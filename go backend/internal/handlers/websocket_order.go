package handlers

import (
	"context"
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/sirupsen/logrus"
)

type OrderHandler struct {
	orderService   *services.OrderService
	walletService  *services.WalletService
	hub           *WebSocketHub
	logger        *logrus.Logger
	trackedOrders map[string][]*TrackedOrder
	watchedUsers  map[string]bool
	mu            sync.RWMutex
	ticker        *time.Ticker
	stopChan      chan bool
}

type TrackedOrder struct {
	ID        uuid.UUID       `json:"id"`
	Status    string          `json:"status"`
	Price     decimal.Decimal `json:"price"`
	Amount    decimal.Decimal `json:"amount"`
	Filled    decimal.Decimal `json:"filled"`
	Remaining decimal.Decimal `json:"remaining"`
	Timestamp time.Time       `json:"timestamp"`
	Cost      decimal.Decimal `json:"cost"`
}

var orderHandlerInstance *OrderHandler
var orderHandlerOnce sync.Once

func GetOrderHandler(orderService *services.OrderService, walletService *services.WalletService, hub *WebSocketHub, logger *logrus.Logger) *OrderHandler {
	orderHandlerOnce.Do(func() {
		orderHandlerInstance = &OrderHandler{
			orderService:  orderService,
			walletService: walletService,
			hub:          hub,
			logger:       logger,
			trackedOrders: make(map[string][]*TrackedOrder),
			watchedUsers:  make(map[string]bool),
			stopChan:     make(chan bool),
		}
		go orderHandlerInstance.startOrderTracking()
	})
	return orderHandlerInstance
}

func (oh *OrderHandler) startOrderTracking() {
	oh.ticker = time.NewTicker(1 * time.Second)
	defer oh.ticker.Stop()

	for {
		select {
		case <-oh.ticker.C:
			oh.flushOrders()
		case <-oh.stopChan:
			return
		}
	}
}

func (oh *OrderHandler) flushOrders() {
	oh.mu.Lock()
	defer oh.mu.Unlock()

	if len(oh.trackedOrders) == 0 {
		return
	}

	for userID, orders := range oh.trackedOrders {
		if len(orders) > 0 {
			filteredOrders := oh.filterValidOrders(orders)
			deduplicatedOrders := oh.deduplicateOrders(filteredOrders)

			if len(deduplicatedOrders) > 0 {
				message := map[string]interface{}{
					"stream": "orders",
					"data":   deduplicatedOrders,
				}

				messageBytes, err := json.Marshal(message)
				if err != nil {
					oh.logger.WithError(err).Error("Failed to marshal order message")
					continue
				}

				userUUID, err := uuid.Parse(userID)
				if err != nil {
					oh.logger.WithError(err).Error("Invalid user ID")
					continue
				}

				oh.hub.BroadcastToUser(userUUID, messageBytes)
			}
		}
	}

	oh.trackedOrders = make(map[string][]*TrackedOrder)
}

func (oh *OrderHandler) filterValidOrders(orders []*TrackedOrder) []*TrackedOrder {
	var filtered []*TrackedOrder
	for _, order := range orders {
		if !order.Price.IsZero() && !order.Amount.IsZero() &&
			!order.Filled.IsNegative() && !order.Remaining.IsNegative() &&
			!order.Timestamp.IsZero() {
			filtered = append(filtered, order)
		}
	}
	return filtered
}

func (oh *OrderHandler) deduplicateOrders(orders []*TrackedOrder) []*TrackedOrder {
	seen := make(map[uuid.UUID]bool)
	var deduplicated []*TrackedOrder

	for _, order := range orders {
		if !seen[order.ID] {
			seen[order.ID] = true
			deduplicated = append(deduplicated, order)
		}
	}

	return deduplicated
}

func (oh *OrderHandler) AddUserToWatchlist(userID string) {
	oh.mu.Lock()
	defer oh.mu.Unlock()

	if !oh.watchedUsers[userID] {
		oh.watchedUsers[userID] = true
		if oh.trackedOrders[userID] == nil {
			oh.trackedOrders[userID] = make([]*TrackedOrder, 0)
		}
	}
}

func (oh *OrderHandler) RemoveUserFromWatchlist(userID string) {
	oh.mu.Lock()
	defer oh.mu.Unlock()

	if oh.watchedUsers[userID] {
		delete(oh.watchedUsers, userID)
		delete(oh.trackedOrders, userID)
	}
}

func (oh *OrderHandler) AddOrderToTrackedOrders(userID string, order *TrackedOrder) {
	oh.mu.Lock()
	defer oh.mu.Unlock()

	if oh.trackedOrders[userID] == nil {
		oh.trackedOrders[userID] = make([]*TrackedOrder, 0)
	}

	oh.trackedOrders[userID] = append(oh.trackedOrders[userID], order)
}

func (oh *OrderHandler) RemoveOrderFromTrackedOrders(userID string, orderID uuid.UUID) {
	oh.mu.Lock()
	defer oh.mu.Unlock()

	if orders, exists := oh.trackedOrders[userID]; exists {
		filtered := make([]*TrackedOrder, 0)
		for _, order := range orders {
			if order.ID != orderID {
				filtered = append(filtered, order)
			}
		}
		oh.trackedOrders[userID] = filtered

		if len(oh.trackedOrders[userID]) == 0 {
			oh.RemoveUserFromWatchlist(userID)
		}
	}
}

func (oh *OrderHandler) HandleOrderWebSocketMessage(userID uuid.UUID, message map[string]interface{}) error {
	userIDStr := userID.String()

	if !oh.watchedUsers[userIDStr] {
		oh.AddUserToWatchlist(userIDStr)
	} else {
		return nil
	}

	ctx := context.Background()
	userOrders, err := oh.orderService.GetOrders(ctx, userID, "OPEN", 100, 0)
	if err != nil {
		oh.logger.WithError(err).Error("Failed to get user orders")
		return err
	}

	if len(userOrders) == 0 {
		oh.RemoveUserFromWatchlist(userIDStr)
		return nil
	}

	go oh.fetchOrdersForUser(ctx, userID, userOrders)

	return nil
}

func (oh *OrderHandler) fetchOrdersForUser(ctx context.Context, userID uuid.UUID, userOrders []*models.OrderResponse) {
	userIDStr := userID.String()

	for oh.watchedUsers[userIDStr] && len(userOrders) > 0 {
		time.Sleep(5 * time.Second)

		for i := len(userOrders) - 1; i >= 0; i-- {
			order := userOrders[i]

			updatedOrder, err := oh.orderService.GetOrder(ctx, userID, order.ID)
			if err != nil {
				oh.logger.WithError(err).Error("Failed to get updated order")
				continue
			}

			if updatedOrder.Status != order.Status {
				trackedOrder := &TrackedOrder{
					ID:        updatedOrder.ID,
					Status:    updatedOrder.Status,
					Price:     updatedOrder.Price,
					Amount:    updatedOrder.Amount,
					Filled:    updatedOrder.Filled,
					Remaining: updatedOrder.Remaining,
					Timestamp: updatedOrder.UpdatedAt,
					Cost:      updatedOrder.Cost,
				}

				oh.AddOrderToTrackedOrders(userIDStr, trackedOrder)

				if updatedOrder.Status == "CLOSED" || updatedOrder.Status == "CANCELED" {
					if updatedOrder.Status == "CLOSED" {
						err := oh.updateWalletBalance(ctx, userID, updatedOrder)
						if err != nil {
							oh.logger.WithError(err).Error("Failed to update wallet balance")
						}
					}

					userOrders = append(userOrders[:i], userOrders[i+1:]...)
				} else {
					order.Status = updatedOrder.Status
				}
			}
		}

		if len(userOrders) == 0 {
			oh.RemoveUserFromWatchlist(userIDStr)
			break
		}
	}
}

func (oh *OrderHandler) updateWalletBalance(ctx context.Context, userID uuid.UUID, order *models.OrderResponse) error {
	symbol := order.Symbol
	parts := parseSymbol(symbol)
	if len(parts) != 2 {
		return fmt.Errorf("invalid symbol format: %s", symbol)
	}

	currency := parts[0]
	pair := parts[1]

	if order.Side == "BUY" {
		currencyWallet, err := oh.walletService.GetOrCreateWallet(ctx, userID, currency, models.WalletTypeSpot)
		if err != nil {
			return fmt.Errorf("failed to get currency wallet: %w", err)
		}

		netAmount := order.Amount.Sub(order.Fee)
		err = oh.walletService.UpdateBalance(ctx, currencyWallet.ID, netAmount)
		if err != nil {
			return fmt.Errorf("failed to update currency wallet balance: %w", err)
		}
	} else {
		pairWallet, err := oh.walletService.GetOrCreateWallet(ctx, userID, pair, models.WalletTypeSpot)
		if err != nil {
			return fmt.Errorf("failed to get pair wallet: %w", err)
		}

		proceeds := order.Amount.Mul(order.Price)
		netProceeds := proceeds.Sub(order.Fee)
		err = oh.walletService.UpdateBalance(ctx, pairWallet.ID, netProceeds)
		if err != nil {
			return fmt.Errorf("failed to update pair wallet balance: %w", err)
		}
	}

	return nil
}

func parseSymbol(symbol string) []string {
	for i := 1; i < len(symbol); i++ {
		if symbol[i] == '/' {
			return []string{symbol[:i], symbol[i+1:]}
		}
	}
	return []string{symbol}
}

func (oh *OrderHandler) Stop() {
	close(oh.stopChan)
}
