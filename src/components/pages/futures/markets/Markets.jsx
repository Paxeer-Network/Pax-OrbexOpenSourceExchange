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
const router_1 = require("next/router");
const market_1 = __importDefault(require("@/stores/futures/market"));
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const lodash_1 = require("lodash");
const SearchBar_1 = require("./SearchBar");
const MarketTab_1 = require("./MarketTab");
const MarketList_1 = require("./MarketList");
const MarketsBase = () => {
    const { market, searchQuery, fetchData, setPriceChangeData, getPrecisionBySymbol, } = (0, market_1.default)();
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
            return () => {
                setTickersFetched(false);
            };
        }
    }, [router.isReady, currency, pair]);
    (0, react_1.useEffect)(() => {
        if (router.isReady && market) {
            const path = `/api/ext/futures/market`;
            createConnection("futuresTradesConnection", path, {
                onOpen: () => {
                    console.log("Trades connection open");
                },
            });
            setTickersFetched(true);
            return () => {
                if (!router.query.symbol) {
                    removeConnection("futuresTradesConnection");
                }
            };
        }
    }, [router.isReady, market === null || market === void 0 ? void 0 : market.symbol]);
    const [tickersConnected, setTickersConnected] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (router.isReady && tickersFetched) {
            createConnection("futuresTickersConnection", `/api/ext/futures/ticker`, {
                onOpen: () => {
                    subscribe("futuresTickersConnection", "tickers");
                },
            });
            setTickersConnected(true);
            return () => {
                unsubscribe("futuresTickersConnection", "tickers");
            };
        }
    }, [router.isReady, tickersFetched]);
    const handleTickerMessage = (message) => {
        const { data } = message;
        if (!data)
            return;
        updateItems(data);
    };
    const messageFilter = (message) => message.stream && message.stream === "tickers";
    (0, react_1.useEffect)(() => {
        if (tickersConnected) {
            addMessageHandler("futuresTickersConnection", handleTickerMessage, messageFilter);
            return () => {
                removeMessageHandler("futuresTickersConnection", handleTickerMessage);
            };
        }
    }, [tickersConnected]);
    return (<div className="h-full max-h-[50vh] p-2">
      <SearchBar_1.SearchBar />
      {searchQuery === "" && <MarketTab_1.MarketTab />}
      <MarketList_1.MarketList />
    </div>);
};
exports.Markets = (0, react_1.memo)(MarketsBase);
