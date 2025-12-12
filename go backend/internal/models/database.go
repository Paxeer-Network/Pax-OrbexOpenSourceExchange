package models

import (
	"time"

	"github.com/google/uuid"
)

type DatabaseBackup struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	Tables      []string   `json:"tables" db:"tables"`
	Status      string     `json:"status" db:"status"`
	FilePath    *string    `json:"filePath" db:"filePath"`
	FileSize    *int64     `json:"fileSize" db:"fileSize"`
	CreatedAt   time.Time  `json:"createdAt" db:"createdAt"`
	CompletedAt *time.Time `json:"completedAt" db:"completedAt"`
}

type DatabaseBackupResponse struct {
	ID          uuid.UUID  `json:"id"`
	Tables      []string   `json:"tables"`
	Status      string     `json:"status"`
	FilePath    *string    `json:"filePath"`
	FileSize    *int64     `json:"fileSize"`
	CreatedAt   time.Time  `json:"createdAt"`
	CompletedAt *time.Time `json:"completedAt"`
}

type MigrationResult struct {
	Direction string        `json:"direction"`
	Steps     int           `json:"steps"`
	Message   string        `json:"message"`
	Success   bool          `json:"success"`
	StartTime time.Time     `json:"startTime"`
	EndTime   time.Time     `json:"endTime"`
	Duration  time.Duration `json:"duration"`
}

type MigrationStatus struct {
	CurrentVersion string    `json:"currentVersion"`
	PendingCount   int       `json:"pendingCount"`
	LastMigration  time.Time `json:"lastMigration"`
}

type DatabaseStats struct {
	Tables map[string]*TableStats `json:"tables"`
}

type TableStats struct {
	RowCount  int64 `json:"rowCount"`
	DataSize  int64 `json:"dataSize"`
	IndexSize int64 `json:"indexSize"`
	TotalSize int64 `json:"totalSize"`
}

func (d *DatabaseBackup) ToResponse() *DatabaseBackupResponse {
	return &DatabaseBackupResponse{
		ID:          d.ID,
		Tables:      d.Tables,
		Status:      d.Status,
		FilePath:    d.FilePath,
		FileSize:    d.FileSize,
		CreatedAt:   d.CreatedAt,
		CompletedAt: d.CompletedAt,
	}
}
