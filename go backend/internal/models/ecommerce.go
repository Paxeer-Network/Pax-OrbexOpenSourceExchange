package models

import (
	"time"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type EcommerceCategory struct {
	ID          uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	Image       string    `json:"image"`
	Status      bool      `json:"status" gorm:"default:true"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	
	EcommerceProducts []EcommerceProduct `json:"ecommerceProducts" gorm:"foreignKey:CategoryID"`
}

type EcommerceProduct struct {
	ID          uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	CategoryID  uuid.UUID `json:"categoryId" gorm:"type:char(36);not null"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	Type        string    `json:"type" gorm:"not null"`
	Price       decimal.Decimal `json:"price" gorm:"type:decimal(65,30)"`
	Currency    string    `json:"currency" gorm:"not null"`
	Image       string    `json:"image"`
	Images      string    `json:"images" gorm:"type:json"`
	Inventory   int       `json:"inventory" gorm:"default:0"`
	FilePath    string    `json:"filePath"`
	FileSize    int64     `json:"fileSize"`
	WalletType  string    `json:"walletType"`
	Status      bool      `json:"status" gorm:"default:true"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	
	Category          EcommerceCategory   `json:"category" gorm:"foreignKey:CategoryID"`
	EcommerceReviews  []EcommerceReview   `json:"ecommerceReviews" gorm:"foreignKey:ProductID"`
	EcommerceDiscounts []EcommerceDiscount `json:"ecommerceDiscounts" gorm:"foreignKey:ProductID"`
	Orders            []EcommerceOrder    `json:"orders" gorm:"many2many:ecommerce_order_items;"`
	Wishlists         []EcommerceWishlist `json:"wishlists" gorm:"many2many:ecommerce_wishlist_items;"`
}

type EcommerceOrder struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	UserID    uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	Status    string    `json:"status" gorm:"default:'PENDING'"`
	Total     decimal.Decimal `json:"total" gorm:"type:decimal(65,30)"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	User                      User                        `json:"user" gorm:"foreignKey:UserID"`
	Products                  []EcommerceProduct          `json:"products" gorm:"many2many:ecommerce_order_items;"`
	EcommerceOrderItems       []EcommerceOrderItem        `json:"ecommerceOrderItems" gorm:"foreignKey:OrderID"`
	EcommerceShippingAddress  *EcommerceShippingAddress   `json:"shippingAddress" gorm:"foreignKey:OrderID"`
	EcommerceShipping         *EcommerceShipping          `json:"shipping" gorm:"foreignKey:OrderID"`
}

type EcommerceOrderItem struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	OrderID   uuid.UUID `json:"orderId" gorm:"type:char(36);not null"`
	ProductID uuid.UUID `json:"productId" gorm:"type:char(36);not null"`
	Quantity  int       `json:"quantity" gorm:"not null"`
	Key       string    `json:"key"`
	FilePath  string    `json:"filePath"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	Order   EcommerceOrder   `json:"order" gorm:"foreignKey:OrderID"`
	Product EcommerceProduct `json:"product" gorm:"foreignKey:ProductID"`
}

type EcommerceReview struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	UserID    uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	ProductID uuid.UUID `json:"productId" gorm:"type:char(36);not null"`
	Rating    int       `json:"rating" gorm:"not null"`
	Comment   string    `json:"comment"`
	Status    bool      `json:"status" gorm:"default:true"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	User    User             `json:"user" gorm:"foreignKey:UserID"`
	Product EcommerceProduct `json:"product" gorm:"foreignKey:ProductID"`
}

type EcommerceDiscount struct {
	ID         uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	ProductID  uuid.UUID `json:"productId" gorm:"type:char(36);not null"`
	Code       string    `json:"code" gorm:"not null;uniqueIndex"`
	Percentage decimal.Decimal `json:"percentage" gorm:"type:decimal(5,2)"`
	ValidUntil time.Time `json:"validUntil"`
	Status     bool      `json:"status" gorm:"default:true"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
	
	Product EcommerceProduct `json:"product" gorm:"foreignKey:ProductID"`
}

type EcommerceShipping struct {
	ID         uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	OrderID    uuid.UUID `json:"orderId" gorm:"type:char(36);not null"`
	TrackingID string    `json:"trackingId"`
	Carrier    string    `json:"carrier"`
	LoadStatus string    `json:"loadStatus" gorm:"default:'PENDING'"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
	
	Order              EcommerceOrder       `json:"order" gorm:"foreignKey:OrderID"`
	EcommerceOrders    []EcommerceOrder     `json:"ecommerceOrders" gorm:"foreignKey:ID;references:ID"`
}

type EcommerceShippingAddress struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	OrderID   uuid.UUID `json:"orderId" gorm:"type:char(36);not null"`
	Name      string    `json:"name" gorm:"not null"`
	Address   string    `json:"address" gorm:"not null"`
	City      string    `json:"city" gorm:"not null"`
	State     string    `json:"state" gorm:"not null"`
	Country   string    `json:"country" gorm:"not null"`
	ZipCode   string    `json:"zipCode" gorm:"not null"`
	Phone     string    `json:"phone"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	Order EcommerceOrder `json:"order" gorm:"foreignKey:OrderID"`
}

type EcommerceWishlist struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	UserID    uuid.UUID `json:"userId" gorm:"type:char(36);not null"`
	Name      string    `json:"name" gorm:"not null"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	
	User                    User                      `json:"user" gorm:"foreignKey:UserID"`
	Products                []EcommerceProduct        `json:"products" gorm:"many2many:ecommerce_wishlist_items;"`
	EcommerceWishlistItems  []EcommerceWishlistItem   `json:"ecommerceWishlistItems" gorm:"foreignKey:WishlistID"`
}

type EcommerceWishlistItem struct {
	ID         uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	WishlistID uuid.UUID `json:"wishlistId" gorm:"type:char(36);not null"`
	ProductID  uuid.UUID `json:"productId" gorm:"type:char(36);not null"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
	
	Wishlist EcommerceWishlist `json:"wishlist" gorm:"foreignKey:WishlistID"`
	Product  EcommerceProduct  `json:"product" gorm:"foreignKey:ProductID"`
}
