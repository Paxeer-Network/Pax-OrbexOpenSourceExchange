import { memo } from "react";
import useMarketStore from "@/stores/trade/market";

const OrderBookRowBase = ({
  index,
  price,
  amount,
  total,
  type,
  maxTotal,
  onRowHover,
  onRowLeave,
  isSelected,
  rowRef,
  lastHoveredIndex,
}) => {
  const bgWidth = `${(total / maxTotal) * 100}%`;
  const { market } = useMarketStore();
  const getPrecision = (type) => Number(market?.precision?.[type] || 8);

  return (
    <div
      ref={rowRef}
      className={`orderbook-row ${type === "ask" ? "orderbook-ask" : "orderbook-bid"} flex justify-between px-3 py-2 cursor-pointer relative w-full transition-all duration-200 ${
        index === lastHoveredIndex
          ? `border-dashed ${
              type === "ask" ? "border-t border-short/50" : "border-b border-long/50"
            }`
          : ""
      }
        ${
          isSelected 
            ? type === "ask" 
              ? "bg-short-soft border-l-2 border-short/50" 
              : "bg-long-soft border-l-2 border-long/50"
            : "bg-transparent hover:bg-muted/30"
        }
        `}
      onMouseEnter={() => onRowHover(index, type)}
      onMouseLeave={onRowLeave}
    >
      <div className="flex justify-between w-full z-10">
        <div
          className={`w-[50%] font-medium text-sm ${
            type === "ask" ? "text-short" : "text-long"
          } transition-colors hover:brightness-110`}
        >
          {price.toLocaleString(undefined, {
            minimumFractionDigits: getPrecision("price"),
            maximumFractionDigits: getPrecision("price"),
          })}
        </div>
        <div className="text-muted-foreground text-sm font-mono hidden sm:block">
          {amount.toLocaleString(undefined, {
            minimumFractionDigits: getPrecision("amount"),
            maximumFractionDigits: getPrecision("amount"),
          })}
        </div>
        <div className="w-[30%] text-end text-muted-800 text-sm dark:text-muted-200">
          {total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
      <div
        className={`absolute top-0 bottom-0 left-0 right-0 z-0 transition-all duration-300 ease-in-out bg-${
          type === "ask" ? "danger" : "success"
        }-500`}
        style={{ width: bgWidth, opacity: 0.25 }}
      ></div>
    </div>
  );
};

export const OrderBookRow = memo(OrderBookRowBase);
