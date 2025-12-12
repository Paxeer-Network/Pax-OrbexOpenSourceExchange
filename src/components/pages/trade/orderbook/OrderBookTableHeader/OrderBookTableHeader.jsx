"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBookTableHeader = void 0;
const react_1 = require("react");
const next_i18next_1 = require("next-i18next");
const market_1 = __importDefault(require("@/stores/trade/market"));
const OrderBookTableHeaderBase = ({}) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { market } = (0, market_1.default)();
    return (<>
      <div className="flex w-full">
        <div className="flex justify-between p-2 bg-muted-100 dark:bg-muted-900 text-muted-800 dark:text-muted-200 w-full">
          <span className="w-[50%] cursor-default">
            {t("Price")}({market === null || market === void 0 ? void 0 : market.pair})
          </span>
          <span className="w-[20%] cursor-default hidden sm:block">
            {t("Amount")}({market === null || market === void 0 ? void 0 : market.currency})
          </span>
          <span className="w-[30%] text-end cursor-default">{t("Total")}</span>
        </div>

        <div className="flex justify-between p-2 bg-muted-100 dark:bg-muted-900 text-muted-800 dark:text-muted-200 w-full md:hidden">
          <span className="w-[50%] cursor-default">
            {t("Price")}({market === null || market === void 0 ? void 0 : market.pair})
          </span>
          <span className="w-[20%] cursor-default hidden sm:block">
            {t("Amount")}({market === null || market === void 0 ? void 0 : market.currency})
          </span>
          <span className="w-[30%] text-end cursor-default">{t("Total")}</span>
        </div>
      </div>
    </>);
};
exports.OrderBookTableHeader = (0, react_1.memo)(OrderBookTableHeaderBase);
