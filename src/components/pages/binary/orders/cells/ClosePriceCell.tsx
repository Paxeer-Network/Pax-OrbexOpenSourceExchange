import React, { useEffect, useState, useCallback, ReactNode } from "react";
import { memo } from "react";
import useMarketStore from "@/stores/trade/market";
import { formatTime } from "@/hooks/useBinaryCountdown";
import Progress from "@/components/elements/base/progress/Progress";

type DynamicClosePriceCellProps = {
  order: any;
  getPrecision: (type: string) => number;
  t: (key: string) => string;
  statusClass: (status: string) => string;
};

const DynamicClosePriceCellComponent: React.FC<DynamicClosePriceCellProps> = ({
  order,
  getPrecision,
  t,
  statusClass,
}) => {
  const priceChangeData = useMarketStore((state) => state.priceChangeData);
  const [displayData, setDisplayData] = useState<ReactNode>(null);

  const updateDisplay = useCallback(() => {
    const { closedAt, createdAt, price, status, side, symbol, closePrice } =
      order;
    const orderPrice = parseFloat(String(price)) || 0;
    const fetchedPrice = priceChangeData[symbol]?.price;
    const currentPrice =
      fetchedPrice !== undefined
        ? parseFloat(String(fetchedPrice)) || orderPrice
        : orderPrice;

    const finalClosePrice = status === "PENDING" ? currentPrice : closePrice;
    const usedPrice = finalClosePrice || currentPrice;
    const change = usedPrice - orderPrice;
    const percentage = (change / orderPrice) * 100;

    const totalTime =
      (new Date(closedAt).getTime() - new Date(createdAt).getTime()) / 1000;
    const currentTime = new Date().getTime();
    const totalSeconds = Math.max(
      (new Date(closedAt).getTime() - currentTime) / 1000,
      0
    );
    const elapsedSeconds = totalTime - totalSeconds;
    const progressPercentage = Math.max((elapsedSeconds / totalTime) * 100, 0);

    // Determine color based on side and whether it's profitable or not
    let currentPriceColor = "text-gray-400";
    const isRiseSide = ["RISE", "CALL", "TOUCH", "HIGHER", "UP"].includes(
      side.toUpperCase()
    );

    if (isRiseSide) {
      // For "rise"-type orders, a positive change is good (green), negative is bad (red)
      currentPriceColor = change >= 0 ? "text-green-500" : "text-red-500";
    } else {
      // For "fall"-type orders, a negative change is good (green), positive is bad (red)
      currentPriceColor = change <= 0 ? "text-green-500" : "text-red-500";
    }

    if (status === "PENDING") {
      // Show live price, countdown, and progress bar
      setDisplayData(
        <div className="flex flex-col gap-1">
          <span className={`${currentPriceColor} flex gap-2 items-center`}>
            <span>{usedPrice?.toFixed(getPrecision("price"))}</span>
            <span>
              ({change > 0 && "+"}
              {percentage.toFixed(2)}%)
            </span>
            <span className="text-warning-500 ml-2">
              {formatTime(totalSeconds)}
            </span>
          </span>
          <Progress size="xs" value={progressPercentage} />
        </div>
      );
    } else {
      // Completed order
      setDisplayData(
        <div className="flex flex-col gap-1">
          <span className={`${currentPriceColor} flex gap-2 items-center`}>
            <span>{usedPrice?.toFixed(getPrecision("price"))}</span>
            <span>
              ({change > 0 && "+"}
              {percentage.toFixed(2)}%)
            </span>
          </span>
        </div>
      );
    }
  }, [order, priceChangeData, getPrecision]);

  useEffect(() => {
    updateDisplay();
    const interval = setInterval(() => {
      if (order.status === "PENDING") {
        updateDisplay();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [order, updateDisplay]);

  return <>{displayData}</>;
};

export const DynamicClosePriceCell = memo(DynamicClosePriceCellComponent);
