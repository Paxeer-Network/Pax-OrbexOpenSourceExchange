package services

import (
	"context"
	"crypto-exchange-go/internal/models"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type FuturesService struct {
	db     *gorm.DB
	logger *logrus.Logger
}

func NewFuturesService(db *gorm.DB, logger *logrus.Logger) *FuturesService {
	return &FuturesService{
		db:     db,
		logger: logger,
	}
}

func (s *FuturesService) GetMarkets(ctx context.Context) ([]models.FuturesMarket, error) {
	var markets []models.FuturesMarket
	err := s.db.WithContext(ctx).Where("status = ?", true).Find(&markets).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get futures markets")
		return nil, err
	}
	
	return markets, nil
}

func (s *FuturesService) GetMarket(ctx context.Context, symbol string) (*models.FuturesMarket, error) {
	var market models.FuturesMarket
	err := s.db.WithContext(ctx).First(&market, "symbol = ?", symbol).Error
	if err != nil {
		s.logger.WithError(err).WithField("symbol", symbol).Error("Failed to get futures market")
		return nil, err
	}
	
	return &market, nil
}

func (s *FuturesService) CreateMarket(ctx context.Context, market *models.FuturesMarket) error {
	market.ID = uuid.New()
	market.CreatedAt = time.Now()
	market.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(market).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create futures market")
		return err
	}
	
	return nil
}

func (s *FuturesService) CreateOrder(ctx context.Context, order *models.FuturesOrder) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var market models.FuturesMarket
		err := tx.First(&market, "symbol = ?", order.Symbol).Error
		if err != nil {
			return err
		}
		
		if !market.Status {
			return gorm.ErrInvalidData
		}
		
		order.ID = uuid.New()
		order.CreatedAt = time.Now()
		order.UpdatedAt = time.Now()
		order.Status = "OPEN"
		order.Filled = decimal.Zero
		order.Remaining = order.Amount
		order.Cost = decimal.Zero
		order.Fee = decimal.Zero
		
		err = tx.Create(order).Error
		if err != nil {
			return err
		}
		
		return s.updateOrCreatePosition(ctx, tx, order)
	})
}

func (s *FuturesService) updateOrCreatePosition(ctx context.Context, tx *gorm.DB, order *models.FuturesOrder) error {
	var position models.FuturesPosition
	err := tx.Where("user_id = ? AND symbol = ? AND status = ?", 
		order.UserID, order.Symbol, "OPEN").First(&position).Error
	
	if err == gorm.ErrRecordNotFound {
		position = models.FuturesPosition{
			ID:         uuid.New(),
			UserID:     order.UserID,
			Symbol:     order.Symbol,
			Side:       order.Side,
			Amount:     order.Amount,
			EntryPrice: order.Price,
			MarkPrice:  order.Price,
			Leverage:   order.Leverage,
			Margin:     order.Amount.Mul(order.Price).Div(order.Leverage),
			Status:     "OPEN",
			CreatedAt:  time.Now(),
			UpdatedAt:  time.Now(),
		}
		
		return tx.Create(&position).Error
	} else if err != nil {
		return err
	}
	
	if position.Side == order.Side {
		totalAmount := position.Amount.Add(order.Amount)
		totalValue := position.Amount.Mul(position.EntryPrice).Add(order.Amount.Mul(order.Price))
		position.EntryPrice = totalValue.Div(totalAmount)
		position.Amount = totalAmount
	} else {
		position.Amount = position.Amount.Sub(order.Amount)
		if position.Amount.LessThanOrEqual(decimal.Zero) {
			position.Status = "CLOSED"
		}
	}
	
	position.UpdatedAt = time.Now()
	return tx.Save(&position).Error
}

func (s *FuturesService) GetOrders(ctx context.Context, userID uuid.UUID, symbol string, status string) ([]models.FuturesOrder, error) {
	var orders []models.FuturesOrder
	query := s.db.WithContext(ctx).Where("user_id = ?", userID)
	
	if symbol != "" {
		query = query.Where("symbol = ?", symbol)
	}
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Order("created_at DESC").Find(&orders).Error
	if err != nil {
		s.logger.WithError(err).WithField("userId", userID).Error("Failed to get futures orders")
		return nil, err
	}
	
	return orders, nil
}

func (s *FuturesService) GetPositions(ctx context.Context, userID uuid.UUID, symbol string) ([]models.FuturesPosition, error) {
	var positions []models.FuturesPosition
	query := s.db.WithContext(ctx).Where("user_id = ?", userID)
	
	if symbol != "" {
		query = query.Where("symbol = ?", symbol)
	}
	
	err := query.Find(&positions).Error
	if err != nil {
		s.logger.WithError(err).WithField("userId", userID).Error("Failed to get futures positions")
		return nil, err
	}
	
	return positions, nil
}

func (s *FuturesService) CancelOrder(ctx context.Context, userID uuid.UUID, orderID uuid.UUID) error {
	err := s.db.WithContext(ctx).Model(&models.FuturesOrder{}).
		Where("id = ? AND user_id = ? AND status = ?", orderID, userID, "OPEN").
		Updates(map[string]interface{}{
			"status":     "CANCELLED",
			"updated_at": time.Now(),
		}).Error
	
	if err != nil {
		s.logger.WithError(err).WithFields(logrus.Fields{
			"userId":  userID,
			"orderId": orderID,
		}).Error("Failed to cancel futures order")
		return err
	}
	
	return nil
}

func (s *FuturesService) ClosePosition(ctx context.Context, userID uuid.UUID, positionID uuid.UUID) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var position models.FuturesPosition
		err := tx.Where("id = ? AND user_id = ?", positionID, userID).First(&position).Error
		if err != nil {
			return err
		}
		
		if position.Status != "OPEN" {
			return gorm.ErrInvalidData
		}
		
		closeOrder := &models.FuturesOrder{
			ID:        uuid.New(),
			UserID:    userID,
			Symbol:    position.Symbol,
			Type:      "MARKET",
			Side:      getOppositeSide(position.Side),
			Amount:    position.Amount,
			Price:     position.MarkPrice,
			Leverage:  position.Leverage,
			Status:    "FILLED",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		
		err = tx.Create(closeOrder).Error
		if err != nil {
			return err
		}
		
		position.Status = "CLOSED"
		position.UpdatedAt = time.Now()
		
		return tx.Save(&position).Error
	})
}

func getOppositeSide(side string) string {
	if side == "BUY" {
		return "SELL"
	}
	return "BUY"
}

func (s *FuturesService) UpdatePositionPnL(ctx context.Context, positionID uuid.UUID, markPrice decimal.Decimal) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var position models.FuturesPosition
		err := tx.First(&position, "id = ?", positionID).Error
		if err != nil {
			return err
		}
		
		priceDiff := markPrice.Sub(position.EntryPrice)
		if position.Side == "SELL" {
			priceDiff = priceDiff.Neg()
		}
		
		unrealizedPnl := priceDiff.Mul(position.Amount).Mul(position.Leverage)
		
		position.MarkPrice = markPrice
		position.UnrealizedPnl = unrealizedPnl
		position.UpdatedAt = time.Now()
		
		return tx.Save(&position).Error
	})
}
