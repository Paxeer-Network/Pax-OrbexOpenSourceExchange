package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type WalletType string

const (
	WalletTypeSpot    WalletType = "SPOT"
	WalletTypeFutures WalletType = "FUTURES"
	WalletTypeFiat    WalletType = "FIAT"
)

type Wallet struct {
	ID        uuid.UUID       `json:"id" db:"id"`
	UserID    uuid.UUID       `json:"userId" db:"userId"`
	Type      WalletType      `json:"type" db:"type"`
	Currency  string          `json:"currency" db:"currency"`
	Balance   decimal.Decimal `json:"balance" db:"balance"`
	CreatedAt time.Time       `json:"createdAt" db:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt" db:"updatedAt"`
}

type WalletResponse struct {
	ID       uuid.UUID       `json:"id"`
	Type     WalletType      `json:"type"`
	Currency string          `json:"currency"`
	Balance  decimal.Decimal `json:"balance"`
}

func (w *Wallet) ToResponse() *WalletResponse {
	return &WalletResponse{
		ID:       w.ID,
		Type:     w.Type,
		Currency: w.Currency,
		Balance:  w.Balance,
	}
}
