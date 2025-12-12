package models

import (
	"time"

	"github.com/google/uuid"
)

type BlogPost struct {
	ID            uuid.UUID              `json:"id" db:"id"`
	Title         string                 `json:"title" db:"title"`
	Slug          string                 `json:"slug" db:"slug"`
	Content       string                 `json:"content" db:"content"`
	Excerpt       string                 `json:"excerpt" db:"excerpt"`
	AuthorID      uuid.UUID              `json:"authorId" db:"authorId"`
	CategoryID    uuid.UUID              `json:"categoryId" db:"categoryId"`
	Tags          []string               `json:"tags" db:"tags"`
	Status        string                 `json:"status" db:"status"`
	FeaturedImage *string                `json:"featuredImage" db:"featuredImage"`
	Metadata      map[string]interface{} `json:"metadata" db:"metadata"`
	PublishedAt   *time.Time             `json:"publishedAt" db:"publishedAt"`
	CreatedAt     time.Time              `json:"createdAt" db:"createdAt"`
	UpdatedAt     time.Time              `json:"updatedAt" db:"updatedAt"`
}

type BlogCategory struct {
	ID          uuid.UUID `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Slug        string    `json:"slug" db:"slug"`
	Description string    `json:"description" db:"description"`
	PostCount   int       `json:"postCount" db:"postCount"`
}

type BlogComment struct {
	ID        uuid.UUID `json:"id" db:"id"`
	PostID    uuid.UUID `json:"postId" db:"postId"`
	UserID    uuid.UUID `json:"userId" db:"userId"`
	Content   string    `json:"content" db:"content"`
	Status    string    `json:"status" db:"status"`
	CreatedAt time.Time `json:"createdAt" db:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" db:"updatedAt"`
}

type CreateCommentRequest struct {
	Content string `json:"content"`
}

type BlogPostResponse struct {
	ID            uuid.UUID              `json:"id"`
	Title         string                 `json:"title"`
	Slug          string                 `json:"slug"`
	Content       string                 `json:"content"`
	Excerpt       string                 `json:"excerpt"`
	AuthorID      uuid.UUID              `json:"authorId"`
	CategoryID    uuid.UUID              `json:"categoryId"`
	Tags          []string               `json:"tags"`
	Status        string                 `json:"status"`
	FeaturedImage *string                `json:"featuredImage"`
	Metadata      map[string]interface{} `json:"metadata"`
	PublishedAt   *time.Time             `json:"publishedAt"`
	CreatedAt     time.Time              `json:"createdAt"`
	UpdatedAt     time.Time              `json:"updatedAt"`
}

type BlogCategoryResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Description string    `json:"description"`
	PostCount   int       `json:"postCount"`
}

type BlogTagResponse struct {
	Name string `json:"name"`
}

type BlogCommentResponse struct {
	ID        uuid.UUID `json:"id"`
	PostID    uuid.UUID `json:"postId"`
	UserID    uuid.UUID `json:"userId"`
	Content   string    `json:"content"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func (b *BlogPost) ToResponse() *BlogPostResponse {
	return &BlogPostResponse{
		ID:            b.ID,
		Title:         b.Title,
		Slug:          b.Slug,
		Content:       b.Content,
		Excerpt:       b.Excerpt,
		AuthorID:      b.AuthorID,
		CategoryID:    b.CategoryID,
		Tags:          b.Tags,
		Status:        b.Status,
		FeaturedImage: b.FeaturedImage,
		Metadata:      b.Metadata,
		PublishedAt:   b.PublishedAt,
		CreatedAt:     b.CreatedAt,
		UpdatedAt:     b.UpdatedAt,
	}
}

func (b *BlogCategory) ToResponse() *BlogCategoryResponse {
	return &BlogCategoryResponse{
		ID:          b.ID,
		Name:        b.Name,
		Slug:        b.Slug,
		Description: b.Description,
		PostCount:   b.PostCount,
	}
}

func (b *BlogComment) ToResponse() *BlogCommentResponse {
	return &BlogCommentResponse{
		ID:        b.ID,
		PostID:    b.PostID,
		UserID:    b.UserID,
		Content:   b.Content,
		Status:    b.Status,
		CreatedAt: b.CreatedAt,
		UpdatedAt: b.UpdatedAt,
	}
}
