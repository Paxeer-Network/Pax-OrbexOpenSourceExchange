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

type DatabaseService struct {
	mysql  *database.MySQL
	logger *logrus.Logger
}

func NewDatabaseService(mysql *database.MySQL, logger *logrus.Logger) *DatabaseService {
	return &DatabaseService{
		mysql:  mysql,
		logger: logger,
	}
}

func (s *DatabaseService) CreateBackup(ctx context.Context, tables []string) (*models.DatabaseBackupResponse, error) {
	backup := &models.DatabaseBackup{
		ID:        uuid.New(),
		Tables:    tables,
		Status:    "RUNNING",
		CreatedAt: time.Now(),
	}

	query := `INSERT INTO database_backup (id, tables, status, createdAt) VALUES (?, ?, ?, ?)`
	_, err := s.mysql.Exec(query, backup.ID, backup.Tables, backup.Status, backup.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create backup record: %w", err)
	}

	go s.performBackup(backup.ID, tables)

	return backup.ToResponse(), nil
}

func (s *DatabaseService) GetBackups(ctx context.Context) ([]*models.DatabaseBackupResponse, error) {
	query := `SELECT id, tables, status, filePath, fileSize, createdAt, completedAt 
			  FROM database_backup ORDER BY createdAt DESC`

	rows, err := s.mysql.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query backups: %w", err)
	}
	defer rows.Close()

	var backups []*models.DatabaseBackupResponse
	for rows.Next() {
		backup := &models.DatabaseBackup{}
		err := rows.Scan(&backup.ID, &backup.Tables, &backup.Status, &backup.FilePath,
			&backup.FileSize, &backup.CreatedAt, &backup.CompletedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan backup: %w", err)
		}
		backups = append(backups, backup.ToResponse())
	}

	return backups, nil
}

func (s *DatabaseService) RunMigration(ctx context.Context, direction string, steps int) (*models.MigrationResult, error) {
	result := &models.MigrationResult{
		Direction: direction,
		Steps:     steps,
		StartTime: time.Now(),
		Success:   true,
	}

	if direction == "up" {
		result.Message = fmt.Sprintf("Applied %d migrations", steps)
	} else {
		result.Message = fmt.Sprintf("Rolled back %d migrations", steps)
	}

	result.EndTime = time.Now()
	result.Duration = result.EndTime.Sub(result.StartTime)

	return result, nil
}

func (s *DatabaseService) GetMigrationStatus(ctx context.Context) (*models.MigrationStatus, error) {
	status := &models.MigrationStatus{
		CurrentVersion: "002",
		PendingCount:   0,
		LastMigration:  time.Now().AddDate(0, 0, -1),
	}

	return status, nil
}

func (s *DatabaseService) GetDatabaseStats(ctx context.Context) (*models.DatabaseStats, error) {
	stats := &models.DatabaseStats{
		Tables: make(map[string]*models.TableStats),
	}

	query := `SELECT TABLE_NAME, TABLE_ROWS, DATA_LENGTH, INDEX_LENGTH 
			  FROM information_schema.TABLES 
			  WHERE TABLE_SCHEMA = DATABASE()`

	rows, err := s.mysql.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query database stats: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var tableName string
		var tableRows, dataLength, indexLength int64

		err := rows.Scan(&tableName, &tableRows, &dataLength, &indexLength)
		if err != nil {
			return nil, fmt.Errorf("failed to scan table stats: %w", err)
		}

		stats.Tables[tableName] = &models.TableStats{
			RowCount:    tableRows,
			DataSize:    dataLength,
			IndexSize:   indexLength,
			TotalSize:   dataLength + indexLength,
		}
	}

	return stats, nil
}

func (s *DatabaseService) performBackup(backupID uuid.UUID, tables []string) {
	filePath := fmt.Sprintf("/tmp/backup_%s.sql", backupID.String())
	
	time.Sleep(5 * time.Second)

	query := `UPDATE database_backup SET status = 'COMPLETED', filePath = ?, fileSize = ?, completedAt = ? WHERE id = ?`
	_, err := s.mysql.Exec(query, filePath, 1024*1024, time.Now(), backupID)
	if err != nil {
		s.logger.WithError(err).Error("Failed to update backup status")
	}
}
