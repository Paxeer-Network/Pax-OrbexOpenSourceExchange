"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticker = void 0;
const react_1 = require("react");
const market_1 = __importDefault(require("@/stores/trade/market"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const TickerBase = ({}) => {
    const { market, priceChangeData } = (0, market_1.default)();
    return (priceChangeData[`${market === null || market === void 0 ? void 0 : market.symbol}`] && (<div className="flex items-center gap-2">
        <Card_1.default className="p-[1px] px-3 flex flex-col text-xs" shape={"rounded-sm"}>
          <span className="text-muted-500 dark:text-muted-400">
            {market === null || market === void 0 ? void 0 : market.symbol}
          </span>
          <span className="text-mutted-800 dark:text-muted-200 text-sm">
            {priceChangeData[`${market === null || market === void 0 ? void 0 : market.symbol}`].price}
          </span>
        </Card_1.default>
      </div>));
};
exports.Ticker = (0, react_1.memo)(TickerBase);
