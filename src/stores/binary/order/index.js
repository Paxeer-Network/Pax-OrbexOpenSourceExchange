"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBinaryOrderStore = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
function shallowCompareOrders(a, b) {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i].id !== b[i].id)
            return false;
    }
    return true;
}
exports.useBinaryOrderStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    wallet: null,
    ask: 0,
    bid: 0,
    ordersTab: "OPEN",
    orders: [],
    openOrders: [],
    loading: false,
    practiceBalances: {},
    setOrdersTab: (tab) => {
        set((state) => {
            state.ordersTab = tab;
        });
    },
    fetchWallet: async (currency) => {
        set((state) => {
            state.loading = true;
        });
        const { data, error } = await (0, api_1.default)({
            url: `/api/finance/wallet/SPOT/${currency}`,
            silent: true,
        });
        if (!error) {
            set((state) => {
                state.wallet = data;
            });
        }
        set((state) => {
            state.loading = false;
        });
    },
    fetchOrders: async (currency, pair, isDemo = false) => {
        set((state) => {
            state.loading = true;
        });
        const { ordersTab } = get();
        const url = `/api/exchange/binary/order`;
        const { data, error } = await (0, api_1.default)({
            url: `${url}?currency=${currency}&pair=${pair}&type=${ordersTab}&isDemo=${isDemo}`,
            silent: true,
        });
        if (!error && Array.isArray(data)) {
            set((state) => {
                const isOpen = ordersTab === "OPEN";
                const currentOrders = isOpen ? state.openOrders : state.orders;
                // Only update if there's a difference
                if (!shallowCompareOrders(currentOrders, data)) {
                    if (isOpen) {
                        state.openOrders = data;
                    }
                    else {
                        state.orders = data;
                    }
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
    placeOrder: async (currency, pair, side, amount, closedAt, isDemo = false, type = "RISE_FALL", barrier, strikePrice, payoutPerPoint) => {
        set((state) => {
            state.loading = true;
        });
        const { fetchWallet, setPracticeBalance, getPracticeBalance } = get();
        const url = "/api/exchange/binary/order";
        const body = {
            currency,
            pair,
            amount,
            side,
            closedAt,
            isDemo,
            type,
        };
        if (type === "HIGHER_LOWER" ||
            type === "TOUCH_NO_TOUCH" ||
            type === "TURBO") {
            body.barrier = barrier;
        }
        if (type === "CALL_PUT") {
            body.strikePrice = strikePrice;
            body.payoutPerPoint = payoutPerPoint;
        }
        if (type === "TURBO") {
            body.payoutPerPoint = payoutPerPoint;
        }
        const { data, error } = await (0, api_1.default)({
            url,
            method: "POST",
            body,
        });
        if (!error && (data === null || data === void 0 ? void 0 : data.order)) {
            if (isDemo) {
                const newBalance = getPracticeBalance(currency, pair) - amount;
                setPracticeBalance(currency, pair, newBalance);
            }
            else {
                fetchWallet(pair);
            }
            set((state) => {
                state.openOrders.push(data.order);
            });
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
    cancelOrder: async (id, pair, isDemo, amount) => {
        set((state) => {
            state.loading = true;
        });
        const { fetchWallet, setPracticeBalance } = get();
        const url = `/api/exchange/binary/order/${id}`;
        const { error } = await (0, api_1.default)({
            url,
            method: "DELETE",
        });
        if (!error) {
            set((state) => {
                state.openOrders = state.openOrders.filter((order) => order.id !== id);
            });
            if (isDemo && amount) {
                const [cur, p] = pair.split("/");
                const currentBalance = get().getPracticeBalance(cur, p);
                setPracticeBalance(cur, p, currentBalance + amount);
            }
            else {
                fetchWallet(pair);
            }
        }
        set((state) => {
            state.loading = false;
        });
    },
    removeOrder: (orderId) => {
        set((state) => {
            state.openOrders = state.openOrders.filter((order) => order.id !== orderId);
        });
    },
    setPracticeBalance: (currency, pair, balance) => {
        set((state) => {
            state.practiceBalances[`${currency}/${pair}`] = balance;
            localStorage.setItem("practiceBalances", JSON.stringify(state.practiceBalances));
        });
    },
    updatePracticeBalance: (currency, pair, amount, type = "subtract") => {
        set((state) => {
            const key = `${currency}/${pair}`;
            const newBalance = type === "add"
                ? (state.practiceBalances[key] || 10000) + amount
                : (state.practiceBalances[key] || 10000) - amount;
            state.practiceBalances[key] = newBalance;
            localStorage.setItem("practiceBalances", JSON.stringify(state.practiceBalances));
        });
    },
    getPracticeBalance: (currency, pair) => {
        const key = `${currency}/${pair}`;
        const savedBalances = localStorage.getItem("practiceBalances");
        if (savedBalances) {
            const balances = JSON.parse(savedBalances);
            return balances[key] !== undefined ? balances[key] : 10000;
        }
        return 10000;
    },
})));
