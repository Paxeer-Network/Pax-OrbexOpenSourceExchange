"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeRow = void 0;
const react_1 = require("react");
const market_1 = __importDefault(require("@/stores/trade/market"));
const TradeRowBase = ({ trade }) => {
    const { market } = (0, market_1.default)();
    const getPrecision = (type) => { var _a; return Number(((_a = market === null || market === void 0 ? void 0 : market.precision) === null || _a === void 0 ? void 0 : _a[type]) || 8); };
    return (<div className={`text-sm flex gap-2 ${(trade === null || trade === void 0 ? void 0 : trade.side) === "buy" ? "text-success-500" : "text-danger-500"}`}>
      <span className="w-[40%]">
        {trade === null || trade === void 0 ? void 0 : trade.price.toFixed(getPrecision("price"))}
      </span>
      <span className="w-[40%]">
        {trade === null || trade === void 0 ? void 0 : trade.amount.toFixed(getPrecision("amount"))}
      </span>
      <span className="w-[20%]">{trade === null || trade === void 0 ? void 0 : trade.time}</span>
    </div>);
};
exports.TradeRow = (0, react_1.memo)(TradeRowBase);
