"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFuturesOrderStore = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
exports.useFuturesOrderStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    currencyBalance: 0,
    pairBalance: 0,
    ask: 0,
    bid: 0,
    ordersTab: "OPEN",
    orders: [],
    openOrders: [],
    positions: [],
    openPositions: [],
    loading: false,
    setOrdersTab: (tab) => {
        set((state) => {
            state.ordersTab = tab;
        });
    },
    fetchWallet: async (type, currency) => {
        set((state) => {
            state.loading = true;
        });
        const { data, error } = await (0, api_1.default)({
            url: `/api/finance/wallet/${type}/${currency}`,
            silent: true,
        });
        if (!error) {
            set((state) => {
                state.pairBalance = data.balance;
            });
        }
        set((state) => {
            state.loading = false;
        });
    },
    fetchOrders: async (currency, pair) => {
        set((state) => {
            state.loading = true;
        });
        const { ordersTab } = get();
        const { data, error } = await (0, api_1.default)({
            url: `/api/ext/futures/order?currency=${currency}&pair=${pair}&type=${ordersTab}`,
            silent: true,
        });
        if (!error) {
            set((state) => {
                if (ordersTab === "OPEN") {
                    state.openOrders = data;
                }
                else if (ordersTab === "HISTORY") {
                    state.orders = data;
                }
            });
        }
        set((state) => {
            state.loading = false;
        });
    },
    fetchPositions: async (currency, pair) => {
        set((state) => {
            state.loading = true;
        });
        const { ordersTab } = get();
        const { data, error } = await (0, api_1.default)({
            url: `/api/ext/futures/position?currency=${currency}&pair=${pair}&type=${ordersTab}`,
            silent: true,
        });
        if (!error) {
            set((state) => {
                if (ordersTab === "OPEN_POSITIONS") {
                    state.openPositions = data;
                }
                else if (ordersTab === "POSITIONS_HISTORY") {
                    state.positions = data;
                }
            });
        }
        set((state) => {
            state.loading = false;
        });
    },
    setAsk: (ask) => {
        set((state) => {
            state.ask = Number(ask);
        });
    },
    setBid: (bid) => {
        set((state) => {
            state.bid = Number(bid);
        });
    },
    placeOrder: async (currency, pair, orderType, side, amount, price, leverage, stopLossPrice, takeProfitPrice) => {
        set((state) => {
            state.loading = true;
        });
        const { fetchOrders, fetchWallet, ask, bid } = get();
        const orderPrice = orderType === "MARKET" ? (side === "BUY" ? ask : bid) : price;
        const { error } = await (0, api_1.default)({
            url: "/api/ext/futures/order",
            method: "POST",
            body: {
                currency,
                pair,
                amount,
                type: orderType,
                side,
                price: orderPrice,
                leverage,
                stopLossPrice,
                takeProfitPrice,
            },
        });
        if (!error) {
            fetchWallet("FUTURES", pair);
            fetchOrders(currency, pair);
        }
        set((state) => {
            state.loading = false;
        });
    },
    setOrders: (orders) => {
        set((state) => {
            state.orders = orders;
        });
    },
    setOpenOrders: (openOrders) => {
        set((state) => {
            state.openOrders = openOrders;
        });
    },
    setPositions: (positions) => {
        set((state) => {
            state.positions = positions;
        });
    },
    setOpenPositions: (openPositions) => {
        set((state) => {
            state.openPositions = openPositions;
        });
    },
    handleOrderMessage: (message) => {
        if (!message || !message.data)
            return;
        const { data } = message;
        if (!data || !Array.isArray(data.data))
            return;
        set((state) => {
            const newItems = [...state.openOrders];
            for (const item of data.data) {
                const index = newItems.findIndex((i) => i.id === item.id);
                if (index > -1) {
                    newItems[index] = {
                        ...newItems[index],
                        ...item,
                    };
                }
                else {
                    newItems.push(item);
                }
            }
            state.openOrders = newItems;
        });
    },
    cancelOrder: async (id, currency, pair, timestamp) => {
        set((state) => {
            state.loading = true;
        });
        const { fetchWallet } = get();
        const { error } = await (0, api_1.default)({
            url: `/api/ext/futures/order/${id}?timestamp=${timestamp}`,
            method: "DELETE",
        });
        if (!error) {
            set((state) => {
                state.openOrders = state.openOrders.filter((order) => order.id !== id);
            });
            fetchWallet("FUTURES", pair);
        }
        set((state) => {
            state.loading = false;
        });
    },
    closePosition: async (id, currency, pair, side) => {
        set((state) => {
            state.loading = true;
        });
        const { fetchWallet, fetchPositions } = get();
        const { error } = await (0, api_1.default)({
            url: `/api/ext/futures/position`,
            method: "DELETE",
            body: {
                currency,
                pair,
                side,
            },
        });
        if (!error) {
            set((state) => {
                state.openPositions = state.openPositions.filter((position) => position.id !== id);
            });
            fetchWallet("FUTURES", pair);
            fetchPositions(currency, pair);
        }
        set((state) => {
            state.loading = false;
        });
    },
})));
