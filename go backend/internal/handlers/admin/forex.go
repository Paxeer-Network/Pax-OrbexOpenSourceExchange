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

type ForexHandler struct {
	forexService *services.ForexService
	logger       *logrus.Logger
}

func NewForexHandler(forexService *services.ForexService, logger *logrus.Logger) *ForexHandler {
	return &ForexHandler{
		forexService: forexService,
		logger:       logger,
	}
}

func (h *ForexHandler) GetPlans(c *gin.Context) {
	var status *bool
	if statusStr := c.Query("status"); statusStr != "" {
		s, err := strconv.ParseBool(statusStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
			return
		}
		status = &s
	}
	
	plans, err := h.forexService.GetPlans(c.Request.Context(), status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get forex plans")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get plans"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": plans})
}

func (h *ForexHandler) GetPlan(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid plan ID"})
		return
	}
	
	plan, err := h.forexService.GetPlan(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get forex plan")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get plan"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": plan})
}

func (h *ForexHandler) CreatePlan(c *gin.Context) {
	var plan models.ForexPlan
	if err := c.ShouldBindJSON(&plan); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.forexService.CreatePlan(c.Request.Context(), &plan)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create forex plan")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create plan"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": plan})
}

func (h *ForexHandler) GetAccounts(c *gin.Context) {
	var userID *uuid.UUID
	if userIDStr := c.Query("userId"); userIDStr != "" {
		id, err := uuid.Parse(userIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}
		userID = &id
	}
	
	accountType := c.Query("type")
	
	accounts, err := h.forexService.GetAccounts(c.Request.Context(), userID, accountType)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get forex accounts")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get accounts"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": accounts})
}

func (h *ForexHandler) CreateAccount(c *gin.Context) {
	var account models.ForexAccount
	if err := c.ShouldBindJSON(&account); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.forexService.CreateAccount(c.Request.Context(), &account)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create forex account")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create account"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": account})
}

func (h *ForexHandler) GetInvestments(c *gin.Context) {
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
	
	investments, err := h.forexService.GetInvestments(c.Request.Context(), userID, planID, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get forex investments")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get investments"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": investments})
}

func (h *ForexHandler) GetSignals(c *gin.Context) {
	status := c.Query("status")
	
	signals, err := h.forexService.GetSignals(c.Request.Context(), status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get forex signals")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get signals"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": signals})
}

func (h *ForexHandler) CreateSignal(c *gin.Context) {
	var signal models.ForexSignal
	if err := c.ShouldBindJSON(&signal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.forexService.CreateSignal(c.Request.Context(), &signal)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create forex signal")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create signal"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": signal})
}

func (h *ForexHandler) CompleteInvestment(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid investment ID"})
		return
	}
	
	err = h.forexService.CompleteInvestment(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to complete forex investment")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to complete investment"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Investment completed successfully"})
}
