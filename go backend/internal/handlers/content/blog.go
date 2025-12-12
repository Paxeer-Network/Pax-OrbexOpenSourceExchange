package content

import (
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type BlogHandler struct {
	blogService *services.BlogService
	logger      *logrus.Logger
}

func NewBlogHandler(blogService *services.BlogService, logger *logrus.Logger) *BlogHandler {
	return &BlogHandler{
		blogService: blogService,
		logger:      logger,
	}
}

func (h *BlogHandler) GetPosts(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "20")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 20
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}

	category := c.Query("category")
	tag := c.Query("tag")
	status := c.DefaultQuery("status", "PUBLISHED")

	posts, err := h.blogService.GetPosts(c.Request.Context(), category, tag, status, limit, offset)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get blog posts")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get posts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": posts})
}

func (h *BlogHandler) GetPost(c *gin.Context) {
	slug := c.Param("slug")

	post, err := h.blogService.GetPostBySlug(c.Request.Context(), slug)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get blog post")
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": post})
}

func (h *BlogHandler) GetCategories(c *gin.Context) {
	categories, err := h.blogService.GetCategories(c.Request.Context())
	if err != nil {
		h.logger.WithError(err).Error("Failed to get blog categories")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get categories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": categories})
}

func (h *BlogHandler) GetTags(c *gin.Context) {
	tags, err := h.blogService.GetTags(c.Request.Context())
	if err != nil {
		h.logger.WithError(err).Error("Failed to get blog tags")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get tags"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tags})
}

func (h *BlogHandler) CreateComment(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	uid, ok := userID.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	postIDStr := c.Param("postId")
	postID, err := uuid.Parse(postIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	var request models.CreateCommentRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	comment, err := h.blogService.CreateComment(c.Request.Context(), uid, postID, &request)
	if err != nil {
		h.logger.WithError(err).Error("Failed to create comment")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": comment})
}

func (h *BlogHandler) GetComments(c *gin.Context) {
	postIDStr := c.Param("postId")
	postID, err := uuid.Parse(postIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	limitStr := c.DefaultQuery("limit", "50")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 50
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}

	comments, err := h.blogService.GetComments(c.Request.Context(), postID, limit, offset)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get comments")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get comments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": comments})
}
