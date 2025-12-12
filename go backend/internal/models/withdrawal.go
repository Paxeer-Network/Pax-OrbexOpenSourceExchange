package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Withdrawal struct {
	ID          uuid.UUID              `json:"id" db:"id"`
	UserID      uuid.UUID              `json:"userId" db:"userId"`
	Type        string                 `json:"type" db:"type"`
	Currency    string                 `json:"currency" db:"currency"`
	Amount      decimal.Decimal        `json:"amount" db:"amount"`
	Fee         decimal.Decimal        `json:"fee" db:"fee"`
	Status      string                 `json:"status" db:"status"`
	Method      string                 `json:"method" db:"method"`
	Address     *string                `json:"address" db:"address"`
	Network     *string                `json:"network" db:"network"`
	BankDetails map[string]interface{} `json:"bankDetails" db:"bankDetails"`
	CreatedAt   time.Time              `json:"createdAt" db:"createdAt"`
	UpdatedAt   time.Time              `json:"updatedAt" db:"updatedAt"`
}

type CreateWithdrawalRequest struct {
	Currency    string                 `json:"currency"`
	Amount      decimal.Decimal        `json:"amount"`
	Fee         decimal.Decimal        `json:"fee"`
	Method      string                 `json:"method"`
	Address     *string                `json:"address"`
	Network     *string                `json:"network"`
	BankDetails map[string]interface{} `json:"bankDetails"`
}

type WithdrawalResponse struct {
	ID          uuid.UUID              `json:"id"`
	UserID      uuid.UUID              `json:"userId"`
	Type        string                 `json:"type"`
	Currency    string                 `json:"currency"`
	Amount      decimal.Decimal        `json:"amount"`
	Fee         decimal.Decimal        `json:"fee"`
	Status      string                 `json:"status"`
	Method      string                 `json:"method"`
	Address     *string                `json:"address"`
	Network     *string                `json:"network"`
	BankDetails map[string]interface{} `json:"bankDetails"`
	CreatedAt   time.Time              `json:"createdAt"`
	UpdatedAt   time.Time              `json:"updatedAt"`
}

func (w *Withdrawal) ToResponse() *WithdrawalResponse {
	return &WithdrawalResponse{
		ID:          w.ID,
		UserID:      w.UserID,
		Type:        w.Type,
		Currency:    w.Currency,
		Amount:      w.Amount,
		Fee:         w.Fee,
		Status:      w.Status,
		Method:      w.Method,
		Address:     w.Address,
		Network:     w.Network,
		BankDetails: w.BankDetails,
		CreatedAt:   w.CreatedAt,
		UpdatedAt:   w.UpdatedAt,
	}
}
