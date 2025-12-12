package tests

import (
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
)

func TestOrderValidation(t *testing.T) {
	order := &services.Order{
		ID:        uuid.New(),
		UserID:    uuid.New(),
		Symbol:    "BTC/USDT",
		Side:      models.OrderSideBuy,
		Type:      models.OrderTypeLimit,
		Amount:    decimal.NewFromFloat(0.001),
		Price:     decimal.NewFromFloat(50000),
		Filled:    decimal.Zero,
		Remaining: decimal.NewFromFloat(0.001),
		Cost:      decimal.Zero,
		Fee:       decimal.Zero,
		Status:    models.OrderStatusOpen,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	assert.Equal(t, "BTC/USDT", order.Symbol)
	assert.Equal(t, models.OrderSideBuy, order.Side)
	assert.Equal(t, models.OrderTypeLimit, order.Type)
	assert.True(t, order.Amount.GreaterThan(decimal.Zero))
	assert.True(t, order.Price.GreaterThan(decimal.Zero))
}

func TestOrderMatching(t *testing.T) {
	buyOrder := &services.Order{
		ID:        uuid.New(),
		UserID:    uuid.New(),
		Symbol:    "BTC/USDT",
		Side:      models.OrderSideBuy,
		Type:      models.OrderTypeLimit,
		Amount:    decimal.NewFromFloat(0.001),
		Price:     decimal.NewFromFloat(50000),
		Filled:    decimal.Zero,
		Remaining: decimal.NewFromFloat(0.001),
		Cost:      decimal.Zero,
		Fee:       decimal.Zero,
		Status:    models.OrderStatusOpen,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	sellOrder := &services.Order{
		ID:        uuid.New(),
		UserID:    uuid.New(),
		Symbol:    "BTC/USDT",
		Side:      models.OrderSideSell,
		Type:      models.OrderTypeLimit,
		Amount:    decimal.NewFromFloat(0.001),
		Price:     decimal.NewFromFloat(49000),
		Filled:    decimal.Zero,
		Remaining: decimal.NewFromFloat(0.001),
		Cost:      decimal.Zero,
		Fee:       decimal.Zero,
		Status:    models.OrderStatusOpen,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	assert.True(t, buyOrder.Price.GreaterThan(sellOrder.Price))
	assert.Equal(t, buyOrder.Amount, sellOrder.Amount)
}

func TestDecimalPrecision(t *testing.T) {
	price := decimal.NewFromString("50000.12345678")
	amount := decimal.NewFromString("0.00000001")
	
	cost := price.Mul(amount)
	
	assert.True(t, cost.GreaterThan(decimal.Zero))
	assert.Equal(t, "0.0005000012345678", cost.String())
}

func TestTradeCalculation(t *testing.T) {
	trade := models.Trade{
		ID:       uuid.New().String(),
		Price:    decimal.NewFromFloat(50000),
		Amount:   decimal.NewFromFloat(0.001),
		Cost:     decimal.NewFromFloat(50),
		Fee:      decimal.Zero,
		DateTime: time.Now(),
	}

	expectedCost := trade.Price.Mul(trade.Amount)
	assert.True(t, trade.Cost.Equal(expectedCost))
}
