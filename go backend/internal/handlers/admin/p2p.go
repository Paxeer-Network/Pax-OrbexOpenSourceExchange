package admin

import (
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type P2pHandler struct {
	p2pService *services.P2pService
	logger     *logrus.Logger
}

func NewP2pHandler(p2pService *services.P2pService, logger *logrus.Logger) *P2pHandler {
	return &P2pHandler{
		p2pService: p2pService,
		logger:     logger,
	}
}

func (h *P2pHandler) GetPaymentMethods(c *gin.Context) {
	currency := c.Query("currency")
	
	methods, err := h.p2pService.GetPaymentMethods(c.Request.Context(), currency)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get P2P payment methods")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get payment methods"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": methods})
}

func (h *P2pHandler) CreatePaymentMethod(c *gin.Context) {
	var method models.P2pPaymentMethod
	if err := c.ShouldBindJSON(&method); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.p2pService.CreatePaymentMethod(c.Request.Context(), &method)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create P2P payment method")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment method"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": method})
}

func (h *P2pHandler) GetOffers(c *gin.Context) {
	var userID *uuid.UUID
	if userIDStr := c.Query("userId"); userIDStr != "" {
		id, err := uuid.Parse(userIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}
		userID = &id
	}
	
	currency := c.Query("currency")
	status := c.Query("status")
	
	offers, err := h.p2pService.GetOffers(c.Request.Context(), userID, currency, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get P2P offers")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get offers"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": offers})
}

func (h *P2pHandler) GetOffer(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid offer ID"})
		return
	}
	
	offer, err := h.p2pService.GetOffer(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get P2P offer")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get offer"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": offer})
}

func (h *P2pHandler) UpdateOfferStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid offer ID"})
		return
	}
	
	var request struct {
		Status string `json:"status"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.p2pService.UpdateOfferStatus(c.Request.Context(), id, request.Status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update P2P offer status")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update offer status"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Offer status updated successfully"})
}

func (h *P2pHandler) GetTrades(c *gin.Context) {
	var userID *uuid.UUID
	if userIDStr := c.Query("userId"); userIDStr != "" {
		id, err := uuid.Parse(userIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}
		userID = &id
	}
	
	var offerID *uuid.UUID
	if offerIDStr := c.Query("offerId"); offerIDStr != "" {
		id, err := uuid.Parse(offerIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid offer ID"})
			return
		}
		offerID = &id
	}
	
	status := c.Query("status")
	
	trades, err := h.p2pService.GetTrades(c.Request.Context(), userID, offerID, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get P2P trades")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get trades"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": trades})
}

func (h *P2pHandler) UpdateTradeStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid trade ID"})
		return
	}
	
	var request struct {
		Status string `json:"status"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.p2pService.UpdateTradeStatus(c.Request.Context(), id, request.Status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update P2P trade status")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update trade status"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Trade status updated successfully"})
}

func (h *P2pHandler) GetDisputes(c *gin.Context) {
	var tradeID *uuid.UUID
	if tradeIDStr := c.Query("tradeId"); tradeIDStr != "" {
		id, err := uuid.Parse(tradeIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid trade ID"})
			return
		}
		tradeID = &id
	}
	
	status := c.Query("status")
	
	disputes, err := h.p2pService.GetDisputes(c.Request.Context(), tradeID, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get P2P disputes")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get disputes"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": disputes})
}

func (h *P2pHandler) ResolveDispute(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid dispute ID"})
		return
	}
	
	var request struct {
		Resolution string `json:"resolution"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.p2pService.ResolveDispute(c.Request.Context(), id, request.Resolution)
	if err != nil {
		h.logger.WithError(err).Error("Failed to resolve P2P dispute")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to resolve dispute"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Dispute resolved successfully"})
}
