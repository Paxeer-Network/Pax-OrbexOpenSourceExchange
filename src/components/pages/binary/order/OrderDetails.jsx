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
const react_1 = __importStar(require("react"));
const next_i18next_1 = require("next-i18next");
const Progress_1 = __importDefault(require("@/components/elements/base/progress/Progress"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const order_1 = require("@/stores/binary/order");
const market_1 = __importDefault(require("@/stores/trade/market"));
const useBinaryCountdown_1 = require("@/hooks/useBinaryCountdown");
const lodash_1 = require("lodash");
const binaryProfit = parseFloat(process.env.NEXT_PUBLIC_BINARY_PROFIT || "87");
const OrderDetails = ({ currency, pair, price, side, createdAt, closedAt, amount, orderId, isPractice, }) => {
    var _a, _b, _c;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { cancelOrder, updatePracticeBalance } = (0, order_1.useBinaryOrderStore)();
    const { priceChangeData } = (0, market_1.default)();
    const [timeLeft, setTimeLeft] = (0, react_1.useState)(Math.max(0, (new Date(closedAt).getTime() - new Date().getTime()) / 1000));
    const [progress, setProgress] = (0, react_1.useState)(0);
    const [profit, setProfit] = (0, react_1.useState)(0);
    const totalTime = (new Date(closedAt).getTime() - new Date(createdAt).getTime()) / 1000;
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            var _a;
            const currentTime = new Date().getTime();
            const totalSeconds = Math.max(0, (new Date(closedAt).getTime() - currentTime) / 1000);
            const elapsedSeconds = totalTime - totalSeconds;
            const progressPercentage = Math.max(0, (elapsedSeconds / totalTime) * 100);
            setTimeLeft(totalSeconds);
            setProgress(progressPercentage);
            const currentPrice = ((_a = priceChangeData[`${currency}/${pair}`]) === null || _a === void 0 ? void 0 : _a.price) || price;
            let profit = 0;
            if (side === "RISE") {
                if (currentPrice > price) {
                    profit = amount * (binaryProfit / 100);
                }
                else {
                    profit = -amount;
                }
            }
            else if (side === "FALL") {
                if (currentPrice < price) {
                    profit = amount * (binaryProfit / 100);
                }
                else {
                    profit = -amount;
                }
            }
            // Calculate profit based on progress, except for the last 50 seconds
            if (totalSeconds > 50) {
                profit = profit * (progressPercentage / 100);
            }
            else {
                // Show full profit or loss in the last 50 seconds
                profit = profit > 0 ? amount * (binaryProfit / 100) : -amount;
            }
            setProfit(profit);
            if (totalSeconds <= 0) {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [
        closedAt,
        amount,
        totalTime,
        priceChangeData,
        currency,
        pair,
        side,
        price,
    ]);
    const profitColor = profit > 0
        ? "text-green-500"
        : profit < 0
            ? "text-red-500"
            : "text-muted-500";
    const currentPriceColor = side === "RISE"
        ? ((_a = priceChangeData[`${currency}/${pair}`]) === null || _a === void 0 ? void 0 : _a.price) > price
            ? "text-green-500"
            : "text-red-500"
        : ((_b = priceChangeData[`${currency}/${pair}`]) === null || _b === void 0 ? void 0 : _b.price) < price
            ? "text-green-500"
            : "text-red-500";
    return (<div className="absolute top-5 left-5 text-md max-w-xs w-64 text-muted-800 dark:text-muted-200">
      <Card_1.default className="p-4" shadow={"flat"}>
        <p>
          {t("Start Price")}: {price}
        </p>
        <p className={currentPriceColor}>
          {t("Current Price")}:{" "}
          {((_c = priceChangeData[`${currency}/${pair}`]) === null || _c === void 0 ? void 0 : _c.price) || price}
        </p>
        <p>
          {t("Side")}: {(0, lodash_1.capitalize)(side)}
        </p>
        <p>
          {t("Ends in")}: {(0, useBinaryCountdown_1.formatTime)(timeLeft)}
        </p>
        <Progress_1.default size="xs" value={progress}/>
        <p className={`mt-2 ${profitColor}`}>
          {t("Profit")}: {profit.toFixed(2)}
        </p>
        {/* <Button
          type="button"
          className="mt-2 w-full"
          onClick={() => cancelOrder(orderId, pair, isPractice, amount)}
          disabled={timeLeft <= 50}
          loading={timeLeft <= 1}
          color="primary"
          size="sm"
          shape="rounded"
        >
          {t("Close Order")}
        </Button> */}
      </Card_1.default>
    </div>);
};
exports.default = OrderDetails;
