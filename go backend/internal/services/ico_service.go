package services

import (
	"context"
	"crypto-exchange-go/internal/models"
	"time"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type IcoService struct {
	db     *gorm.DB
	logger *logrus.Logger
}

func NewIcoService(db *gorm.DB, logger *logrus.Logger) *IcoService {
	return &IcoService{
		db:     db,
		logger: logger,
	}
}

func (s *IcoService) GetProjects(ctx context.Context, status string) ([]models.IcoProject, error) {
	var projects []models.IcoProject
	query := s.db.WithContext(ctx)
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Preload("IcoTokens").Find(&projects).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ICO projects")
		return nil, err
	}
	
	return projects, nil
}

func (s *IcoService) GetProject(ctx context.Context, id uuid.UUID) (*models.IcoProject, error) {
	var project models.IcoProject
	err := s.db.WithContext(ctx).
		Preload("IcoTokens.IcoPhases.IcoContributions").
		Preload("IcoTokens.IcoAllocations").
		First(&project, "id = ?", id).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("projectId", id).Error("Failed to get ICO project")
		return nil, err
	}
	
	return &project, nil
}

func (s *IcoService) CreateProject(ctx context.Context, project *models.IcoProject) error {
	project.ID = uuid.New()
	project.CreatedAt = time.Now()
	project.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(project).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create ICO project")
		return err
	}
	
	return nil
}

func (s *IcoService) UpdateProject(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	updates["updated_at"] = time.Now()
	
	err := s.db.WithContext(ctx).Model(&models.IcoProject{}).
		Where("id = ?", id).Updates(updates).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("projectId", id).Error("Failed to update ICO project")
		return err
	}
	
	return nil
}

func (s *IcoService) DeleteProject(ctx context.Context, id uuid.UUID) error {
	err := s.db.WithContext(ctx).Delete(&models.IcoProject{}, "id = ?", id).Error
	if err != nil {
		s.logger.WithError(err).WithField("projectId", id).Error("Failed to delete ICO project")
		return err
	}
	
	return nil
}

func (s *IcoService) GetTokens(ctx context.Context, projectID *uuid.UUID) ([]models.IcoToken, error) {
	var tokens []models.IcoToken
	query := s.db.WithContext(ctx).Preload("Project").Preload("IcoPhases")
	
	if projectID != nil {
		query = query.Where("project_id = ?", *projectID)
	}
	
	err := query.Find(&tokens).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ICO tokens")
		return nil, err
	}
	
	return tokens, nil
}

func (s *IcoService) GetToken(ctx context.Context, id uuid.UUID) (*models.IcoToken, error) {
	var token models.IcoToken
	err := s.db.WithContext(ctx).
		Preload("Project").
		Preload("IcoPhases.IcoContributions").
		Preload("IcoAllocations").
		First(&token, "id = ?", id).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("tokenId", id).Error("Failed to get ICO token")
		return nil, err
	}
	
	return &token, nil
}

func (s *IcoService) CreateToken(ctx context.Context, token *models.IcoToken) error {
	token.ID = uuid.New()
	token.CreatedAt = time.Now()
	token.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(token).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create ICO token")
		return err
	}
	
	return nil
}

func (s *IcoService) GetPhases(ctx context.Context, tokenID *uuid.UUID, status string) ([]models.IcoPhase, error) {
	var phases []models.IcoPhase
	query := s.db.WithContext(ctx).Preload("Token")
	
	if tokenID != nil {
		query = query.Where("token_id = ?", *tokenID)
	}
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Find(&phases).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ICO phases")
		return nil, err
	}
	
	return phases, nil
}

func (s *IcoService) CreatePhase(ctx context.Context, phase *models.IcoPhase) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var existingPhases []models.IcoPhase
		err := tx.Where("token_id = ? AND status IN ?", phase.TokenID, []string{"PENDING", "ACTIVE"}).
			Find(&existingPhases).Error
		if err != nil {
			return err
		}
		
		for _, existing := range existingPhases {
			if (phase.StartDate.Before(existing.EndDate) && phase.EndDate.After(existing.StartDate)) {
				return gorm.ErrInvalidData
			}
		}
		
		phase.ID = uuid.New()
		phase.CreatedAt = time.Now()
		phase.UpdatedAt = time.Now()
		
		if phase.StartDate.Before(time.Now()) {
			phase.Status = "ACTIVE"
		} else {
			phase.Status = "PENDING"
		}
		
		return tx.Create(phase).Error
	})
}

func (s *IcoService) UpdatePhaseStatus(ctx context.Context, phaseID uuid.UUID, status string) error {
	err := s.db.WithContext(ctx).Model(&models.IcoPhase{}).
		Where("id = ?", phaseID).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_at": time.Now(),
		}).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("phaseId", phaseID).Error("Failed to update ICO phase status")
		return err
	}
	
	return nil
}

func (s *IcoService) ProcessPhases(ctx context.Context) error {
	now := time.Now()
	
	var pendingPhases []models.IcoPhase
	err := s.db.WithContext(ctx).Where("status = ? AND start_date <= ?", "PENDING", now).
		Find(&pendingPhases).Error
	if err != nil {
		return err
	}
	
	for _, phase := range pendingPhases {
		if phase.EndDate.After(now) {
			err = s.UpdatePhaseStatus(ctx, phase.ID, "ACTIVE")
			if err != nil {
				s.logger.WithError(err).WithField("phaseId", phase.ID).Error("Failed to activate ICO phase")
			}
		}
	}
	
	var activePhases []models.IcoPhase
	err = s.db.WithContext(ctx).Where("status = ? AND end_date <= ?", "ACTIVE", now).
		Find(&activePhases).Error
	if err != nil {
		return err
	}
	
	for _, phase := range activePhases {
		err = s.UpdatePhaseStatus(ctx, phase.ID, "COMPLETED")
		if err != nil {
			s.logger.WithError(err).WithField("phaseId", phase.ID).Error("Failed to complete ICO phase")
		}
	}
	
	return nil
}

func (s *IcoService) CreateContribution(ctx context.Context, contribution *models.IcoContribution) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var phase models.IcoPhase
		err := tx.Preload("Token").First(&phase, "id = ?", contribution.PhaseID).Error
		if err != nil {
			return err
		}
		
		if phase.Status != "ACTIVE" {
			return gorm.ErrInvalidData
		}
		
		if contribution.Amount.LessThan(phase.MinPurchase) || 
		   contribution.Amount.GreaterThan(phase.MaxPurchase) {
			return gorm.ErrInvalidData
		}
		
		contribution.ID = uuid.New()
		contribution.CreatedAt = time.Now()
		contribution.UpdatedAt = time.Now()
		contribution.Status = "PENDING"
		
		return tx.Create(contribution).Error
	})
}

func (s *IcoService) GetContributions(ctx context.Context, userID *uuid.UUID, phaseID *uuid.UUID) ([]models.IcoContribution, error) {
	var contributions []models.IcoContribution
	query := s.db.WithContext(ctx).
		Preload("User").
		Preload("Phase.Token")
	
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}
	
	if phaseID != nil {
		query = query.Where("phase_id = ?", *phaseID)
	}
	
	err := query.Find(&contributions).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ICO contributions")
		return nil, err
	}
	
	return contributions, nil
}
