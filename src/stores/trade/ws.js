"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const ws_1 = __importDefault(require("@/utils/ws"));
const createWebSocketConnection = () => ({
    isConnected: false,
    wsManager: null,
    subscriptions: [],
    subscriptionQueue: [],
    isTypeSubscribed: function (type, payload) {
        return this.subscriptions.some((sub) => sub.type === type && sub.payload === payload);
    },
});
const useWebSocketStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    orderConnection: createWebSocketConnection(),
    tickersConnection: createWebSocketConnection(),
    ecoTickersConnection: createWebSocketConnection(),
    futuresTickersConnection: createWebSocketConnection(),
    tradesConnection: createWebSocketConnection(),
    ecoTradesConnection: createWebSocketConnection(),
    futuresTradesConnection: createWebSocketConnection(),
    ordersConnection: createWebSocketConnection(),
    futuresOrdersConnection: createWebSocketConnection(),
    messageHandlers: {},
    createConnection: async (connectionKey, path, options) => {
        var _a;
        const connection = get()[connectionKey];
        if (!path) {
            return Promise.reject("path is invalid.");
        }
        if (connection && connection.isConnected) {
            (_a = options === null || options === void 0 ? void 0 : options.onOpen) === null || _a === void 0 ? void 0 : _a.call(options);
            return Promise.resolve();
        }
        const wsManager = new ws_1.default(path);
        set((state) => {
            state[connectionKey] = {
                isConnected: false,
                wsManager,
                subscriptions: [],
                subscriptionQueue: [],
                isTypeSubscribed: createWebSocketConnection().isTypeSubscribed,
            };
        });
        wsManager.on("open", () => {
            var _a;
            console.log("WebSocket Connected to", path);
            set((state) => {
                state[connectionKey].isConnected = true;
            });
            (_a = options === null || options === void 0 ? void 0 : options.onOpen) === null || _a === void 0 ? void 0 : _a.call(options);
            // Process subscription queue
            const connection = get()[connectionKey];
            connection.subscriptionQueue.forEach((sub) => {
                wsManager.send({
                    action: "SUBSCRIBE",
                    payload: { type: sub.type, ...sub.payload },
                });
            });
            set((state) => {
                state[connectionKey].subscriptionQueue = [];
            });
        });
        wsManager.on("close", () => {
            var _a;
            console.log("WebSocket Disconnected from", path);
            set((state) => {
                state[connectionKey].isConnected = false;
            });
            (_a = options === null || options === void 0 ? void 0 : options.onClose) === null || _a === void 0 ? void 0 : _a.call(options);
        });
        wsManager.on("error", (error) => {
            var _a;
            console.error("WebSocket error on", path, ":", error.message);
            (_a = options === null || options === void 0 ? void 0 : options.onError) === null || _a === void 0 ? void 0 : _a.call(options, error);
        });
        wsManager.on("message", (message) => {
            const handlers = get().messageHandlers[connectionKey] || [];
            handlers.forEach(({ handler, filter }) => {
                if (filter(message)) {
                    handler(message);
                }
            });
        });
        wsManager.connect();
    },
    send: (connectionKey, message) => {
        const connection = get()[connectionKey];
        if (connection && connection.isConnected && connection.wsManager) {
            connection.wsManager.send(message);
        }
    },
    addMessageHandler: (connectionKey, handler, filter = () => true) => {
        set((state) => {
            const handlers = state.messageHandlers[connectionKey] || [];
            handlers.push({ handler, filter });
            state.messageHandlers[connectionKey] = handlers;
        });
    },
    removeMessageHandler: (connectionKey, handler) => {
        set((state) => {
            const handlers = state.messageHandlers[connectionKey] || [];
            state.messageHandlers[connectionKey] = handlers.filter((item) => item.handler !== handler);
        });
    },
    hasMessageHandler: (connectionKey, handler) => {
        const handlers = get().messageHandlers[connectionKey] || [];
        return handlers.some((item) => item.handler === handler);
    },
    removeConnection: (connectionKey) => {
        const connection = get()[connectionKey];
        if (connection && connection.isConnected && connection.wsManager) {
            connection.wsManager.disconnect();
            set((state) => {
                state[connectionKey].isConnected = false;
                state[connectionKey].wsManager = null;
            });
        }
    },
    subscribe: (connectionKey, type, payload) => {
        set((state) => {
            var _a;
            const connection = state[connectionKey];
            if (!connection.isTypeSubscribed(type, payload)) {
                connection.subscriptions.push({ type, payload });
                if ((_a = connection.wsManager) === null || _a === void 0 ? void 0 : _a.isConnected()) {
                    connection.wsManager.send({
                        action: "SUBSCRIBE",
                        payload: { type, ...payload },
                    });
                }
                else {
                    connection.subscriptionQueue.push({ type, payload });
                }
            }
        });
    },
    unsubscribe: (connectionKey, type, payload) => {
        set((state) => {
            var _a;
            const connection = state[connectionKey];
            connection.subscriptions = connection.subscriptions.filter((sub) => sub.type !== type || sub.payload !== payload);
            (_a = connection.wsManager) === null || _a === void 0 ? void 0 : _a.send({
                action: "UNSUBSCRIBE",
                payload: { type, ...payload },
            });
        });
    },
    isConnectionOpen: (connectionKey) => {
        const connection = get()[connectionKey];
        return (connection === null || connection === void 0 ? void 0 : connection.isConnected) || false;
    },
})));
exports.default = useWebSocketStore;
