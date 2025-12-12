package models

import (
	"time"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type IcoProject struct {
	ID          uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	Website     string    `json:"website"`
	Whitepaper  string    `json:"whitepaper"`
	Image       string    `json:"image"`
	Status      string    `json:"status" gorm:"default:'PENDING'"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	
	IcoTokens     []IcoToken     `json:"icoTokens" gorm:"foreignKey:ProjectID"`
	IcoAllocations []IcoAllocation `json:"icoAllocations" gorm:"foreignKey:ProjectID"`
}

type IcoToken struct {
	ID          uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	ProjectID   uuid.UUID `json:"projectId" gorm:"type:char(36);not null"`
	Name        string    `json:"name" gorm:"not null"`
	Currency    string    `json:"currency" gorm:"not null"`
	Chain       string    `json:"chain" gorm:"not null"`
	Contract    string    `json:"contract"`
	Decimals    int       `json:"decimals" gorm:"default:18"`
	TotalSupply decimal.Decimal `json:"totalSupply" gorm:"type:decimal(65,30)"`
	Image       string    `json:"image"`
	Status      string    `json:"status" gorm:"default:'PENDING'"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	
	Project    IcoProject `json:"project" gorm:"foreignKey:ProjectID"`
	IcoPhases  []IcoPhase `json:"icoPhases" gorm:"foreignKey:TokenID"`
	IcoAllocations []IcoAllocation `json:"icoAllocations" gorm:"foreignKey:TokenID"`
}

type IcoPhase struct {
	ID           uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	TokenID      uuid.UUID `json:"tokenId" gorm:"type:char(36);not null"`
	Name         string    `json:"name" gorm:"not null"`
	StartDate    time.Time `json:"startDate"`
	EndDate      time.Time `json:"endDate"`
	Price        decimal.Decimal `json:"price" gorm:"type:decimal(65,30)"`
	MinPurchase  decimal.Decimal `json:"minPurchase" gorm:"type:decimal(65,30)"`
	MaxPurchase  decimal.Decimal `json:"maxPurchase" gorm:"type:decimal(65,30)"`
	Status       string    `json:"status" gorm:"default:'PENDING'"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
	
	Token           IcoToken           `json:"token" gorm:"foreignKey:TokenID"`
	IcoContributions []IcoContribution `json:"icoContributions" gorm:"foreignKey:PhaseID"`
	IcoPhaseAllocations []IcoPhaseAllocation `json:"icoPhaseAllocations" gorm:"foreignKey:PhaseID"`
}

type IcoContribution struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	UserID    uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	PhaseID   uuid.UUID `json:"phaseId" gorm:"type:char(36);not null"`
	Amount    decimal.Decimal `json:"amount" gorm:"type:decimal(65,30)"`
	Status    string    `json:"status" gorm:"default:'PENDING'"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	User  User     `json:"user" gorm:"foreignKey:UserID"`
	Phase IcoPhase `json:"phase" gorm:"foreignKey:PhaseID"`
}

type IcoAllocation struct {
	ID         uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	TokenID    uuid.UUID `json:"tokenId" gorm:"type:char(36);not null"`
	ProjectID  uuid.UUID `json:"projectId" gorm:"type:char(36);not null"`
	Name       string    `json:"name" gorm:"not null"`
	Percentage decimal.Decimal `json:"percentage" gorm:"type:decimal(5,2)"`
	Status     string    `json:"status" gorm:"default:'ACTIVE'"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
	
	Token   IcoToken   `json:"token" gorm:"foreignKey:TokenID"`
	Project IcoProject `json:"project" gorm:"foreignKey:ProjectID"`
	IcoPhaseAllocations []IcoPhaseAllocation `json:"icoPhaseAllocations" gorm:"foreignKey:AllocationID"`
}

type IcoPhaseAllocation struct {
	ID           uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	AllocationID uuid.UUID `json:"allocationId" gorm:"type:char(36);not null"`
	PhaseID      uuid.UUID `json:"phaseId" gorm:"type:char(36);not null"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
	
	Allocation IcoAllocation `json:"allocation" gorm:"foreignKey:AllocationID"`
	Phase      IcoPhase      `json:"phase" gorm:"foreignKey:PhaseID"`
}
