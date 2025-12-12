package models

import (
	"time"

	"github.com/google/uuid"
)

type SupportTicket struct {
	ID          uuid.UUID `json:"id" db:"id"`
	UserID      uuid.UUID `json:"userId" db:"userId"`
	Subject     string    `json:"subject" db:"subject"`
	Message     string    `json:"message" db:"message"`
	Category    string    `json:"category" db:"category"`
	Priority    string    `json:"priority" db:"priority"`
	Status      string    `json:"status" db:"status"`
	Attachments []string  `json:"attachments" db:"attachments"`
	CreatedAt   time.Time `json:"createdAt" db:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt" db:"updatedAt"`
}

type SupportMessage struct {
	ID        uuid.UUID `json:"id" db:"id"`
	TicketID  uuid.UUID `json:"ticketId" db:"ticketId"`
	UserID    uuid.UUID `json:"userId" db:"userId"`
	Message   string    `json:"message" db:"message"`
	IsStaff   bool      `json:"isStaff" db:"isStaff"`
	CreatedAt time.Time `json:"createdAt" db:"createdAt"`
}

type CreateTicketRequest struct {
	Subject     string   `json:"subject"`
	Message     string   `json:"message"`
	Category    string   `json:"category"`
	Priority    string   `json:"priority"`
	Attachments []string `json:"attachments"`
}

type SupportTicketResponse struct {
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"userId"`
	Subject     string    `json:"subject"`
	Message     string    `json:"message"`
	Category    string    `json:"category"`
	Priority    string    `json:"priority"`
	Status      string    `json:"status"`
	Attachments []string  `json:"attachments"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type SupportMessageResponse struct {
	ID        uuid.UUID `json:"id"`
	TicketID  uuid.UUID `json:"ticketId"`
	UserID    uuid.UUID `json:"userId"`
	Message   string    `json:"message"`
	IsStaff   bool      `json:"isStaff"`
	CreatedAt time.Time `json:"createdAt"`
}

func (s *SupportTicket) ToResponse() *SupportTicketResponse {
	return &SupportTicketResponse{
		ID:          s.ID,
		UserID:      s.UserID,
		Subject:     s.Subject,
		Message:     s.Message,
		Category:    s.Category,
		Priority:    s.Priority,
		Status:      s.Status,
		Attachments: s.Attachments,
		CreatedAt:   s.CreatedAt,
		UpdatedAt:   s.UpdatedAt,
	}
}

func (s *SupportMessage) ToResponse() *SupportMessageResponse {
	return &SupportMessageResponse{
		ID:        s.ID,
		TicketID:  s.TicketID,
		UserID:    s.UserID,
		Message:   s.Message,
		IsStaff:   s.IsStaff,
		CreatedAt: s.CreatedAt,
	}
}
