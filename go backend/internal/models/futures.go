package models

import (
	"time"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type FuturesMarket struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Currency  string    `json:"currency" gorm:"not null"`
	Pair      string    `json:"pair" gorm:"not null"`
	Symbol    string    `json:"symbol" gorm:"not null;uniqueIndex"`
	Status    bool      `json:"status" gorm:"default:true"`
	Metadata  string    `json:"metadata" gorm:"type:json"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	FuturesOrders    []FuturesOrder    `json:"futuresOrders" gorm:"foreignKey:Symbol;references:Symbol"`
	FuturesPositions []FuturesPosition `json:"futuresPositions" gorm:"foreignKey:Symbol;references:Symbol"`
}

type FuturesOrder struct {
	ID              uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	UserID          uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	Symbol          string    `json:"symbol" gorm:"not null"`
	Type            string    `json:"type" gorm:"not null"`
	Side            string    `json:"side" gorm:"not null"`
	Amount          decimal.Decimal `json:"amount" gorm:"type:decimal(65,30)"`
	Price           decimal.Decimal `json:"price" gorm:"type:decimal(65,30)"`
	Filled          decimal.Decimal `json:"filled" gorm:"type:decimal(65,30);default:0"`
	Remaining       decimal.Decimal `json:"remaining" gorm:"type:decimal(65,30)"`
	Cost            decimal.Decimal `json:"cost" gorm:"type:decimal(65,30);default:0"`
	Fee             decimal.Decimal `json:"fee" gorm:"type:decimal(65,30);default:0"`
	Leverage        decimal.Decimal `json:"leverage" gorm:"type:decimal(10,2);default:1"`
	StopLossPrice   *decimal.Decimal `json:"stopLossPrice" gorm:"type:decimal(65,30)"`
	TakeProfitPrice *decimal.Decimal `json:"takeProfitPrice" gorm:"type:decimal(65,30)"`
	Status          string    `json:"status" gorm:"default:'OPEN'"`
	Trades          string    `json:"trades" gorm:"type:json"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
	
	User   User          `json:"user" gorm:"foreignKey:UserID"`
	Market FuturesMarket `json:"market" gorm:"foreignKey:Symbol;references:Symbol"`
}

type FuturesPosition struct {
	ID              uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	UserID          uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	Symbol          string    `json:"symbol" gorm:"not null"`
	Side            string    `json:"side" gorm:"not null"`
	Amount          decimal.Decimal `json:"amount" gorm:"type:decimal(65,30)"`
	EntryPrice      decimal.Decimal `json:"entryPrice" gorm:"type:decimal(65,30)"`
	MarkPrice       decimal.Decimal `json:"markPrice" gorm:"type:decimal(65,30)"`
	UnrealizedPnl   decimal.Decimal `json:"unrealizedPnl" gorm:"type:decimal(65,30);default:0"`
	RealizedPnl     decimal.Decimal `json:"realizedPnl" gorm:"type:decimal(65,30);default:0"`
	Leverage        decimal.Decimal `json:"leverage" gorm:"type:decimal(10,2);default:1"`
	Margin          decimal.Decimal `json:"margin" gorm:"type:decimal(65,30)"`
	StopLossPrice   *decimal.Decimal `json:"stopLossPrice" gorm:"type:decimal(65,30)"`
	TakeProfitPrice *decimal.Decimal `json:"takeProfitPrice" gorm:"type:decimal(65,30)"`
	Status          string    `json:"status" gorm:"default:'OPEN'"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
	
	User   User          `json:"user" gorm:"foreignKey:UserID"`
	Market FuturesMarket `json:"market" gorm:"foreignKey:Symbol;references:Symbol"`
}
