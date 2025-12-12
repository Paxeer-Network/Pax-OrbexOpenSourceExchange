"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestPrices = void 0;
const react_1 = require("react");
const order_1 = require("@/stores/futures/order");
const market_1 = __importDefault(require("@/stores/futures/market"));
const next_i18next_1 = require("next-i18next");
const BestPricesBase = ({ bestAsk, bestBid }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { setAsk, setBid } = (0, order_1.useFuturesOrderStore)();
    (0, react_1.useEffect)(() => {
        setAsk(bestAsk);
        setBid(bestBid);
    }, [bestAsk, bestBid]);
    const { market } = (0, market_1.default)();
    const getPrecision = (type) => { var _a; return Number(((_a = market === null || market === void 0 ? void 0 : market.precision) === null || _a === void 0 ? void 0 : _a[type]) || 8); };
    return (<div className="text-center text-base p-2 text-white flex justify-between items-center">
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-600 dark:text-muted-400 font-semibold">
          {t("Ask")}
        </span>{" "}
        <span className="text-danger-500 text-lg">
          {bestAsk === null || bestAsk === void 0 ? void 0 : bestAsk.toFixed(getPrecision("price"))}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-600 dark:text-muted-400 font-semibold">
          {t("Bid")}
        </span>{" "}
        <span className="text-success-500 text-lg">
          {bestBid === null || bestBid === void 0 ? void 0 : bestBid.toFixed(getPrecision("price"))}
        </span>
      </div>
    </div>);
};
exports.BestPrices = (0, react_1.memo)(BestPricesBase);
