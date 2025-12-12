package services

import (
	"context"
	"crypto-exchange-go/internal/models"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type MailwizardService struct {
	db     *gorm.DB
	logger *logrus.Logger
}

func NewMailwizardService(db *gorm.DB, logger *logrus.Logger) *MailwizardService {
	return &MailwizardService{
		db:     db,
		logger: logger,
	}
}

func (s *MailwizardService) GetTemplates(ctx context.Context, templateType string, status *bool) ([]models.MailwizardTemplate, error) {
	var templates []models.MailwizardTemplate
	query := s.db.WithContext(ctx)
	
	if templateType != "" {
		query = query.Where("type = ?", templateType)
	}
	
	if status != nil {
		query = query.Where("status = ?", *status)
	}
	
	err := query.Find(&templates).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get mailwizard templates")
		return nil, err
	}
	
	return templates, nil
}

func (s *MailwizardService) GetTemplate(ctx context.Context, id uuid.UUID) (*models.MailwizardTemplate, error) {
	var template models.MailwizardTemplate
	err := s.db.WithContext(ctx).
		Preload("MailwizardCampaigns").
		First(&template, "id = ?", id).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("templateId", id).Error("Failed to get mailwizard template")
		return nil, err
	}
	
	return &template, nil
}

func (s *MailwizardService) CreateTemplate(ctx context.Context, template *models.MailwizardTemplate) error {
	template.ID = uuid.New()
	template.CreatedAt = time.Now()
	template.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(template).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create mailwizard template")
		return err
	}
	
	return nil
}

func (s *MailwizardService) UpdateTemplate(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	updates["updated_at"] = time.Now()
	
	err := s.db.WithContext(ctx).Model(&models.MailwizardTemplate{}).
		Where("id = ?", id).Updates(updates).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("templateId", id).Error("Failed to update mailwizard template")
		return err
	}
	
	return nil
}

func (s *MailwizardService) DeleteTemplate(ctx context.Context, id uuid.UUID) error {
	err := s.db.WithContext(ctx).Delete(&models.MailwizardTemplate{}, "id = ?", id).Error
	if err != nil {
		s.logger.WithError(err).WithField("templateId", id).Error("Failed to delete mailwizard template")
		return err
	}
	
	return nil
}

func (s *MailwizardService) GetCampaigns(ctx context.Context, status string) ([]models.MailwizardCampaign, error) {
	var campaigns []models.MailwizardCampaign
	query := s.db.WithContext(ctx).Preload("Template")
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Order("created_at DESC").Find(&campaigns).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get mailwizard campaigns")
		return nil, err
	}
	
	return campaigns, nil
}

func (s *MailwizardService) GetCampaign(ctx context.Context, id uuid.UUID) (*models.MailwizardCampaign, error) {
	var campaign models.MailwizardCampaign
	err := s.db.WithContext(ctx).
		Preload("Template").
		First(&campaign, "id = ?", id).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("campaignId", id).Error("Failed to get mailwizard campaign")
		return nil, err
	}
	
	return &campaign, nil
}

func (s *MailwizardService) CreateCampaign(ctx context.Context, campaign *models.MailwizardCampaign) error {
	campaign.ID = uuid.New()
	campaign.CreatedAt = time.Now()
	campaign.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(campaign).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create mailwizard campaign")
		return err
	}
	
	return nil
}

func (s *MailwizardService) UpdateCampaign(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	updates["updated_at"] = time.Now()
	
	err := s.db.WithContext(ctx).Model(&models.MailwizardCampaign{}).
		Where("id = ?", id).Updates(updates).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("campaignId", id).Error("Failed to update mailwizard campaign")
		return err
	}
	
	return nil
}

func (s *MailwizardService) DeleteCampaign(ctx context.Context, id uuid.UUID) error {
	err := s.db.WithContext(ctx).Delete(&models.MailwizardCampaign{}, "id = ?", id).Error
	if err != nil {
		s.logger.WithError(err).WithField("campaignId", id).Error("Failed to delete mailwizard campaign")
		return err
	}
	
	return nil
}

func (s *MailwizardService) SendCampaign(ctx context.Context, campaignID uuid.UUID) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var campaign models.MailwizardCampaign
		err := tx.Preload("Template").First(&campaign, "id = ?", campaignID).Error
		if err != nil {
			return err
		}
		
		if campaign.Status != "PENDING" {
			return gorm.ErrInvalidData
		}
		
		var targets []string
		err = json.Unmarshal([]byte(campaign.Targets), &targets)
		if err != nil {
			return err
		}
		
		err = tx.Model(&campaign).Updates(map[string]interface{}{
			"status":     "SENT",
			"updated_at": time.Now(),
		}).Error
		
		return err
	})
}
