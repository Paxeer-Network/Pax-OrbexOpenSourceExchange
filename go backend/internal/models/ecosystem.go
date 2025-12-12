package models

import (
	"time"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type EcosystemBlockchain struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	ProductID string    `json:"productId" gorm:"uniqueIndex"`
	Chain     string    `json:"chain" gorm:"not null;uniqueIndex"`
	Name      string    `json:"name" gorm:"not null"`
	Network   string    `json:"network" gorm:"not null"`
	Version   string    `json:"version"`
	Status    bool      `json:"status" gorm:"default:true"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	EcosystemTokens        []EcosystemToken        `json:"ecosystemTokens" gorm:"foreignKey:Chain;references:Chain"`
	EcosystemMasterWallets []EcosystemMasterWallet `json:"ecosystemMasterWallets" gorm:"foreignKey:Chain;references:Chain"`
}

type EcosystemToken struct {
	ID           uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Chain        string    `json:"chain" gorm:"not null"`
	Name         string    `json:"name" gorm:"not null"`
	Currency     string    `json:"currency" gorm:"not null"`
	Contract     string    `json:"contract"`
	Network      string    `json:"network" gorm:"not null"`
	Type         string    `json:"type" gorm:"not null"`
	Decimals     int       `json:"decimals" gorm:"default:18"`
	Precision    int       `json:"precision" gorm:"default:8"`
	ContractType string    `json:"contractType"`
	Icon         string    `json:"icon"`
	Limits       string    `json:"limits" gorm:"type:json"`
	Fee          decimal.Decimal `json:"fee" gorm:"type:decimal(65,30);default:0"`
	Status       bool      `json:"status" gorm:"default:true"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
	
	Blockchain      EcosystemBlockchain   `json:"blockchain" gorm:"foreignKey:Chain;references:Chain"`
	EcosystemMarkets []EcosystemMarket    `json:"ecosystemMarkets" gorm:"foreignKey:Currency;references:Currency"`
}

type EcosystemMarket struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Currency  string    `json:"currency" gorm:"not null"`
	Pair      string    `json:"pair" gorm:"not null"`
	Symbol    string    `json:"symbol" gorm:"not null;uniqueIndex"`
	Status    bool      `json:"status" gorm:"default:true"`
	Metadata  string    `json:"metadata" gorm:"type:json"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	Token EcosystemToken `json:"token" gorm:"foreignKey:Currency;references:Currency"`
}

type EcosystemMasterWallet struct {
	ID          uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Chain       string    `json:"chain" gorm:"not null"`
	Currency    string    `json:"currency" gorm:"not null"`
	Address     string    `json:"address" gorm:"not null"`
	PublicKey   string    `json:"publicKey"`
	Mnemonic    string    `json:"mnemonic"`
	Balance     decimal.Decimal `json:"balance" gorm:"type:decimal(65,30);default:0"`
	LastIndex   int       `json:"lastIndex" gorm:"default:0"`
	Status      bool      `json:"status" gorm:"default:true"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	
	Blockchain              EcosystemBlockchain       `json:"blockchain" gorm:"foreignKey:Chain;references:Chain"`
	EcosystemCustodialWallets []EcosystemCustodialWallet `json:"ecosystemCustodialWallets" gorm:"foreignKey:MasterWalletID"`
}

type EcosystemCustodialWallet struct {
	ID             uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	MasterWalletID uuid.UUID `json:"masterWalletId" gorm:"type:char(36);not null"`
	Chain          string    `json:"chain" gorm:"not null"`
	Address        string    `json:"address" gorm:"not null"`
	Network        string    `json:"network" gorm:"not null"`
	PublicKey      string    `json:"publicKey"`
	PrivateKey     string    `json:"privateKey"`
	Status         bool      `json:"status" gorm:"default:true"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
	
	MasterWallet EcosystemMasterWallet `json:"masterWallet" gorm:"foreignKey:MasterWalletID"`
}

type EcosystemPrivateLedger struct {
	ID                 uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	WalletID           int       `json:"walletId" gorm:"not null"`
	Index              int       `json:"index" gorm:"not null"`
	Currency           string    `json:"currency" gorm:"not null"`
	Chain              string    `json:"chain" gorm:"not null"`
	Network            string    `json:"network" gorm:"not null"`
	OffchainDifference decimal.Decimal `json:"offchainDifference" gorm:"type:decimal(65,30);default:0"`
	CreatedAt          time.Time `json:"createdAt"`
	UpdatedAt          time.Time `json:"updatedAt"`
}

type EcosystemUtxo struct {
	ID            uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	WalletID      int       `json:"walletId" gorm:"not null"`
	TransactionID string    `json:"transactionId" gorm:"not null"`
	Index         int       `json:"index" gorm:"not null"`
	Amount        decimal.Decimal `json:"amount" gorm:"type:decimal(65,30)"`
	Script        string    `json:"script"`
	Status        bool      `json:"status" gorm:"default:false"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}
