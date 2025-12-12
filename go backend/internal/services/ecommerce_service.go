package services

import (
	"context"
	"crypto-exchange-go/internal/models"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type EcommerceService struct {
	db     *gorm.DB
	logger *logrus.Logger
}

func NewEcommerceService(db *gorm.DB, logger *logrus.Logger) *EcommerceService {
	return &EcommerceService{
		db:     db,
		logger: logger,
	}
}

func (s *EcommerceService) GetCategories(ctx context.Context) ([]models.EcommerceCategory, error) {
	var categories []models.EcommerceCategory
	err := s.db.WithContext(ctx).Where("status = ?", true).Find(&categories).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ecommerce categories")
		return nil, err
	}
	
	return categories, nil
}

func (s *EcommerceService) CreateCategory(ctx context.Context, category *models.EcommerceCategory) error {
	category.ID = uuid.New()
	category.CreatedAt = time.Now()
	category.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(category).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create ecommerce category")
		return err
	}
	
	return nil
}

func (s *EcommerceService) GetProducts(ctx context.Context, categoryID *uuid.UUID, status *bool) ([]models.EcommerceProduct, error) {
	var products []models.EcommerceProduct
	query := s.db.WithContext(ctx).
		Preload("Category").
		Preload("EcommerceReviews")
	
	if categoryID != nil {
		query = query.Where("category_id = ?", *categoryID)
	}
	
	if status != nil {
		query = query.Where("status = ?", *status)
	}
	
	err := query.Find(&products).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ecommerce products")
		return nil, err
	}
	
	return products, nil
}

func (s *EcommerceService) GetProduct(ctx context.Context, id uuid.UUID) (*models.EcommerceProduct, error) {
	var product models.EcommerceProduct
	err := s.db.WithContext(ctx).
		Preload("Category").
		Preload("EcommerceReviews.User").
		Preload("EcommerceDiscounts").
		First(&product, "id = ?", id).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("productId", id).Error("Failed to get ecommerce product")
		return nil, err
	}
	
	return &product, nil
}

func (s *EcommerceService) CreateProduct(ctx context.Context, product *models.EcommerceProduct) error {
	var existingProduct models.EcommerceProduct
	err := s.db.WithContext(ctx).Where("name = ?", product.Name).First(&existingProduct).Error
	if err == nil {
		return gorm.ErrDuplicatedKey
	}
	
	product.ID = uuid.New()
	product.CreatedAt = time.Now()
	product.UpdatedAt = time.Now()
	
	err = s.db.WithContext(ctx).Create(product).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create ecommerce product")
		return err
	}
	
	return nil
}

func (s *EcommerceService) UpdateProduct(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	updates["updated_at"] = time.Now()
	
	err := s.db.WithContext(ctx).Model(&models.EcommerceProduct{}).
		Where("id = ?", id).Updates(updates).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("productId", id).Error("Failed to update ecommerce product")
		return err
	}
	
	return nil
}

func (s *EcommerceService) GetOrders(ctx context.Context, userID *uuid.UUID, status string) ([]models.EcommerceOrder, error) {
	var orders []models.EcommerceOrder
	query := s.db.WithContext(ctx).
		Preload("User").
		Preload("Products.Category").
		Preload("EcommerceOrderItems").
		Preload("EcommerceShippingAddress").
		Preload("EcommerceShipping")
	
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	err := query.Order("created_at DESC").Find(&orders).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ecommerce orders")
		return nil, err
	}
	
	return orders, nil
}

func (s *EcommerceService) GetOrder(ctx context.Context, id uuid.UUID) (*models.EcommerceOrder, error) {
	var order models.EcommerceOrder
	err := s.db.WithContext(ctx).
		Preload("User").
		Preload("Products.Category").
		Preload("EcommerceOrderItems.Product").
		Preload("EcommerceShippingAddress").
		Preload("EcommerceShipping").
		First(&order, "id = ?", id).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("orderId", id).Error("Failed to get ecommerce order")
		return nil, err
	}
	
	return &order, nil
}

func (s *EcommerceService) CreateOrder(ctx context.Context, order *models.EcommerceOrder, items []models.EcommerceOrderItem) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		order.ID = uuid.New()
		order.CreatedAt = time.Now()
		order.UpdatedAt = time.Now()
		order.Status = "PENDING"
		
		var total decimal.Decimal
		for _, item := range items {
			var product models.EcommerceProduct
			err := tx.First(&product, "id = ?", item.ProductID).Error
			if err != nil {
				return err
			}
			
			if product.Inventory < item.Quantity {
				return gorm.ErrInvalidData
			}
			
			itemTotal := product.Price.Mul(decimal.NewFromInt(int64(item.Quantity)))
			total = total.Add(itemTotal)
			
			err = tx.Model(&product).Update("inventory", product.Inventory-item.Quantity).Error
			if err != nil {
				return err
			}
		}
		
		order.Total = total
		err := tx.Create(order).Error
		if err != nil {
			return err
		}
		
		for _, item := range items {
			item.ID = uuid.New()
			item.OrderID = order.ID
			item.CreatedAt = time.Now()
			item.UpdatedAt = time.Now()
			
			err = tx.Create(&item).Error
			if err != nil {
				return err
			}
		}
		
		return nil
	})
}

func (s *EcommerceService) UpdateOrderStatus(ctx context.Context, id uuid.UUID, status string) error {
	err := s.db.WithContext(ctx).Model(&models.EcommerceOrder{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_at": time.Now(),
		}).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("orderId", id).Error("Failed to update order status")
		return err
	}
	
	return nil
}

func (s *EcommerceService) CreateReview(ctx context.Context, review *models.EcommerceReview) error {
	review.ID = uuid.New()
	review.CreatedAt = time.Now()
	review.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(review).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create ecommerce review")
		return err
	}
	
	return nil
}

func (s *EcommerceService) GetReviews(ctx context.Context, productID *uuid.UUID, userID *uuid.UUID) ([]models.EcommerceReview, error) {
	var reviews []models.EcommerceReview
	query := s.db.WithContext(ctx).
		Preload("User").
		Preload("Product.Category")
	
	if productID != nil {
		query = query.Where("product_id = ?", *productID)
	}
	
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}
	
	err := query.Order("created_at DESC").Find(&reviews).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ecommerce reviews")
		return nil, err
	}
	
	return reviews, nil
}

func (s *EcommerceService) CreateDiscount(ctx context.Context, discount *models.EcommerceDiscount) error {
	discount.ID = uuid.New()
	discount.CreatedAt = time.Now()
	discount.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(discount).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create ecommerce discount")
		return err
	}
	
	return nil
}

func (s *EcommerceService) GetDiscounts(ctx context.Context, productID *uuid.UUID, code string) ([]models.EcommerceDiscount, error) {
	var discounts []models.EcommerceDiscount
	query := s.db.WithContext(ctx).Preload("Product.Category")
	
	if productID != nil {
		query = query.Where("product_id = ?", *productID)
	}
	
	if code != "" {
		query = query.Where("code = ?", code)
	}
	
	err := query.Where("status = ? AND valid_until > ?", true, time.Now()).Find(&discounts).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to get ecommerce discounts")
		return nil, err
	}
	
	return discounts, nil
}

func (s *EcommerceService) CreateShipping(ctx context.Context, shipping *models.EcommerceShipping) error {
	shipping.ID = uuid.New()
	shipping.CreatedAt = time.Now()
	shipping.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(shipping).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create ecommerce shipping")
		return err
	}
	
	return nil
}

func (s *EcommerceService) UpdateShippingStatus(ctx context.Context, id uuid.UUID, status string) error {
	err := s.db.WithContext(ctx).Model(&models.EcommerceShipping{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"load_status": status,
			"updated_at":  time.Now(),
		}).Error
	
	if err != nil {
		s.logger.WithError(err).WithField("shippingId", id).Error("Failed to update shipping status")
		return err
	}
	
	return nil
}

func (s *EcommerceService) CreateShippingAddress(ctx context.Context, address *models.EcommerceShippingAddress) error {
	address.ID = uuid.New()
	address.CreatedAt = time.Now()
	address.UpdatedAt = time.Now()
	
	err := s.db.WithContext(ctx).Create(address).Error
	if err != nil {
		s.logger.WithError(err).Error("Failed to create shipping address")
		return err
	}
	
	return nil
}
