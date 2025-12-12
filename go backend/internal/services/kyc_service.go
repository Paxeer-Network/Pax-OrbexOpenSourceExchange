package services

import (
	"context"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/internal/models"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type KYCService struct {
	mysql  *database.MySQL
	logger *logrus.Logger
}

func NewKYCService(mysql *database.MySQL, logger *logrus.Logger) *KYCService {
	return &KYCService{
		mysql:  mysql,
		logger: logger,
	}
}

func (s *KYCService) SubmitApplication(ctx context.Context, userID uuid.UUID, req *models.KYCApplicationRequest) (*models.KYCApplicationResponse, error) {
	application := &models.KYCApplication{
		ID:          uuid.New(),
		UserID:      userID,
		Level:       req.Level,
		Status:      "PENDING",
		Data:        req.Data,
		Documents:   req.Documents,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	query := `INSERT INTO kyc (id, userId, level, status, data, documents, createdAt, updatedAt) 
			  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := s.mysql.Exec(query, application.ID, application.UserID, application.Level,
		application.Status, application.Data, application.Documents,
		application.CreatedAt, application.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create KYC application: %w", err)
	}

	return application.ToResponse(), nil
}

func (s *KYCService) GetUserApplications(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*models.KYCApplicationResponse, error) {
	query := `SELECT id, userId, level, status, data, documents, notes, createdAt, updatedAt 
			  FROM kyc WHERE userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?`

	rows, err := s.mysql.Query(query, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query KYC applications: %w", err)
	}
	defer rows.Close()

	var applications []*models.KYCApplicationResponse
	for rows.Next() {
		application := &models.KYCApplication{}
		err := rows.Scan(&application.ID, &application.UserID, &application.Level,
			&application.Status, &application.Data, &application.Documents,
			&application.Notes, &application.CreatedAt, &application.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan KYC application: %w", err)
		}
		applications = append(applications, application.ToResponse())
	}

	return applications, nil
}

func (s *KYCService) GetApplication(ctx context.Context, userID, applicationID uuid.UUID) (*models.KYCApplicationResponse, error) {
	query := `SELECT id, userId, level, status, data, documents, notes, createdAt, updatedAt 
			  FROM kyc WHERE id = ? AND userId = ?`

	application := &models.KYCApplication{}
	err := s.mysql.Get(application, query, applicationID, userID)
	if err != nil {
		return nil, fmt.Errorf("KYC application not found: %w", err)
	}

	return application.ToResponse(), nil
}

func (s *KYCService) UpdateApplication(ctx context.Context, userID, applicationID uuid.UUID, req *models.KYCApplicationRequest) error {
	query := `UPDATE kyc SET level = ?, data = ?, documents = ?, updatedAt = ? 
			  WHERE id = ? AND userId = ? AND status = 'PENDING'`

	_, err := s.mysql.Exec(query, req.Level, req.Data, req.Documents, time.Now(), applicationID, userID)
	if err != nil {
		return fmt.Errorf("failed to update KYC application: %w", err)
	}

	return nil
}
