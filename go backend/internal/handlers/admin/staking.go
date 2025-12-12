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

type StakingHandler struct {
	stakingService *services.StakingService
	logger         *logrus.Logger
}

func NewStakingHandler(stakingService *services.StakingService, logger *logrus.Logger) *StakingHandler {
	return &StakingHandler{
		stakingService: stakingService,
		logger:         logger,
	}
}

func (h *StakingHandler) GetPools(c *gin.Context) {
	currency := c.Query("currency")
	chain := c.Query("chain")
	
	var status *bool
	if statusStr := c.Query("status"); statusStr != "" {
		s, err := strconv.ParseBool(statusStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
			return
		}
		status = &s
	}
	
	pools, err := h.stakingService.GetPools(c.Request.Context(), currency, chain, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get staking pools")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get pools"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": pools})
}

func (h *StakingHandler) GetPool(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pool ID"})
		return
	}
	
	pool, err := h.stakingService.GetPool(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get staking pool")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get pool"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": pool})
}

func (h *StakingHandler) CreatePool(c *gin.Context) {
	var pool models.StakingPool
	if err := c.ShouldBindJSON(&pool); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.stakingService.CreatePool(c.Request.Context(), &pool)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create staking pool")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create pool"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": pool})
}

func (h *StakingHandler) UpdatePool(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pool ID"})
		return
	}
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.stakingService.UpdatePool(c.Request.Context(), id, updates)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update staking pool")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update pool"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Pool updated successfully"})
}

func (h *StakingHandler) GetDurations(c *gin.Context) {
	var poolID *uuid.UUID
	if poolIDStr := c.Query("poolId"); poolIDStr != "" {
		id, err := uuid.Parse(poolIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pool ID"})
			return
		}
		poolID = &id
	}
	
	durations, err := h.stakingService.GetDurations(c.Request.Context(), poolID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get staking durations")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get durations"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": durations})
}

func (h *StakingHandler) CreateDuration(c *gin.Context) {
	var duration models.StakingDuration
	if err := c.ShouldBindJSON(&duration); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.stakingService.CreateDuration(c.Request.Context(), &duration)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create staking duration")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create duration"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": duration})
}

func (h *StakingHandler) GetStakes(c *gin.Context) {
	var userID *uuid.UUID
	if userIDStr := c.Query("userId"); userIDStr != "" {
		id, err := uuid.Parse(userIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}
		userID = &id
	}
	
	var poolID *uuid.UUID
	if poolIDStr := c.Query("poolId"); poolIDStr != "" {
		id, err := uuid.Parse(poolIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pool ID"})
			return
		}
		poolID = &id
	}
	
	status := c.Query("status")
	
	stakes, err := h.stakingService.GetStakes(c.Request.Context(), userID, poolID, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get staking logs")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get stakes"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": stakes})
}

func (h *StakingHandler) GetStake(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stake ID"})
		return
	}
	
	stake, err := h.stakingService.GetStake(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get staking log")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get stake"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": stake})
}

func (h *StakingHandler) ReleaseStake(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stake ID"})
		return
	}
	
	err = h.stakingService.ReleaseStake(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to release stake")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to release stake"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Stake released successfully"})
}
