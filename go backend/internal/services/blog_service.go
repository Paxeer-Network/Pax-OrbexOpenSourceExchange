package services

import (
	"context"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/internal/models"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type BlogService struct {
	mysql  *database.MySQL
	logger *logrus.Logger
}

func NewBlogService(mysql *database.MySQL, logger *logrus.Logger) *BlogService {
	return &BlogService{
		mysql:  mysql,
		logger: logger,
	}
}

func (s *BlogService) GetPosts(ctx context.Context, category, tag, status string, limit, offset int) ([]*models.BlogPostResponse, error) {
	query := `SELECT id, title, slug, content, excerpt, authorId, categoryId, tags, status, 
			  featuredImage, metadata, publishedAt, createdAt, updatedAt 
			  FROM blog_post WHERE 1=1`
	args := []interface{}{}

	if category != "" {
		query += " AND categoryId = ?"
		args = append(args, category)
	}

	if tag != "" {
		query += " AND JSON_CONTAINS(tags, ?)"
		args = append(args, fmt.Sprintf(`"%s"`, tag))
	}

	if status != "" {
		query += " AND status = ?"
		args = append(args, status)
	}

	query += " ORDER BY publishedAt DESC, createdAt DESC LIMIT ? OFFSET ?"
	args = append(args, limit, offset)

	rows, err := s.mysql.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query blog posts: %w", err)
	}
	defer rows.Close()

	var posts []*models.BlogPostResponse
	for rows.Next() {
		post := &models.BlogPost{}
		err := rows.Scan(&post.ID, &post.Title, &post.Slug, &post.Content, &post.Excerpt,
			&post.AuthorID, &post.CategoryID, &post.Tags, &post.Status, &post.FeaturedImage,
			&post.Metadata, &post.PublishedAt, &post.CreatedAt, &post.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan blog post: %w", err)
		}
		posts = append(posts, post.ToResponse())
	}

	return posts, nil
}

func (s *BlogService) GetPostBySlug(ctx context.Context, slug string) (*models.BlogPostResponse, error) {
	query := `SELECT id, title, slug, content, excerpt, authorId, categoryId, tags, status, 
			  featuredImage, metadata, publishedAt, createdAt, updatedAt 
			  FROM blog_post WHERE slug = ? AND status = 'PUBLISHED'`

	post := &models.BlogPost{}
	err := s.mysql.Get(post, query, slug)
	if err != nil {
		return nil, fmt.Errorf("blog post not found: %w", err)
	}

	return post.ToResponse(), nil
}

func (s *BlogService) GetCategories(ctx context.Context) ([]*models.BlogCategoryResponse, error) {
	query := `SELECT id, name, slug, description, postCount FROM blog_category ORDER BY name ASC`

	rows, err := s.mysql.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query blog categories: %w", err)
	}
	defer rows.Close()

	var categories []*models.BlogCategoryResponse
	for rows.Next() {
		category := &models.BlogCategory{}
		err := rows.Scan(&category.ID, &category.Name, &category.Slug, &category.Description, &category.PostCount)
		if err != nil {
			return nil, fmt.Errorf("failed to scan blog category: %w", err)
		}
		categories = append(categories, category.ToResponse())
	}

	return categories, nil
}

func (s *BlogService) GetTags(ctx context.Context) ([]*models.BlogTagResponse, error) {
	query := `SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(tags, CONCAT('$[', idx, ']'))) as tag
			  FROM blog_post 
			  CROSS JOIN JSON_TABLE(JSON_ARRAY(0,1,2,3,4,5,6,7,8,9), '$[*]' COLUMNS (idx INT PATH '$')) AS t
			  WHERE JSON_EXTRACT(tags, CONCAT('$[', idx, ']')) IS NOT NULL
			  ORDER BY tag ASC`

	rows, err := s.mysql.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query blog tags: %w", err)
	}
	defer rows.Close()

	var tags []*models.BlogTagResponse
	for rows.Next() {
		var tag string
		err := rows.Scan(&tag)
		if err != nil {
			return nil, fmt.Errorf("failed to scan blog tag: %w", err)
		}
		tags = append(tags, &models.BlogTagResponse{Name: tag})
	}

	return tags, nil
}

func (s *BlogService) CreateComment(ctx context.Context, userID, postID uuid.UUID, req *models.CreateCommentRequest) (*models.BlogCommentResponse, error) {
	comment := &models.BlogComment{
		ID:        uuid.New(),
		PostID:    postID,
		UserID:    userID,
		Content:   req.Content,
		Status:    "PENDING",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	query := `INSERT INTO blog_comment (id, postId, userId, content, status, createdAt, updatedAt) 
			  VALUES (?, ?, ?, ?, ?, ?, ?)`

	_, err := s.mysql.Exec(query, comment.ID, comment.PostID, comment.UserID,
		comment.Content, comment.Status, comment.CreatedAt, comment.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create blog comment: %w", err)
	}

	return comment.ToResponse(), nil
}

func (s *BlogService) GetComments(ctx context.Context, postID uuid.UUID, limit, offset int) ([]*models.BlogCommentResponse, error) {
	query := `SELECT id, postId, userId, content, status, createdAt, updatedAt 
			  FROM blog_comment WHERE postId = ? AND status = 'APPROVED' 
			  ORDER BY createdAt ASC LIMIT ? OFFSET ?`

	rows, err := s.mysql.Query(query, postID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query blog comments: %w", err)
	}
	defer rows.Close()

	var comments []*models.BlogCommentResponse
	for rows.Next() {
		comment := &models.BlogComment{}
		err := rows.Scan(&comment.ID, &comment.PostID, &comment.UserID, &comment.Content,
			&comment.Status, &comment.CreatedAt, &comment.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan blog comment: %w", err)
		}
		comments = append(comments, comment.ToResponse())
	}

	return comments, nil
}
