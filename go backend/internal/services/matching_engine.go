package services

import (
	"context"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/internal/models"
	"encoding/json"
	"fmt"
	"sort"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/sirupsen/logrus"
)

type MatchingEngine struct {
	scyllaDB      *database.ScyllaDB
	redis         *database.Redis
	logger        *logrus.Logger
	orderQueues   map[string][]*Order
	marketsBySymbol map[string]*models.ExchangeMarket
	lockedOrders  map[string]bool
	lastCandles   map[string]map[string]*models.Candle
	yesterdayCandles map[string]*models.Candle
	mu            sync.RWMutex
	orderMu       sync.Mutex
	instance      *MatchingEngine
	once          sync.Once
}

type Order struct {
	ID          uuid.UUID       `json:"id"`
	UserID      uuid.UUID       `json:"userId"`
	Symbol      string          `json:"symbol"`
	Side        models.OrderSide `json:"side"`
	Type        models.OrderType `json:"type"`
	Amount      decimal.Decimal `json:"amount"`
	Price       decimal.Decimal `json:"price"`
	Filled      decimal.Decimal `json:"filled"`
	Remaining   decimal.Decimal `json:"remaining"`
	Cost        decimal.Decimal `json:"cost"`
	Fee         decimal.Decimal `json:"fee"`
	Status      models.OrderStatus `json:"status"`
	Trades      models.Trades   `json:"trades"`
	CreatedAt   time.Time       `json:"createdAt"`
	UpdatedAt   time.Time       `json:"updatedAt"`
}

type OrderBook struct {
	Symbol string                        `json:"symbol"`
	Bids   map[string]decimal.Decimal   `json:"bids"`
	Asks   map[string]decimal.Decimal   `json:"asks"`
}

var (
	matchingEngineInstance *MatchingEngine
	matchingEngineOnce     sync.Once
)

func NewMatchingEngine(scyllaDB *database.ScyllaDB, redis *database.Redis, logger *logrus.Logger) (*MatchingEngine, error) {
	var err error
	matchingEngineOnce.Do(func() {
		matchingEngineInstance = &MatchingEngine{
			scyllaDB:         scyllaDB,
			redis:           redis,
			logger:          logger,
			orderQueues:     make(map[string][]*Order),
			marketsBySymbol: make(map[string]*models.ExchangeMarket),
			lockedOrders:    make(map[string]bool),
			lastCandles:     make(map[string]map[string]*models.Candle),
			yesterdayCandles: make(map[string]*models.Candle),
		}
		err = matchingEngineInstance.initialize()
	})

	if err != nil {
		return nil, err
	}

	return matchingEngineInstance, nil
}

func (me *MatchingEngine) initialize() error {
	if err := me.initializeMarkets(); err != nil {
		return fmt.Errorf("failed to initialize markets: %w", err)
	}

	if err := me.initializeOrders(); err != nil {
		return fmt.Errorf("failed to initialize orders: %w", err)
	}

	if err := me.initializeCandles(); err != nil {
		return fmt.Errorf("failed to initialize candles: %w", err)
	}

	go me.processQueuePeriodically()

	return nil
}

func (me *MatchingEngine) initializeMarkets() error {
	return nil
}

func (me *MatchingEngine) initializeOrders() error {
	query := `SELECT id, user_id, symbol, side, type, amount, price, filled, remaining, cost, fee, status, trades, created_at, updated_at 
			  FROM orders WHERE status = 'OPEN'`

	iter := me.scyllaDB.Session().Query(query).Iter()
	defer iter.Close()

	var orders []*Order
	for {
		order := &Order{}
		var tradesJSON string
		
		if !iter.Scan(&order.ID, &order.UserID, &order.Symbol, &order.Side, &order.Type,
			&order.Amount, &order.Price, &order.Filled, &order.Remaining, &order.Cost,
			&order.Fee, &order.Status, &tradesJSON, &order.CreatedAt, &order.UpdatedAt) {
			break
		}

		if tradesJSON != "" {
			if err := json.Unmarshal([]byte(tradesJSON), &order.Trades); err != nil {
				me.logger.WithError(err).Error("Failed to unmarshal trades")
				continue
			}
		}

		orders = append(orders, order)
	}

	if err := iter.Close(); err != nil {
		return fmt.Errorf("failed to iterate orders: %w", err)
	}

	me.mu.Lock()
	defer me.mu.Unlock()

	for _, order := range orders {
		if me.orderQueues[order.Symbol] == nil {
			me.orderQueues[order.Symbol] = make([]*Order, 0)
		}
		me.orderQueues[order.Symbol] = append(me.orderQueues[order.Symbol], order)
	}

	return nil
}

func (me *MatchingEngine) initializeCandles() error {
	return nil
}

func (me *MatchingEngine) processQueuePeriodically() {
	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	for range ticker.C {
		me.processQueue()
	}
}

func (me *MatchingEngine) processQueue() {
	me.mu.RLock()
	symbols := make([]string, 0, len(me.orderQueues))
	for symbol := range me.orderQueues {
		symbols = append(symbols, symbol)
	}
	me.mu.RUnlock()

	for _, symbol := range symbols {
		me.processSymbolQueue(symbol)
	}
}

func (me *MatchingEngine) processSymbolQueue(symbol string) {
	me.mu.Lock()
	orders := me.orderQueues[symbol]
	if len(orders) == 0 {
		me.mu.Unlock()
		return
	}

	ordersCopy := make([]*Order, len(orders))
	copy(ordersCopy, orders)
	me.mu.Unlock()

	orderBook, err := me.fetchOrderBook(symbol)
	if err != nil {
		me.logger.WithError(err).WithField("symbol", symbol).Error("Failed to fetch order book")
		return
	}

	matchedOrders, bookUpdates := me.matchAndCalculateOrders(ordersCopy, orderBook)
	if len(matchedOrders) == 0 {
		return
	}

	if err := me.performUpdates(matchedOrders, bookUpdates); err != nil {
		me.logger.WithError(err).Error("Failed to perform updates")
		return
	}

	me.broadcastUpdates(matchedOrders, bookUpdates)

	me.mu.Lock()
	me.orderQueues[symbol] = me.filterOpenOrders(me.orderQueues[symbol])
	me.mu.Unlock()
}

func (me *MatchingEngine) matchAndCalculateOrders(orders []*Order, orderBook *OrderBook) ([]*Order, map[string]*OrderBook) {
	var matchedOrders []*Order
	bookUpdates := make(map[string]*OrderBook)

	buyOrders := make([]*Order, 0)
	sellOrders := make([]*Order, 0)

	for _, order := range orders {
		if order.Side == models.OrderSideBuy {
			buyOrders = append(buyOrders, order)
		} else {
			sellOrders = append(sellOrders, order)
		}
	}

	sort.Slice(buyOrders, func(i, j int) bool {
		if buyOrders[i].Price.Equal(buyOrders[j].Price) {
			return buyOrders[i].CreatedAt.Before(buyOrders[j].CreatedAt)
		}
		return buyOrders[i].Price.GreaterThan(buyOrders[j].Price)
	})

	sort.Slice(sellOrders, func(i, j int) bool {
		if sellOrders[i].Price.Equal(sellOrders[j].Price) {
			return sellOrders[i].CreatedAt.Before(sellOrders[j].CreatedAt)
		}
		return sellOrders[i].Price.LessThan(sellOrders[j].Price)
	})

	for _, buyOrder := range buyOrders {
		for _, sellOrder := range sellOrders {
			if buyOrder.Price.GreaterThanOrEqual(sellOrder.Price) && 
			   buyOrder.Remaining.GreaterThan(decimal.Zero) && 
			   sellOrder.Remaining.GreaterThan(decimal.Zero) {
				
				matchedOrders = append(matchedOrders, me.executeMatch(buyOrder, sellOrder)...)
			}
		}
	}

	if len(matchedOrders) > 0 {
		bookUpdates[orders[0].Symbol] = me.updateOrderBook(orderBook, matchedOrders)
	}

	return matchedOrders, bookUpdates
}

func (me *MatchingEngine) executeMatch(buyOrder, sellOrder *Order) []*Order {
	matchPrice := sellOrder.Price
	matchAmount := decimal.Min(buyOrder.Remaining, sellOrder.Remaining)

	if matchAmount.LessThanOrEqual(decimal.Zero) {
		return nil
	}

	matchCost := matchAmount.Mul(matchPrice)

	trade := models.Trade{
		ID:       uuid.New().String(),
		Price:    matchPrice,
		Amount:   matchAmount,
		Cost:     matchCost,
		Fee:      decimal.Zero,
		DateTime: time.Now(),
	}

	buyOrder.Filled = buyOrder.Filled.Add(matchAmount)
	buyOrder.Remaining = buyOrder.Amount.Sub(buyOrder.Filled)
	buyOrder.Cost = buyOrder.Cost.Add(matchCost)
	buyOrder.Trades = append(buyOrder.Trades, trade)
	buyOrder.UpdatedAt = time.Now()

	if buyOrder.Remaining.LessThanOrEqual(decimal.Zero) {
		buyOrder.Status = models.OrderStatusClosed
	}

	sellOrder.Filled = sellOrder.Filled.Add(matchAmount)
	sellOrder.Remaining = sellOrder.Amount.Sub(sellOrder.Filled)
	sellOrder.Cost = sellOrder.Cost.Add(matchCost)
	sellOrder.Trades = append(sellOrder.Trades, trade)
	sellOrder.UpdatedAt = time.Now()

	if sellOrder.Remaining.LessThanOrEqual(decimal.Zero) {
		sellOrder.Status = models.OrderStatusClosed
	}

	return []*Order{buyOrder, sellOrder}
}

func (me *MatchingEngine) fetchOrderBook(symbol string) (*OrderBook, error) {
	orderBook := &OrderBook{
		Symbol: symbol,
		Bids:   make(map[string]decimal.Decimal),
		Asks:   make(map[string]decimal.Decimal),
	}

	query := `SELECT side, price, amount FROM order_book WHERE symbol = ?`
	iter := me.scyllaDB.Session().Query(query, symbol).Iter()
	defer iter.Close()

	for {
		var side string
		var price, amount decimal.Decimal

		if !iter.Scan(&side, &price, &amount) {
			break
		}

		priceStr := price.String()
		if side == "bids" {
			orderBook.Bids[priceStr] = amount
		} else {
			orderBook.Asks[priceStr] = amount
		}
	}

	return orderBook, iter.Close()
}

func (me *MatchingEngine) updateOrderBook(orderBook *OrderBook, orders []*Order) *OrderBook {
	updatedBook := &OrderBook{
		Symbol: orderBook.Symbol,
		Bids:   make(map[string]decimal.Decimal),
		Asks:   make(map[string]decimal.Decimal),
	}

	for price, amount := range orderBook.Bids {
		updatedBook.Bids[price] = amount
	}
	for price, amount := range orderBook.Asks {
		updatedBook.Asks[price] = amount
	}

	for _, order := range orders {
		priceStr := order.Price.String()
		if order.Side == models.OrderSideBuy {
			if order.Status == models.OrderStatusClosed {
				delete(updatedBook.Bids, priceStr)
			} else {
				updatedBook.Bids[priceStr] = order.Remaining
			}
		} else {
			if order.Status == models.OrderStatusClosed {
				delete(updatedBook.Asks, priceStr)
			} else {
				updatedBook.Asks[priceStr] = order.Remaining
			}
		}
	}

	return updatedBook
}

func (me *MatchingEngine) performUpdates(orders []*Order, bookUpdates map[string]*OrderBook) error {
	if !me.lockOrders(orders) {
		return fmt.Errorf("could not obtain lock on orders")
	}
	defer me.unlockOrders(orders)

	queries := make([]string, 0)
	params := make([][]interface{}, 0)

	for _, order := range orders {
		tradesJSON, _ := json.Marshal(order.Trades)
		query := `UPDATE orders SET filled = ?, remaining = ?, cost = ?, status = ?, trades = ?, updated_at = ? WHERE id = ?`
		params = append(params, []interface{}{
			order.Filled, order.Remaining, order.Cost, order.Status, string(tradesJSON), order.UpdatedAt, order.ID,
		})
		queries = append(queries, query)
	}

	for symbol, book := range bookUpdates {
		for price, amount := range book.Bids {
			query := `INSERT INTO order_book (symbol, side, price, amount) VALUES (?, 'bids', ?, ?) 
					  ON DUPLICATE KEY UPDATE amount = ?`
			priceDecimal, _ := decimal.NewFromString(price)
			params = append(params, []interface{}{symbol, priceDecimal, amount, amount})
			queries = append(queries, query)
		}
		for price, amount := range book.Asks {
			query := `INSERT INTO order_book (symbol, side, price, amount) VALUES (?, 'asks', ?, ?) 
					  ON DUPLICATE KEY UPDATE amount = ?`
			priceDecimal, _ := decimal.NewFromString(price)
			params = append(params, []interface{}{symbol, priceDecimal, amount, amount})
			queries = append(queries, query)
		}
	}

	return me.scyllaDB.ExecuteBatch(queries, params)
}

func (me *MatchingEngine) lockOrders(orders []*Order) bool {
	me.orderMu.Lock()
	defer me.orderMu.Unlock()

	for _, order := range orders {
		if me.lockedOrders[order.ID.String()] {
			return false
		}
	}

	for _, order := range orders {
		me.lockedOrders[order.ID.String()] = true
	}

	return true
}

func (me *MatchingEngine) unlockOrders(orders []*Order) {
	me.orderMu.Lock()
	defer me.orderMu.Unlock()

	for _, order := range orders {
		delete(me.lockedOrders, order.ID.String())
	}
}

func (me *MatchingEngine) filterOpenOrders(orders []*Order) []*Order {
	filtered := make([]*Order, 0)
	for _, order := range orders {
		if order.Status == models.OrderStatusOpen {
			filtered = append(filtered, order)
		}
	}
	return filtered
}

func (me *MatchingEngine) broadcastUpdates(orders []*Order, bookUpdates map[string]*OrderBook) {
	ctx := context.Background()

	for _, order := range orders {
		orderJSON, _ := json.Marshal(order)
		me.redis.Publish(ctx, fmt.Sprintf("order:%s", order.UserID.String()), orderJSON)
	}

	for symbol, book := range bookUpdates {
		bookJSON, _ := json.Marshal(book)
		me.redis.Publish(ctx, fmt.Sprintf("orderbook:%s", symbol), bookJSON)
	}
}

func (me *MatchingEngine) AddToQueue(order *Order) error {
	if err := me.validateOrder(order); err != nil {
		return err
	}

	me.mu.Lock()
	defer me.mu.Unlock()

	if me.orderQueues[order.Symbol] == nil {
		me.orderQueues[order.Symbol] = make([]*Order, 0)
	}

	me.orderQueues[order.Symbol] = append(me.orderQueues[order.Symbol], order)

	go me.processSymbolQueue(order.Symbol)

	return nil
}

func (me *MatchingEngine) validateOrder(order *Order) error {
	if order.Amount.LessThanOrEqual(decimal.Zero) {
		return fmt.Errorf("order amount must be greater than zero")
	}
	if order.Price.LessThanOrEqual(decimal.Zero) {
		return fmt.Errorf("order price must be greater than zero")
	}
	if order.Symbol == "" {
		return fmt.Errorf("order symbol cannot be empty")
	}
	return nil
}

func (me *MatchingEngine) CancelOrder(orderID uuid.UUID, symbol string) error {
	me.mu.Lock()
	defer me.mu.Unlock()

	orders := me.orderQueues[symbol]
	for i, order := range orders {
		if order.ID == orderID {
			orders[i] = orders[len(orders)-1]
			me.orderQueues[symbol] = orders[:len(orders)-1]
			break
		}
	}

	query := `UPDATE orders SET status = 'CANCELED', updated_at = ? WHERE id = ?`
	return me.scyllaDB.Session().Query(query, time.Now(), orderID).Exec()
}

func (me *MatchingEngine) GetTickers() map[string]*models.Ticker {
	me.mu.RLock()
	defer me.mu.RUnlock()

	tickers := make(map[string]*models.Ticker)
	for symbol := range me.lastCandles {
		ticker := me.getTicker(symbol)
		if !ticker.Last.IsZero() {
			tickers[symbol] = ticker
		}
	}
	return tickers
}

func (me *MatchingEngine) GetTicker(symbol string) *models.Ticker {
	me.mu.RLock()
	defer me.mu.RUnlock()
	return me.getTicker(symbol)
}

func (me *MatchingEngine) getTicker(symbol string) *models.Ticker {
	lastCandle := me.lastCandles[symbol]["1d"]
	previousCandle := me.yesterdayCandles[symbol]

	if lastCandle == nil {
		return &models.Ticker{
			Symbol:      symbol,
			Last:        decimal.Zero,
			BaseVolume:  decimal.Zero,
			QuoteVolume: decimal.Zero,
			Change:      decimal.Zero,
			Percentage:  decimal.Zero,
			High:        decimal.Zero,
			Low:         decimal.Zero,
		}
	}

	last := lastCandle.Close
	baseVolume := lastCandle.Volume
	quoteVolume := last.Mul(baseVolume)

	change := decimal.Zero
	percentage := decimal.Zero

	if previousCandle != nil {
		open := previousCandle.Close
		close := lastCandle.Close

		change = close.Sub(open)
		if !open.IsZero() {
			percentage = change.Div(open).Mul(decimal.NewFromInt(100))
		}
	}

	return &models.Ticker{
		Symbol:      symbol,
		Last:        last,
		BaseVolume:  baseVolume,
		QuoteVolume: quoteVolume,
		Change:      change,
		Percentage:  percentage,
		High:        lastCandle.High,
		Low:         lastCandle.Low,
	}
}
