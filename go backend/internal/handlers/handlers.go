package handlers

import (
	"crypto-exchange-go/internal/middleware"
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type Handlers struct {
	orderService   *services.OrderService
	walletService  *services.WalletService
	marketService  *services.MarketService
	matchingEngine *services.MatchingEngine
	logger         *logrus.Logger
}

func New(orderService *services.OrderService, walletService *services.WalletService, marketService *services.MarketService, matchingEngine *services.MatchingEngine, logger *logrus.Logger) *Handlers {
	return &Handlers{
		orderService:   orderService,
		walletService:  walletService,
		marketService:  marketService,
		matchingEngine: matchingEngine,
		logger:         logger,
	}
}

func (h *Handlers) CreateOrder(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	var req models.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	order, err := h.orderService.CreateOrder(c.Request.Context(), user.ID, &req)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create order")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Order created successfully",
		"data":    order,
	})
}

func (h *Handlers) GetOrders(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	status := c.Query("status")
	limitStr := c.DefaultQuery("limit", "50")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit parameter"})
		return
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid offset parameter"})
		return
	}

	orders, err := h.orderService.GetOrders(c.Request.Context(), user.ID, status, limit, offset)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get orders")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get orders"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orders})
}

func (h *Handlers) GetOrder(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	orderIDStr := c.Param("id")
	orderID, err := uuid.Parse(orderIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	order, err := h.orderService.GetOrder(c.Request.Context(), user.ID, orderID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get order")
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

func (h *Handlers) CancelOrder(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	orderIDStr := c.Param("id")
	orderID, err := uuid.Parse(orderIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	err = h.orderService.CancelOrder(c.Request.Context(), user.ID, orderID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to cancel order")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order canceled successfully"})
}

func (h *Handlers) GetOrderBook(c *gin.Context) {
	currency := c.Param("currency")
	pair := c.Param("pair")

	orderBook, err := h.marketService.GetOrderBook(c.Request.Context(), currency, pair)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get order book")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get order book"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orderBook})
}

func (h *Handlers) GetWallets(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	walletType := models.WalletType(c.Query("type"))

	wallets, err := h.walletService.GetWallets(c.Request.Context(), user.ID, walletType)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get wallets")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get wallets"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": wallets})
}

func (h *Handlers) CreateDeposit(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Deposit functionality not implemented"})
}

func (h *Handlers) CreateWithdrawal(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Withdrawal functionality not implemented"})
}

func (h *Handlers) GetMarkets(c *gin.Context) {
	markets, err := h.marketService.GetMarkets(c.Request.Context())
	if err != nil {
		h.logger.WithError(err).Error("Failed to get markets")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get markets"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": markets})
}

func (h *Handlers) GetTickers(c *gin.Context) {
	tickers := h.matchingEngine.GetTickers()
	c.JSON(http.StatusOK, gin.H{"data": tickers})
}

func (h *Handlers) GetTicker(c *gin.Context) {
	symbol := c.Param("symbol")
	ticker := h.matchingEngine.GetTicker(symbol)
	
	if ticker == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ticker not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ticker})
}
