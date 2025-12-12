package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Transaction struct {
	ID          uuid.UUID              `json:"id" db:"id"`
	UserID      uuid.UUID              `json:"userId" db:"userId"`
	Type        string                 `json:"type" db:"type"`
	Status      string                 `json:"status" db:"status"`
	Currency    string                 `json:"currency" db:"currency"`
	Amount      decimal.Decimal        `json:"amount" db:"amount"`
	Fee         decimal.Decimal        `json:"fee" db:"fee"`
	Description string                 `json:"description" db:"description"`
	ReferenceID *string                `json:"referenceId" db:"referenceId"`
	Metadata    map[string]interface{} `json:"metadata" db:"metadata"`
	CreatedAt   time.Time              `json:"createdAt" db:"createdAt"`
	UpdatedAt   time.Time              `json:"updatedAt" db:"updatedAt"`
}

type TransactionResponse struct {
	ID          uuid.UUID              `json:"id"`
	UserID      uuid.UUID              `json:"userId"`
	Type        string                 `json:"type"`
	Status      string                 `json:"status"`
	Currency    string                 `json:"currency"`
	Amount      decimal.Decimal        `json:"amount"`
	Fee         decimal.Decimal        `json:"fee"`
	Description string                 `json:"description"`
	ReferenceID *string                `json:"referenceId"`
	Metadata    map[string]interface{} `json:"metadata"`
	CreatedAt   time.Time              `json:"createdAt"`
	UpdatedAt   time.Time              `json:"updatedAt"`
}

type TransactionAnalysis struct {
	StartDate time.Time                           `json:"startDate"`
	EndDate   time.Time                           `json:"endDate"`
	Summary   map[string]*TransactionSummary      `json:"summary"`
}

type TransactionSummary struct {
	Type        string  `json:"type"`
	Currency    string  `json:"currency"`
	TotalAmount float64 `json:"totalAmount"`
	Count       int     `json:"count"`
}

func (t *Transaction) ToResponse() *TransactionResponse {
	return &TransactionResponse{
		ID:          t.ID,
		UserID:      t.UserID,
		Type:        t.Type,
		Status:      t.Status,
		Currency:    t.Currency,
		Amount:      t.Amount,
		Fee:         t.Fee,
		Description: t.Description,
		ReferenceID: t.ReferenceID,
		Metadata:    t.Metadata,
		CreatedAt:   t.CreatedAt,
		UpdatedAt:   t.UpdatedAt,
	}
}
