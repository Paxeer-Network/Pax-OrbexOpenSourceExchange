package finance

import (
	"context"
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/sirupsen/logrus"
)

type WalletHandler struct {
	walletService *services.WalletService
	logger        *logrus.Logger
}

func NewWalletHandler(walletService *services.WalletService, logger *logrus.Logger) *WalletHandler {
	return &WalletHandler{
		walletService: walletService,
		logger:        logger,
	}
}

func (h *WalletHandler) GetWallets(c *gin.Context) {
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

	walletType := models.WalletType(c.Query("walletType"))
	pnl := c.Query("pnl") == "true"

	if pnl {
		h.handlePnL(c, uid)
		return
	}

	wallets, err := h.walletService.GetWallets(c.Request.Context(), uid, walletType)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get wallets")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get wallets"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": wallets})
}

func (h *WalletHandler) GetWallet(c *gin.Context) {
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

	walletType := models.WalletType(c.Param("type"))
	currency := c.Param("currency")

	wallet, err := h.walletService.GetWallet(c.Request.Context(), uid, currency, walletType)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get wallet")
		c.JSON(http.StatusNotFound, gin.H{"error": "Wallet not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": wallet})
}

func (h *WalletHandler) handlePnL(c *gin.Context, userID uuid.UUID) {
	ctx := c.Request.Context()

	wallets, err := h.walletService.GetWallets(ctx, userID, "")
	if err != nil {
		h.logger.WithError(err).Error("Failed to get wallets for PnL")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get wallets"})
		return
	}

	today := time.Now().Truncate(24 * time.Hour)
	balances := map[string]decimal.Decimal{
		"FIAT": decimal.Zero,
		"SPOT": decimal.Zero,
		"ECO":  decimal.Zero,
	}

	for _, wallet := range wallets {
		price := decimal.NewFromFloat(1.0)
		if wallet.Type == "FIAT" {
			price = decimal.NewFromFloat(1.0)
		} else {
			price = decimal.NewFromFloat(1.0)
		}

		balances[string(wallet.Type)] = balances[string(wallet.Type)].Add(wallet.Balance.Mul(price))
	}

	pnlData := h.calculatePnLData(ctx, userID, balances, today)

	c.JSON(http.StatusOK, pnlData)
}

func (h *WalletHandler) calculatePnLData(ctx context.Context, userID uuid.UUID, balances map[string]decimal.Decimal, today time.Time) map[string]interface{} {
	todayTotal := decimal.Zero
	for _, balance := range balances {
		todayTotal = todayTotal.Add(balance)
	}

	yesterday := today.AddDate(0, 0, -1)
	yesterdayTotal := decimal.Zero

	pnl := todayTotal.Sub(yesterdayTotal)

	chart := h.generatePnLChart(ctx, userID, today)

	return map[string]interface{}{
		"today":     todayTotal,
		"yesterday": yesterdayTotal,
		"pnl":       pnl,
		"chart":     chart,
	}
}

func (h *WalletHandler) generatePnLChart(ctx context.Context, userID uuid.UUID, today time.Time) []map[string]interface{} {
	chart := make([]map[string]interface{}, 0)

	oneMonthAgo := today.AddDate(0, 0, -28)
	startOfWeek := oneMonthAgo.AddDate(0, 0, -int(oneMonthAgo.Weekday()))

	for weekStart := startOfWeek; weekStart.Before(today); weekStart = weekStart.AddDate(0, 0, 7) {
		weekEnd := weekStart.AddDate(0, 0, 6)

		weeklyData := map[string]interface{}{
			"date":    weekStart.Format("2006-01-02"),
			"FIAT":    decimal.Zero,
			"SPOT":    decimal.Zero,
			"FUNDING": decimal.Zero,
		}

		chart = append(chart, weeklyData)
	}

	return chart
}
