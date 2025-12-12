package admin

import (
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/sirupsen/logrus"
)

type AffiliateHandler struct {
	affiliateService *services.AffiliateService
	logger           *logrus.Logger
}

func NewAffiliateHandler(affiliateService *services.AffiliateService, logger *logrus.Logger) *AffiliateHandler {
	return &AffiliateHandler{
		affiliateService: affiliateService,
		logger:           logger,
	}
}

func (h *AffiliateHandler) GetConditions(c *gin.Context) {
	var status *bool
	if statusStr := c.Query("status"); statusStr != "" {
		s, err := strconv.ParseBool(statusStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
			return
		}
		status = &s
	}
	
	conditions, err := h.affiliateService.GetConditions(c.Request.Context(), status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get affiliate conditions")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get conditions"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": conditions})
}

func (h *AffiliateHandler) CreateCondition(c *gin.Context) {
	var condition models.AffiliateCondition
	if err := c.ShouldBindJSON(&condition); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.affiliateService.CreateCondition(c.Request.Context(), &condition)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create affiliate condition")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create condition"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": condition})
}

func (h *AffiliateHandler) UpdateCondition(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid condition ID"})
		return
	}
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.affiliateService.UpdateCondition(c.Request.Context(), id, updates)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update affiliate condition")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update condition"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Condition updated successfully"})
}

func (h *AffiliateHandler) GetReferrals(c *gin.Context) {
	var referrerID *uuid.UUID
	if referrerIDStr := c.Query("referrerId"); referrerIDStr != "" {
		id, err := uuid.Parse(referrerIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid referrer ID"})
			return
		}
		referrerID = &id
	}
	
	status := c.Query("status")
	
	referrals, err := h.affiliateService.GetReferrals(c.Request.Context(), referrerID, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get affiliate referrals")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get referrals"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": referrals})
}

func (h *AffiliateHandler) UpdateReferralStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid referral ID"})
		return
	}
	
	var request struct {
		Status string `json:"status"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.affiliateService.UpdateReferralStatus(c.Request.Context(), id, request.Status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update referral status")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update referral status"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Referral status updated successfully"})
}

func (h *AffiliateHandler) GetRewards(c *gin.Context) {
	var userID *uuid.UUID
	if userIDStr := c.Query("userId"); userIDStr != "" {
		id, err := uuid.Parse(userIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}
		userID = &id
	}
	
	var conditionID *uuid.UUID
	if conditionIDStr := c.Query("conditionId"); conditionIDStr != "" {
		id, err := uuid.Parse(conditionIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid condition ID"})
			return
		}
		conditionID = &id
	}
	
	status := c.Query("status")
	
	rewards, err := h.affiliateService.GetRewards(c.Request.Context(), userID, conditionID, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get affiliate rewards")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get rewards"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": rewards})
}

func (h *AffiliateHandler) CreateReward(c *gin.Context) {
	var request struct {
		UserID      uuid.UUID       `json:"userId"`
		ConditionID uuid.UUID       `json:"conditionId"`
		Amount      decimal.Decimal `json:"amount"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.affiliateService.CreateReward(c.Request.Context(), request.UserID, request.ConditionID, request.Amount)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create affiliate reward")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create reward"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"message": "Reward created successfully"})
}

func (h *AffiliateHandler) UpdateRewardStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid reward ID"})
		return
	}
	
	var request struct {
		Status string `json:"status"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.affiliateService.UpdateRewardStatus(c.Request.Context(), id, request.Status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update reward status")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update reward status"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Reward status updated successfully"})
}
