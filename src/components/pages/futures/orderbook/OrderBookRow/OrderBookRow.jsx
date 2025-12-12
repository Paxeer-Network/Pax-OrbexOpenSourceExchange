"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBookRow = void 0;
const react_1 = require("react");
const market_1 = __importDefault(require("@/stores/trade/market"));
const OrderBookRowBase = ({ index, price, amount, total, type, maxTotal, onRowHover, onRowLeave, isSelected, rowRef, lastHoveredIndex, }) => {
    const bgWidth = `${(total / maxTotal) * 100}%`;
    const { market } = (0, market_1.default)();
    const getPrecision = (type) => { var _a; return Number(((_a = market === null || market === void 0 ? void 0 : market.precision) === null || _a === void 0 ? void 0 : _a[type]) || 8); };
    return (<div ref={rowRef} className={`flex justify-between px-2 py-[2px] cursor-pointer relative w-full grow ${index === lastHoveredIndex
            ? `border-dashed ${type === "ask" ? "border-t pt-[1px]!" : "border-b pb-[1px]!"} border-muted-300`
            : ""}
        ${isSelected ? "bg-muted-100 dark:bg-muted-800" : "bg-transparent"}
        
        `} onMouseEnter={() => onRowHover(index, type)} onMouseLeave={onRowLeave}>
      <div className="flex justify-between w-full z-10">
        <div className={`w-[50%] text-${type === "ask" ? "danger" : "success"}-500 text-sm dark:text-${type === "ask" ? "danger" : "success"}-400`}>
          {price.toLocaleString(undefined, {
            minimumFractionDigits: getPrecision("price"),
            maximumFractionDigits: getPrecision("price"),
        })}
        </div>
        <div className="text-muted-800 text-sm dark:text-muted-200 hidden sm:block">
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
      <div className={`absolute top-0 bottom-0 left-0 right-0 z-0 transition-all duration-300 ease-in-out bg-${type === "ask" ? "danger" : "success"}-500`} style={{ width: bgWidth, opacity: 0.25 }}></div>
    </div>);
};
exports.OrderBookRow = (0, react_1.memo)(OrderBookRowBase);
