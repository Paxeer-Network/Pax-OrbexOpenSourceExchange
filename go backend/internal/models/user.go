package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID  `json:"id" db:"id"`
	Email     string     `json:"email" db:"email"`
	FirstName string     `json:"firstName" db:"firstName"`
	LastName  string     `json:"lastName" db:"lastName"`
	Status    string     `json:"status" db:"status"`
	CreatedAt time.Time  `json:"createdAt" db:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt" db:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt" db:"deletedAt"`
}
