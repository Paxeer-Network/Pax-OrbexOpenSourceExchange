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

type AffiliateService struct {
	db     *gorm.DB
	logger *logrus.Logger
}

func NewAffiliateService(db *gorm.DB, logger *logrus.Logger) *AffiliateService {
	return &AffiliateService{
		db:     db,
		logger: logger,
	}
}

func (s *AffiliateService) GetConditions(ctx context.Context, status *bool) ([]models.AffiliateCondition, error) {
	var conditions []models.AffiliateCondition
	query := s.db.WithContext(ctx)
	
	if status != nil {
		query = query.Where("status = ?", *status)
	}
	
	err := query.Find(&conditions).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get affiliate conditions")
		return nil, err
	}
	
	return conditions, nil
}

func (s *AffiliateService) CreateCondition(ctx context.Context, condition *models.AffiliateCondition) error {
	condition.ID = uuid.New()
	condition.CreatedAt = time.Now()
	condition.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(condition).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create affiliate condition")
		return err
	}
	
	return nil
}

func (s *AffiliateService) UpdateCondition(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	updates["updated_at"] = time.Now()
	
	err := s.db.WithContext(ctx).Model(&models.AffiliateCondition{}).
		Where("id = ?", id).Updates(updates).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("conditionId", id).Error("Failed to update affiliate condition")
		return err
	}
	
	return nil
}

func (s *AffiliateService) CreateReferral(ctx context.Context, referrerID, referredID uuid.UUID) error {
	var existingReferral models.AffiliateReferral
	err := s.db.WithContext(ctx).Where("referred_id = ?", referredID).First(&existingReferral).Error
	if err == nil {
		return gorm.ErrDuplicatedKey
	}
	
	referral := &models.AffiliateReferral{
		ID:         uuid.New(),
		ReferrerID: referrerID,
		ReferredID: referredID,
		Status:     "PENDING",
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}
	
	err = s.db.WithContext(ctx).Create(referral).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create affiliate referral")
		return err
	}
	
	return nil
}

func (s *AffiliateService) GetReferrals(ctx context.Context, referrerID *uuid.UUID, status string) ([]models.AffiliateReferral, error) {
	var referrals []models.AffiliateReferral
	query := s.db.WithContext(ctx).
		Preload("Referrer").
		Preload("Referred")
	
	if referrerID != nil {
		query = query.Where("referrer_id = ?", *referrerID)
	}
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Order("created_at DESC").Find(&referrals).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get affiliate referrals")
		return nil, err
	}
	
	return referrals, nil
}

func (s *AffiliateService) UpdateReferralStatus(ctx context.Context, id uuid.UUID, status string) error {
	err := s.db.WithContext(ctx).Model(&models.AffiliateReferral{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_at": time.Now(),
		}).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("referralId", id).Error("Failed to update referral status")
		return err
	}
	
	return nil
}

func (s *AffiliateService) CreateReward(ctx context.Context, userID, conditionID uuid.UUID, amount decimal.Decimal) error {
	reward := &models.AffiliateReward{
		ID:          uuid.New(),
		UserID:      userID,
		ConditionID: conditionID,
		Amount:      amount,
		Status:      "PENDING",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	
	err := s.db.WithContext(ctx).Create(reward).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create affiliate reward")
		return err
	}
	
	return nil
}

func (s *AffiliateService) GetRewards(ctx context.Context, userID *uuid.UUID, conditionID *uuid.UUID, status string) ([]models.AffiliateReward, error) {
	var rewards []models.AffiliateReward
	query := s.db.WithContext(ctx).
		Preload("User").
		Preload("Condition")
	
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}
	
	if conditionID != nil {
		query = query.Where("condition_id = ?", *conditionID)
	}
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Order("created_at DESC").Find(&rewards).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get affiliate rewards")
		return nil, err
	}
	
	return rewards, nil
}

func (s *AffiliateService) UpdateRewardStatus(ctx context.Context, id uuid.UUID, status string) error {
	err := s.db.WithContext(ctx).Model(&models.AffiliateReward{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_at": time.Now(),
		}).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("rewardId", id).Error("Failed to update reward status")
		return err
	}
	
	return nil
}

func (s *AffiliateService) ProcessRewards(ctx context.Context) error {
	var conditions []models.AffiliateCondition
	err := s.db.WithContext(ctx).Where("status = ?", true).Find(&conditions).Error
	if err != nil {
		return err
	}
	
	for _, condition := range conditions {
		switch condition.Type {
		case "REGISTRATION":
			err = s.processRegistrationRewards(ctx, condition)
		case "DEPOSIT":
			err = s.processDepositRewards(ctx, condition)
		case "TRADE":
			err = s.processTradeRewards(ctx, condition)
		}
		
		if err != nil {
			s.logger.WithError(err).WithField("conditionId", condition.ID).Error("Failed to process rewards for condition")
		}
	}
	
	return nil
}

func (s *AffiliateService) processRegistrationRewards(ctx context.Context, condition models.AffiliateCondition) error {
	var referrals []models.AffiliateReferral
	err := s.db.WithContext(ctx).Where("status = ?", "ACTIVE").Find(&referrals).Error
	if err != nil {
		return err
	}
	
	for _, referral := range referrals {
		var existingReward models.AffiliateReward
		err = s.db.WithContext(ctx).Where("user_id = ? AND condition_id = ?", 
			referral.ReferrerID, condition.ID).First(&existingReward).Error
		
		if err == gorm.ErrRecordNotFound {
			err = s.CreateReward(ctx, referral.ReferrerID, condition.ID, condition.Reward)
			if err != nil {
				return err
			}
		}
	}
	
	return nil
}

func (s *AffiliateService) processDepositRewards(ctx context.Context, condition models.AffiliateCondition) error {
	return nil
}

func (s *AffiliateService) processTradeRewards(ctx context.Context, condition models.AffiliateCondition) error {
	return nil
}
