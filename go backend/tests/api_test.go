package tests

import (
	"bytes"
	"crypto-exchange-go/internal/config"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/internal/handlers"
	"crypto-exchange-go/internal/middleware"
	"crypto-exchange-go/internal/services"
	"crypto-exchange-go/pkg/logger"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setupTestRouter() (*gin.Engine, error) {
	cfg := &config.Config{
		MySQL: config.MySQL{
			Host:     "localhost",
			Port:     3306,
			Database: "Orbex_test",
			Username: "root",
			Password: "",
		},
		ScyllaDB: config.ScyllaDB{
			Hosts:    []string{"127.0.0.1:9042"},
			Keyspace: "trading_test",
		},
		Redis: config.Redis{
			Host: "localhost",
			Port: 6379,
			DB:   1,
		},
		JWT: config.JWT{
			AccessSecret: "test-secret",
		},
	}

	log := logger.New("debug")

	db, err := database.NewMySQL(cfg.MySQL)
	if err != nil {
		return nil, err
	}

	scyllaDB, err := database.NewScyllaDB(cfg.ScyllaDB)
	if err != nil {
		return nil, err
	}

	redisClient, err := database.NewRedis(cfg.Redis)
	if err != nil {
		return nil, err
	}

	matchingEngine, err := services.NewMatchingEngine(scyllaDB, redisClient, log)
	if err != nil {
		return nil, err
	}

	orderService := services.NewOrderService(db, scyllaDB, redisClient, matchingEngine, log)
	walletService := services.NewWalletService(db, log)
	marketService := services.NewMarketService(db, scyllaDB, redisClient, log)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(middleware.CORS())

	h := handlers.New(orderService, walletService, marketService, matchingEngine, log)

	api := router.Group("/api")
	{
		auth := api.Group("")
		auth.Use(middleware.Auth(cfg.JWT))
		{
			exchange := auth.Group("/exchange")
			{
				exchange.POST("/order", h.CreateOrder)
				exchange.GET("/order", h.GetOrders)
				exchange.GET("/order/:id", h.GetOrder)
				exchange.DELETE("/order/:id", h.CancelOrder)
				exchange.GET("/orderbook/:currency/:pair", h.GetOrderBook)
			}

			finance := auth.Group("/finance")
			{
				finance.GET("/wallet", h.GetWallets)
			}
		}

		public := api.Group("")
		{
			public.GET("/exchange/market", h.GetMarkets)
			public.GET("/exchange/ticker", h.GetTickers)
			public.GET("/exchange/ticker/:symbol", h.GetTicker)
		}
	}

	return router, nil
}

func TestGetMarkets(t *testing.T) {
	router, err := setupTestRouter()
	require.NoError(t, err)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/exchange/market", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.Contains(t, response, "data")
}

func TestGetTickers(t *testing.T) {
	router, err := setupTestRouter()
	require.NoError(t, err)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/exchange/ticker", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.Contains(t, response, "data")
}

func TestCreateOrderUnauthorized(t *testing.T) {
	router, err := setupTestRouter()
	require.NoError(t, err)

	orderData := map[string]interface{}{
		"currency": "BTC",
		"pair":     "USDT",
		"type":     "LIMIT",
		"side":     "BUY",
		"amount":   "0.001",
		"price":    "50000",
	}

	jsonData, _ := json.Marshal(orderData)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/exchange/order", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestGetOrderBookEndpoint(t *testing.T) {
	router, err := setupTestRouter()
	require.NoError(t, err)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/exchange/orderbook/BTC/USDT", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}
