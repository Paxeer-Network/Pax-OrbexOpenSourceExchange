// Orderbook.jsx
import React, { memo, useEffect, useRef, useState } from "react";
import { OrderbookHeader } from "@/components/pages/trade/orderbook/OrderbookHeader";
import { OrderBookTableHeader } from "@/components/pages/trade/orderbook/OrderBookTableHeader";
import { OrderBookRow } from "@/components/pages/trade/orderbook/OrderBookRow";
import { BestPrices } from "@/components/pages/trade/orderbook/BestPrices";
import { DisplayTotals } from "@/components/pages/trade/orderbook/DisplayTotals";
import useWebSocketStore from "@/stores/trade/ws";
import useMarketStore from "@/stores/trade/market";
import { useTranslation } from "next-i18next";

const ordersLimit = 15;
const provider = process.env.NEXT_PUBLIC_EXCHANGE;
const tickSizeLimitMap = {
  0.01: provider === "kuc" ? 50 : 40,
  0.1: provider === "kuc" ? 50 : 80,
  1: provider === "kuc" ? 100 : 160,
  10: provider === "kuc" ? 100 : 320,
};

const orderBookWorker =
  typeof window !== "undefined" ? new Worker("/worker/orderBook.js") : null;

const OrderbookBase = () => {
  const { t } = useTranslation();
  const {
    subscribe,
    unsubscribe,
    addMessageHandler,
    removeMessageHandler,
    tradesConnection,
    ecoTradesConnection,
  } = useWebSocketStore();
  const { market } = useMarketStore();
  const askRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bidRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [hoveredType, setHoveredType] = useState<"ask" | "bid" | null>(null);
  const [visible, setVisible] = useState({ asks: true, bids: true });
  const [tickSize, setTickSize] = useState(0.01);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState({
    ask: null as number | null,
    bid: null as number | null,
  });
  const [orderBook, setOrderBook] = useState<{
    asks: { price: number; amount: number; total: number }[];
    bids: { price: number; amount: number; total: number }[];
    maxAskTotal: number;
    maxBidTotal: number;
    askPercentage: string;
    bidPercentage: string;
    bestPrices: {
      bestAsk: number;
      bestBid: number;
    };
  }>({
    asks: [],
    bids: [],
    maxAskTotal: 0,
    maxBidTotal: 0,
    askPercentage: "0.00",
    bidPercentage: "0.00",
    bestPrices: { bestAsk: 0, bestBid: 0 },
  });
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });

  const subscribedRef = useRef(false);
  const previousSymbolRef = useRef<string | undefined>(undefined);
  const previousTickSizeRef = useRef<number | undefined>(undefined);

  const handleRowHover = (index: number, type: "ask" | "bid") => {
    setHoveredIndex((prev) => ({
      ...prev,
      [type]: index,
    }));
    setHoveredType(type);
    setIsHovered(true);
    const ref =
      type === "ask" ? askRefs.current[index] : bidRefs.current[index];
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

  useEffect(() => {
    if (orderBookWorker && tradesConnection?.isConnected) {
      orderBookWorker.onmessage = (event) => {
        setOrderBook(event.data);
      };
      orderBookWorker.onerror = (error) => {
        console.error("Error from worker:", error);
      };
    }
  }, [tradesConnection?.isConnected]);

  const handleOrderbookMessage = (message: any) => {
    if (message && message.data) {
      // Forward the raw orderbook data to the worker
      orderBookWorker?.postMessage(message.data);
    }
  };

  useEffect(() => {
    const setupOrderbook = () => {
      if (market?.symbol) {
        const { isEco } = market;
        const connectionKey = isEco
          ? "ecoTradesConnection"
          : "tradesConnection";
        const subscribePayload = {
          limit: isEco ? undefined : tickSizeLimitMap[tickSize],
          symbol: market.symbol,
        };

        const symbolChanged = previousSymbolRef.current !== market.symbol;
        const tickSizeChanged = previousTickSizeRef.current !== tickSize;

        if (
          ((isEco && ecoTradesConnection?.isConnected) ||
            (!isEco && tradesConnection?.isConnected)) &&
          (!subscribedRef.current || symbolChanged || tickSizeChanged)
        ) {
          subscribe(connectionKey, "orderbook", subscribePayload);
          subscribedRef.current = true;
          previousSymbolRef.current = market.symbol;
          previousTickSizeRef.current = tickSize;
        }

        const messageFilter = (message: any) =>
          message.stream && message.stream.startsWith("orderbook");
        addMessageHandler(connectionKey, handleOrderbookMessage, messageFilter);
      }
    };

    const cleanupOrderbook = () => {
      if (subscribedRef.current && market) {
        const { isEco } = market;
        const connectionKey = isEco
          ? "ecoTradesConnection"
          : "tradesConnection";
        const unsubscribePayload = {
          limit: isEco ? undefined : tickSizeLimitMap[tickSize],
          symbol: market.symbol,
        };
        unsubscribe(connectionKey, "orderbook", unsubscribePayload);
        removeMessageHandler(connectionKey, handleOrderbookMessage);
        subscribedRef.current = false;
      }

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

    setupOrderbook();

    return () => {
      cleanupOrderbook();
    };
  }, [
    market?.symbol,
    tradesConnection?.isConnected,
    ecoTradesConnection?.isConnected,
    tickSize,
    subscribe,
    unsubscribe,
    addMessageHandler,
    removeMessageHandler,
  ]);

  return (
    <div className="relative w-full flex flex-col text-xs overflow-hidden z-5 min-w-[220px]">
      <OrderbookHeader
        visible={visible}
        setVisible={setVisible}
        askPercentage={orderBook.askPercentage}
        bidPercentage={orderBook.bidPercentage}
      />
      <OrderBookTableHeader />
      <div className="flex flex-row md:flex-col">
        <div className="hidden md:block order-2 ">
          <BestPrices {...orderBook.bestPrices} />
        </div>
        {visible.asks && (
          <div className="min-h-[45vh] max-h-[45vh] overflow-hidden w-full order-1 flex flex-col-reverse bg-gradient-to-b from-transparent to-short/5 rounded-t-lg">
            {orderBook.asks.length > 0 ? (
              orderBook.asks.map((ask, index) => (
                <OrderBookRow
                  key={index}
                  index={index}
                  {...ask}
                  type="ask"
                  maxTotal={orderBook.maxAskTotal}
                  onRowHover={handleRowHover}
                  onRowLeave={handleRowLeave}
                  isSelected={
                    hoveredIndex.ask !== null && index <= hoveredIndex.ask
                  }
                  rowRef={(el) => (askRefs.current[index] = el)}
                  lastHoveredIndex={hoveredIndex.ask}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center space-y-2 opacity-60">
                  <div className="w-8 h-8 rounded-full bg-short/20 flex items-center justify-center">
                    <span className="text-short text-sm">📊</span>
                  </div>
                  <span className="text-muted-foreground text-sm font-medium">
                    {t("No Asks")}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        {visible.bids && (
          <div className="min-h-[45vh] max-h-[45vh] overflow-hidden w-full order-3 flex flex-col bg-gradient-to-t from-transparent to-long/5 rounded-b-lg">
            {orderBook.bids.length > 0 ? (
              orderBook.bids.map((bid, index) => (
                <OrderBookRow
                  key={index}
                  index={index}
                  {...bid}
                  type="bid"
                  maxTotal={orderBook.maxBidTotal}
                  onRowHover={handleRowHover}
                  onRowLeave={handleRowLeave}
                  isSelected={
                    hoveredIndex.bid !== null && index <= hoveredIndex.bid
                  }
                  rowRef={(el) => (bidRefs.current[index] = el)}
                  lastHoveredIndex={hoveredIndex.bid}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center space-y-2 opacity-60">
                  <div className="w-8 h-8 rounded-full bg-long/20 flex items-center justify-center">
                    <span className="text-long text-sm">📈</span>
                  </div>
                  <span className="text-muted-foreground text-sm font-medium">
                    {t("No Bids")}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {isHovered && (
        <DisplayTotals
          currency={market?.currency}
          pair={market?.pair}
          orderBook={orderBook}
          hoveredIndex={hoveredIndex}
          hoveredType={hoveredType}
          cardPosition={cardPosition}
          isHovered={isHovered}
        />
      )}
    </div>
  );
};

export const Orderbook = memo(OrderbookBase);
