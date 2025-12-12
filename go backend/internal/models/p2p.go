package models

import (
	"time"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type P2pPaymentMethod struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	Image     string    `json:"image"`
	Currency  string    `json:"currency" gorm:"not null"`
	Status    bool      `json:"status" gorm:"default:true"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	P2pOffers []P2pOffer `json:"p2pOffers" gorm:"foreignKey:PaymentMethodID"`
}

type P2pOffer struct {
	ID              uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	UserID          uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	PaymentMethodID uuid.UUID `json:"paymentMethodId" gorm:"type:char(36);not null"`
	Currency        string    `json:"currency" gorm:"not null"`
	Amount          decimal.Decimal `json:"amount" gorm:"type:decimal(65,30)"`
	Price           decimal.Decimal `json:"price" gorm:"type:decimal(65,30)"`
	MinAmount       decimal.Decimal `json:"minAmount" gorm:"type:decimal(65,30)"`
	MaxAmount       decimal.Decimal `json:"maxAmount" gorm:"type:decimal(65,30)"`
	Status          string    `json:"status" gorm:"default:'ACTIVE'"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
	
	User          User             `json:"user" gorm:"foreignKey:UserID"`
	PaymentMethod P2pPaymentMethod `json:"paymentMethod" gorm:"foreignKey:PaymentMethodID"`
	P2pTrades     []P2pTrade       `json:"p2pTrades" gorm:"foreignKey:OfferID"`
	P2pReviews    []P2pReview      `json:"p2pReviews" gorm:"foreignKey:OfferID"`
}

type P2pTrade struct {
	ID       uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	OfferID  uuid.UUID `json:"offerId" gorm:"type:char(36);not null"`
	UserID   uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	SellerID uuid.UUID `json:"sellerId" gorm:"type:char(36);not null"`
	BuyerID  uuid.UUID `json:"buyerId" gorm:"type:char(36);not null"`
	Amount   decimal.Decimal `json:"amount" gorm:"type:decimal(65,30)"`
	Price    decimal.Decimal `json:"price" gorm:"type:decimal(65,30)"`
	Total    decimal.Decimal `json:"total" gorm:"type:decimal(65,30)"`
	Status   string    `json:"status" gorm:"default:'PENDING'"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	Offer      P2pOffer    `json:"offer" gorm:"foreignKey:OfferID"`
	User       User        `json:"user" gorm:"foreignKey:UserID"`
	Seller     User        `json:"seller" gorm:"foreignKey:SellerID"`
	Buyer      User        `json:"buyer" gorm:"foreignKey:BuyerID"`
	P2pDisputes []P2pDispute `json:"p2pDisputes" gorm:"foreignKey:TradeID"`
	P2pEscrows  []P2pEscrow  `json:"p2pEscrows" gorm:"foreignKey:TradeID"`
	P2pCommissions []P2pCommission `json:"p2pCommissions" gorm:"foreignKey:TradeID"`
}

type P2pDispute struct {
	ID         uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	TradeID    uuid.UUID `json:"tradeId" gorm:"type:char(36);not null"`
	RaiserID   uuid.UUID `json:"raiserId" gorm:"type:char(36);not null"`
	Reason     string    `json:"reason" gorm:"not null"`
	Resolution string    `json:"resolution"`
	Status     string    `json:"status" gorm:"default:'OPEN'"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
	
	Trade  P2pTrade `json:"trade" gorm:"foreignKey:TradeID"`
	Raiser User     `json:"raiser" gorm:"foreignKey:RaiserID"`
}

type P2pEscrow struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	TradeID   uuid.UUID `json:"tradeId" gorm:"type:char(36);not null"`
	Amount    decimal.Decimal `json:"amount" gorm:"type:decimal(65,30)"`
	Status    string    `json:"status" gorm:"default:'HELD'"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	Trade P2pTrade `json:"trade" gorm:"foreignKey:TradeID"`
}

type P2pReview struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	OfferID   uuid.UUID `json:"offerId" gorm:"type:char(36);not null"`
	UserID    uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	Rating    int       `json:"rating" gorm:"not null"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	Offer P2pOffer `json:"offer" gorm:"foreignKey:OfferID"`
	User  User     `json:"user" gorm:"foreignKey:UserID"`
}

type P2pCommission struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	TradeID   uuid.UUID `json:"tradeId" gorm:"type:char(36);not null"`
	Amount    decimal.Decimal `json:"amount" gorm:"type:decimal(65,30)"`
	Status    string    `json:"status" gorm:"default:'PENDING'"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	Trade P2pTrade `json:"trade" gorm:"foreignKey:TradeID"`
}
