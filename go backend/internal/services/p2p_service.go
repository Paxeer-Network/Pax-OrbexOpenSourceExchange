package services

import (
	"context"
	"crypto-exchange-go/internal/models"
	"time"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type P2pService struct {
	db     *gorm.DB
	logger *logrus.Logger
}

func NewP2pService(db *gorm.DB, logger *logrus.Logger) *P2pService {
	return &P2pService{
		db:     db,
		logger: logger,
	}
}

func (s *P2pService) GetPaymentMethods(ctx context.Context, currency string) ([]models.P2pPaymentMethod, error) {
	var methods []models.P2pPaymentMethod
	query := s.db.WithContext(ctx).Where("status = ?", true)
	
	if currency != "" {
		query = query.Where("currency = ?", currency)
	}
	
	err := query.Find(&methods).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get P2P payment methods")
		return nil, err
	}
	
	return methods, nil
}

func (s *P2pService) CreatePaymentMethod(ctx context.Context, method *models.P2pPaymentMethod) error {
	method.ID = uuid.New()
	method.CreatedAt = time.Now()
	method.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(method).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create P2P payment method")
		return err
	}
	
	return nil
}

func (s *P2pService) GetOffers(ctx context.Context, userID *uuid.UUID, currency string, status string) ([]models.P2pOffer, error) {
	var offers []models.P2pOffer
	query := s.db.WithContext(ctx).
		Preload("User").
		Preload("PaymentMethod").
		Preload("P2pTrades").
		Preload("P2pReviews")
	
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}
	
	if currency != "" {
		query = query.Where("currency = ?", currency)
	}
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Order("created_at DESC").Find(&offers).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get P2P offers")
		return nil, err
	}
	
	return offers, nil
}

func (s *P2pService) GetOffer(ctx context.Context, id uuid.UUID) (*models.P2pOffer, error) {
	var offer models.P2pOffer
	err := s.db.WithContext(ctx).
		Preload("User").
		Preload("PaymentMethod").
		Preload("P2pTrades").
		Preload("P2pReviews.User").
		First(&offer, "id = ?", id).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("offerId", id).Error("Failed to get P2P offer")
		return nil, err
	}
	
	return &offer, nil
}

func (s *P2pService) CreateOffer(ctx context.Context, offer *models.P2pOffer) error {
	offer.ID = uuid.New()
	offer.CreatedAt = time.Now()
	offer.UpdatedAt = time.Now()
	offer.Status = "ACTIVE"
	
	err := s.db.WithContext(ctx).Create(offer).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create P2P offer")
		return err
	}
	
	return nil
}

func (s *P2pService) UpdateOfferStatus(ctx context.Context, id uuid.UUID, status string) error {
	err := s.db.WithContext(ctx).Model(&models.P2pOffer{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_at": time.Now(),
		}).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("offerId", id).Error("Failed to update P2P offer status")
		return err
	}
	
	return nil
}

func (s *P2pService) CreateTrade(ctx context.Context, trade *models.P2pTrade) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var offer models.P2pOffer
		err := tx.First(&offer, "id = ?", trade.OfferID).Error
		if err != nil {
			return err
		}
		
		if offer.Status != "ACTIVE" {
			return gorm.ErrInvalidData
		}
		
		if trade.Amount.LessThan(offer.MinAmount) || trade.Amount.GreaterThan(offer.MaxAmount) {
			return gorm.ErrInvalidData
		}
		
		trade.ID = uuid.New()
		trade.CreatedAt = time.Now()
		trade.UpdatedAt = time.Now()
		trade.Status = "PENDING"
		trade.Total = trade.Amount.Mul(trade.Price)
		
		err = tx.Create(trade).Error
		if err != nil {
			return err
		}
		
		escrow := &models.P2pEscrow{
			ID:        uuid.New(),
			TradeID:   trade.ID,
			Amount:    trade.Amount,
			Status:    "HELD",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		
		return tx.Create(escrow).Error
	})
}

func (s *P2pService) GetTrades(ctx context.Context, userID *uuid.UUID, offerID *uuid.UUID, status string) ([]models.P2pTrade, error) {
	var trades []models.P2pTrade
	query := s.db.WithContext(ctx).
		Preload("Offer.PaymentMethod").
		Preload("User").
		Preload("Seller").
		Preload("Buyer").
		Preload("P2pDisputes").
		Preload("P2pEscrows")
	
	if userID != nil {
		query = query.Where("user_id = ? OR seller_id = ? OR buyer_id = ?", *userID, *userID, *userID)
	}
	
	if offerID != nil {
		query = query.Where("offer_id = ?", *offerID)
	}
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Order("created_at DESC").Find(&trades).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get P2P trades")
		return nil, err
	}
	
	return trades, nil
}

func (s *P2pService) UpdateTradeStatus(ctx context.Context, id uuid.UUID, status string) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		err := tx.Model(&models.P2pTrade{}).
			Where("id = ?", id).
			Updates(map[string]interface{}{
				"status":     status,
				"updated_at": time.Now(),
			}).Error
		
		if err != nil {
			return err
		}
		
		if status == "COMPLETED" {
			err = tx.Model(&models.P2pEscrow{}).
				Where("trade_id = ?", id).
				Updates(map[string]interface{}{
					"status":     "RELEASED",
					"updated_at": time.Now(),
				}).Error
		}
		
		return err
	})
}

func (s *P2pService) CreateDispute(ctx context.Context, dispute *models.P2pDispute) error {
	dispute.ID = uuid.New()
	dispute.CreatedAt = time.Now()
	dispute.UpdatedAt = time.Now()
	dispute.Status = "OPEN"
	
	err := s.db.WithContext(ctx).Create(dispute).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create P2P dispute")
		return err
	}
	
	return s.UpdateTradeStatus(ctx, dispute.TradeID, "DISPUTE_OPEN")
}

func (s *P2pService) GetDisputes(ctx context.Context, tradeID *uuid.UUID, status string) ([]models.P2pDispute, error) {
	var disputes []models.P2pDispute
	query := s.db.WithContext(ctx).
		Preload("Trade.Offer").
		Preload("Raiser")
	
	if tradeID != nil {
		query = query.Where("trade_id = ?", *tradeID)
	}
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Order("created_at DESC").Find(&disputes).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get P2P disputes")
		return nil, err
	}
	
	return disputes, nil
}

func (s *P2pService) ResolveDispute(ctx context.Context, id uuid.UUID, resolution string) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var dispute models.P2pDispute
		err := tx.Preload("Trade").First(&dispute, "id = ?", id).Error
		if err != nil {
			return err
		}
		
		err = tx.Model(&dispute).Updates(map[string]interface{}{
			"resolution": resolution,
			"status":     "RESOLVED",
			"updated_at": time.Now(),
		}).Error
		
		if err != nil {
			return err
		}
		
		return s.UpdateTradeStatus(ctx, dispute.TradeID, "COMPLETED")
	})
}

func (s *P2pService) CreateReview(ctx context.Context, review *models.P2pReview) error {
	review.ID = uuid.New()
	review.CreatedAt = time.Now()
	review.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(review).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create P2P review")
		return err
	}
	
	return nil
}

func (s *P2pService) GetReviews(ctx context.Context, offerID *uuid.UUID, userID *uuid.UUID) ([]models.P2pReview, error) {
	var reviews []models.P2pReview
	query := s.db.WithContext(ctx).
		Preload("Offer").
		Preload("User")
	
	if offerID != nil {
		query = query.Where("offer_id = ?", *offerID)
	}
	
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}
	
	err := query.Order("created_at DESC").Find(&reviews).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get P2P reviews")
		return nil, err
	}
	
	return reviews, nil
}

func (s *P2pService) CreateCommission(ctx context.Context, commission *models.P2pCommission) error {
	commission.ID = uuid.New()
	commission.CreatedAt = time.Now()
	commission.UpdatedAt = time.Now()
	commission.Status = "PENDING"
	
	err := s.db.WithContext(ctx).Create(commission).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create P2P commission")
		return err
	}
	
	return nil
}

func (s *P2pService) GetCommissions(ctx context.Context, tradeID *uuid.UUID, status string) ([]models.P2pCommission, error) {
	var commissions []models.P2pCommission
	query := s.db.WithContext(ctx).Preload("Trade")
	
	if tradeID != nil {
		query = query.Where("trade_id = ?", *tradeID)
	}
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Order("created_at DESC").Find(&commissions).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get P2P commissions")
		return nil, err
	}
	
	return commissions, nil
}
