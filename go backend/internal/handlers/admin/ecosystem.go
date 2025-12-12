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

type EcosystemHandler struct {
	ecosystemService *services.EcosystemService
	logger           *logrus.Logger
}

func NewEcosystemHandler(ecosystemService *services.EcosystemService, logger *logrus.Logger) *EcosystemHandler {
	return &EcosystemHandler{
		ecosystemService: ecosystemService,
		logger:           logger,
	}
}

func (h *EcosystemHandler) GetBlockchains(c *gin.Context) {
	blockchains, err := h.ecosystemService.GetBlockchains(c.Request.Context())
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecosystem blockchains")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get blockchains"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": blockchains})
}

func (h *EcosystemHandler) GetBlockchain(c *gin.Context) {
	chain := c.Param("chain")
	
	blockchain, err := h.ecosystemService.GetBlockchain(c.Request.Context(), chain)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecosystem blockchain")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get blockchain"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": blockchain})
}

func (h *EcosystemHandler) UpdateBlockchainStatus(c *gin.Context) {
	productID := c.Param("productId")
	
	var request struct {
		Status bool `json:"status"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.ecosystemService.UpdateBlockchainStatus(c.Request.Context(), productID, request.Status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update blockchain status")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update blockchain status"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Blockchain status updated successfully"})
}

func (h *EcosystemHandler) GetTokens(c *gin.Context) {
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
	
	tokens, err := h.ecosystemService.GetTokens(c.Request.Context(), chain, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecosystem tokens")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get tokens"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": tokens})
}

func (h *EcosystemHandler) GetToken(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token ID"})
		return
	}
	
	token, err := h.ecosystemService.GetToken(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecosystem token")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get token"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": token})
}

func (h *EcosystemHandler) CreateToken(c *gin.Context) {
	var token models.EcosystemToken
	if err := c.ShouldBindJSON(&token); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.ecosystemService.CreateToken(c.Request.Context(), &token)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create ecosystem token")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": token})
}

func (h *EcosystemHandler) UpdateToken(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token ID"})
		return
	}
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.ecosystemService.UpdateToken(c.Request.Context(), id, updates)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update ecosystem token")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update token"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Token updated successfully"})
}

func (h *EcosystemHandler) GetMarkets(c *gin.Context) {
	markets, err := h.ecosystemService.GetMarkets(c.Request.Context())
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecosystem markets")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get markets"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": markets})
}

func (h *EcosystemHandler) CreateMarket(c *gin.Context) {
	var market models.EcosystemMarket
	if err := c.ShouldBindJSON(&market); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.ecosystemService.CreateMarket(c.Request.Context(), &market)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create ecosystem market")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create market"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": market})
}

func (h *EcosystemHandler) GetMasterWallets(c *gin.Context) {
	chain := c.Query("chain")
	
	wallets, err := h.ecosystemService.GetMasterWallets(c.Request.Context(), chain)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecosystem master wallets")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get master wallets"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": wallets})
}

func (h *EcosystemHandler) GetMasterWallet(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid wallet ID"})
		return
	}
	
	wallet, err := h.ecosystemService.GetMasterWallet(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecosystem master wallet")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get master wallet"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": wallet})
}

func (h *EcosystemHandler) CreateMasterWallet(c *gin.Context) {
	var wallet models.EcosystemMasterWallet
	if err := c.ShouldBindJSON(&wallet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.ecosystemService.CreateMasterWallet(c.Request.Context(), &wallet)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create ecosystem master wallet")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create master wallet"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": wallet})
}

func (h *EcosystemHandler) GetCustodialWallets(c *gin.Context) {
	var masterWalletID *uuid.UUID
	if masterWalletIDStr := c.Query("masterWalletId"); masterWalletIDStr != "" {
		id, err := uuid.Parse(masterWalletIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid master wallet ID"})
			return
		}
		masterWalletID = &id
	}
	
	chain := c.Query("chain")
	
	wallets, err := h.ecosystemService.GetCustodialWallets(c.Request.Context(), masterWalletID, chain)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecosystem custodial wallets")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get custodial wallets"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": wallets})
}

func (h *EcosystemHandler) CreateCustodialWallet(c *gin.Context) {
	var wallet models.EcosystemCustodialWallet
	if err := c.ShouldBindJSON(&wallet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.ecosystemService.CreateCustodialWallet(c.Request.Context(), &wallet)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create ecosystem custodial wallet")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create custodial wallet"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": wallet})
}
