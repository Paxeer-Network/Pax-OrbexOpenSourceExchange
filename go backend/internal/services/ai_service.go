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

type AiService struct {
	db     *gorm.DB
	logger *logrus.Logger
}

func NewAiService(db *gorm.DB, logger *logrus.Logger) *AiService {
	return &AiService{
		db:     db,
		logger: logger,
	}
}

func (s *AiService) GetPlans(ctx context.Context, status *bool) ([]models.AiInvestmentPlan, error) {
	var plans []models.AiInvestmentPlan
	query := s.db.WithContext(ctx).
		Preload("Durations").
		Preload("Investments")
	
	if status != nil {
		query = query.Where("status = ?", *status)
	}
	
	err := query.Find(&plans).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get AI investment plans")
		return nil, err
	}
	
	return plans, nil
}

func (s *AiService) GetPlan(ctx context.Context, id uuid.UUID) (*models.AiInvestmentPlan, error) {
	var plan models.AiInvestmentPlan
	err := s.db.WithContext(ctx).
		Preload("Durations").
		Preload("Investments.User").
		First(&plan, "id = ?", id).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("planId", id).Error("Failed to get AI investment plan")
		return nil, err
	}
	
	return &plan, nil
}

func (s *AiService) CreatePlan(ctx context.Context, plan *models.AiInvestmentPlan) error {
	plan.ID = uuid.New()
	plan.CreatedAt = time.Now()
	plan.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(plan).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create AI investment plan")
		return err
	}
	
	return nil
}

func (s *AiService) UpdatePlan(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	updates["updated_at"] = time.Now()
	
	err := s.db.WithContext(ctx).Model(&models.AiInvestmentPlan{}).
		Where("id = ?", id).Updates(updates).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("planId", id).Error("Failed to update AI investment plan")
		return err
	}
	
	return nil
}

func (s *AiService) GetDurations(ctx context.Context) ([]models.AiInvestmentDuration, error) {
	var durations []models.AiInvestmentDuration
	err := s.db.WithContext(ctx).Find(&durations).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get AI investment durations")
		return nil, err
	}
	
	return durations, nil
}

func (s *AiService) CreateDuration(ctx context.Context, duration *models.AiInvestmentDuration) error {
	duration.ID = uuid.New()
	duration.CreatedAt = time.Now()
	duration.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(duration).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create AI investment duration")
		return err
	}
	
	return nil
}

func (s *AiService) CreateInvestment(ctx context.Context, investment *models.AiInvestment) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var plan models.AiInvestmentPlan
		err := tx.First(&plan, "id = ?", investment.PlanID).Error
		if err != nil {
			return err
		}
		
		if !plan.Status {
			return gorm.ErrInvalidData
		}
		
		if investment.Amount.LessThan(plan.MinAmount) || investment.Amount.GreaterThan(plan.MaxAmount) {
			return gorm.ErrInvalidData
		}
		
		var duration models.AiInvestmentDuration
		err = tx.First(&duration, "id = ?", investment.DurationID).Error
		if err != nil {
			return err
		}
		
		investment.ID = uuid.New()
		investment.CreatedAt = time.Now()
		investment.UpdatedAt = time.Now()
		investment.Status = "ACTIVE"
		investment.Result = "PENDING"
		
		switch duration.Timeframe {
		case "DAYS":
			investment.EndDate = time.Now().AddDate(0, 0, duration.Duration)
		case "MONTHS":
			investment.EndDate = time.Now().AddDate(0, duration.Duration, 0)
		case "YEARS":
			investment.EndDate = time.Now().AddDate(duration.Duration, 0, 0)
		}
		
		err = tx.Create(investment).Error
		if err != nil {
			return err
		}
		
		return tx.Model(&plan).Update("invested", plan.Invested.Add(investment.Amount)).Error
	})
}

func (s *AiService) GetInvestments(ctx context.Context, userID *uuid.UUID, planID *uuid.UUID, status string) ([]models.AiInvestment, error) {
	var investments []models.AiInvestment
	query := s.db.WithContext(ctx).
		Preload("User").
		Preload("Plan").
		Preload("Duration")
	
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}
	
	if planID != nil {
		query = query.Where("plan_id = ?", *planID)
	}
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Order("created_at DESC").Find(&investments).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get AI investments")
		return nil, err
	}
	
	return investments, nil
}

func (s *AiService) ProcessInvestments(ctx context.Context) error {
	var investmentsToProcess []models.AiInvestment
	err := s.db.WithContext(ctx).
		Where("status = ? AND end_date <= ?", "ACTIVE", time.Now()).
		Preload("Plan").
		Find(&investmentsToProcess).Error
	
	if err != nil {
		return err
	}
	
	for _, investment := range investmentsToProcess {
		err = s.CompleteInvestment(ctx, investment.ID)
		if err != nil {
			s.logger.WithError(err).WithField("investmentId", investment.ID).Error("Failed to complete AI investment")
		}
	}
	
	return nil
}

func (s *AiService) CompleteInvestment(ctx context.Context, investmentID uuid.UUID) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var investment models.AiInvestment
		err := tx.Preload("Plan").First(&investment, "id = ?", investmentID).Error
		if err != nil {
			return err
		}
		
		if investment.Status != "ACTIVE" {
			return gorm.ErrInvalidData
		}
		
		profit := investment.Amount.Mul(investment.Plan.ProfitPercentage).Div(decimal.NewFromInt(100))
		
		err = tx.Model(&investment).Updates(map[string]interface{}{
			"profit":     profit,
			"result":     "COMPLETED",
			"status":     "COMPLETED",
			"updated_at": time.Now(),
		}).Error
		
		return err
	})
}

func (s *AiService) CancelInvestment(ctx context.Context, userID, investmentID uuid.UUID) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var investment models.AiInvestment
		err := tx.Where("id = ? AND user_id = ?", investmentID, userID).First(&investment).Error
		if err != nil {
			return err
		}
		
		if investment.Status != "ACTIVE" {
			return gorm.ErrInvalidData
		}
		
		penaltyRate := decimal.NewFromFloat(0.05)
		penalty := investment.Amount.Mul(penaltyRate)
		refund := investment.Amount.Sub(penalty)
		
		err = tx.Model(&investment).Updates(map[string]interface{}{
			"profit":     refund.Sub(investment.Amount),
			"result":     "CANCELLED",
			"status":     "CANCELLED",
			"updated_at": time.Now(),
		}).Error
		
		return err
	})
}
