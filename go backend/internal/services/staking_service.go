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

type StakingService struct {
	db     *gorm.DB
	logger *logrus.Logger
}

func NewStakingService(db *gorm.DB, logger *logrus.Logger) *StakingService {
	return &StakingService{
		db:     db,
		logger: logger,
	}
}

func (s *StakingService) GetPools(ctx context.Context, currency string, chain string, status *bool) ([]models.StakingPool, error) {
	var pools []models.StakingPool
	query := s.db.WithContext(ctx).
		Preload("StakingDurations").
		Preload("StakingLogs")
	
	if currency != "" {
		query = query.Where("currency = ?", currency)
	}
	
	if chain != "" {
		query = query.Where("chain = ?", chain)
	}
	
	if status != nil {
		query = query.Where("status = ?", *status)
	}
	
	err := query.Find(&pools).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get staking pools")
		return nil, err
	}
	
	return pools, nil
}

func (s *StakingService) GetPool(ctx context.Context, id uuid.UUID) (*models.StakingPool, error) {
	var pool models.StakingPool
	err := s.db.WithContext(ctx).
		Preload("StakingDurations").
		Preload("StakingLogs.User").
		First(&pool, "id = ?", id).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("poolId", id).Error("Failed to get staking pool")
		return nil, err
	}
	
	return &pool, nil
}

func (s *StakingService) CreatePool(ctx context.Context, pool *models.StakingPool) error {
	pool.ID = uuid.New()
	pool.CreatedAt = time.Now()
	pool.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(pool).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create staking pool")
		return err
	}
	
	return nil
}

func (s *StakingService) UpdatePool(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	updates["updated_at"] = time.Now()
	
	err := s.db.WithContext(ctx).Model(&models.StakingPool{}).
		Where("id = ?", id).Updates(updates).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("poolId", id).Error("Failed to update staking pool")
		return err
	}
	
	return nil
}

func (s *StakingService) GetDurations(ctx context.Context, poolID *uuid.UUID) ([]models.StakingDuration, error) {
	var durations []models.StakingDuration
	query := s.db.WithContext(ctx).Preload("Pool")
	
	if poolID != nil {
		query = query.Where("pool_id = ?", *poolID)
	}
	
	err := query.Find(&durations).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get staking durations")
		return nil, err
	}
	
	return durations, nil
}

func (s *StakingService) CreateDuration(ctx context.Context, duration *models.StakingDuration) error {
	duration.ID = uuid.New()
	duration.CreatedAt = time.Now()
	duration.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(duration).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create staking duration")
		return err
	}
	
	return nil
}

func (s *StakingService) CreateStake(ctx context.Context, stake *models.StakingLog) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var pool models.StakingPool
		err := tx.First(&pool, "id = ?", stake.PoolID).Error
		if err != nil {
			return err
		}
		
		if !pool.Status {
			return gorm.ErrInvalidData
		}
		
		var duration models.StakingDuration
		err = tx.First(&duration, "id = ?", stake.DurationID).Error
		if err != nil {
			return err
		}
		
		stake.ID = uuid.New()
		stake.CreatedAt = time.Now()
		stake.UpdatedAt = time.Now()
		stake.Status = "ACTIVE"
		stake.ReleaseDate = time.Now().AddDate(0, 0, duration.Duration)
		
		reward := stake.Amount.Mul(duration.InterestRate).Div(decimal.NewFromInt(100))
		stake.Reward = reward
		
		return tx.Create(stake).Error
	})
}

func (s *StakingService) GetStakes(ctx context.Context, userID *uuid.UUID, poolID *uuid.UUID, status string) ([]models.StakingLog, error) {
	var stakes []models.StakingLog
	query := s.db.WithContext(ctx).
		Preload("User").
		Preload("Pool").
		Preload("Duration")
	
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}
	
	if poolID != nil {
		query = query.Where("pool_id = ?", *poolID)
	}
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Order("created_at DESC").Find(&stakes).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get staking logs")
		return nil, err
	}
	
	return stakes, nil
}

func (s *StakingService) GetStake(ctx context.Context, id uuid.UUID) (*models.StakingLog, error) {
	var stake models.StakingLog
	err := s.db.WithContext(ctx).
		Preload("User").
		Preload("Pool").
		Preload("Duration").
		First(&stake, "id = ?", id).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("stakeId", id).Error("Failed to get staking log")
		return nil, err
	}
	
	return &stake, nil
}

func (s *StakingService) ProcessStakes(ctx context.Context) error {
	var stakesToRelease []models.StakingLog
	err := s.db.WithContext(ctx).
		Where("status = ? AND release_date <= ?", "ACTIVE", time.Now()).
		Preload("Pool").
		Preload("User").
		Preload("Duration").
		Find(&stakesToRelease).Error
	
	if err != nil {
		return err
	}
	
	for _, stake := range stakesToRelease {
		err = s.ReleaseStake(ctx, stake.ID)
		if err != nil {
			s.logger.WithError(err).WithField("stakeId", stake.ID).Error("Failed to release stake")
		}
	}
	
	return nil
}

func (s *StakingService) ReleaseStake(ctx context.Context, stakeID uuid.UUID) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var stake models.StakingLog
		err := tx.First(&stake, "id = ?", stakeID).Error
		if err != nil {
			return err
		}
		
		if stake.Status != "ACTIVE" {
			return gorm.ErrInvalidData
		}
		
		err = tx.Model(&stake).Updates(map[string]interface{}{
			"status":     "RELEASED",
			"updated_at": time.Now(),
		}).Error
		
		if err != nil {
			return err
		}
		
		return nil
	})
}

func (s *StakingService) CancelStake(ctx context.Context, userID, stakeID uuid.UUID) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var stake models.StakingLog
		err := tx.Where("id = ? AND user_id = ?", stakeID, userID).First(&stake).Error
		if err != nil {
			return err
		}
		
		if stake.Status != "ACTIVE" {
			return gorm.ErrInvalidData
		}
		
		penaltyRate := decimal.NewFromFloat(0.1)
		penalty := stake.Amount.Mul(penaltyRate)
		refundAmount := stake.Amount.Sub(penalty)
		
		err = tx.Model(&stake).Updates(map[string]interface{}{
			"status":     "CANCELLED",
			"reward":     refundAmount.Sub(stake.Amount),
			"updated_at": time.Now(),
		}).Error
		
		return err
	})
}
