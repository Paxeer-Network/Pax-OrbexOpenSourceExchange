package services

import (
	"context"
	"crypto-exchange-go/internal/models"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type EcosystemService struct {
	db     *gorm.DB
	logger *logrus.Logger
}

func NewEcosystemService(db *gorm.DB, logger *logrus.Logger) *EcosystemService {
	return &EcosystemService{
		db:     db,
		logger: logger,
	}
}

func (s *EcosystemService) GetBlockchains(ctx context.Context) ([]models.EcosystemBlockchain, error) {
	var blockchains []models.EcosystemBlockchain
	err := s.db.WithContext(ctx).Find(&blockchains).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ecosystem blockchains")
		return nil, err
	}
	
	return blockchains, nil
}

func (s *EcosystemService) GetBlockchain(ctx context.Context, chain string) (*models.EcosystemBlockchain, error) {
	var blockchain models.EcosystemBlockchain
	err := s.db.WithContext(ctx).First(&blockchain, "chain = ?", chain).Error
	if err != nil {
		s.logger.WithError(err).WithField("chain", chain).Error("Failed to get ecosystem blockchain")
		return nil, err
	}
	
	return &blockchain, nil
}

func (s *EcosystemService) UpdateBlockchainStatus(ctx context.Context, productID string, status bool) error {
	err := s.db.WithContext(ctx).Model(&models.EcosystemBlockchain{}).
		Where("product_id = ?", productID).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_at": time.Now(),
		}).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("productId", productID).Error("Failed to update blockchain status")
		return err
	}
	
	return nil
}

func (s *EcosystemService) GetTokens(ctx context.Context, chain string, status *bool) ([]models.EcosystemToken, error) {
	var tokens []models.EcosystemToken
	query := s.db.WithContext(ctx)
	
	if chain != "" {
		query = query.Where("chain = ?", chain)
	}
	
	if status != nil {
		query = query.Where("status = ?", *status)
	}
	
	err := query.Find(&tokens).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ecosystem tokens")
		return nil, err
	}
	
	return tokens, nil
}

func (s *EcosystemService) GetToken(ctx context.Context, id uuid.UUID) (*models.EcosystemToken, error) {
	var token models.EcosystemToken
	err := s.db.WithContext(ctx).Preload("Blockchain").First(&token, "id = ?", id).Error
	if err != nil {
		s.logger.WithError(err).WithField("tokenId", id).Error("Failed to get ecosystem token")
		return nil, err
	}
	
	return &token, nil
}

func (s *EcosystemService) CreateToken(ctx context.Context, token *models.EcosystemToken) error {
	token.ID = uuid.New()
	token.CreatedAt = time.Now()
	token.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(token).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create ecosystem token")
		return err
	}
	
	return nil
}

func (s *EcosystemService) UpdateToken(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	updates["updated_at"] = time.Now()
	
	err := s.db.WithContext(ctx).Model(&models.EcosystemToken{}).
		Where("id = ?", id).Updates(updates).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("tokenId", id).Error("Failed to update ecosystem token")
		return err
	}
	
	return nil
}

func (s *EcosystemService) GetMarkets(ctx context.Context) ([]models.EcosystemMarket, error) {
	var markets []models.EcosystemMarket
	err := s.db.WithContext(ctx).Where("status = ?", true).
		Preload("Token").Find(&markets).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ecosystem markets")
		return nil, err
	}
	
	return markets, nil
}

func (s *EcosystemService) CreateMarket(ctx context.Context, market *models.EcosystemMarket) error {
	market.ID = uuid.New()
	market.CreatedAt = time.Now()
	market.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(market).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create ecosystem market")
		return err
	}
	
	return nil
}

func (s *EcosystemService) GetMasterWallets(ctx context.Context, chain string) ([]models.EcosystemMasterWallet, error) {
	var wallets []models.EcosystemMasterWallet
	query := s.db.WithContext(ctx).Preload("EcosystemCustodialWallets")
	
	if chain != "" {
		query = query.Where("chain = ?", chain)
	}
	
	err := query.Find(&wallets).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ecosystem master wallets")
		return nil, err
	}
	
	return wallets, nil
}

func (s *EcosystemService) GetMasterWallet(ctx context.Context, id uuid.UUID) (*models.EcosystemMasterWallet, error) {
	var wallet models.EcosystemMasterWallet
	err := s.db.WithContext(ctx).
		Preload("EcosystemCustodialWallets").
		First(&wallet, "id = ?", id).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("walletId", id).Error("Failed to get ecosystem master wallet")
		return nil, err
	}
	
	return &wallet, nil
}

func (s *EcosystemService) CreateMasterWallet(ctx context.Context, wallet *models.EcosystemMasterWallet) error {
	wallet.ID = uuid.New()
	wallet.CreatedAt = time.Now()
	wallet.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(wallet).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create ecosystem master wallet")
		return err
	}
	
	return nil
}

func (s *EcosystemService) UpdateMasterWalletBalance(ctx context.Context, id uuid.UUID, balance decimal.Decimal) error {
	err := s.db.WithContext(ctx).Model(&models.EcosystemMasterWallet{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"balance":    balance,
			"updated_at": time.Now(),
		}).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("walletId", id).Error("Failed to update master wallet balance")
		return err
	}
	
	return nil
}

func (s *EcosystemService) GetCustodialWallets(ctx context.Context, masterWalletID *uuid.UUID, chain string) ([]models.EcosystemCustodialWallet, error) {
	var wallets []models.EcosystemCustodialWallet
	query := s.db.WithContext(ctx).Preload("MasterWallet")
	
	if masterWalletID != nil {
		query = query.Where("master_wallet_id = ?", *masterWalletID)
	}
	
	if chain != "" {
		query = query.Where("chain = ?", chain)
	}
	
	err := query.Find(&wallets).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ecosystem custodial wallets")
		return nil, err
	}
	
	return wallets, nil
}

func (s *EcosystemService) CreateCustodialWallet(ctx context.Context, wallet *models.EcosystemCustodialWallet) error {
	wallet.ID = uuid.New()
	wallet.CreatedAt = time.Now()
	wallet.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(wallet).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create ecosystem custodial wallet")
		return err
	}
	
	return nil
}

func (s *EcosystemService) GetPrivateLedgers(ctx context.Context, walletID int, currency string) ([]models.EcosystemPrivateLedger, error) {
	var ledgers []models.EcosystemPrivateLedger
	query := s.db.WithContext(ctx)
	
	if walletID > 0 {
		query = query.Where("wallet_id = ?", walletID)
	}
	
	if currency != "" {
		query = query.Where("currency = ?", currency)
	}
	
	err := query.Find(&ledgers).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ecosystem private ledgers")
		return nil, err
	}
	
	return ledgers, nil
}

func (s *EcosystemService) UpdatePrivateLedger(ctx context.Context, walletID int, index int, currency string, difference decimal.Decimal) error {
	var ledger models.EcosystemPrivateLedger
	err := s.db.WithContext(ctx).Where("wallet_id = ? AND index = ? AND currency = ?", 
		walletID, index, currency).First(&ledger).Error
	
	if err == gorm.ErrRecordNotFound {
		ledger = models.EcosystemPrivateLedger{
			ID:                 uuid.New(),
			WalletID:           walletID,
			Index:              index,
			Currency:           currency,
			OffchainDifference: difference,
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		}
		
		return s.db.WithContext(ctx).Create(&ledger).Error
	} else if err != nil {
		return err
	}
	
	ledger.OffchainDifference = ledger.OffchainDifference.Add(difference)
	ledger.UpdatedAt = time.Now()
	
	return s.db.WithContext(ctx).Save(&ledger).Error
}

func (s *EcosystemService) GetUtxos(ctx context.Context, walletID int, status *bool) ([]models.EcosystemUtxo, error) {
	var utxos []models.EcosystemUtxo
	query := s.db.WithContext(ctx)
	
	if walletID > 0 {
		query = query.Where("wallet_id = ?", walletID)
	}
	
	if status != nil {
		query = query.Where("status = ?", *status)
	}
	
	err := query.Order("amount DESC").Find(&utxos).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ecosystem UTXOs")
		return nil, err
	}
	
	return utxos, nil
}

func (s *EcosystemService) CreateUtxo(ctx context.Context, utxo *models.EcosystemUtxo) error {
	utxo.ID = uuid.New()
	utxo.CreatedAt = time.Now()
	utxo.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(utxo).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create ecosystem UTXO")
		return err
	}
	
	return nil
}

func (s *EcosystemService) UpdateUtxoStatus(ctx context.Context, id uuid.UUID, status bool) error {
	err := s.db.WithContext(ctx).Model(&models.EcosystemUtxo{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_at": time.Now(),
		}).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("utxoId", id).Error("Failed to update UTXO status")
		return err
	}
	
	return nil
}
