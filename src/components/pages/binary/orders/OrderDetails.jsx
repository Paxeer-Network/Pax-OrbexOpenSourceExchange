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
exports.OrderDetails = void 0;
const react_1 = __importStar(require("react"));
const date_fns_1 = require("date-fns");
const react_2 = require("@iconify/react");
const Progress_1 = __importDefault(require("@/components/elements/base/progress/Progress"));
const market_1 = __importDefault(require("@/stores/trade/market"));
const useBinaryCountdown_1 = require("@/hooks/useBinaryCountdown");
const OrderDetails = ({ order }) => {
    var _a;
    const priceChangeData = (0, market_1.default)((state) => state.priceChangeData);
    const [timeLeft, setTimeLeft] = (0, react_1.useState)(0);
    const [progress, setProgress] = (0, react_1.useState)(0);
    const [profit, setProfit] = (0, react_1.useState)(0);
    const binaryRiseFallProfit = parseFloat(process.env.NEXT_PUBLIC_BINARY_PROFIT || "87");
    const binaryHigherLowerProfit = parseFloat(process.env.NEXT_PUBLIC_BINARY_HIGHER_LOWER_PROFIT || "87");
    const binaryTouchNoTouchProfit = parseFloat(process.env.NEXT_PUBLIC_BINARY_TOUCH_NO_TOUCH_PROFIT || "87");
    const binaryCallPutProfit = parseFloat(process.env.NEXT_PUBLIC_BINARY_CALL_PUT_PROFIT || "87");
    const binaryTurboProfit = parseFloat(process.env.NEXT_PUBLIC_BINARY_TURBO_PROFIT || "87");
    const profitForOrderType = (type) => {
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
    const calcValues = (0, react_1.useCallback)(() => {
        var _a;
        if (!order)
            return;
        const { closedAt, createdAt, amount, side, symbol, price, status, barrier, strikePrice, payoutPerPoint, type, } = order;
        const orderPrice = parseFloat(String(price)) || 0;
        const totalTime = (new Date(closedAt).getTime() - new Date(createdAt).getTime()) / 1000;
        const currentTime = new Date().getTime();
        const totalSeconds = Math.max(0, (new Date(closedAt).getTime() - currentTime) / 1000);
        const elapsedSeconds = totalTime - totalSeconds;
        const progressPercentage = Math.max((elapsedSeconds / totalTime) * 100, 0);
        setTimeLeft(totalSeconds);
        setProgress(progressPercentage);
        const fetchedPrice = (_a = priceChangeData[symbol]) === null || _a === void 0 ? void 0 : _a.price;
        const currentMarketPrice = fetchedPrice !== undefined
            ? parseFloat(String(fetchedPrice)) || orderPrice
            : orderPrice;
        // If order completed, profit is fixed by backend
        if (status !== "PENDING") {
            setProfit(order.profit || 0);
            return;
        }
        // For PENDING:
        const profitPerc = profitForOrderType(type);
        let calcProfit = 0;
        switch (type) {
            case "RISE_FALL":
                if (side === "RISE") {
                    calcProfit =
                        currentMarketPrice > orderPrice
                            ? amount * (profitPerc / 100)
                            : -amount;
                }
                else {
                    calcProfit =
                        currentMarketPrice < orderPrice
                            ? amount * (profitPerc / 100)
                            : -amount;
                }
                break;
            case "HIGHER_LOWER":
                if (barrier) {
                    if (side === "HIGHER") {
                        calcProfit =
                            currentMarketPrice > barrier
                                ? amount * (profitPerc / 100)
                                : -amount;
                    }
                    else {
                        calcProfit =
                            currentMarketPrice < barrier
                                ? amount * (profitPerc / 100)
                                : -amount;
                    }
                }
                break;
            case "TOUCH_NO_TOUCH":
                // Pending logic guess: If close to barrier, guess TOUCH scenario:
                if (barrier) {
                    const diff = Math.abs((currentMarketPrice - barrier) / barrier);
                    const touchedNow = diff < 0.001;
                    if (side === "TOUCH") {
                        calcProfit = touchedNow ? amount * (profitPerc / 100) : -amount;
                    }
                    else {
                        calcProfit = touchedNow ? -amount : amount * (profitPerc / 100);
                    }
                }
                break;
            case "CALL_PUT":
                if (strikePrice) {
                    if (side === "CALL") {
                        calcProfit =
                            currentMarketPrice > strikePrice
                                ? amount * (profitPerc / 100)
                                : -amount;
                    }
                    else {
                        calcProfit =
                            currentMarketPrice < strikePrice
                                ? amount * (profitPerc / 100)
                                : -amount;
                    }
                }
                break;
            case "TURBO":
                if (barrier && payoutPerPoint) {
                    const difference = side === "UP"
                        ? currentMarketPrice - barrier
                        : barrier - currentMarketPrice;
                    if (difference > 0) {
                        const payoutValue = difference * payoutPerPoint;
                        if (payoutValue > amount) {
                            calcProfit = payoutValue - amount;
                        }
                        else if (payoutValue === amount) {
                            calcProfit = 0;
                        }
                        else {
                            calcProfit = -amount;
                        }
                    }
                    else if (difference === 0) {
                        calcProfit = 0; // draw-like scenario
                    }
                    else {
                        calcProfit = -amount;
                    }
                }
                break;
        }
        if (totalSeconds > 50) {
            calcProfit = calcProfit * (progressPercentage / 100);
        }
        setProfit(calcProfit);
    }, [order, priceChangeData]);
    (0, react_1.useEffect)(() => {
        if (!order)
            return;
        calcValues();
    }, [order, priceChangeData, calcValues]);
    (0, react_1.useEffect)(() => {
        if (order && order.status === "PENDING") {
            const interval = setInterval(() => {
                calcValues();
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [order, calcValues]);
    if (!order)
        return null;
    const { side, status, type } = order;
    const displayPrice = status === "PENDING"
        ? ((_a = priceChangeData[order.symbol]) === null || _a === void 0 ? void 0 : _a.price) || order.price || 0
        : order.closePrice;
    let priceColor = "text-gray-400";
    const orderPrice = order.price;
    if (["RISE", "CALL", "TOUCH", "HIGHER", "UP"].includes(side)) {
        priceColor =
            displayPrice > orderPrice
                ? "text-green-500"
                : displayPrice < orderPrice
                    ? "text-red-500"
                    : "text-gray-400";
    }
    else {
        priceColor =
            displayPrice < orderPrice
                ? "text-green-500"
                : displayPrice > orderPrice
                    ? "text-red-500"
                    : "text-gray-400";
    }
    const SideIcon = ["RISE", "HIGHER", "UP", "CALL", "TOUCH"].includes(side) ? (<react_2.Icon icon="ant-design:arrow-up-outlined" className="text-green-500"/>) : (<react_2.Icon icon="ant-design:arrow-down-outlined" className="text-red-500"/>);
    return (<div className="p-4 overflow-auto bg-white dark:bg-muted-900 rounded-md border border-muted-200 dark:border-muted-800">
      {/* Header Section */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            {SideIcon}
            {order.symbol}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            {(0, date_fns_1.format)(new Date(order.createdAt), "yyyy-MM-dd HH:mm")} - {side}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-block px-2 py-1 text-sm font-medium rounded-md ${profit > 0
            ? "bg-green-100 text-green-700"
            : profit < 0
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-600"}`}>
            Profit: {profit.toFixed(2)}
          </span>
        </div>
      </div>

      {/* If pending, show countdown and progress. Otherwise, show closed date */}
      {status === "PENDING" ? (<div className="mb-4">
          <div className="flex items-center gap-2 text-sm">
            <react_2.Icon icon="mdi:timer-outline" className="text-muted-500"/>
            <span className="text-neutral-600 dark:text-neutral-400">
              Ends in: {(0, useBinaryCountdown_1.formatTime)(timeLeft)}
            </span>
          </div>
          <Progress_1.default size="xs" value={progress}/>
        </div>) : (<div className="mb-4 flex items-center gap-2 text-sm">
          <react_2.Icon icon="mdi:calendar-check-outline" className="text-muted-500"/>
          <span className="text-neutral-600 dark:text-neutral-400">
            Closed At: {(0, date_fns_1.format)(new Date(order.closedAt), "yyyy-MM-dd HH:mm:ss")}
          </span>
        </div>)}

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-neutral-700 dark:text-neutral-200">
        <div className="flex flex-col">
          <span className="text-neutral-500 dark:text-neutral-400 font-medium">
            Start Price
          </span>
          <span className="font-semibold">{order.price}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-neutral-500 dark:text-neutral-400 font-medium">
            {status === "PENDING" ? "Current Price" : "Close Price"}
          </span>
          <span className={`font-semibold ${priceColor}`}>{displayPrice}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-neutral-500 dark:text-neutral-400 font-medium">
            Side
          </span>
          <span className="font-semibold flex items-center gap-1">
            {SideIcon} {side}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-neutral-500 dark:text-neutral-400 font-medium">
            Amount
          </span>
          <span className="font-semibold">{order.amount}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-neutral-500 dark:text-neutral-400 font-medium">
            Type
          </span>
          <span className="font-semibold">
            {order.isDemo ? "Demo" : "Real"} ({type})
          </span>
        </div>

        {status === "PENDING" && (<div className="flex flex-col">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">
              Expires At
            </span>
            <span className="font-semibold">
              {(0, date_fns_1.format)(new Date(order.closedAt), "yyyy-MM-dd HH:mm:ss")}
            </span>
          </div>)}

        {/* Show additional fields per type */}
        {["HIGHER_LOWER", "TOUCH_NO_TOUCH", "TURBO"].includes(type) &&
            order.barrier && (<div className="flex flex-col">
              <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                Barrier
              </span>
              <span className="font-semibold">{order.barrier}</span>
            </div>)}

        {type === "CALL_PUT" && order.strikePrice && (<div className="flex flex-col">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">
              Strike Price
            </span>
            <span className="font-semibold">{order.strikePrice}</span>
          </div>)}

        {type === "CALL_PUT" && order.payoutPerPoint && (<div className="flex flex-col">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">
              Payout/Point
            </span>
            <span className="font-semibold">{order.payoutPerPoint}</span>
          </div>)}

        {type === "TURBO" && order.payoutPerPoint && (<div className="flex flex-col">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">
              Payout/Point
            </span>
            <span className="font-semibold">{order.payoutPerPoint}</span>
          </div>)}
      </div>
    </div>);
};
exports.OrderDetails = OrderDetails;
