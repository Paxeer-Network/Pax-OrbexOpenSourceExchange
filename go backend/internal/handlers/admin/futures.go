package admin

import (
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type FuturesHandler struct {
	futuresService *services.FuturesService
	logger         *logrus.Logger
}

func NewFuturesHandler(futuresService *services.FuturesService, logger *logrus.Logger) *FuturesHandler {
	return &FuturesHandler{
		futuresService: futuresService,
		logger:         logger,
	}
}

func (h *FuturesHandler) GetMarkets(c *gin.Context) {
	markets, err := h.futuresService.GetMarkets(c.Request.Context())
	if err != nil {
		h.logger.WithError(err).Error("Failed to get futures markets")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get markets"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": markets})
}

func (h *FuturesHandler) GetMarket(c *gin.Context) {
	symbol := c.Param("symbol")
	
	market, err := h.futuresService.GetMarket(c.Request.Context(), symbol)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get futures market")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get market"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": market})
}

func (h *FuturesHandler) CreateMarket(c *gin.Context) {
	var market models.FuturesMarket
	if err := c.ShouldBindJSON(&market); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.futuresService.CreateMarket(c.Request.Context(), &market)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create futures market")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create market"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": market})
}

func (h *FuturesHandler) GetOrders(c *gin.Context) {
	var userID uuid.UUID
	if userIDStr := c.Query("userId"); userIDStr != "" {
		id, err := uuid.Parse(userIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}
		userID = id
	}
	
	symbol := c.Query("symbol")
	status := c.Query("status")
	
	orders, err := h.futuresService.GetOrders(c.Request.Context(), userID, symbol, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get futures orders")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get orders"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": orders})
}

func (h *FuturesHandler) GetPositions(c *gin.Context) {
	var userID uuid.UUID
	if userIDStr := c.Query("userId"); userIDStr != "" {
		id, err := uuid.Parse(userIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}
		userID = id
	}
	
	symbol := c.Query("symbol")
	
	positions, err := h.futuresService.GetPositions(c.Request.Context(), userID, symbol)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get futures positions")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get positions"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": positions})
}
