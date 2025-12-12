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
exports.DynamicClosePriceCell = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("react");
const market_1 = __importDefault(require("@/stores/trade/market"));
const useBinaryCountdown_1 = require("@/hooks/useBinaryCountdown");
const Progress_1 = __importDefault(require("@/components/elements/base/progress/Progress"));
const DynamicClosePriceCellComponent = ({ order, getPrecision, t, statusClass, }) => {
    const priceChangeData = (0, market_1.default)((state) => state.priceChangeData);
    const [displayData, setDisplayData] = (0, react_1.useState)(null);
    const updateDisplay = (0, react_1.useCallback)(() => {
        var _a;
        const { closedAt, createdAt, price, status, side, symbol, closePrice } = order;
        const orderPrice = parseFloat(String(price)) || 0;
        const fetchedPrice = (_a = priceChangeData[symbol]) === null || _a === void 0 ? void 0 : _a.price;
        const currentPrice = fetchedPrice !== undefined
            ? parseFloat(String(fetchedPrice)) || orderPrice
            : orderPrice;
        const finalClosePrice = status === "PENDING" ? currentPrice : closePrice;
        const usedPrice = finalClosePrice || currentPrice;
        const change = usedPrice - orderPrice;
        const percentage = (change / orderPrice) * 100;
        const totalTime = (new Date(closedAt).getTime() - new Date(createdAt).getTime()) / 1000;
        const currentTime = new Date().getTime();
        const totalSeconds = Math.max((new Date(closedAt).getTime() - currentTime) / 1000, 0);
        const elapsedSeconds = totalTime - totalSeconds;
        const progressPercentage = Math.max((elapsedSeconds / totalTime) * 100, 0);
        // Determine color based on side and whether it's profitable or not
        let currentPriceColor = "text-gray-400";
        const isRiseSide = ["RISE", "CALL", "TOUCH", "HIGHER", "UP"].includes(side.toUpperCase());
        if (isRiseSide) {
            // For "rise"-type orders, a positive change is good (green), negative is bad (red)
            currentPriceColor = change >= 0 ? "text-green-500" : "text-red-500";
        }
        else {
            // For "fall"-type orders, a negative change is good (green), positive is bad (red)
            currentPriceColor = change <= 0 ? "text-green-500" : "text-red-500";
        }
        if (status === "PENDING") {
            // Show live price, countdown, and progress bar
            setDisplayData(<div className="flex flex-col gap-1">
          <span className={`${currentPriceColor} flex gap-2 items-center`}>
            <span>{usedPrice === null || usedPrice === void 0 ? void 0 : usedPrice.toFixed(getPrecision("price"))}</span>
            <span>
              ({change > 0 && "+"}
              {percentage.toFixed(2)}%)
            </span>
            <span className="text-warning-500 ml-2">
              {(0, useBinaryCountdown_1.formatTime)(totalSeconds)}
            </span>
          </span>
          <Progress_1.default size="xs" value={progressPercentage}/>
        </div>);
        }
        else {
            // Completed order
            setDisplayData(<div className="flex flex-col gap-1">
          <span className={`${currentPriceColor} flex gap-2 items-center`}>
            <span>{usedPrice === null || usedPrice === void 0 ? void 0 : usedPrice.toFixed(getPrecision("price"))}</span>
            <span>
              ({change > 0 && "+"}
              {percentage.toFixed(2)}%)
            </span>
          </span>
        </div>);
        }
    }, [order, priceChangeData, getPrecision]);
    (0, react_1.useEffect)(() => {
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
exports.DynamicClosePriceCell = (0, react_2.memo)(DynamicClosePriceCellComponent);
