package models

import (
	"time"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type AffiliateCondition struct {
	ID          uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	Type        string    `json:"type" gorm:"not null"`
	Value       decimal.Decimal `json:"value" gorm:"type:decimal(65,30)"`
	Reward      decimal.Decimal `json:"reward" gorm:"type:decimal(65,30)"`
	Status      bool      `json:"status" gorm:"default:true"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	
	AffiliateRewards []AffiliateReward `json:"affiliateRewards" gorm:"foreignKey:ConditionID"`
}

type AffiliateReferral struct {
	ID         uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	ReferrerID uuid.UUID `json:"referrerId" gorm:"type:char(36);not null"`
	ReferredID uuid.UUID `json:"referredId" gorm:"type:char(36);not null"`
	Status     string    `json:"status" gorm:"default:'PENDING'"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
	
	Referrer User `json:"referrer" gorm:"foreignKey:ReferrerID"`
	Referred User `json:"referred" gorm:"foreignKey:ReferredID"`
}

type AffiliateReward struct {
	ID          uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	UserID      uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	ConditionID uuid.UUID `json:"conditionId" gorm:"type:char(36);not null"`
	Amount      decimal.Decimal `json:"amount" gorm:"type:decimal(65,30)"`
	Status      string    `json:"status" gorm:"default:'PENDING'"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	
	User      User               `json:"user" gorm:"foreignKey:UserID"`
	Condition AffiliateCondition `json:"condition" gorm:"foreignKey:ConditionID"`
}
