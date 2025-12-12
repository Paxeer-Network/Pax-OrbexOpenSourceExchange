"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
const useMarketStoreBase = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    market: null,
    searchQuery: "",
    marketData: [],
    watchlistData: [],
    selectedPair: "",
    marketReady: false,
    watchlistReady: false,
    pairs: [],
    priceChangeData: {},
    withEco: true,
    setWithEco: (status) => set((state) => {
        state.withEco = status;
    }),
    setPriceChangeData: (symbol, price, change) => set((state) => {
        state.priceChangeData[symbol] = { price, change };
    }),
    getPrecisionBySymbol: (symbol) => {
        const { marketData } = get();
        const market = marketData.find((m) => m.symbol === symbol);
        return market ? market.precision : { price: 8, amount: 8 };
    },
    setSearchQuery: (query) => set((state) => {
        state.searchQuery = query;
    }),
    setMarketData: (data) => set((state) => {
        const updatedMarketData = state.marketData.map((item) => {
            const update = data.find((d) => d.symbol === item.symbol);
            return update ? { ...item, ...update } : item;
        });
        const newMarketData = data.filter((item) => !state.marketData.some((m) => m.symbol === item.symbol));
        state.marketData = [...updatedMarketData, ...newMarketData];
        state.pairs = [
            ...new Set([...state.pairs, ...data.map((item) => item.pair)]),
        ];
    }),
    setWatchlistData: (data) => set((state) => {
        state.watchlistData = data;
    }),
    setSelectedPair: (pair) => set((state) => {
        state.selectedPair = pair;
    }),
    fetchData: async (params) => {
        const { fetchWatchlist, withEco } = get();
        const { currency, pair } = params || {};
        const { data, error } = await (0, api_1.default)({
            url: `/api/exchange/market?eco=${withEco}`,
            silent: true,
        });
        if (!error) {
            const markets = data.map((item) => {
                var _a, _b;
                return ({
                    id: item.id,
                    symbol: `${item.currency}/${item.pair}`,
                    currency: item.currency,
                    pair: item.pair,
                    precision: (_a = item.metadata) === null || _a === void 0 ? void 0 : _a.precision,
                    limits: (_b = item.metadata) === null || _b === void 0 ? void 0 : _b.limits,
                    isEco: item.isEco,
                    icon: item.icon,
                });
            });
            set((state) => {
                const updatedMarketData = state.marketData.map((item) => {
                    const update = markets.find((m) => m.symbol === item.symbol);
                    return update ? { ...item, ...update } : item;
                });
                const newMarketData = markets.filter((item) => !state.marketData.some((m) => m.symbol === item.symbol));
                state.marketData = [...updatedMarketData, ...newMarketData];
                state.pairs = [
                    ...new Set([...state.pairs, ...markets.map((item) => item.pair)]),
                ];
                if (currency && pair) {
                    const market = markets.find((item) => item.symbol === `${currency}/${pair}`);
                    state.selectedPair = pair;
                    if (market) {
                        state.market = market;
                    }
                }
            });
            await fetchWatchlist(markets);
            set({ watchlistReady: true });
        }
    },
    getFirstAvailablePair: () => {
        var _a, _b;
        const { marketData } = get();
        // Modify this to include your logic for selecting an available pair
        const availablePairs = marketData.filter((pair) => !pair.isEco);
        return (_b = (_a = availablePairs[0]) === null || _a === void 0 ? void 0 : _a.symbol) === null || _b === void 0 ? void 0 : _b.replace("/", "_");
    },
    setMarket: (symbol) => {
        const { marketData } = get();
        const market = marketData.find((m) => m.symbol === symbol);
        set((state) => {
            state.market = market;
        });
    },
    fetchWatchlist: async (markets) => {
        const { withEco } = get();
        const { data, error } = await (0, api_1.default)({
            url: "/api/exchange/watchlist",
            silent: true,
        });
        if (!error) {
            const watchlist = data
                .map((item) => markets.find((m) => m.symbol === item.symbol))
                .filter((item) => item && (withEco ? true : !item.isEco));
            set((state) => {
                state.watchlistData = watchlist;
            });
        }
    },
    toggleWatchlist: async (symbol) => {
        const { fetchWatchlist, marketData } = get();
        const { error } = await (0, api_1.default)({
            url: "/api/exchange/watchlist",
            method: "POST",
            body: { type: "TRADE", symbol },
        });
        if (!error) {
            await fetchWatchlist(marketData);
        }
    },
})));
const useMarketStore = useMarketStoreBase;
exports.default = useMarketStore;
