package finance

import (
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type DepositHandler struct {
	depositService *services.DepositService
	logger         *logrus.Logger
}

func NewDepositHandler(depositService *services.DepositService, logger *logrus.Logger) *DepositHandler {
	return &DepositHandler{
		depositService: depositService,
		logger:         logger,
	}
}

func (h *DepositHandler) CreateFiatDeposit(c *gin.Context) {
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

	var request models.CreateDepositRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	deposit, err := h.depositService.CreateFiatDeposit(c.Request.Context(), uid, &request)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create fiat deposit")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create deposit"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": deposit})
}

func (h *DepositHandler) CreateSpotDeposit(c *gin.Context) {
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

	var request models.CreateDepositRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	deposit, err := h.depositService.CreateSpotDeposit(c.Request.Context(), uid, &request)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create spot deposit")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create deposit"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": deposit})
}

func (h *DepositHandler) VerifyStripeDeposit(c *gin.Context) {
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
		PaymentIntentID string `json:"paymentIntentId"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.depositService.VerifyStripeDeposit(c.Request.Context(), uid, request.PaymentIntentID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to verify Stripe deposit")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify deposit"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (h *DepositHandler) VerifyPayPalDeposit(c *gin.Context) {
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
		OrderID string `json:"orderId"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.depositService.VerifyPayPalDeposit(c.Request.Context(), uid, request.OrderID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to verify PayPal deposit")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify deposit"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (h *DepositHandler) GetDepositAddress(c *gin.Context) {
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

	currency := c.Param("currency")
	network := c.Query("network")

	address, err := h.depositService.GetDepositAddress(c.Request.Context(), uid, currency, network)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get deposit address")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get deposit address"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": address})
}
