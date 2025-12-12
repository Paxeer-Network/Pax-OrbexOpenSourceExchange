package handlers

import (
	"context"
	"crypto-exchange-go/internal/middleware"
	"crypto-exchange-go/internal/models"
	"crypto-exchange-go/internal/services"
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

type WebSocketHub struct {
	clients    map[*WebSocketClient]bool
	register   chan *WebSocketClient
	unregister chan *WebSocketClient
	broadcast  chan []byte
	logger     *logrus.Logger
	mu         sync.RWMutex
}

type WebSocketClient struct {
	hub      *WebSocketHub
	conn     *websocket.Conn
	send     chan []byte
	userID   uuid.UUID
	symbols  map[string]bool
	mu       sync.RWMutex
}

type WebSocketMessage struct {
	Type    string      `json:"type"`
	Symbol  string      `json:"symbol,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	UserID  string      `json:"userId,omitempty"`
	Message string      `json:"message,omitempty"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func NewWebSocketHub(logger *logrus.Logger) *WebSocketHub {
	return &WebSocketHub{
		clients:    make(map[*WebSocketClient]bool),
		register:   make(chan *WebSocketClient),
		unregister: make(chan *WebSocketClient),
		broadcast:  make(chan []byte),
		logger:     logger,
	}
}

func (h *WebSocketHub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
			h.logger.WithField("userID", client.userID).Info("WebSocket client connected")

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
			h.mu.Unlock()
			h.logger.WithField("userID", client.userID).Info("WebSocket client disconnected")

		case message := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					delete(h.clients, client)
					close(client.send)
				}
			}
			h.mu.RUnlock()
		}
	}
}

func (h *WebSocketHub) BroadcastToUser(userID uuid.UUID, message []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	for client := range h.clients {
		if client.userID == userID {
			select {
			case client.send <- message:
			default:
				delete(h.clients, client)
				close(client.send)
			}
		}
	}
}

func (h *WebSocketHub) BroadcastToSymbol(symbol string, message []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	for client := range h.clients {
		client.mu.RLock()
		isWatching := client.symbols[symbol]
		client.mu.RUnlock()

		if isWatching {
			select {
			case client.send <- message:
			default:
				delete(h.clients, client)
				close(client.send)
			}
		}
	}
}

func (h *Handlers) HandleOrderWebSocket(hub *WebSocketHub) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := middleware.GetUserFromContext(c)
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}

		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			h.logger.WithError(err).Error("Failed to upgrade WebSocket connection")
			return
		}

		client := &WebSocketClient{
			hub:     hub,
			conn:    conn,
			send:    make(chan []byte, 256),
			userID:  user.ID,
			symbols: make(map[string]bool),
		}

		client.hub.register <- client

		go client.writePump()
		go client.readPump(h)
	}
}

func (h *Handlers) HandleMarketWebSocket(hub *WebSocketHub) gin.HandlerFunc {
	return func(c *gin.Context) {
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			h.logger.WithError(err).Error("Failed to upgrade WebSocket connection")
			return
		}

		client := &WebSocketClient{
			hub:     hub,
			conn:    conn,
			send:    make(chan []byte, 256),
			symbols: make(map[string]bool),
		}

		client.hub.register <- client

		go client.writePump()
		go client.readPumpMarket(h)
	}
}

func (c *WebSocketClient) readPump(h *Handlers) {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(512)
	c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, messageBytes, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				h.logger.WithError(err).Error("WebSocket error")
			}
			break
		}

		var msg WebSocketMessage
		if err := json.Unmarshal(messageBytes, &msg); err != nil {
			h.logger.WithError(err).Error("Failed to unmarshal WebSocket message")
			continue
		}

		switch msg.Type {
		case "subscribe":
			c.mu.Lock()
			c.symbols[msg.Symbol] = true
			c.mu.Unlock()

		case "unsubscribe":
			c.mu.Lock()
			delete(c.symbols, msg.Symbol)
			c.mu.Unlock()

		case "cancelOrder":
			if msg.Data != nil {
				if orderIDStr, ok := msg.Data.(string); ok {
					if orderID, err := uuid.Parse(orderIDStr); err == nil {
						ctx := context.Background()
						if err := h.orderService.CancelOrder(ctx, c.userID, orderID); err != nil {
							h.logger.WithError(err).Error("Failed to cancel order via WebSocket")
						}
					}
				}
			}
		}
	}
}

func (c *WebSocketClient) readPumpMarket(h *Handlers) {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(512)
	c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, messageBytes, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				h.logger.WithError(err).Error("WebSocket error")
			}
			break
		}

		var msg WebSocketMessage
		if err := json.Unmarshal(messageBytes, &msg); err != nil {
			h.logger.WithError(err).Error("Failed to unmarshal WebSocket message")
			continue
		}

		switch msg.Type {
		case "subscribe":
			c.mu.Lock()
			c.symbols[msg.Symbol] = true
			c.mu.Unlock()

		case "unsubscribe":
			c.mu.Lock()
			delete(c.symbols, msg.Symbol)
			c.mu.Unlock()
		}
	}
}

func (c *WebSocketClient) writePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
