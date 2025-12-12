package admin

import (
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type MailwizardHandler struct {
	mailwizardService *services.MailwizardService
	logger            *logrus.Logger
}

func NewMailwizardHandler(mailwizardService *services.MailwizardService, logger *logrus.Logger) *MailwizardHandler {
	return &MailwizardHandler{
		mailwizardService: mailwizardService,
		logger:            logger,
	}
}

func (h *MailwizardHandler) GetTemplates(c *gin.Context) {
	templateType := c.Query("type")
	
	var status *bool
	if statusStr := c.Query("status"); statusStr != "" {
		s, err := strconv.ParseBool(statusStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
			return
		}
		status = &s
	}
	
	templates, err := h.mailwizardService.GetTemplates(c.Request.Context(), templateType, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get mailwizard templates")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get templates"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": templates})
}

func (h *MailwizardHandler) GetTemplate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid template ID"})
		return
	}
	
	template, err := h.mailwizardService.GetTemplate(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get mailwizard template")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get template"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": template})
}

func (h *MailwizardHandler) CreateTemplate(c *gin.Context) {
	var template models.MailwizardTemplate
	if err := c.ShouldBindJSON(&template); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.mailwizardService.CreateTemplate(c.Request.Context(), &template)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create mailwizard template")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create template"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": template})
}

func (h *MailwizardHandler) UpdateTemplate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid template ID"})
		return
	}
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.mailwizardService.UpdateTemplate(c.Request.Context(), id, updates)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update mailwizard template")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update template"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Template updated successfully"})
}

func (h *MailwizardHandler) DeleteTemplate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid template ID"})
		return
	}
	
	err = h.mailwizardService.DeleteTemplate(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to delete mailwizard template")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete template"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Template deleted successfully"})
}

func (h *MailwizardHandler) GetCampaigns(c *gin.Context) {
	status := c.Query("status")
	
	campaigns, err := h.mailwizardService.GetCampaigns(c.Request.Context(), status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get mailwizard campaigns")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get campaigns"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": campaigns})
}

func (h *MailwizardHandler) GetCampaign(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid campaign ID"})
		return
	}
	
	campaign, err := h.mailwizardService.GetCampaign(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get mailwizard campaign")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get campaign"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": campaign})
}

func (h *MailwizardHandler) CreateCampaign(c *gin.Context) {
	var campaign models.MailwizardCampaign
	if err := c.ShouldBindJSON(&campaign); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.mailwizardService.CreateCampaign(c.Request.Context(), &campaign)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create mailwizard campaign")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create campaign"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": campaign})
}

func (h *MailwizardHandler) UpdateCampaign(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid campaign ID"})
		return
	}
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.mailwizardService.UpdateCampaign(c.Request.Context(), id, updates)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update mailwizard campaign")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update campaign"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Campaign updated successfully"})
}

func (h *MailwizardHandler) DeleteCampaign(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid campaign ID"})
		return
	}
	
	err = h.mailwizardService.DeleteCampaign(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to delete mailwizard campaign")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete campaign"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Campaign deleted successfully"})
}

func (h *MailwizardHandler) SendCampaign(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid campaign ID"})
		return
	}
	
	err = h.mailwizardService.SendCampaign(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to send mailwizard campaign")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send campaign"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Campaign sent successfully"})
}
