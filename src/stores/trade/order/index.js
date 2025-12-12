"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOrderStore = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
exports.useOrderStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    currencyBalance: 0,
    pairBalance: 0,
    ask: 0,
    bid: 0,
    ordersTab: "OPEN",
    orders: [],
    openOrders: [],
    loading: false,
    setOrdersTab: (tab) => {
        set((state) => {
            state.ordersTab = tab;
        });
    },
    fetchWallets: async (isEco, currency, pair) => {
        set((state) => {
            state.loading = true;
        });
        const { data, error } = await (0, api_1.default)({
            url: "/api/finance/wallet/symbol",
            silent: true,
            params: { type: isEco ? "ECO" : "SPOT", currency, pair },
        });
        if (!error) {
            set((state) => {
                state.currencyBalance = data.CURRENCY;
                state.pairBalance = data.PAIR;
            });
        }
        set((state) => {
            state.loading = false;
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
                if (type === "currency") {
                    state.currencyBalance = data;
                }
                else if (type === "pair") {
                    state.pairBalance = data;
                }
            });
        }
        set((state) => {
            state.loading = false;
        });
    },
    fetchOrders: async (isEco, currency, pair) => {
        set((state) => {
            state.loading = true;
        });
        const { ordersTab } = get();
        const url = isEco ? `/api/ext/ecosystem/order` : `/api/exchange/order`;
        const { data, error } = await (0, api_1.default)({
            url: `${url}?currency=${currency}&pair=${pair}&type=${ordersTab}`,
            silent: true,
        });
        if (!error) {
            set((state) => {
                state[ordersTab === "OPEN" ? "openOrders" : "orders"] = data;
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
    placeOrder: async (isEco, currency, pair, orderType, side, amount, price) => {
        set((state) => {
            state.loading = true;
        });
        const { fetchOrders, fetchWallets } = get();
        const url = isEco ? "/api/ext/ecosystem/order" : "/api/exchange/order";
        try {
            const { error } = await (0, api_1.default)({
                url,
                method: "POST",
                body: {
                    currency,
                    pair,
                    amount,
                    type: orderType,
                    side,
                    price: orderType === "MARKET"
                        ? side === "BUY"
                            ? get().ask
                            : get().bid
                        : Number(price),
                },
            });
            if (!error) {
                await fetchWallets(isEco, currency, pair);
                await fetchOrders(isEco, currency, pair);
                return true;
            }
        }
        catch (error) {
            console.error("Failed to place order:", error);
            throw error;
        }
        finally {
            set((state) => {
                state.loading = false;
            });
        }
        return false;
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
    cancelOrder: async (id, isEco, currency, pair, timestamp) => {
        set((state) => {
            state.loading = true;
        });
        const { fetchWallets } = get();
        const url = isEco
            ? `/api/ext/ecosystem/order/${id}?timestamp=${timestamp}`
            : `/api/exchange/order/${id}`;
        const { error } = await (0, api_1.default)({
            url,
            method: "DELETE",
        });
        if (!error) {
            set((state) => {
                state.openOrders = state.openOrders.filter((order) => order.id !== id);
            });
            fetchWallets(isEco, currency, pair);
        }
        set((state) => {
            state.loading = false;
        });
    },
    aiInvestments: [],
    aiPlans: [],
    setAiPlans: (plans) => {
        set((state) => {
            state.aiPlans = plans;
        });
    },
    setAiInvestments: (investments) => {
        set((state) => {
            state.aiInvestments = investments;
        });
    },
    fetchAiInvestments: async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/ext/ai/investment/log",
            silent: true,
        });
        if (!error) {
            set((state) => {
                state.aiInvestments = data;
            });
        }
    },
    placeAiInvestmentOrder: async (planId, durationId, market, amount) => {
        set((state) => {
            state.loading = true;
        });
        const { fetchWallets, fetchAiInvestments } = get();
        const { error } = await (0, api_1.default)({
            url: "/api/ext/ai/investment/log",
            method: "POST",
            body: {
                planId,
                durationId,
                amount,
                currency: market.currency,
                pair: market.pair,
                type: market.isEco ? "ECO" : "SPOT",
            },
        });
        if (!error) {
            await fetchWallets(market.isEco, market.currency, market.pair);
            await fetchAiInvestments();
        }
        set((state) => {
            state.loading = false;
        });
    },
    cancelAiInvestmentOrder: async (id, isEco, currency, pair) => {
        set((state) => {
            state.loading = true;
        });
        const { fetchWallets } = get();
        const { error } = await (0, api_1.default)({
            url: `/api/ext/ai/investment/log/${id}`,
            method: "DELETE",
        });
        if (!error) {
            await fetchWallets(isEco, currency, pair);
            set((state) => {
                state.aiInvestments = state.aiInvestments.filter((investment) => investment.id !== id);
            });
        }
        set((state) => {
            state.loading = false;
        });
    },
})));
