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

type NotificationService struct {
	mysql  *database.MySQL
	logger *logrus.Logger
}

func NewNotificationService(mysql *database.MySQL, logger *logrus.Logger) *NotificationService {
	return &NotificationService{
		mysql:  mysql,
		logger: logger,
	}
}

func (s *NotificationService) GetNotifications(ctx context.Context, userID uuid.UUID, unreadOnly bool, limit, offset int) ([]*models.NotificationResponse, error) {
	query := `SELECT id, userId, type, title, message, isRead, metadata, createdAt, updatedAt 
			  FROM notification WHERE userId = ?`
	args := []interface{}{userID}

	if unreadOnly {
		query += " AND isRead = false"
	}

	query += " ORDER BY createdAt DESC LIMIT ? OFFSET ?"
	args = append(args, limit, offset)

	rows, err := s.mysql.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query notifications: %w", err)
	}
	defer rows.Close()

	var notifications []*models.NotificationResponse
	for rows.Next() {
		notification := &models.Notification{}
		err := rows.Scan(&notification.ID, &notification.UserID, &notification.Type,
			&notification.Title, &notification.Message, &notification.IsRead,
			&notification.Metadata, &notification.CreatedAt, &notification.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan notification: %w", err)
		}
		notifications = append(notifications, notification.ToResponse())
	}

	return notifications, nil
}

func (s *NotificationService) MarkAsRead(ctx context.Context, userID, notificationID uuid.UUID) error {
	query := `UPDATE notification SET isRead = true, updatedAt = ? WHERE id = ? AND userId = ?`
	_, err := s.mysql.Exec(query, time.Now(), notificationID, userID)
	if err != nil {
		return fmt.Errorf("failed to mark notification as read: %w", err)
	}

	return nil
}

func (s *NotificationService) DeleteNotification(ctx context.Context, userID, notificationID uuid.UUID) error {
	query := `DELETE FROM notification WHERE id = ? AND userId = ?`
	_, err := s.mysql.Exec(query, notificationID, userID)
	if err != nil {
		return fmt.Errorf("failed to delete notification: %w", err)
	}

	return nil
}

func (s *NotificationService) CleanupOldNotifications(ctx context.Context, userID uuid.UUID) (int, error) {
	cutoffDate := time.Now().AddDate(0, -3, 0)
	query := `DELETE FROM notification WHERE userId = ? AND createdAt < ? AND isRead = true`
	
	result, err := s.mysql.Exec(query, userID, cutoffDate)
	if err != nil {
		return 0, fmt.Errorf("failed to cleanup notifications: %w", err)
	}

	rowsAffected, _ := result.RowsAffected()
	return int(rowsAffected), nil
}

func (s *NotificationService) BulkDeleteNotifications(ctx context.Context, userID uuid.UUID, notificationIDs []uuid.UUID) (int, error) {
	if len(notificationIDs) == 0 {
		return 0, nil
	}

	placeholders := make([]string, len(notificationIDs))
	args := []interface{}{userID}
	
	for i, id := range notificationIDs {
		placeholders[i] = "?"
		args = append(args, id)
	}

	query := fmt.Sprintf(`DELETE FROM notification WHERE userId = ? AND id IN (%s)`, 
		fmt.Sprintf("%s", placeholders))
	
	result, err := s.mysql.Exec(query, args...)
	if err != nil {
		return 0, fmt.Errorf("failed to bulk delete notifications: %w", err)
	}

	rowsAffected, _ := result.RowsAffected()
	return int(rowsAffected), nil
}

func (s *NotificationService) CreateNotification(ctx context.Context, userID uuid.UUID, notificationType, title, message string, metadata map[string]interface{}) error {
	notification := &models.Notification{
		ID:        uuid.New(),
		UserID:    userID,
		Type:      notificationType,
		Title:     title,
		Message:   message,
		IsRead:    false,
		Metadata:  metadata,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	query := `INSERT INTO notification (id, userId, type, title, message, isRead, metadata, createdAt, updatedAt) 
			  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := s.mysql.Exec(query, notification.ID, notification.UserID, notification.Type,
		notification.Title, notification.Message, notification.IsRead, notification.Metadata,
		notification.CreatedAt, notification.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to create notification: %w", err)
	}

	return nil
}
