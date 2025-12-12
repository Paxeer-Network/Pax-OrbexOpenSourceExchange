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
exports.Orderbook = void 0;
const react_1 = __importStar(require("react"));
const OrderbookHeader_1 = require("@/components/pages/futures/orderbook/OrderbookHeader");
const OrderBookTableHeader_1 = require("@/components/pages/futures/orderbook/OrderBookTableHeader");
const OrderBookRow_1 = require("@/components/pages/futures/orderbook/OrderBookRow");
const BestPrices_1 = require("@/components/pages/futures/orderbook/BestPrices");
const DisplayTotals_1 = require("@/components/pages/futures/orderbook/DisplayTotals");
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const market_1 = __importDefault(require("@/stores/futures/market"));
const next_i18next_1 = require("next-i18next");
const ordersLimit = 15;
const provider = process.env.NEXT_PUBLIC_EXCHANGE;
const tickSizeLimitMap = {
    0.01: provider === "kuc" ? 50 : 40,
    0.1: provider === "kuc" ? 50 : 80,
    1: provider === "kuc" ? 100 : 160,
    10: provider === "kuc" ? 100 : 320,
};
const orderBookWorker = typeof window !== "undefined" ? new Worker("/worker/orderBook.js") : null;
const OrderbookBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { subscribe, unsubscribe, addMessageHandler, removeMessageHandler, futuresTradesConnection, } = (0, ws_1.default)();
    const { market } = (0, market_1.default)();
    const askRefs = (0, react_1.useRef)([]);
    const bidRefs = (0, react_1.useRef)([]);
    const [hoveredType, setHoveredType] = (0, react_1.useState)();
    const [visible, setVisible] = (0, react_1.useState)({ asks: true, bids: true });
    const [tickSize, setTickSize] = (0, react_1.useState)(0.01);
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const [hoveredIndex, setHoveredIndex] = (0, react_1.useState)({
        ask: null,
        bid: null,
    });
    const [orderBook, setOrderBook] = (0, react_1.useState)({
        asks: [],
        bids: [],
        maxAskTotal: 0,
        maxBidTotal: 0,
        askPercentage: "0.00",
        bidPercentage: "0.00",
        bestPrices: { bestAsk: 0, bestBid: 0 },
    });
    const [cardPosition, setCardPosition] = (0, react_1.useState)({ top: 0, left: 0 });
    const handleRowHover = (index, type) => {
        setHoveredIndex((prev) => ({
            ...prev,
            [type]: index,
        }));
        setHoveredType(type);
        setIsHovered(true);
        const ref = type === "ask" ? askRefs.current[index] : bidRefs.current[index];
        if (ref) {
            const rect = ref.getBoundingClientRect();
            setCardPosition({
                top: rect.top,
                left: rect.left + rect.width,
            });
        }
    };
    const handleRowLeave = () => {
        setIsHovered(false);
        setHoveredIndex({ bid: null, ask: null });
        setHoveredType(null);
        setCardPosition({ ...cardPosition, top: 0 });
    };
    (0, react_1.useEffect)(() => {
        if (orderBookWorker && (futuresTradesConnection === null || futuresTradesConnection === void 0 ? void 0 : futuresTradesConnection.isConnected)) {
            orderBookWorker.onmessage = (event) => {
                setOrderBook(event.data);
            };
            orderBookWorker.onerror = (error) => {
                console.error("Error from worker:", error);
            };
        }
    }, [futuresTradesConnection === null || futuresTradesConnection === void 0 ? void 0 : futuresTradesConnection.isConnected]);
    const [orderbookReady, setOrderbookReady] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if ((futuresTradesConnection === null || futuresTradesConnection === void 0 ? void 0 : futuresTradesConnection.isConnected) && (market === null || market === void 0 ? void 0 : market.symbol)) {
            const subscribePayload = {
                symbol: market.symbol,
            };
            subscribe("futuresTradesConnection", "orderbook", subscribePayload);
            setOrderbookReady(true);
            return () => {
                unsubscribe("futuresTradesConnection", "orderbook", subscribePayload);
                setOrderbookReady(false);
            };
        }
    }, [market === null || market === void 0 ? void 0 : market.symbol, futuresTradesConnection === null || futuresTradesConnection === void 0 ? void 0 : futuresTradesConnection.isConnected]);
    (0, react_1.useEffect)(() => {
        if (orderbookReady) {
            const handleOrderbookMessage = (message) => {
                if (message && message.data) {
                    orderBookWorker === null || orderBookWorker === void 0 ? void 0 : orderBookWorker.postMessage(message.data);
                }
            };
            const messageFilter = (message) => message.stream && message.stream.startsWith("orderbook");
            addMessageHandler("futuresTradesConnection", handleOrderbookMessage, messageFilter);
            return () => {
                removeMessageHandler("futuresTradesConnection", handleOrderbookMessage);
                setOrderBook({
                    asks: [],
                    bids: [],
                    maxAskTotal: 0,
                    maxBidTotal: 0,
                    askPercentage: "0.00",
                    bidPercentage: "0.00",
                    bestPrices: { bestAsk: 0, bestBid: 0 },
                });
            };
        }
    }, [orderbookReady]);
    return (<>
      <div className="relative w-full flex flex-col text-xs overflow-hidden z-5 min-w-[220px] ">
        <OrderbookHeader_1.OrderbookHeader visible={visible} setVisible={setVisible} askPercentage={orderBook.askPercentage} bidPercentage={orderBook.bidPercentage}/>
        <OrderBookTableHeader_1.OrderBookTableHeader />
        <div className="flex flex-row md:flex-col">
          <div className="hidden md:block order-2 ">
            <BestPrices_1.BestPrices {...orderBook.bestPrices}/>
          </div>
          {visible.asks && (<div className="min-h-[45vh] max-h-[45vh] overflow-hidden w-full order-1 flex flex-col-reverse grow">
              {orderBook.asks.length > 0 ? (orderBook.asks.map((ask, index) => (<OrderBookRow_1.OrderBookRow key={index} index={index} {...ask} type="ask" maxTotal={orderBook.maxAskTotal} onRowHover={handleRowHover} onRowLeave={handleRowLeave} isSelected={hoveredIndex.ask !== null && index <= hoveredIndex.ask} rowRef={(el) => (askRefs.current[index] = el)} lastHoveredIndex={hoveredIndex.ask}/>))) : (<div className="flex items-center justify-center h-full">
                  <span className="text-muted-400 dark:text-muted-500">
                    {t("No Asks")}
                  </span>
                </div>)}
            </div>)}
          {visible.bids && (<div className="min-h-[45vh] max-h-[45vh] overflow-hidden w-full order-3 flex flex-col grow">
              {orderBook.bids.length > 0 ? (orderBook.bids.map((bid, index) => (<OrderBookRow_1.OrderBookRow key={index} index={index} {...bid} type="bid" maxTotal={orderBook.maxBidTotal} onRowHover={handleRowHover} onRowLeave={handleRowLeave} isSelected={hoveredIndex.bid !== null && index <= hoveredIndex.bid} rowRef={(el) => (bidRefs.current[index] = el)} lastHoveredIndex={hoveredIndex.bid}/>))) : (<div className="flex items-center justify-center h-full">
                  <span className="text-muted-400 dark:text-muted-500">
                    {t("No Bids")}
                  </span>
                </div>)}
            </div>)}
        </div>
        {isHovered && (<DisplayTotals_1.DisplayTotals currency={market === null || market === void 0 ? void 0 : market.currency} pair={market === null || market === void 0 ? void 0 : market.pair} orderBook={orderBook} hoveredIndex={hoveredIndex} hoveredType={hoveredType} cardPosition={cardPosition} isHovered={isHovered}/>)}
      </div>
    </>);
};
exports.Orderbook = (0, react_1.memo)(OrderbookBase);
