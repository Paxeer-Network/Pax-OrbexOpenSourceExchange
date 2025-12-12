package models

import (
	"time"

	"github.com/google/uuid"
)

type UserProfile struct {
	ID            uuid.UUID              `json:"id"`
	FirstName     string                 `json:"firstName"`
	LastName      string                 `json:"lastName"`
	Email         string                 `json:"email"`
	Avatar        *string                `json:"avatar"`
	Phone         *string                `json:"phone"`
	EmailVerified bool                   `json:"emailVerified"`
	TwoFactor     bool                   `json:"twoFactor"`
	Profile       map[string]interface{} `json:"profile"`
	Metadata      map[string]interface{} `json:"metadata"`
	CreatedAt     time.Time              `json:"createdAt"`
	UpdatedAt     time.Time              `json:"updatedAt"`
}

type UpdateProfileRequest struct {
	FirstName *string                `json:"firstName"`
	LastName  *string                `json:"lastName"`
	Email     *string                `json:"email"`
	Avatar    *string                `json:"avatar"`
	Phone     *string                `json:"phone"`
	TwoFactor *bool                  `json:"twoFactor"`
	Profile   map[string]interface{} `json:"profile"`
	Metadata  map[string]interface{} `json:"metadata"`
}

type KYCApplication struct {
	ID        uuid.UUID              `json:"id" db:"id"`
	UserID    uuid.UUID              `json:"userId" db:"userId"`
	Level     int                    `json:"level" db:"level"`
	Status    string                 `json:"status" db:"status"`
	Data      map[string]interface{} `json:"data" db:"data"`
	Documents []string               `json:"documents" db:"documents"`
	Notes     *string                `json:"notes" db:"notes"`
	CreatedAt time.Time              `json:"createdAt" db:"createdAt"`
	UpdatedAt time.Time              `json:"updatedAt" db:"updatedAt"`
}

type KYCApplicationRequest struct {
	Level     int                    `json:"level"`
	Data      map[string]interface{} `json:"data"`
	Documents []string               `json:"documents"`
}

type KYCApplicationResponse struct {
	ID        uuid.UUID              `json:"id"`
	UserID    uuid.UUID              `json:"userId"`
	Level     int                    `json:"level"`
	Status    string                 `json:"status"`
	Data      map[string]interface{} `json:"data"`
	Documents []string               `json:"documents"`
	Notes     *string                `json:"notes"`
	CreatedAt time.Time              `json:"createdAt"`
	UpdatedAt time.Time              `json:"updatedAt"`
}

func (u *User) ToProfile() *UserProfile {
	return &UserProfile{
		ID:            u.ID,
		FirstName:     u.FirstName,
		LastName:      u.LastName,
		Email:         u.Email,
		Avatar:        u.Avatar,
		Phone:         u.Phone,
		EmailVerified: u.EmailVerified,
		TwoFactor:     u.TwoFactor,
		Profile:       u.Profile,
		Metadata:      u.Metadata,
		CreatedAt:     u.CreatedAt,
		UpdatedAt:     u.UpdatedAt,
	}
}

func (k *KYCApplication) ToResponse() *KYCApplicationResponse {
	return &KYCApplicationResponse{
		ID:        k.ID,
		UserID:    k.UserID,
		Level:     k.Level,
		Status:    k.Status,
		Data:      k.Data,
		Documents: k.Documents,
		Notes:     k.Notes,
		CreatedAt: k.CreatedAt,
		UpdatedAt: k.UpdatedAt,
	}
}
