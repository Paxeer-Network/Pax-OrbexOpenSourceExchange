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

type SupportService struct {
	mysql  *database.MySQL
	logger *logrus.Logger
}

func NewSupportService(mysql *database.MySQL, logger *logrus.Logger) *SupportService {
	return &SupportService{
		mysql:  mysql,
		logger: logger,
	}
}

func (s *SupportService) CreateTicket(ctx context.Context, userID uuid.UUID, req *models.CreateTicketRequest) (*models.SupportTicketResponse, error) {
	ticket := &models.SupportTicket{
		ID:          uuid.New(),
		UserID:      userID,
		Subject:     req.Subject,
		Message:     req.Message,
		Category:    req.Category,
		Priority:    req.Priority,
		Status:      "OPEN",
		Attachments: req.Attachments,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	query := `INSERT INTO support_ticket (id, userId, subject, message, category, priority, status, attachments, createdAt, updatedAt) 
			  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := s.mysql.Exec(query, ticket.ID, ticket.UserID, ticket.Subject, ticket.Message,
		ticket.Category, ticket.Priority, ticket.Status, ticket.Attachments,
		ticket.CreatedAt, ticket.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create support ticket: %w", err)
	}

	return ticket.ToResponse(), nil
}

func (s *SupportService) GetUserTickets(ctx context.Context, userID uuid.UUID, status string, limit, offset int) ([]*models.SupportTicketResponse, error) {
	query := `SELECT id, userId, subject, message, category, priority, status, attachments, createdAt, updatedAt 
			  FROM support_ticket WHERE userId = ?`
	args := []interface{}{userID}

	if status != "" {
		query += " AND status = ?"
		args = append(args, status)
	}

	query += " ORDER BY createdAt DESC LIMIT ? OFFSET ?"
	args = append(args, limit, offset)

	rows, err := s.mysql.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query support tickets: %w", err)
	}
	defer rows.Close()

	var tickets []*models.SupportTicketResponse
	for rows.Next() {
		ticket := &models.SupportTicket{}
		err := rows.Scan(&ticket.ID, &ticket.UserID, &ticket.Subject, &ticket.Message,
			&ticket.Category, &ticket.Priority, &ticket.Status, &ticket.Attachments,
			&ticket.CreatedAt, &ticket.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan support ticket: %w", err)
		}
		tickets = append(tickets, ticket.ToResponse())
	}

	return tickets, nil
}

func (s *SupportService) GetTicket(ctx context.Context, userID, ticketID uuid.UUID) (*models.SupportTicketResponse, error) {
	query := `SELECT id, userId, subject, message, category, priority, status, attachments, createdAt, updatedAt 
			  FROM support_ticket WHERE id = ? AND userId = ?`

	ticket := &models.SupportTicket{}
	err := s.mysql.Get(ticket, query, ticketID, userID)
	if err != nil {
		return nil, fmt.Errorf("support ticket not found: %w", err)
	}

	return ticket.ToResponse(), nil
}

func (s *SupportService) AddMessage(ctx context.Context, userID, ticketID uuid.UUID, message string) (*models.SupportMessageResponse, error) {
	ticketMessage := &models.SupportMessage{
		ID:        uuid.New(),
		TicketID:  ticketID,
		UserID:    userID,
		Message:   message,
		IsStaff:   false,
		CreatedAt: time.Now(),
	}

	query := `INSERT INTO support_message (id, ticketId, userId, message, isStaff, createdAt) 
			  VALUES (?, ?, ?, ?, ?, ?)`

	_, err := s.mysql.Exec(query, ticketMessage.ID, ticketMessage.TicketID, ticketMessage.UserID,
		ticketMessage.Message, ticketMessage.IsStaff, ticketMessage.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to add message to ticket: %w", err)
	}

	updateQuery := `UPDATE support_ticket SET updatedAt = ? WHERE id = ? AND userId = ?`
	_, err = s.mysql.Exec(updateQuery, time.Now(), ticketID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to update ticket timestamp: %w", err)
	}

	return ticketMessage.ToResponse(), nil
}

func (s *SupportService) CloseTicket(ctx context.Context, userID, ticketID uuid.UUID) error {
	query := `UPDATE support_ticket SET status = 'CLOSED', updatedAt = ? WHERE id = ? AND userId = ?`
	_, err := s.mysql.Exec(query, time.Now(), ticketID, userID)
	if err != nil {
		return fmt.Errorf("failed to close support ticket: %w", err)
	}

	return nil
}
