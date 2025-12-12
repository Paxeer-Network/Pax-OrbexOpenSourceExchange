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

type EcommerceHandler struct {
	ecommerceService *services.EcommerceService
	logger           *logrus.Logger
}

func NewEcommerceHandler(ecommerceService *services.EcommerceService, logger *logrus.Logger) *EcommerceHandler {
	return &EcommerceHandler{
		ecommerceService: ecommerceService,
		logger:           logger,
	}
}

func (h *EcommerceHandler) GetCategories(c *gin.Context) {
	categories, err := h.ecommerceService.GetCategories(c.Request.Context())
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecommerce categories")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get categories"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": categories})
}

func (h *EcommerceHandler) CreateCategory(c *gin.Context) {
	var category models.EcommerceCategory
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.ecommerceService.CreateCategory(c.Request.Context(), &category)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create ecommerce category")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": category})
}

func (h *EcommerceHandler) GetProducts(c *gin.Context) {
	var categoryID *uuid.UUID
	if categoryIDStr := c.Query("categoryId"); categoryIDStr != "" {
		id, err := uuid.Parse(categoryIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
			return
		}
		categoryID = &id
	}
	
	var status *bool
	if statusStr := c.Query("status"); statusStr != "" {
		s, err := strconv.ParseBool(statusStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
			return
		}
		status = &s
	}
	
	products, err := h.ecommerceService.GetProducts(c.Request.Context(), categoryID, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecommerce products")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get products"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": products})
}

func (h *EcommerceHandler) GetProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}
	
	product, err := h.ecommerceService.GetProduct(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecommerce product")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get product"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": product})
}

func (h *EcommerceHandler) CreateProduct(c *gin.Context) {
	var product models.EcommerceProduct
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.ecommerceService.CreateProduct(c.Request.Context(), &product)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create ecommerce product")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": product})
}

func (h *EcommerceHandler) UpdateProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.ecommerceService.UpdateProduct(c.Request.Context(), id, updates)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update ecommerce product")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Product updated successfully"})
}

func (h *EcommerceHandler) GetOrders(c *gin.Context) {
	var userID *uuid.UUID
	if userIDStr := c.Query("userId"); userIDStr != "" {
		id, err := uuid.Parse(userIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}
		userID = &id
	}
	
	status := c.Query("status")
	
	orders, err := h.ecommerceService.GetOrders(c.Request.Context(), userID, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecommerce orders")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get orders"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": orders})
}

func (h *EcommerceHandler) GetOrder(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}
	
	order, err := h.ecommerceService.GetOrder(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecommerce order")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get order"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": order})
}

func (h *EcommerceHandler) UpdateOrderStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}
	
	var request struct {
		Status string `json:"status"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.ecommerceService.UpdateOrderStatus(c.Request.Context(), id, request.Status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update order status")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Order status updated successfully"})
}

func (h *EcommerceHandler) GetReviews(c *gin.Context) {
	var productID *uuid.UUID
	if productIDStr := c.Query("productId"); productIDStr != "" {
		id, err := uuid.Parse(productIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
			return
		}
		productID = &id
	}
	
	var userID *uuid.UUID
	if userIDStr := c.Query("userId"); userIDStr != "" {
		id, err := uuid.Parse(userIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}
		userID = &id
	}
	
	reviews, err := h.ecommerceService.GetReviews(c.Request.Context(), productID, userID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecommerce reviews")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get reviews"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": reviews})
}

func (h *EcommerceHandler) GetDiscounts(c *gin.Context) {
	var productID *uuid.UUID
	if productIDStr := c.Query("productId"); productIDStr != "" {
		id, err := uuid.Parse(productIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
			return
		}
		productID = &id
	}
	
	code := c.Query("code")
	
	discounts, err := h.ecommerceService.GetDiscounts(c.Request.Context(), productID, code)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ecommerce discounts")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get discounts"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": discounts})
}

func (h *EcommerceHandler) CreateDiscount(c *gin.Context) {
	var discount models.EcommerceDiscount
	if err := c.ShouldBindJSON(&discount); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.ecommerceService.CreateDiscount(c.Request.Context(), &discount)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create ecommerce discount")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create discount"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": discount})
}
