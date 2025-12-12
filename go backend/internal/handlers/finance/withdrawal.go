package finance

import (
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type WithdrawalHandler struct {
	withdrawalService *services.WithdrawalService
	logger            *logrus.Logger
}

func NewWithdrawalHandler(withdrawalService *services.WithdrawalService, logger *logrus.Logger) *WithdrawalHandler {
	return &WithdrawalHandler{
		withdrawalService: withdrawalService,
		logger:            logger,
	}
}

func (h *WithdrawalHandler) CreateFiatWithdrawal(c *gin.Context) {
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

	var request models.CreateWithdrawalRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	withdrawal, err := h.withdrawalService.CreateFiatWithdrawal(c.Request.Context(), uid, &request)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create fiat withdrawal")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": withdrawal})
}

func (h *WithdrawalHandler) CreateSpotWithdrawal(c *gin.Context) {
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

	var request models.CreateWithdrawalRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	withdrawal, err := h.withdrawalService.CreateSpotWithdrawal(c.Request.Context(), uid, &request)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create spot withdrawal")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": withdrawal})
}

func (h *WithdrawalHandler) GetWithdrawals(c *gin.Context) {
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

	withdrawals, err := h.withdrawalService.GetUserWithdrawals(c.Request.Context(), uid)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get withdrawals")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get withdrawals"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": withdrawals})
}

func (h *WithdrawalHandler) CancelWithdrawal(c *gin.Context) {
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

	withdrawalIDStr := c.Param("id")
	withdrawalID, err := uuid.Parse(withdrawalIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid withdrawal ID"})
		return
	}

	err = h.withdrawalService.CancelWithdrawal(c.Request.Context(), uid, withdrawalID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to cancel withdrawal")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Withdrawal canceled successfully"})
}
