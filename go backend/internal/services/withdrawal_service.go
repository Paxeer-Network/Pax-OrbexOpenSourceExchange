package services

import (
	"context"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/internal/models"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/sirupsen/logrus"
)

type WithdrawalService struct {
	mysql         *database.MySQL
	walletService *WalletService
	logger        *logrus.Logger
}

func NewWithdrawalService(mysql *database.MySQL, walletService *WalletService, logger *logrus.Logger) *WithdrawalService {
	return &WithdrawalService{
		mysql:         mysql,
		walletService: walletService,
		logger:        logger,
	}
}

func (s *WithdrawalService) CreateFiatWithdrawal(ctx context.Context, userID uuid.UUID, req *models.CreateWithdrawalRequest) (*models.WithdrawalResponse, error) {
	wallet, err := s.walletService.GetWallet(ctx, userID, req.Currency, models.WalletTypeFiat)
	if err != nil {
		return nil, fmt.Errorf("wallet not found: %w", err)
	}

	totalAmount := req.Amount.Add(req.Fee)
	if wallet.Balance.LessThan(totalAmount) {
		return nil, fmt.Errorf("insufficient balance")
	}

	withdrawal := &models.Withdrawal{
		ID:          uuid.New(),
		UserID:      userID,
		Type:        "FIAT",
		Currency:    req.Currency,
		Amount:      req.Amount,
		Fee:         req.Fee,
		Status:      "PENDING",
		Method:      req.Method,
		Address:     req.Address,
		BankDetails: req.BankDetails,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	query := `INSERT INTO withdrawal (id, userId, type, currency, amount, fee, status, method, address, bankDetails, createdAt, updatedAt) 
			  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err = s.mysql.Exec(query, withdrawal.ID, withdrawal.UserID, withdrawal.Type, withdrawal.Currency,
		withdrawal.Amount, withdrawal.Fee, withdrawal.Status, withdrawal.Method, withdrawal.Address,
		withdrawal.BankDetails, withdrawal.CreatedAt, withdrawal.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create fiat withdrawal: %w", err)
	}

	err = s.walletService.UpdateBalance(ctx, wallet.ID, totalAmount.Neg())
	if err != nil {
		return nil, fmt.Errorf("failed to update wallet balance: %w", err)
	}

	return withdrawal.ToResponse(), nil
}

func (s *WithdrawalService) CreateSpotWithdrawal(ctx context.Context, userID uuid.UUID, req *models.CreateWithdrawalRequest) (*models.WithdrawalResponse, error) {
	wallet, err := s.walletService.GetWallet(ctx, userID, req.Currency, models.WalletTypeSpot)
	if err != nil {
		return nil, fmt.Errorf("wallet not found: %w", err)
	}

	totalAmount := req.Amount.Add(req.Fee)
	if wallet.Balance.LessThan(totalAmount) {
		return nil, fmt.Errorf("insufficient balance")
	}

	withdrawal := &models.Withdrawal{
		ID:        uuid.New(),
		UserID:    userID,
		Type:      "SPOT",
		Currency:  req.Currency,
		Amount:    req.Amount,
		Fee:       req.Fee,
		Status:    "PENDING",
		Method:    req.Method,
		Address:   req.Address,
		Network:   req.Network,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	query := `INSERT INTO withdrawal (id, userId, type, currency, amount, fee, status, method, address, network, createdAt, updatedAt) 
			  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err = s.mysql.Exec(query, withdrawal.ID, withdrawal.UserID, withdrawal.Type, withdrawal.Currency,
		withdrawal.Amount, withdrawal.Fee, withdrawal.Status, withdrawal.Method, withdrawal.Address,
		withdrawal.Network, withdrawal.CreatedAt, withdrawal.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create spot withdrawal: %w", err)
	}

	err = s.walletService.UpdateBalance(ctx, wallet.ID, totalAmount.Neg())
	if err != nil {
		return nil, fmt.Errorf("failed to update wallet balance: %w", err)
	}

	return withdrawal.ToResponse(), nil
}

func (s *WithdrawalService) GetUserWithdrawals(ctx context.Context, userID uuid.UUID) ([]*models.WithdrawalResponse, error) {
	query := `SELECT id, userId, type, currency, amount, fee, status, method, address, network, bankDetails, createdAt, updatedAt 
			  FROM withdrawal WHERE userId = ? ORDER BY createdAt DESC`

	rows, err := s.mysql.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query withdrawals: %w", err)
	}
	defer rows.Close()

	var withdrawals []*models.WithdrawalResponse
	for rows.Next() {
		withdrawal := &models.Withdrawal{}
		err := rows.Scan(&withdrawal.ID, &withdrawal.UserID, &withdrawal.Type, &withdrawal.Currency,
			&withdrawal.Amount, &withdrawal.Fee, &withdrawal.Status, &withdrawal.Method,
			&withdrawal.Address, &withdrawal.Network, &withdrawal.BankDetails,
			&withdrawal.CreatedAt, &withdrawal.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan withdrawal: %w", err)
		}
		withdrawals = append(withdrawals, withdrawal.ToResponse())
	}

	return withdrawals, nil
}

func (s *WithdrawalService) CancelWithdrawal(ctx context.Context, userID, withdrawalID uuid.UUID) error {
	query := `SELECT currency, amount, fee, type FROM withdrawal WHERE id = ? AND userId = ? AND status = 'PENDING'`
	
	var currency string
	var amount, fee decimal.Decimal
	var walletType string
	
	err := s.mysql.Get(&currency, query, withdrawalID, userID)
	if err != nil {
		return fmt.Errorf("withdrawal not found or cannot be canceled: %w", err)
	}

	updateQuery := `UPDATE withdrawal SET status = 'CANCELED', updatedAt = ? WHERE id = ?`
	_, err = s.mysql.Exec(updateQuery, time.Now(), withdrawalID)
	if err != nil {
		return fmt.Errorf("failed to cancel withdrawal: %w", err)
	}

	var wType models.WalletType
	if walletType == "FIAT" {
		wType = models.WalletTypeFiat
	} else {
		wType = models.WalletTypeSpot
	}

	wallet, err := s.walletService.GetWallet(ctx, userID, currency, wType)
	if err != nil {
		return fmt.Errorf("failed to get wallet: %w", err)
	}

	refundAmount := amount.Add(fee)
	err = s.walletService.UpdateBalance(ctx, wallet.ID, refundAmount)
	if err != nil {
		return fmt.Errorf("failed to refund wallet balance: %w", err)
	}

	return nil
}
