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

type DepositService struct {
	mysql         *database.MySQL
	walletService *WalletService
	logger        *logrus.Logger
}

func NewDepositService(mysql *database.MySQL, walletService *WalletService, logger *logrus.Logger) *DepositService {
	return &DepositService{
		mysql:         mysql,
		walletService: walletService,
		logger:        logger,
	}
}

func (s *DepositService) CreateFiatDeposit(ctx context.Context, userID uuid.UUID, req *models.CreateDepositRequest) (*models.DepositResponse, error) {
	deposit := &models.Deposit{
		ID:            uuid.New(),
		UserID:        userID,
		Type:          "FIAT",
		Currency:      req.Currency,
		Amount:        req.Amount,
		Fee:           decimal.Zero,
		Status:        "PENDING",
		Method:        req.Method,
		PaymentData:   req.PaymentData,
		TransactionID: req.TransactionID,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	query := `INSERT INTO deposit (id, userId, type, currency, amount, fee, status, method, paymentData, transactionId, createdAt, updatedAt) 
			  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := s.mysql.Exec(query, deposit.ID, deposit.UserID, deposit.Type, deposit.Currency,
		deposit.Amount, deposit.Fee, deposit.Status, deposit.Method, deposit.PaymentData,
		deposit.TransactionID, deposit.CreatedAt, deposit.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create fiat deposit: %w", err)
	}

	return deposit.ToResponse(), nil
}

func (s *DepositService) CreateSpotDeposit(ctx context.Context, userID uuid.UUID, req *models.CreateDepositRequest) (*models.DepositResponse, error) {
	deposit := &models.Deposit{
		ID:            uuid.New(),
		UserID:        userID,
		Type:          "SPOT",
		Currency:      req.Currency,
		Amount:        req.Amount,
		Fee:           decimal.Zero,
		Status:        "PENDING",
		Method:        req.Method,
		Address:       req.Address,
		Network:       req.Network,
		TransactionID: req.TransactionID,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	query := `INSERT INTO deposit (id, userId, type, currency, amount, fee, status, method, address, network, transactionId, createdAt, updatedAt) 
			  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := s.mysql.Exec(query, deposit.ID, deposit.UserID, deposit.Type, deposit.Currency,
		deposit.Amount, deposit.Fee, deposit.Status, deposit.Method, deposit.Address,
		deposit.Network, deposit.TransactionID, deposit.CreatedAt, deposit.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create spot deposit: %w", err)
	}

	return deposit.ToResponse(), nil
}

func (s *DepositService) VerifyStripeDeposit(ctx context.Context, userID uuid.UUID, paymentIntentID string) (*models.DepositVerificationResult, error) {
	query := `SELECT id, currency, amount FROM deposit WHERE userId = ? AND paymentData LIKE ? AND status = 'PENDING'`
	
	var depositID uuid.UUID
	var currency string
	var amount decimal.Decimal
	
	err := s.mysql.Get(&depositID, query, userID, "%"+paymentIntentID+"%")
	if err != nil {
		return nil, fmt.Errorf("deposit not found: %w", err)
	}

	updateQuery := `UPDATE deposit SET status = 'COMPLETED', updatedAt = ? WHERE id = ?`
	_, err = s.mysql.Exec(updateQuery, time.Now(), depositID)
	if err != nil {
		return nil, fmt.Errorf("failed to update deposit status: %w", err)
	}

	wallet, err := s.walletService.GetOrCreateWallet(ctx, userID, currency, models.WalletTypeFiat)
	if err != nil {
		return nil, fmt.Errorf("failed to get wallet: %w", err)
	}

	err = s.walletService.UpdateBalance(ctx, wallet.ID, amount)
	if err != nil {
		return nil, fmt.Errorf("failed to update wallet balance: %w", err)
	}

	return &models.DepositVerificationResult{
		Success:   true,
		DepositID: depositID,
		Amount:    amount,
		Currency:  currency,
	}, nil
}

func (s *DepositService) VerifyPayPalDeposit(ctx context.Context, userID uuid.UUID, orderID string) (*models.DepositVerificationResult, error) {
	query := `SELECT id, currency, amount FROM deposit WHERE userId = ? AND paymentData LIKE ? AND status = 'PENDING'`
	
	var depositID uuid.UUID
	var currency string
	var amount decimal.Decimal
	
	err := s.mysql.Get(&depositID, query, userID, "%"+orderID+"%")
	if err != nil {
		return nil, fmt.Errorf("deposit not found: %w", err)
	}

	updateQuery := `UPDATE deposit SET status = 'COMPLETED', updatedAt = ? WHERE id = ?`
	_, err = s.mysql.Exec(updateQuery, time.Now(), depositID)
	if err != nil {
		return nil, fmt.Errorf("failed to update deposit status: %w", err)
	}

	wallet, err := s.walletService.GetOrCreateWallet(ctx, userID, currency, models.WalletTypeFiat)
	if err != nil {
		return nil, fmt.Errorf("failed to get wallet: %w", err)
	}

	err = s.walletService.UpdateBalance(ctx, wallet.ID, amount)
	if err != nil {
		return nil, fmt.Errorf("failed to update wallet balance: %w", err)
	}

	return &models.DepositVerificationResult{
		Success:   true,
		DepositID: depositID,
		Amount:    amount,
		Currency:  currency,
	}, nil
}

func (s *DepositService) GetDepositAddress(ctx context.Context, userID uuid.UUID, currency, network string) (*models.DepositAddress, error) {
	query := `SELECT address FROM deposit_address WHERE userId = ? AND currency = ? AND network = ?`
	
	var address string
	err := s.mysql.Get(&address, query, userID, currency, network)
	if err != nil {
		address = s.generateDepositAddress(currency, network)
		
		insertQuery := `INSERT INTO deposit_address (id, userId, currency, network, address, createdAt) 
						VALUES (?, ?, ?, ?, ?, ?)`
		_, err = s.mysql.Exec(insertQuery, uuid.New(), userID, currency, network, address, time.Now())
		if err != nil {
			return nil, fmt.Errorf("failed to create deposit address: %w", err)
		}
	}

	return &models.DepositAddress{
		Currency: currency,
		Network:  network,
		Address:  address,
	}, nil
}

func (s *DepositService) generateDepositAddress(currency, network string) string {
	return fmt.Sprintf("%s_%s_%d", currency, network, time.Now().Unix())
}
