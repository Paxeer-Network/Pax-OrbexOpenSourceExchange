import React, { useEffect, useState, useCallback } from "react";
import useMarketStore from "@/stores/trade/market";
import { memo } from "react";

// Environment-based profits
const binaryRiseFallProfit = parseFloat(
  process.env.NEXT_PUBLIC_BINARY_PROFIT || "87"
);
const binaryHigherLowerProfit = parseFloat(
  process.env.NEXT_PUBLIC_BINARY_HIGHER_LOWER_PROFIT || "87"
);
const binaryTouchNoTouchProfit = parseFloat(
  process.env.NEXT_PUBLIC_BINARY_TOUCH_NO_TOUCH_PROFIT || "87"
);
const binaryCallPutProfit = parseFloat(
  process.env.NEXT_PUBLIC_BINARY_CALL_PUT_PROFIT || "87"
);
const binaryTurboProfit = parseFloat(
  process.env.NEXT_PUBLIC_BINARY_TURBO_PROFIT || "87"
);

type DynamicProfitCellProps = {
  order: any;
  getPrecision: (type: string) => number;
};

type OrderType =
  | "RISE_FALL"
  | "HIGHER_LOWER"
  | "TOUCH_NO_TOUCH"
  | "CALL_PUT"
  | "TURBO";
type OrderSide =
  | "RISE"
  | "FALL"
  | "HIGHER"
  | "LOWER"
  | "TOUCH"
  | "NO_TOUCH"
  | "CALL"
  | "PUT"
  | "UP"
  | "DOWN";
type OrderStatus = "WIN" | "LOSS" | "DRAW" | "PENDING";

const DynamicProfitCellComponent: React.FC<DynamicProfitCellProps> = ({
  order,
  getPrecision,
}) => {
  const priceChangeData = useMarketStore((state) => state.priceChangeData);
  const [profit, setProfit] = useState(0);

  const profitForOrderType = (type: OrderType) => {
    switch (type) {
      case "HIGHER_LOWER":
        return binaryHigherLowerProfit;
      case "TOUCH_NO_TOUCH":
        return binaryTouchNoTouchProfit;
      case "CALL_PUT":
        return binaryCallPutProfit;
      case "TURBO":
        return binaryTurboProfit;
      case "RISE_FALL":
      default:
        return binaryRiseFallProfit;
    }
  };

  const calcProfit = useCallback(() => {
    if (!order) return;

    const {
      closedAt,
      createdAt,
      amount,
      side,
      symbol,
      price,
      status,
      barrier,
      strikePrice,
      payoutPerPoint,
      type,
    } = order;
    const orderType = type as OrderType;
    const orderSide = side as OrderSide;
    const orderStatus = status as OrderStatus;

    const orderPrice = parseFloat(String(price)) || 0;
    const fetchedPrice = priceChangeData[symbol]?.price;
    const currentPrice =
      fetchedPrice !== undefined
        ? parseFloat(String(fetchedPrice)) || orderPrice
        : orderPrice;

    const totalTime =
      (new Date(closedAt).getTime() - new Date(createdAt).getTime()) / 1000;
    const currentTime = new Date().getTime();
    const totalSeconds = Math.max(
      0,
      (new Date(closedAt).getTime() - currentTime) / 1000
    );
    const elapsedSeconds = totalTime - totalSeconds;
    const progressPercentage = Math.max((elapsedSeconds / totalTime) * 100, 0);

    const profitPerc = profitForOrderType(orderType);

    let calcProfit = 0;

    // Determine order result condition based on type
    if (orderStatus === "PENDING") {
      // We simulate final outcome for UI
      switch (orderType) {
        case "RISE_FALL":
          calcProfit =
            orderSide === "RISE"
              ? currentPrice > orderPrice
                ? amount * (profitPerc / 100)
                : -amount
              : currentPrice < orderPrice
                ? amount * (profitPerc / 100)
                : -amount;
          break;

        case "HIGHER_LOWER":
          if (!barrier) break;
          if (orderSide === "HIGHER") {
            calcProfit =
              currentPrice > barrier ? amount * (profitPerc / 100) : -amount;
          } else {
            calcProfit =
              currentPrice < barrier ? amount * (profitPerc / 100) : -amount;
          }
          break;

        case "TOUCH_NO_TOUCH":
          if (!barrier) break;
          // Can't know if touched without backend logic, but let's assume:
          // If currentPrice has reached barrier at any point (we can't know from client), just approximate:
          // For pending, we only guess based on current price:
          // This is tricky because the real logic depends on OHLC data.
          // For simplicity: if currentPrice ~ barrier -> random guess
          // Let's just use a heuristic: if difference <1%, guess touched for TOUCH:
          const diff = Math.abs((currentPrice - barrier) / barrier);
          const touchedNow = diff < 0.001; // mock heuristic
          if (orderSide === "TOUCH") {
            calcProfit = touchedNow ? amount * (profitPerc / 100) : -amount;
          } else {
            calcProfit = touchedNow ? -amount : amount * (profitPerc / 100);
          }
          break;

        case "CALL_PUT":
          if (!strikePrice) break;
          if (orderSide === "CALL") {
            calcProfit =
              currentPrice > strikePrice
                ? amount * (profitPerc / 100)
                : -amount;
          } else {
            calcProfit =
              currentPrice < strikePrice
                ? amount * (profitPerc / 100)
                : -amount;
          }
          break;

        case "TURBO":
          if (!barrier || !payoutPerPoint) break;
          // Turbo logic:
          // If no breach (hard to know from front-end), we consider final difference:
          const difference =
            orderSide === "UP"
              ? currentPrice - barrier
              : barrier - currentPrice;
          if (difference === 0) {
            calcProfit = 0; // draw scenario if ended now
          } else if (difference > 0) {
            const payoutValue = difference * payoutPerPoint;
            if (payoutValue > amount) {
              calcProfit = payoutValue - amount;
            } else if (payoutValue === amount) {
              calcProfit = 0;
            } else {
              calcProfit = -amount;
            }
          } else {
            // negative difference means loss
            calcProfit = -amount;
          }
          break;
      }

      // If pending and more than 50 seconds remain, scale profit
      if (totalSeconds > 50) {
        calcProfit = calcProfit * (progressPercentage / 100);
      } else {
        // Once within 50 seconds, we consider final scenario as is
      }
    } else {
      // Order finished: use final outcome
      // The backend sets order.status and order.profit, we can just trust order.profit if available
      // But if we must recalc:
      switch (orderStatus) {
        case "WIN":
          calcProfit = order.profit; // already set by backend
          break;
        case "LOSS":
          calcProfit = -amount;
          break;
        case "DRAW":
          calcProfit = 0;
          break;
      }
    }

    setProfit(calcProfit);
  }, [order, priceChangeData]);

  useEffect(() => {
    calcProfit();

    let interval: number | undefined;
    if (order.status === "PENDING") {
      interval = window.setInterval(() => {
        calcProfit();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [order, calcProfit]);

  const profitColor =
    profit > 0
      ? "text-green-500"
      : profit < 0
        ? "text-red-500"
        : "text-gray-400";

  const symbol = profit > 0 ? "+" : profit < 0 ? "-" : "";
  const formattedProfit = `${symbol}${Math.abs(profit).toFixed(getPrecision("price"))}`;

  return <span className={profitColor}>{formattedProfit}</span>;
};

export const DynamicProfitCell = memo(DynamicProfitCellComponent);
