package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Deposit struct {
	ID            uuid.UUID              `json:"id" db:"id"`
	UserID        uuid.UUID              `json:"userId" db:"userId"`
	Type          string                 `json:"type" db:"type"`
	Currency      string                 `json:"currency" db:"currency"`
	Amount        decimal.Decimal        `json:"amount" db:"amount"`
	Fee           decimal.Decimal        `json:"fee" db:"fee"`
	Status        string                 `json:"status" db:"status"`
	Method        string                 `json:"method" db:"method"`
	Address       *string                `json:"address" db:"address"`
	Network       *string                `json:"network" db:"network"`
	PaymentData   map[string]interface{} `json:"paymentData" db:"paymentData"`
	TransactionID *string                `json:"transactionId" db:"transactionId"`
	CreatedAt     time.Time              `json:"createdAt" db:"createdAt"`
	UpdatedAt     time.Time              `json:"updatedAt" db:"updatedAt"`
}

type CreateDepositRequest struct {
	Currency      string                 `json:"currency"`
	Amount        decimal.Decimal        `json:"amount"`
	Method        string                 `json:"method"`
	Address       *string                `json:"address"`
	Network       *string                `json:"network"`
	PaymentData   map[string]interface{} `json:"paymentData"`
	TransactionID *string                `json:"transactionId"`
}

type DepositResponse struct {
	ID            uuid.UUID              `json:"id"`
	UserID        uuid.UUID              `json:"userId"`
	Type          string                 `json:"type"`
	Currency      string                 `json:"currency"`
	Amount        decimal.Decimal        `json:"amount"`
	Fee           decimal.Decimal        `json:"fee"`
	Status        string                 `json:"status"`
	Method        string                 `json:"method"`
	Address       *string                `json:"address"`
	Network       *string                `json:"network"`
	PaymentData   map[string]interface{} `json:"paymentData"`
	TransactionID *string                `json:"transactionId"`
	CreatedAt     time.Time              `json:"createdAt"`
	UpdatedAt     time.Time              `json:"updatedAt"`
}

type DepositVerificationResult struct {
	Success   bool            `json:"success"`
	DepositID uuid.UUID       `json:"depositId"`
	Amount    decimal.Decimal `json:"amount"`
	Currency  string          `json:"currency"`
}

type DepositAddress struct {
	Currency string `json:"currency"`
	Network  string `json:"network"`
	Address  string `json:"address"`
}

func (d *Deposit) ToResponse() *DepositResponse {
	return &DepositResponse{
		ID:            d.ID,
		UserID:        d.UserID,
		Type:          d.Type,
		Currency:      d.Currency,
		Amount:        d.Amount,
		Fee:           d.Fee,
		Status:        d.Status,
		Method:        d.Method,
		Address:       d.Address,
		Network:       d.Network,
		PaymentData:   d.PaymentData,
		TransactionID: d.TransactionID,
		CreatedAt:     d.CreatedAt,
		UpdatedAt:     d.UpdatedAt,
	}
}
