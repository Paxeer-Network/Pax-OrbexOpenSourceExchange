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

type IcoHandler struct {
	icoService *services.IcoService
	logger     *logrus.Logger
}

func NewIcoHandler(icoService *services.IcoService, logger *logrus.Logger) *IcoHandler {
	return &IcoHandler{
		icoService: icoService,
		logger:     logger,
	}
}

func (h *IcoHandler) GetProjects(c *gin.Context) {
	status := c.Query("status")
	
	projects, err := h.icoService.GetProjects(c.Request.Context(), status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ICO projects")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get projects"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": projects})
}

func (h *IcoHandler) GetProject(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}
	
	project, err := h.icoService.GetProject(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ICO project")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get project"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": project})
}

func (h *IcoHandler) CreateProject(c *gin.Context) {
	var project models.IcoProject
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.icoService.CreateProject(c.Request.Context(), &project)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create ICO project")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": project})
}

func (h *IcoHandler) UpdateProject(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.icoService.UpdateProject(c.Request.Context(), id, updates)
	if err != nil {
		h.logger.WithError(err).Error("Failed to update ICO project")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update project"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Project updated successfully"})
}

func (h *IcoHandler) DeleteProject(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}
	
	err = h.icoService.DeleteProject(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to delete ICO project")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete project"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}

func (h *IcoHandler) GetTokens(c *gin.Context) {
	var projectID *uuid.UUID
	if projectIDStr := c.Query("projectId"); projectIDStr != "" {
		id, err := uuid.Parse(projectIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
			return
		}
		projectID = &id
	}
	
	tokens, err := h.icoService.GetTokens(c.Request.Context(), projectID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ICO tokens")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get tokens"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": tokens})
}

func (h *IcoHandler) GetToken(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token ID"})
		return
	}
	
	token, err := h.icoService.GetToken(c.Request.Context(), id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ICO token")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get token"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": token})
}

func (h *IcoHandler) CreateToken(c *gin.Context) {
	var token models.IcoToken
	if err := c.ShouldBindJSON(&token); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.icoService.CreateToken(c.Request.Context(), &token)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create ICO token")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": token})
}

func (h *IcoHandler) GetPhases(c *gin.Context) {
	var tokenID *uuid.UUID
	if tokenIDStr := c.Query("tokenId"); tokenIDStr != "" {
		id, err := uuid.Parse(tokenIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token ID"})
			return
		}
		tokenID = &id
	}
	
	status := c.Query("status")
	
	phases, err := h.icoService.GetPhases(c.Request.Context(), tokenID, status)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ICO phases")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get phases"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": phases})
}

func (h *IcoHandler) CreatePhase(c *gin.Context) {
	var phase models.IcoPhase
	if err := c.ShouldBindJSON(&phase); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err := h.icoService.CreatePhase(c.Request.Context(), &phase)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create ICO phase")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create phase"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": phase})
}

func (h *IcoHandler) GetContributions(c *gin.Context) {
	var userID *uuid.UUID
	if userIDStr := c.Query("userId"); userIDStr != "" {
		id, err := uuid.Parse(userIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}
		userID = &id
	}
	
	var phaseID *uuid.UUID
	if phaseIDStr := c.Query("phaseId"); phaseIDStr != "" {
		id, err := uuid.Parse(phaseIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid phase ID"})
			return
		}
		phaseID = &id
	}
	
	contributions, err := h.icoService.GetContributions(c.Request.Context(), userID, phaseID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get ICO contributions")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get contributions"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": contributions})
}
