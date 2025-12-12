package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type OrderStatus string

const (
	OrderStatusOpen     OrderStatus = "OPEN"
	OrderStatusClosed   OrderStatus = "CLOSED"
	OrderStatusCanceled OrderStatus = "CANCELED"
	OrderStatusExpired  OrderStatus = "EXPIRED"
	OrderStatusRejected OrderStatus = "REJECTED"
)

type OrderType string

const (
	OrderTypeMarket OrderType = "MARKET"
	OrderTypeLimit  OrderType = "LIMIT"
)

type OrderSide string

const (
	OrderSideBuy  OrderSide = "BUY"
	OrderSideSell OrderSide = "SELL"
)

type TimeInForce string

const (
	TimeInForceGTC TimeInForce = "GTC"
	TimeInForceIOC TimeInForce = "IOC"
	TimeInForceFOK TimeInForce = "FOK"
	TimeInForcePO  TimeInForce = "PO"
)

type Trade struct {
	ID       string          `json:"id"`
	Price    decimal.Decimal `json:"price"`
	Amount   decimal.Decimal `json:"amount"`
	Cost     decimal.Decimal `json:"cost"`
	Fee      decimal.Decimal `json:"fee"`
	DateTime time.Time       `json:"datetime"`
}

type Trades []Trade

func (t Trades) Value() (driver.Value, error) {
	return json.Marshal(t)
}

func (t *Trades) Scan(value interface{}) error {
	if value == nil {
		*t = nil
		return nil
	}

	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, t)
	case string:
		return json.Unmarshal([]byte(v), t)
	}

	return nil
}

type ExchangeOrder struct {
	ID           uuid.UUID       `json:"id" db:"id"`
	ReferenceID  *string         `json:"referenceId" db:"referenceId"`
	UserID       uuid.UUID       `json:"userId" db:"userId"`
	Status       OrderStatus     `json:"status" db:"status"`
	Symbol       string          `json:"symbol" db:"symbol"`
	Type         OrderType       `json:"type" db:"type"`
	TimeInForce  TimeInForce     `json:"timeInForce" db:"timeInForce"`
	Side         OrderSide       `json:"side" db:"side"`
	Price        decimal.Decimal `json:"price" db:"price"`
	Average      *decimal.Decimal `json:"average" db:"average"`
	Amount       decimal.Decimal `json:"amount" db:"amount"`
	Filled       decimal.Decimal `json:"filled" db:"filled"`
	Remaining    decimal.Decimal `json:"remaining" db:"remaining"`
	Cost         decimal.Decimal `json:"cost" db:"cost"`
	Trades       Trades          `json:"trades" db:"trades"`
	Fee          decimal.Decimal `json:"fee" db:"fee"`
	FeeCurrency  string          `json:"feeCurrency" db:"feeCurrency"`
	CreatedAt    time.Time       `json:"createdAt" db:"createdAt"`
	UpdatedAt    time.Time       `json:"updatedAt" db:"updatedAt"`
	DeletedAt    *time.Time      `json:"deletedAt" db:"deletedAt"`
}

type CreateOrderRequest struct {
	Currency string          `json:"currency" binding:"required"`
	Pair     string          `json:"pair" binding:"required"`
	Type     OrderType       `json:"type" binding:"required"`
	Side     OrderSide       `json:"side" binding:"required"`
	Amount   decimal.Decimal `json:"amount" binding:"required"`
	Price    *decimal.Decimal `json:"price"`
}

type OrderResponse struct {
	ID          uuid.UUID        `json:"id"`
	Status      OrderStatus      `json:"status"`
	Symbol      string           `json:"symbol"`
	Type        OrderType        `json:"type"`
	TimeInForce TimeInForce      `json:"timeInForce"`
	Side        OrderSide        `json:"side"`
	Price       decimal.Decimal  `json:"price"`
	Average     *decimal.Decimal `json:"average"`
	Amount      decimal.Decimal  `json:"amount"`
	Filled      decimal.Decimal  `json:"filled"`
	Remaining   decimal.Decimal  `json:"remaining"`
	Cost        decimal.Decimal  `json:"cost"`
	Fee         decimal.Decimal  `json:"fee"`
	FeeCurrency string           `json:"feeCurrency"`
	CreatedAt   time.Time        `json:"createdAt"`
	UpdatedAt   time.Time        `json:"updatedAt"`
}

func (o *ExchangeOrder) ToResponse() *OrderResponse {
	return &OrderResponse{
		ID:          o.ID,
		Status:      o.Status,
		Symbol:      o.Symbol,
		Type:        o.Type,
		TimeInForce: o.TimeInForce,
		Side:        o.Side,
		Price:       o.Price,
		Average:     o.Average,
		Amount:      o.Amount,
		Filled:      o.Filled,
		Remaining:   o.Remaining,
		Cost:        o.Cost,
		Fee:         o.Fee,
		FeeCurrency: o.FeeCurrency,
		CreatedAt:   o.CreatedAt,
		UpdatedAt:   o.UpdatedAt,
	}
}
