package models

import (
	"time"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type ForexPlan struct {
	ID          uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	Image       string    `json:"image"`
	MinAmount   decimal.Decimal `json:"minAmount" gorm:"type:decimal(65,30)"`
	MaxAmount   decimal.Decimal `json:"maxAmount" gorm:"type:decimal(65,30)"`
	Invested    decimal.Decimal `json:"invested" gorm:"type:decimal(65,30);default:0"`
	ProfitPercentage decimal.Decimal `json:"profitPercentage" gorm:"type:decimal(5,2)"`
	Status      bool      `json:"status" gorm:"default:true"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	
	Investments []ForexInvestment `json:"investments" gorm:"foreignKey:PlanID"`
	Durations   []ForexDuration   `json:"durations" gorm:"many2many:forex_plan_durations;"`
}

type ForexDuration struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Duration  int       `json:"duration" gorm:"not null"`
	Timeframe string    `json:"timeframe" gorm:"not null"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	Plans       []ForexPlan       `json:"plans" gorm:"many2many:forex_plan_durations;"`
	Investments []ForexInvestment `json:"investments" gorm:"foreignKey:DurationID"`
}

type ForexAccount struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	UserID    uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	Type      string    `json:"type" gorm:"not null"`
	Balance   decimal.Decimal `json:"balance" gorm:"type:decimal(65,30);default:0"`
	Status    bool      `json:"status" gorm:"default:true"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	User        User              `json:"user" gorm:"foreignKey:UserID"`
	Investments []ForexInvestment `json:"investments" gorm:"foreignKey:AccountID"`
}

type ForexInvestment struct {
	ID         uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	UserID     uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	PlanID     uuid.UUID `json:"planId" gorm:"type:char(36);not null"`
	DurationID uuid.UUID `json:"durationId" gorm:"type:char(36);not null"`
	AccountID  uuid.UUID `json:"accountId" gorm:"type:char(36);not null"`
	Amount     decimal.Decimal `json:"amount" gorm:"type:decimal(65,30)"`
	Profit     decimal.Decimal `json:"profit" gorm:"type:decimal(65,30);default:0"`
	Result     string    `json:"result" gorm:"default:'PENDING'"`
	Status     string    `json:"status" gorm:"default:'ACTIVE'"`
	EndDate    time.Time `json:"endDate"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
	
	User     User          `json:"user" gorm:"foreignKey:UserID"`
	Plan     ForexPlan     `json:"plan" gorm:"foreignKey:PlanID"`
	Duration ForexDuration `json:"duration" gorm:"foreignKey:DurationID"`
	Account  ForexAccount  `json:"account" gorm:"foreignKey:AccountID"`
}

type ForexSignal struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Title     string    `json:"title" gorm:"not null"`
	Image     string    `json:"image"`
	Status    string    `json:"status" gorm:"default:'ACTIVE'"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
