package services

import (
	"context"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/internal/models"
	"fmt"

	"github.com/shopspring/decimal"
	"github.com/sirupsen/logrus"
)

type MarketService struct {
	mysql    *database.MySQL
	scyllaDB *database.ScyllaDB
	redis    *database.Redis
	logger   *logrus.Logger
}

func NewMarketService(mysql *database.MySQL, scyllaDB *database.ScyllaDB, redis *database.Redis, logger *logrus.Logger) *MarketService {
	return &MarketService{
		mysql:    mysql,
		scyllaDB: scyllaDB,
		redis:    redis,
		logger:   logger,
	}
}

func (s *MarketService) GetMarkets(ctx context.Context) ([]*models.ExchangeMarket, error) {
	query := `SELECT id, currency, pair, isTrending, isHot, metadata, status 
			  FROM exchange_market WHERE status = 1 ORDER BY currency, pair`

	rows, err := s.mysql.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query markets: %w", err)
	}
	defer rows.Close()

	var markets []*models.ExchangeMarket
	for rows.Next() {
		market := &models.ExchangeMarket{}
		err := rows.Scan(&market.ID, &market.Currency, &market.Pair, &market.IsTrending,
			&market.IsHot, &market.Metadata, &market.Status)
		if err != nil {
			return nil, fmt.Errorf("failed to scan market: %w", err)
		}
		markets = append(markets, market)
	}

	return markets, nil
}

func (s *MarketService) GetOrderBook(ctx context.Context, currency, pair string) (*models.OrderBook, error) {
	symbol := fmt.Sprintf("%s/%s", currency, pair)
	
	query := `SELECT side, price, amount FROM order_book WHERE symbol = ? ORDER BY price`
	iter := s.scyllaDB.Session().Query(query, symbol).Iter()
	defer iter.Close()

	orderBook := &models.OrderBook{
		Symbol: symbol,
		Bids:   make([]models.OrderBookEntry, 0),
		Asks:   make([]models.OrderBookEntry, 0),
	}

	for {
		var side string
		var price, amount decimal.Decimal

		if !iter.Scan(&side, &price, &amount) {
			break
		}

		entry := models.OrderBookEntry{
			Price:  price,
			Amount: amount,
		}

		if side == "bids" {
			orderBook.Bids = append(orderBook.Bids, entry)
		} else {
			orderBook.Asks = append(orderBook.Asks, entry)
		}
	}

	if err := iter.Close(); err != nil {
		return nil, fmt.Errorf("failed to fetch order book: %w", err)
	}

	return orderBook, nil
}

func (s *MarketService) GetCandles(ctx context.Context, symbol, interval string, limit int) ([]*models.Candle, error) {
	query := `SELECT symbol, interval, open, high, low, close, volume, created_at, updated_at 
			  FROM candles WHERE symbol = ? AND interval = ? ORDER BY created_at DESC LIMIT ?`

	iter := s.scyllaDB.Session().Query(query, symbol, interval, limit).Iter()
	defer iter.Close()

	var candles []*models.Candle
	for {
		candle := &models.Candle{}
		if !iter.Scan(&candle.Symbol, &candle.Interval, &candle.Open, &candle.High,
			&candle.Low, &candle.Close, &candle.Volume, &candle.CreatedAt, &candle.UpdatedAt) {
			break
		}
		candles = append(candles, candle)
	}

	if err := iter.Close(); err != nil {
		return nil, fmt.Errorf("failed to fetch candles: %w", err)
	}

	return candles, nil
}
