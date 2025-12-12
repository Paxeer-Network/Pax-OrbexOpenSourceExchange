"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markets = void 0;
const react_1 = __importStar(require("react"));
const SearchBar_1 = require("./SearchBar");
const MarketList_1 = require("./MarketList");
const MarketTab_1 = require("./MarketTab");
const router_1 = require("next/router");
const market_1 = __importDefault(require("@/stores/trade/market"));
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const lodash_1 = require("lodash");
const dashboard_1 = require("@/stores/dashboard");
const api_1 = __importDefault(require("@/utils/api"));
const MarketsBase = () => {
    const { market, searchQuery, fetchData, setPriceChangeData, getPrecisionBySymbol, } = (0, market_1.default)();
    const { hasExtension } = (0, dashboard_1.useDashboardStore)();
    const [currency, setCurrency] = (0, react_1.useState)(null);
    const [pair, setPair] = (0, react_1.useState)(null);
    const router = (0, router_1.useRouter)();
    const [tickersFetched, setTickersFetched] = (0, react_1.useState)(false);
    const { createConnection, removeConnection, addMessageHandler, removeMessageHandler, subscribe, unsubscribe, } = (0, ws_1.default)();
    (0, react_1.useEffect)(() => {
        if (router.query.symbol) {
            const [newCurrency, newPair] = typeof router.query.symbol === "string"
                ? router.query.symbol.split("_")
                : [];
            setCurrency(newCurrency);
            setPair(newPair);
        }
    }, [router.query.symbol]);
    const updateItems = (message) => {
        Object.keys(message).forEach((symbol) => {
            const update = message[symbol];
            if (update.last !== undefined && update.change !== undefined) {
                const precision = getPrecisionBySymbol(symbol);
                setPriceChangeData(symbol, update.last.toFixed(precision.price), update.change.toFixed(2));
            }
        });
    };
    const debouncedFetchData = (0, lodash_1.debounce)(fetchData, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady && currency && pair) {
            debouncedFetchData({ currency, pair });
            debouncedFetchTickers();
            return () => {
                setTickersFetched(false);
            };
        }
    }, [router.isReady, currency, pair]);
    const fetchTickers = async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/exchange/ticker",
            silent: true,
        });
        if (!error) {
            updateItems(data);
        }
        setTickersFetched(true);
    };
    const debouncedFetchTickers = (0, lodash_1.debounce)(fetchTickers, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady && market) {
            const { isEco } = market;
            const path = isEco ? `/api/ext/ecosystem/market` : `/api/exchange/market`;
            createConnection("tradesConnection", path, {
                onOpen: () => {
                    console.log("Trades connection open");
                },
            });
            if (hasExtension("ecosystem")) {
                createConnection("ecoTradesConnection", `/api/ext/ecosystem/market`, {
                    onOpen: () => {
                        console.log("Eco trades connection open");
                    },
                });
            }
            return () => {
                if (!router.query.symbol) {
                    removeConnection("tradesConnection");
                    if (hasExtension("ecosystem")) {
                        removeConnection("ecoTradesConnection");
                    }
                }
            };
        }
    }, [router.isReady, market === null || market === void 0 ? void 0 : market.symbol]);
    const [tickersConnected, setTickersConnected] = (0, react_1.useState)(false);
    const [ecoTickersConnected, setEcoTickersConnected] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (tickersFetched) {
            createConnection("tickersConnection", `/api/exchange/ticker`, {
                onOpen: () => {
                    subscribe("tickersConnection", "tickers");
                },
            });
            setTickersConnected(true);
            if (hasExtension("ecosystem")) {
                createConnection("ecoTickersConnection", `/api/ext/ecosystem/ticker`, {
                    onOpen: () => {
                        subscribe("ecoTickersConnection", "tickers");
                    },
                });
                setEcoTickersConnected(true);
            }
            return () => {
                unsubscribe("tickersConnection", "tickers");
                if (hasExtension("ecosystem")) {
                    unsubscribe("ecoTickersConnection", "tickers");
                }
            };
        }
    }, [tickersFetched]);
    const handleTickerMessage = (message) => {
        const { data } = message;
        if (!data)
            return;
        updateItems(data);
    };
    const messageFilter = (message) => message.stream && message.stream === "tickers";
    (0, react_1.useEffect)(() => {
        if (tickersConnected) {
            addMessageHandler("tickersConnection", handleTickerMessage, messageFilter);
            return () => {
                removeMessageHandler("tickersConnection", handleTickerMessage);
            };
        }
    }, [tickersConnected]);
    (0, react_1.useEffect)(() => {
        if (ecoTickersConnected) {
            addMessageHandler("ecoTickersConnection", handleTickerMessage, messageFilter);
            return () => {
                removeMessageHandler("ecoTickersConnection", handleTickerMessage);
            };
        }
    }, [ecoTickersConnected]);
    return (<div className="h-full flex flex-col bg-white dark:bg-zinc-950">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
        <SearchBar_1.SearchBar />
        {searchQuery === "" && <MarketTab_1.MarketTab />}
      </div>
      <div className="flex-1 min-h-0">
        <MarketList_1.MarketList />
      </div>
    </div>);
};
exports.Markets = (0, react_1.memo)(MarketsBase);
