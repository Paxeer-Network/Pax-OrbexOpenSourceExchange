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
exports.Trades = void 0;
const react_1 = __importStar(require("react"));
const TradesTableHeader_1 = require("./TradesTableHeader");
const TradeRow_1 = require("./TradeRow");
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const market_1 = __importDefault(require("@/stores/trade/market"));
const date_fns_1 = require("date-fns");
const next_i18next_1 = require("next-i18next");
const TradesBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [trades, setTrades] = (0, react_1.useState)([]);
    const { market } = (0, market_1.default)();
    const { subscribe, unsubscribe, addMessageHandler, removeMessageHandler, tradesConnection, ecoTradesConnection, } = (0, ws_1.default)();
    const handleTradesMessage = (message) => {
        const { data } = message;
        if (!data)
            return;
        const newTrades = data.map((trade) => ({
            id: trade.id,
            price: trade.price,
            amount: trade.amount,
            time: (0, date_fns_1.formatDate)(new Date(trade.datetime || trade.timestamp), "HH:mm:ss"),
            side: trade.side.toLowerCase(),
        }));
        // Avoid duplicates
        setTrades((prevTrades) => {
            const uniqueTrades = newTrades.filter((newTrade) => !prevTrades.some((trade) => trade.id === newTrade.id));
            return [...uniqueTrades, ...prevTrades.slice(0, 49)];
        });
    };
    (0, react_1.useEffect)(() => {
        if (!(market === null || market === void 0 ? void 0 : market.currency) || !(market === null || market === void 0 ? void 0 : market.pair))
            return;
        const { isEco } = market;
        const connectionKey = isEco ? "ecoTradesConnection" : "tradesConnection";
        const isConnected = isEco
            ? ecoTradesConnection === null || ecoTradesConnection === void 0 ? void 0 : ecoTradesConnection.isConnected
            : tradesConnection === null || tradesConnection === void 0 ? void 0 : tradesConnection.isConnected;
        if (!isConnected)
            return; // ensure websocket is open before subscribing
        const messageFilter = (message) => message.stream === "trades";
        addMessageHandler(connectionKey, handleTradesMessage, messageFilter);
        subscribe(connectionKey, "trades", {
            symbol: `${market === null || market === void 0 ? void 0 : market.currency}/${market === null || market === void 0 ? void 0 : market.pair}`,
        });
        return () => {
            unsubscribe(connectionKey, "trades", {
                symbol: `${market === null || market === void 0 ? void 0 : market.currency}/${market === null || market === void 0 ? void 0 : market.pair}`,
            });
            removeMessageHandler(connectionKey, handleTradesMessage);
            setTrades([]);
        };
    }, [
        market === null || market === void 0 ? void 0 : market.currency,
        market === null || market === void 0 ? void 0 : market.pair,
        tradesConnection === null || tradesConnection === void 0 ? void 0 : tradesConnection.isConnected,
        ecoTradesConnection === null || ecoTradesConnection === void 0 ? void 0 : ecoTradesConnection.isConnected,
    ]);
    return (<>
      <TradesTableHeader_1.TradesTableHeader />
      <div className="max-h-[50vh] m-2 overflow-y-auto slimscroll">
        {(trades.length > 0 &&
            trades.map((trade, index) => (<TradeRow_1.TradeRow key={index} trade={trade}/>))) || (<div className="flex items-center justify-center h-full text-sm">
            <span className="text-muted-400 dark:text-muted-500">
              {t("No Trades")}
            </span>
          </div>)}
      </div>
    </>);
};
exports.Trades = (0, react_1.memo)(TradesBase);
