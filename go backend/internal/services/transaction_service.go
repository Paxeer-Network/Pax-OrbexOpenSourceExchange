package services

import (
	"context"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/internal/models"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type TransactionService struct {
	mysql  *database.MySQL
	logger *logrus.Logger
}

func NewTransactionService(mysql *database.MySQL, logger *logrus.Logger) *TransactionService {
	return &TransactionService{
		mysql:  mysql,
		logger: logger,
	}
}

func (s *TransactionService) GetTransactions(ctx context.Context, userID uuid.UUID, transactionType, status string, limit, offset int) ([]*models.TransactionResponse, error) {
	query := `SELECT id, userId, type, status, currency, amount, fee, description, 
			  referenceId, metadata, createdAt, updatedAt 
			  FROM transaction WHERE userId = ?`
	args := []interface{}{userID}

	if transactionType != "" {
		query += " AND type = ?"
		args = append(args, transactionType)
	}

	if status != "" {
		query += " AND status = ?"
		args = append(args, status)
	}

	query += " ORDER BY createdAt DESC LIMIT ? OFFSET ?"
	args = append(args, limit, offset)

	rows, err := s.mysql.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query transactions: %w", err)
	}
	defer rows.Close()

	var transactions []*models.TransactionResponse
	for rows.Next() {
		transaction := &models.Transaction{}
		err := rows.Scan(&transaction.ID, &transaction.UserID, &transaction.Type, &transaction.Status,
			&transaction.Currency, &transaction.Amount, &transaction.Fee, &transaction.Description,
			&transaction.ReferenceID, &transaction.Metadata, &transaction.CreatedAt, &transaction.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan transaction: %w", err)
		}
		transactions = append(transactions, transaction.ToResponse())
	}

	return transactions, nil
}

func (s *TransactionService) GetTransaction(ctx context.Context, userID, transactionID uuid.UUID) (*models.TransactionResponse, error) {
	query := `SELECT id, userId, type, status, currency, amount, fee, description, 
			  referenceId, metadata, createdAt, updatedAt 
			  FROM transaction WHERE id = ? AND userId = ?`

	transaction := &models.Transaction{}
	err := s.mysql.Get(transaction, query, transactionID, userID)
	if err != nil {
		return nil, fmt.Errorf("transaction not found: %w", err)
	}

	return transaction.ToResponse(), nil
}

func (s *TransactionService) AnalyzeTransactions(ctx context.Context, userID uuid.UUID, startDate, endDate, transactionType string) (*models.TransactionAnalysis, error) {
	start, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		return nil, fmt.Errorf("invalid start date: %w", err)
	}

	end, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		return nil, fmt.Errorf("invalid end date: %w", err)
	}

	query := `SELECT type, currency, SUM(amount) as total_amount, COUNT(*) as count
			  FROM transaction 
			  WHERE userId = ? AND createdAt BETWEEN ? AND ?`
	args := []interface{}{userID, start, end}

	if transactionType != "" {
		query += " AND type = ?"
		args = append(args, transactionType)
	}

	query += " GROUP BY type, currency ORDER BY total_amount DESC"

	rows, err := s.mysql.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to analyze transactions: %w", err)
	}
	defer rows.Close()

	analysis := &models.TransactionAnalysis{
		StartDate: start,
		EndDate:   end,
		Summary:   make(map[string]*models.TransactionSummary),
	}

	for rows.Next() {
		var txType, currency string
		var totalAmount float64
		var count int

		err := rows.Scan(&txType, &currency, &totalAmount, &count)
		if err != nil {
			return nil, fmt.Errorf("failed to scan analysis result: %w", err)
		}

		key := fmt.Sprintf("%s_%s", txType, currency)
		analysis.Summary[key] = &models.TransactionSummary{
			Type:        txType,
			Currency:    currency,
			TotalAmount: totalAmount,
			Count:       count,
		}
	}

	return analysis, nil
}
