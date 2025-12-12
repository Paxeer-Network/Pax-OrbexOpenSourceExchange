package services

import (
	"context"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/internal/models"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/sirupsen/logrus"
)

type OrderService struct {
	mysql         *database.MySQL
	scyllaDB      *database.ScyllaDB
	redis         *database.Redis
	matchingEngine *MatchingEngine
	logger        *logrus.Logger
}

func NewOrderService(mysql *database.MySQL, scyllaDB *database.ScyllaDB, redis *database.Redis, matchingEngine *MatchingEngine, logger *logrus.Logger) *OrderService {
	return &OrderService{
		mysql:         mysql,
		scyllaDB:      scyllaDB,
		redis:         redis,
		matchingEngine: matchingEngine,
		logger:        logger,
	}
}

func (s *OrderService) CreateOrder(ctx context.Context, userID uuid.UUID, req *models.CreateOrderRequest) (*models.OrderResponse, error) {
	market, err := s.getMarket(req.Currency, req.Pair)
	if err != nil {
		return nil, fmt.Errorf("market not found: %w", err)
	}

	if err := s.validateOrderRequest(req, market); err != nil {
		return nil, err
	}

	symbol := fmt.Sprintf("%s/%s", req.Currency, req.Pair)
	
	orderPrice := decimal.Zero
	if req.Price != nil {
		orderPrice = *req.Price
	} else if req.Type == models.OrderTypeMarket {
		ticker := s.matchingEngine.GetTicker(symbol)
		if ticker == nil || ticker.Last.IsZero() {
			return nil, fmt.Errorf("unable to fetch current market price")
		}
		orderPrice = ticker.Last
	}

	cost := req.Amount.Mul(orderPrice)

	if err := s.validateBalance(userID, req, cost); err != nil {
		return nil, err
	}

	order := &models.ExchangeOrder{
		ID:          uuid.New(),
		UserID:      userID,
		Status:      models.OrderStatusOpen,
		Symbol:      symbol,
		Type:        req.Type,
		TimeInForce: models.TimeInForceGTC,
		Side:        req.Side,
		Price:       orderPrice,
		Amount:      req.Amount,
		Filled:      decimal.Zero,
		Remaining:   req.Amount,
		Cost:        decimal.Zero,
		Fee:         decimal.Zero,
		FeeCurrency: req.Currency,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := s.saveOrder(order); err != nil {
		return nil, fmt.Errorf("failed to save order: %w", err)
	}

	if err := s.updateWalletBalances(userID, req, cost); err != nil {
		return nil, fmt.Errorf("failed to update wallet balances: %w", err)
	}

	matchingOrder := &Order{
		ID:        order.ID,
		UserID:    order.UserID,
		Symbol:    order.Symbol,
		Side:      order.Side,
		Type:      order.Type,
		Amount:    order.Amount,
		Price:     order.Price,
		Filled:    order.Filled,
		Remaining: order.Remaining,
		Cost:      order.Cost,
		Fee:       order.Fee,
		Status:    order.Status,
		Trades:    order.Trades,
		CreatedAt: order.CreatedAt,
		UpdatedAt: order.UpdatedAt,
	}

	if err := s.matchingEngine.AddToQueue(matchingOrder); err != nil {
		return nil, fmt.Errorf("failed to add order to matching engine: %w", err)
	}

	return order.ToResponse(), nil
}

func (s *OrderService) GetOrders(ctx context.Context, userID uuid.UUID, status string, limit, offset int) ([]*models.OrderResponse, error) {
	query := `SELECT id, referenceId, userId, status, symbol, type, timeInForce, side, price, average, 
			  amount, filled, remaining, cost, trades, fee, feeCurrency, createdAt, updatedAt 
			  FROM exchange_order WHERE userId = ?`
	args := []interface{}{userID}

	if status != "" {
		query += " AND status = ?"
		args = append(args, status)
	}

	query += " ORDER BY createdAt DESC LIMIT ? OFFSET ?"
	args = append(args, limit, offset)

	rows, err := s.mysql.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query orders: %w", err)
	}
	defer rows.Close()

	var orders []*models.OrderResponse
	for rows.Next() {
		order := &models.ExchangeOrder{}
		err := rows.Scan(&order.ID, &order.ReferenceID, &order.UserID, &order.Status, &order.Symbol,
			&order.Type, &order.TimeInForce, &order.Side, &order.Price, &order.Average,
			&order.Amount, &order.Filled, &order.Remaining, &order.Cost, &order.Trades,
			&order.Fee, &order.FeeCurrency, &order.CreatedAt, &order.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan order: %w", err)
		}
		orders = append(orders, order.ToResponse())
	}

	return orders, nil
}

func (s *OrderService) GetOrder(ctx context.Context, userID, orderID uuid.UUID) (*models.OrderResponse, error) {
	query := `SELECT id, referenceId, userId, status, symbol, type, timeInForce, side, price, average, 
			  amount, filled, remaining, cost, trades, fee, feeCurrency, createdAt, updatedAt 
			  FROM exchange_order WHERE id = ? AND userId = ?`

	order := &models.ExchangeOrder{}
	err := s.mysql.Get(order, query, orderID, userID)
	if err != nil {
		return nil, fmt.Errorf("order not found: %w", err)
	}

	return order.ToResponse(), nil
}

func (s *OrderService) CancelOrder(ctx context.Context, userID, orderID uuid.UUID) error {
	order, err := s.GetOrder(ctx, userID, orderID)
	if err != nil {
		return err
	}

	if order.Status != models.OrderStatusOpen {
		return fmt.Errorf("order cannot be canceled")
	}

	if err := s.matchingEngine.CancelOrder(orderID, order.Symbol); err != nil {
		return fmt.Errorf("failed to cancel order in matching engine: %w", err)
	}

	query := `UPDATE exchange_order SET status = ?, updatedAt = ? WHERE id = ? AND userId = ?`
	_, err = s.mysql.Exec(query, models.OrderStatusCanceled, time.Now(), orderID, userID)
	if err != nil {
		return fmt.Errorf("failed to update order status: %w", err)
	}

	return nil
}

func (s *OrderService) getMarket(currency, pair string) (*models.ExchangeMarket, error) {
	query := `SELECT id, currency, pair, isTrending, isHot, metadata, status 
			  FROM exchange_market WHERE currency = ? AND pair = ? AND status = 1`

	market := &models.ExchangeMarket{}
	err := s.mysql.Get(market, query, currency, pair)
	if err != nil {
		return nil, fmt.Errorf("market not found: %w", err)
	}

	return market, nil
}

func (s *OrderService) validateOrderRequest(req *models.CreateOrderRequest, market *models.ExchangeMarket) error {
	if market.Metadata == nil {
		return fmt.Errorf("market metadata not found")
	}

	metadata := market.Metadata

	if req.Amount.LessThan(metadata.Limits.Amount.Min) {
		return fmt.Errorf("amount too low, minimum is %s", metadata.Limits.Amount.Min.String())
	}

	if !metadata.Limits.Amount.Max.IsZero() && req.Amount.GreaterThan(metadata.Limits.Amount.Max) {
		return fmt.Errorf("amount too high, maximum is %s", metadata.Limits.Amount.Max.String())
	}

	if req.Price != nil {
		if req.Price.LessThan(metadata.Limits.Price.Min) {
			return fmt.Errorf("price too low, minimum is %s", metadata.Limits.Price.Min.String())
		}

		if !metadata.Limits.Price.Max.IsZero() && req.Price.GreaterThan(metadata.Limits.Price.Max) {
			return fmt.Errorf("price too high, maximum is %s", metadata.Limits.Price.Max.String())
		}
	}

	return nil
}

func (s *OrderService) validateBalance(userID uuid.UUID, req *models.CreateOrderRequest, cost decimal.Decimal) error {
	if req.Side == models.OrderSideBuy {
		wallet, err := s.getWallet(userID, req.Pair)
		if err != nil {
			return fmt.Errorf("wallet not found for %s", req.Pair)
		}
		if wallet.Balance.LessThan(cost) {
			return fmt.Errorf("insufficient balance, need %s %s", cost.String(), req.Pair)
		}
	} else {
		wallet, err := s.getWallet(userID, req.Currency)
		if err != nil {
			return fmt.Errorf("wallet not found for %s", req.Currency)
		}
		if wallet.Balance.LessThan(req.Amount) {
			return fmt.Errorf("insufficient balance, need %s %s", req.Amount.String(), req.Currency)
		}
	}

	return nil
}

func (s *OrderService) getWallet(userID uuid.UUID, currency string) (*models.Wallet, error) {
	query := `SELECT id, userId, type, currency, balance, createdAt, updatedAt 
			  FROM wallet WHERE userId = ? AND currency = ? AND type = 'SPOT'`

	wallet := &models.Wallet{}
	err := s.mysql.Get(wallet, query, userID, currency)
	if err != nil {
		return nil, fmt.Errorf("wallet not found: %w", err)
	}

	return wallet, nil
}

func (s *OrderService) saveOrder(order *models.ExchangeOrder) error {
	query := `INSERT INTO exchange_order (id, userId, status, symbol, type, timeInForce, side, price, 
			  amount, filled, remaining, cost, fee, feeCurrency, createdAt, updatedAt) 
			  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := s.mysql.Exec(query, order.ID, order.UserID, order.Status, order.Symbol, order.Type,
		order.TimeInForce, order.Side, order.Price, order.Amount, order.Filled, order.Remaining,
		order.Cost, order.Fee, order.FeeCurrency, order.CreatedAt, order.UpdatedAt)

	return err
}

func (s *OrderService) updateWalletBalances(userID uuid.UUID, req *models.CreateOrderRequest, cost decimal.Decimal) error {
	if req.Side == models.OrderSideBuy {
		query := `UPDATE wallet SET balance = balance - ? WHERE userId = ? AND currency = ? AND type = 'SPOT'`
		_, err := s.mysql.Exec(query, cost, userID, req.Pair)
		return err
	} else {
		query := `UPDATE wallet SET balance = balance - ? WHERE userId = ? AND currency = ? AND type = 'SPOT'`
		_, err := s.mysql.Exec(query, req.Amount, userID, req.Currency)
		return err
	}
}
