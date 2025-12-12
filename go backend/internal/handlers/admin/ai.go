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

type AiHandler struct {
	aiService *services.AiService
	logger    *logrus.Logger
}

func NewAiHandler(aiService *services.AiService, logger *logrus.Logger) *AiHandler {
	return &AiHandler{
		aiService: aiService,
		logger:    logger,
	}
}

func (h *AiHandler) GetPlans(c *gin.Context) {
	var status *bool
	if statusStr := c.Query("status"); statusStr != "" {
		s, err := strconv.ParseBool(statusStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
			return
		}
		status = &s
	}
	
	plans, err := h.aiService.GetPlans(c.Request.Context(), status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get AI investment plans")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get plans"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": plans})
}

func (h *AiHandler) GetPlan(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid plan ID"})
		return
	}
	
	plan, err := h.aiService.GetPlan(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get AI investment plan")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get plan"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": plan})
}

func (h *AiHandler) CreatePlan(c *gin.Context) {
	var plan models.AiInvestmentPlan
	if err := c.ShouldBindJSON(&plan); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.aiService.CreatePlan(c.Request.Context(), &plan)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create AI investment plan")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create plan"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": plan})
}

func (h *AiHandler) UpdatePlan(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid plan ID"})
		return
	}
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.aiService.UpdatePlan(c.Request.Context(), id, updates)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update AI investment plan")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update plan"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Plan updated successfully"})
}

func (h *AiHandler) GetDurations(c *gin.Context) {
	durations, err := h.aiService.GetDurations(c.Request.Context())
	if err != nil {
		h.logger.WithError(err).Error("Failed to get AI investment durations")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get durations"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": durations})
}

func (h *AiHandler) CreateDuration(c *gin.Context) {
	var duration models.AiInvestmentDuration
	if err := c.ShouldBindJSON(&duration); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.aiService.CreateDuration(c.Request.Context(), &duration)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create AI investment duration")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create duration"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": duration})
}

func (h *AiHandler) GetInvestments(c *gin.Context) {
	var userID *uuid.UUID
	if userIDStr := c.Query("userId"); userIDStr != "" {
		id, err := uuid.Parse(userIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}
		userID = &id
	}
	
	var planID *uuid.UUID
	if planIDStr := c.Query("planId"); planIDStr != "" {
		id, err := uuid.Parse(planIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid plan ID"})
			return
		}
		planID = &id
	}
	
	status := c.Query("status")
	
	investments, err := h.aiService.GetInvestments(c.Request.Context(), userID, planID, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get AI investments")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get investments"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": investments})
}

func (h *AiHandler) CompleteInvestment(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid investment ID"})
		return
	}
	
	err = h.aiService.CompleteInvestment(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to complete AI investment")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to complete investment"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Investment completed successfully"})
}
