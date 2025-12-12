"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebSocketManager {
    constructor(wsPath) {
        this.ws = null;
        this.listeners = {};
        this.reconnectInterval = 5000;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsHost = window.location.host.replace("3000", "4000");
        const wsUrl = `${wsProtocol}//${wsHost}${wsPath}`;
        this.url = wsUrl;
    }
    connect() {
        if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
            this.ws = new WebSocket(this.url);
            this.ws.onopen = () => {
                var _a;
                console.log("WebSocket connection opened.");
                (_a = this.listeners["open"]) === null || _a === void 0 ? void 0 : _a.forEach((cb) => cb());
                this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
            };
            this.ws.onmessage = (event) => {
                var _a;
                const message = JSON.parse(event.data);
                (_a = this.listeners["message"]) === null || _a === void 0 ? void 0 : _a.forEach((cb) => cb(message));
            };
            this.ws.onclose = () => {
                var _a;
                console.log("WebSocket connection closed");
                (_a = this.listeners["close"]) === null || _a === void 0 ? void 0 : _a.forEach((cb) => cb());
            };
            this.ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                // Prevent error from bubbling up and crashing the app
            };
        }
    }
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
        else {
            console.error("WebSocket connection not open.");
        }
    }
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
        }
    }
    isConnected() {
        var _a;
        return ((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN;
    }
    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => this.connect(), this.reconnectInterval);
            this.reconnectAttempts++;
            console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        }
        else {
            console.log("Max reconnection attempts reached, giving up.");
        }
    }
}
exports.default = WebSocketManager;
