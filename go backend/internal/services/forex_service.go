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

type ForexService struct {
	db     *gorm.DB
	logger *logrus.Logger
}

func NewForexService(db *gorm.DB, logger *logrus.Logger) *ForexService {
	return &ForexService{
		db:     db,
		logger: logger,
	}
}

func (s *ForexService) GetPlans(ctx context.Context, status *bool) ([]models.ForexPlan, error) {
	var plans []models.ForexPlan
	query := s.db.WithContext(ctx).
		Preload("Durations").
		Preload("Investments")
	
	if status != nil {
		query = query.Where("status = ?", *status)
	}
	
	err := query.Find(&plans).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get forex plans")
		return nil, err
	}
	
	return plans, nil
}

func (s *ForexService) GetPlan(ctx context.Context, id uuid.UUID) (*models.ForexPlan, error) {
	var plan models.ForexPlan
	err := s.db.WithContext(ctx).
		Preload("Durations").
		Preload("Investments.User").
		First(&plan, "id = ?", id).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("planId", id).Error("Failed to get forex plan")
		return nil, err
	}
	
	return &plan, nil
}

func (s *ForexService) CreatePlan(ctx context.Context, plan *models.ForexPlan) error {
	plan.ID = uuid.New()
	plan.CreatedAt = time.Now()
	plan.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(plan).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create forex plan")
		return err
	}
	
	return nil
}

func (s *ForexService) GetAccounts(ctx context.Context, userID *uuid.UUID, accountType string) ([]models.ForexAccount, error) {
	var accounts []models.ForexAccount
	query := s.db.WithContext(ctx).Preload("User")
	
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}
	
	if accountType != "" {
		query = query.Where("type = ?", accountType)
	}
	
	err := query.Find(&accounts).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get forex accounts")
		return nil, err
	}
	
	return accounts, nil
}

func (s *ForexService) CreateAccount(ctx context.Context, account *models.ForexAccount) error {
	account.ID = uuid.New()
	account.CreatedAt = time.Now()
	account.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(account).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create forex account")
		return err
	}
	
	return nil
}

func (s *ForexService) UpdateAccountBalance(ctx context.Context, accountID uuid.UUID, balance decimal.Decimal) error {
	err := s.db.WithContext(ctx).Model(&models.ForexAccount{}).
		Where("id = ?", accountID).
		Updates(map[string]interface{}{
			"balance":    balance,
			"updated_at": time.Now(),
		}).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("accountId", accountID).Error("Failed to update forex account balance")
		return err
	}
	
	return nil
}

func (s *ForexService) CreateInvestment(ctx context.Context, investment *models.ForexInvestment) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var plan models.ForexPlan
		err := tx.First(&plan, "id = ?", investment.PlanID).Error
		if err != nil {
			return err
		}
		
		if !plan.Status {
			return gorm.ErrInvalidData
		}
		
		var account models.ForexAccount
		err = tx.First(&account, "id = ?", investment.AccountID).Error
		if err != nil {
			return err
		}
		
		if account.Balance.LessThan(investment.Amount) {
			return gorm.ErrInvalidData
		}
		
		var duration models.ForexDuration
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
		
		newBalance := account.Balance.Sub(investment.Amount)
		err = tx.Model(&account).Update("balance", newBalance).Error
		if err != nil {
			return err
		}
		
		return tx.Model(&plan).Update("invested", plan.Invested.Add(investment.Amount)).Error
	})
}

func (s *ForexService) GetInvestments(ctx context.Context, userID *uuid.UUID, planID *uuid.UUID, status string) ([]models.ForexInvestment, error) {
	var investments []models.ForexInvestment
	query := s.db.WithContext(ctx).
		Preload("User").
		Preload("Plan").
		Preload("Duration").
		Preload("Account")
	
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
		s.logger.WithError(err).Error("Failed to get forex investments")
		return nil, err
	}
	
	return investments, nil
}

func (s *ForexService) GetSignals(ctx context.Context, status string) ([]models.ForexSignal, error) {
	var signals []models.ForexSignal
	query := s.db.WithContext(ctx)
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Order("created_at DESC").Find(&signals).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get forex signals")
		return nil, err
	}
	
	return signals, nil
}

func (s *ForexService) CreateSignal(ctx context.Context, signal *models.ForexSignal) error {
	signal.ID = uuid.New()
	signal.CreatedAt = time.Now()
	signal.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(signal).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create forex signal")
		return err
	}
	
	return nil
}

func (s *ForexService) ProcessInvestments(ctx context.Context) error {
	var investmentsToProcess []models.ForexInvestment
	err := s.db.WithContext(ctx).
		Where("status = ? AND end_date <= ?", "ACTIVE", time.Now()).
		Preload("Plan").
		Preload("Account").
		Find(&investmentsToProcess).Error
	
	if err != nil {
		return err
	}
	
	for _, investment := range investmentsToProcess {
		err = s.CompleteInvestment(ctx, investment.ID)
		if err != nil {
			s.logger.WithError(err).WithField("investmentId", investment.ID).Error("Failed to complete forex investment")
		}
	}
	
	return nil
}

func (s *ForexService) CompleteInvestment(ctx context.Context, investmentID uuid.UUID) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var investment models.ForexInvestment
		err := tx.Preload("Plan").Preload("Account").First(&investment, "id = ?", investmentID).Error
		if err != nil {
			return err
		}
		
		if investment.Status != "ACTIVE" {
			return gorm.ErrInvalidData
		}
		
		profit := investment.Amount.Mul(investment.Plan.ProfitPercentage).Div(decimal.NewFromInt(100))
		totalReturn := investment.Amount.Add(profit)
		
		err = tx.Model(&investment).Updates(map[string]interface{}{
			"profit":     profit,
			"result":     "COMPLETED",
			"status":     "COMPLETED",
			"updated_at": time.Now(),
		}).Error
		if err != nil {
			return err
		}
		
		newBalance := investment.Account.Balance.Add(totalReturn)
		return tx.Model(&investment.Account).Update("balance", newBalance).Error
	})
}
