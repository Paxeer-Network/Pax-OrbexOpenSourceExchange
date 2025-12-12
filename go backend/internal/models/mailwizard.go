package models

import (
	"time"
	"github.com/google/uuid"
)

type MailwizardTemplate struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	Subject   string    `json:"subject" gorm:"not null"`
	Body      string    `json:"body" gorm:"type:text"`
	Type      string    `json:"type" gorm:"not null"`
	Status    bool      `json:"status" gorm:"default:true"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	MailwizardCampaigns []MailwizardCampaign `json:"mailwizardCampaigns" gorm:"foreignKey:TemplateID"`
}

type MailwizardCampaign struct {
	ID         uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	TemplateID uuid.UUID `json:"templateId" gorm:"type:char(36);not null"`
	Name       string    `json:"name" gorm:"not null"`
	Subject    string    `json:"subject" gorm:"not null"`
	Targets    string    `json:"targets" gorm:"type:json"`
	Status     string    `json:"status" gorm:"default:'PENDING'"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
	
	Template MailwizardTemplate `json:"template" gorm:"foreignKey:TemplateID"`
}
