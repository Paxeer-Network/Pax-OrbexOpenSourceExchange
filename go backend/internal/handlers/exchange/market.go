package exchange

import (
	"crypto-exchange-go/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type MarketHandler struct {
	marketService *services.MarketService
	logger        *logrus.Logger
}

func NewMarketHandler(marketService *services.MarketService, logger *logrus.Logger) *MarketHandler {
	return &MarketHandler{
		marketService: marketService,
		logger:        logger,
	}
}

func (h *MarketHandler) GetMarkets(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "100")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 100
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}

	trending := c.Query("trending") == "true"
	hot := c.Query("hot") == "true"

	markets, err := h.marketService.GetMarkets(c.Request.Context(), trending, hot, limit, offset)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get markets")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get markets"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": markets})
}

func (h *MarketHandler) GetMarket(c *gin.Context) {
	currency := c.Param("currency")
	pair := c.Param("pair")

	market, err := h.marketService.GetMarket(c.Request.Context(), currency, pair)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get market")
		c.JSON(http.StatusNotFound, gin.H{"error": "Market not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": market})
}

func (h *MarketHandler) GetTickers(c *gin.Context) {
	symbols := c.QueryArray("symbols")

	tickers, err := h.marketService.GetTickers(c.Request.Context(), symbols)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get tickers")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get tickers"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tickers})
}

func (h *MarketHandler) GetTicker(c *gin.Context) {
	symbol := c.Param("symbol")

	ticker, err := h.marketService.GetTicker(c.Request.Context(), symbol)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ticker")
		c.JSON(http.StatusNotFound, gin.H{"error": "Ticker not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ticker})
}

func (h *MarketHandler) GetOrderBook(c *gin.Context) {
	symbol := c.Param("symbol")
	limitStr := c.DefaultQuery("limit", "100")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 100
	}

	orderBook, err := h.marketService.GetOrderBook(c.Request.Context(), symbol, limit)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get order book")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get order book"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orderBook})
}

func (h *MarketHandler) GetTrades(c *gin.Context) {
	symbol := c.Param("symbol")
	limitStr := c.DefaultQuery("limit", "100")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 100
	}

	trades, err := h.marketService.GetRecentTrades(c.Request.Context(), symbol, limit)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get trades")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get trades"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": trades})
}

func (h *MarketHandler) GetChartData(c *gin.Context) {
	symbol := c.Param("symbol")
	interval := c.DefaultQuery("interval", "1h")
	limitStr := c.DefaultQuery("limit", "100")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 100
	}

	chartData, err := h.marketService.GetChartData(c.Request.Context(), symbol, interval, limit)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get chart data")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get chart data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": chartData})
}
