package system

import (
	"crypto-exchange-go/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type DatabaseHandler struct {
	databaseService *services.DatabaseService
	logger          *logrus.Logger
}

func NewDatabaseHandler(databaseService *services.DatabaseService, logger *logrus.Logger) *DatabaseHandler {
	return &DatabaseHandler{
		databaseService: databaseService,
		logger:          logger,
	}
}

func (h *DatabaseHandler) CreateBackup(c *gin.Context) {
	var request struct {
		Tables []string `json:"tables"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	backup, err := h.databaseService.CreateBackup(c.Request.Context(), request.Tables)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create database backup")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create backup"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": backup})
}

func (h *DatabaseHandler) GetBackups(c *gin.Context) {
	backups, err := h.databaseService.GetBackups(c.Request.Context())
	if err != nil {
		h.logger.WithError(err).Error("Failed to get database backups")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get backups"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": backups})
}

func (h *DatabaseHandler) RunMigration(c *gin.Context) {
	var request struct {
		Direction string `json:"direction"`
		Steps     int    `json:"steps"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.databaseService.RunMigration(c.Request.Context(), request.Direction, request.Steps)
	if err != nil {
		h.logger.WithError(err).Error("Failed to run database migration")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to run migration"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (h *DatabaseHandler) GetMigrationStatus(c *gin.Context) {
	status, err := h.databaseService.GetMigrationStatus(c.Request.Context())
	if err != nil {
		h.logger.WithError(err).Error("Failed to get migration status")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get migration status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": status})
}

func (h *DatabaseHandler) GetDatabaseStats(c *gin.Context) {
	stats, err := h.databaseService.GetDatabaseStats(c.Request.Context())
	if err != nil {
		h.logger.WithError(err).Error("Failed to get database stats")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get database stats"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": stats})
}
