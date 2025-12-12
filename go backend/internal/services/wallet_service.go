package services

import (
	"context"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/internal/models"
	"fmt"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/sirupsen/logrus"
)

type WalletService struct {
	mysql  *database.MySQL
	logger *logrus.Logger
}

func NewWalletService(mysql *database.MySQL, logger *logrus.Logger) *WalletService {
	return &WalletService{
		mysql:  mysql,
		logger: logger,
	}
}

func (s *WalletService) GetWallets(ctx context.Context, userID uuid.UUID, walletType models.WalletType) ([]*models.WalletResponse, error) {
	query := `SELECT id, userId, type, currency, balance, createdAt, updatedAt 
			  FROM wallet WHERE userId = ?`
	args := []interface{}{userID}

	if walletType != "" {
		query += " AND type = ?"
		args = append(args, walletType)
	}

	query += " ORDER BY currency ASC"

	rows, err := s.mysql.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query wallets: %w", err)
	}
	defer rows.Close()

	var wallets []*models.WalletResponse
	for rows.Next() {
		wallet := &models.Wallet{}
		err := rows.Scan(&wallet.ID, &wallet.UserID, &wallet.Type, &wallet.Currency,
			&wallet.Balance, &wallet.CreatedAt, &wallet.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan wallet: %w", err)
		}
		wallets = append(wallets, wallet.ToResponse())
	}

	return wallets, nil
}

func (s *WalletService) GetWallet(ctx context.Context, userID uuid.UUID, currency string, walletType models.WalletType) (*models.WalletResponse, error) {
	query := `SELECT id, userId, type, currency, balance, createdAt, updatedAt 
			  FROM wallet WHERE userId = ? AND currency = ? AND type = ?`

	wallet := &models.Wallet{}
	err := s.mysql.Get(wallet, query, userID, currency, walletType)
	if err != nil {
		return nil, fmt.Errorf("wallet not found: %w", err)
	}

	return wallet.ToResponse(), nil
}

func (s *WalletService) CreateWallet(ctx context.Context, userID uuid.UUID, currency string, walletType models.WalletType) (*models.WalletResponse, error) {
	wallet := &models.Wallet{
		ID:       uuid.New(),
		UserID:   userID,
		Type:     walletType,
		Currency: currency,
		Balance:  decimal.Zero,
	}

	query := `INSERT INTO wallet (id, userId, type, currency, balance, createdAt, updatedAt) 
			  VALUES (?, ?, ?, ?, ?, NOW(), NOW())`

	_, err := s.mysql.Exec(query, wallet.ID, wallet.UserID, wallet.Type, wallet.Currency, wallet.Balance)
	if err != nil {
		return nil, fmt.Errorf("failed to create wallet: %w", err)
	}

	return wallet.ToResponse(), nil
}

func (s *WalletService) UpdateBalance(ctx context.Context, walletID uuid.UUID, amount decimal.Decimal) error {
	query := `UPDATE wallet SET balance = balance + ?, updatedAt = NOW() WHERE id = ?`
	_, err := s.mysql.Exec(query, amount, walletID)
	if err != nil {
		return fmt.Errorf("failed to update wallet balance: %w", err)
	}

	return nil
}

func (s *WalletService) GetOrCreateWallet(ctx context.Context, userID uuid.UUID, currency string, walletType models.WalletType) (*models.WalletResponse, error) {
	wallet, err := s.GetWallet(ctx, userID, currency, walletType)
	if err != nil {
		return s.CreateWallet(ctx, userID, currency, walletType)
	}
	return wallet, nil
}
