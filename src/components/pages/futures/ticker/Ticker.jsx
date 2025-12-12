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
exports.Ticker = void 0;
const react_1 = __importStar(require("react"));
const market_1 = require("@/utils/market");
const react_loading_skeleton_1 = __importDefault(require("react-loading-skeleton"));
require("react-loading-skeleton/dist/skeleton.css");
const dashboard_1 = require("@/stores/dashboard");
const market_2 = __importDefault(require("@/stores/futures/market"));
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const next_i18next_1 = require("next-i18next");
const router_1 = require("next/router");
const TickerBase = () => {
    var _a, _b, _c;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { isDark } = (0, dashboard_1.useDashboardStore)();
    const { market } = (0, market_2.default)();
    const { subscribe, unsubscribe, addMessageHandler, removeMessageHandler, futuresTradesConnection, } = (0, ws_1.default)();
    const router = (0, router_1.useRouter)();
    const getPrecision = (type) => { var _a; return Number(((_a = market === null || market === void 0 ? void 0 : market.precision) === null || _a === void 0 ? void 0 : _a[type]) || 8); };
    const [ticker, setTicker] = (0, react_1.useState)();
    const [clientIsDark, setClientIsDark] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setClientIsDark(isDark);
    }, [isDark]);
    (0, react_1.useEffect)(() => {
        if (router.isReady && market && (futuresTradesConnection === null || futuresTradesConnection === void 0 ? void 0 : futuresTradesConnection.isConnected)) {
            const handleBinanceTickerMessage = (message) => {
                if (message.stream !== "ticker")
                    return;
                const { data } = message;
                if (!data)
                    return;
                const { info, ...tickerData } = data;
                setTicker(tickerData);
            };
            const handleKucoinTickerMessage = (message) => {
                if (message.stream !== "ticker")
                    return;
                const { data } = message;
                if (!data || data.symbol !== market.symbol)
                    return;
                const tickerData = {
                    symbol: data.symbol,
                    timestamp: data.timestamp,
                    datetime: data.datetime,
                    bid: data.bid,
                    bidVolume: data.bidVolume,
                    ask: data.ask,
                    askVolume: data.askVolume,
                    close: data.close,
                    last: data.last,
                };
                setTicker(tickerData);
            };
            const resetTicker = () => {
                setTicker(undefined);
            };
            const messageFilter = (message) => message.stream === "ticker";
            let handler;
            switch (process.env.NEXT_PUBLIC_EXCHANGE) {
                case "bin":
                    handler = handleBinanceTickerMessage;
                    break;
                case "kuc":
                    handler = handleKucoinTickerMessage;
                    break;
                default:
                    handler = handleBinanceTickerMessage;
                    break;
            }
            addMessageHandler("futuresTradesConnection", handler, messageFilter);
            subscribe("futuresTradesConnection", "ticker", {
                symbol: market === null || market === void 0 ? void 0 : market.symbol,
            });
            return () => {
                unsubscribe("futuresTradesConnection", "ticker", {
                    symbol: market === null || market === void 0 ? void 0 : market.symbol,
                });
                removeMessageHandler("futuresTradesConnection", handler);
                resetTicker();
            };
        }
    }, [router.isReady, market, futuresTradesConnection === null || futuresTradesConnection === void 0 ? void 0 : futuresTradesConnection.isConnected]);
    return (<div className="flex gap-5 p-2 text-muted-800 dark:text-muted-200 items-center justify-center h-full">
      <div className="pe-5 border-r border-muted-300 dark:border-muted-700 hidden md:block">
        {(ticker === null || ticker === void 0 ? void 0 : ticker.symbol) || (<react_loading_skeleton_1.default width={80} height={16} baseColor={clientIsDark ? "#27272a" : "#f7fafc"} highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}/>)}
      </div>
      <div className="flex w-full h-full">
        <div className="w-1/3 flex flex-col md:flex-row items-center h-full gap-1">
          <div className="w-full md:w-1/2 text-sm md:text-lg">
            <span className="block md:hidden">
              {(ticker === null || ticker === void 0 ? void 0 : ticker.symbol) || (<react_loading_skeleton_1.default width={60} height={12} baseColor={clientIsDark ? "#27272a" : "#f7fafc"} highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}/>)}
            </span>
            <span>
              {((_a = ticker === null || ticker === void 0 ? void 0 : ticker.last) === null || _a === void 0 ? void 0 : _a.toFixed(5)) || (<react_loading_skeleton_1.default width={40} height={10} baseColor={clientIsDark ? "#27272a" : "#f7fafc"} highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}/>)}
            </span>
          </div>
          {process.env.NEXT_PUBLIC_EXCHANGE === "bin" && (<div className="w-full md:w-1/2 text-xs md:text-sm">
              <span className="text-muted-600 dark:text-muted-400">
                {t("24h change")}
              </span>
              <div className="text-md flex gap-1 items-center">
                <span className={ticker && (ticker === null || ticker === void 0 ? void 0 : ticker.percentage) && ticker.percentage >= 0
                ? (ticker === null || ticker === void 0 ? void 0 : ticker.percentage) === 0
                    ? ""
                    : "text-success-500"
                : "text-danger-500"}>
                  {(ticker === null || ticker === void 0 ? void 0 : ticker.change) !== undefined ? (ticker.change.toFixed(2)) : (<react_loading_skeleton_1.default width={40} height={10} baseColor={clientIsDark ? "#27272a" : "#f7fafc"} highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}/>)}
                </span>
                <span className={`text-xs ${ticker && (ticker === null || ticker === void 0 ? void 0 : ticker.percentage) && ticker.percentage >= 0
                ? (ticker === null || ticker === void 0 ? void 0 : ticker.percentage) === 0
                    ? ""
                    : "text-success-500"
                : "text-danger-500"}`}>
                  {(ticker === null || ticker === void 0 ? void 0 : ticker.percentage) !== undefined ? (`${ticker.percentage.toFixed(2)}%`) : (<react_loading_skeleton_1.default width={30} height={8} baseColor={clientIsDark ? "#27272a" : "#f7fafc"} highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}/>)}
                </span>
              </div>
            </div>)}
        </div>
        <div className="w-1/3 flex flex-col md:flex-row text-xs md:text-sm h-full items-center justify-between">
          <div className="w-full md:w-1/2">
            <span className="text-muted-600 dark:text-muted-400">
              {t("24h high")}
            </span>
            <div>
              {((_b = ticker === null || ticker === void 0 ? void 0 : ticker.high) === null || _b === void 0 ? void 0 : _b.toFixed(5)) || (<react_loading_skeleton_1.default width={40} height={10} baseColor={clientIsDark ? "#27272a" : "#f7fafc"} highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}/>)}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <span className="text-muted-600 dark:text-muted-400">
              {t("24h low")}
            </span>
            <div>
              {((_c = ticker === null || ticker === void 0 ? void 0 : ticker.low) === null || _c === void 0 ? void 0 : _c.toFixed(5)) || (<react_loading_skeleton_1.default width={40} height={10} baseColor={clientIsDark ? "#27272a" : "#f7fafc"} highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}/>)}
            </div>
          </div>
        </div>
        <div className="w-1/3 flex flex-col md:flex-row text-xs md:text-sm h-full items-center justify-between">
          <div className="w-full md:w-1/2">
            <span className="text-muted-600 dark:text-muted-400">
              {t("24h volume")} ({market === null || market === void 0 ? void 0 : market.currency})
            </span>
            <div>
              {(0, market_1.formatLargeNumber)((ticker === null || ticker === void 0 ? void 0 : ticker.baseVolume) || 0, getPrecision("amount")) || (<react_loading_skeleton_1.default width={40} height={10} baseColor={clientIsDark ? "#27272a" : "#f7fafc"} highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}/>)}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <span className="text-muted-600 dark:text-muted-400">
              {t("24h volume")} ({market === null || market === void 0 ? void 0 : market.pair})
            </span>
            <div>
              {(0, market_1.formatLargeNumber)((ticker === null || ticker === void 0 ? void 0 : ticker.quoteVolume) || 0, getPrecision("price")) || (<react_loading_skeleton_1.default width={40} height={10} baseColor={clientIsDark ? "#27272a" : "#f7fafc"} highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}/>)}
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.Ticker = (0, react_1.memo)(TickerBase);
