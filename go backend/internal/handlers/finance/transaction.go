package finance

import (
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type TransactionHandler struct {
	transactionService *services.TransactionService
	logger             *logrus.Logger
}

func NewTransactionHandler(transactionService *services.TransactionService, logger *logrus.Logger) *TransactionHandler {
	return &TransactionHandler{
		transactionService: transactionService,
		logger:             logger,
	}
}

func (h *TransactionHandler) GetTransactions(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	uid, ok := userID.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	limitStr := c.DefaultQuery("limit", "50")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 50
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}

	transactionType := c.Query("type")
	status := c.Query("status")

	transactions, err := h.transactionService.GetTransactions(c.Request.Context(), uid, transactionType, status, limit, offset)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get transactions")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get transactions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": transactions})
}

func (h *TransactionHandler) GetTransaction(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	uid, ok := userID.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	transactionIDStr := c.Param("id")
	transactionID, err := uuid.Parse(transactionIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid transaction ID"})
		return
	}

	transaction, err := h.transactionService.GetTransaction(c.Request.Context(), uid, transactionID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get transaction")
		c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": transaction})
}

func (h *TransactionHandler) AnalyzeTransactions(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	uid, ok := userID.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var request struct {
		StartDate string `json:"startDate"`
		EndDate   string `json:"endDate"`
		Type      string `json:"type"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	analysis, err := h.transactionService.AnalyzeTransactions(c.Request.Context(), uid, request.StartDate, request.EndDate, request.Type)
	if err != nil {
		h.logger.WithError(err).Error("Failed to analyze transactions")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze transactions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": analysis})
}
