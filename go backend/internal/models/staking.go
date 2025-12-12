package models

import (
	"time"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type StakingPool struct {
	ID          uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	Currency    string    `json:"currency" gorm:"not null"`
	Chain       string    `json:"chain" gorm:"not null"`
	Type        string    `json:"type" gorm:"not null"`
	Icon        string    `json:"icon"`
	Status      bool      `json:"status" gorm:"default:true"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	
	StakingDurations []StakingDuration `json:"stakingDurations" gorm:"foreignKey:PoolID"`
	StakingLogs      []StakingLog      `json:"stakingLogs" gorm:"foreignKey:PoolID"`
}

type StakingDuration struct {
	ID           uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	PoolID       uuid.UUID `json:"poolId" gorm:"type:char(36);not null"`
	Duration     int       `json:"duration" gorm:"not null"`
	InterestRate decimal.Decimal `json:"interestRate" gorm:"type:decimal(5,2)"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
	
	Pool        StakingPool `json:"pool" gorm:"foreignKey:PoolID"`
	StakingLogs []StakingLog `json:"stakingLogs" gorm:"foreignKey:DurationID"`
}

type StakingLog struct {
	ID         uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	UserID     uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	PoolID     uuid.UUID `json:"poolId" gorm:"type:char(36);not null"`
	DurationID uuid.UUID `json:"durationId" gorm:"type:char(36);not null"`
	Amount     decimal.Decimal `json:"amount" gorm:"type:decimal(65,30)"`
	Reward     decimal.Decimal `json:"reward" gorm:"type:decimal(65,30);default:0"`
	Status     string    `json:"status" gorm:"default:'ACTIVE'"`
	ReleaseDate time.Time `json:"releaseDate"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
	
	User     User            `json:"user" gorm:"foreignKey:UserID"`
	Pool     StakingPool     `json:"pool" gorm:"foreignKey:PoolID"`
	Duration StakingDuration `json:"duration" gorm:"foreignKey:DurationID"`
}
