"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDetails = void 0;
const react_1 = require("react");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const next_i18next_1 = require("next-i18next");
const lodash_1 = require("lodash");
const ProductDetailsBase = ({ product, categoryName }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Card_1.default className="text-muted-800 dark:text-muted-200 text-sm" color="contrast">
      <h3 className="text-md font-semibold px-5 py-3">
        {t("Product Details")}
      </h3>
      <ul className="flex flex-col gap-1">
        <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between px-5 pb-1">
          <p className="text-muted-500 dark:text-muted-300">{t("Name")}</p>{" "}
          {product === null || product === void 0 ? void 0 : product.name}
        </li>
        <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between px-5 pb-1">
          <p className="text-muted-500 dark:text-muted-300">{t("Category")}</p>{" "}
          {categoryName}
        </li>
        <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between px-5 pb-1">
          <p className="text-muted-500 dark:text-muted-300">{t("Type")}</p>{" "}
          {(0, lodash_1.capitalize)(product === null || product === void 0 ? void 0 : product.type)}
        </li>
        <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between px-5 pb-1">
          <p className="text-muted-500 dark:text-muted-300">{t("Price")}</p>{" "}
          {product === null || product === void 0 ? void 0 : product.price} {product === null || product === void 0 ? void 0 : product.currency}
        </li>
        <li className="flex justify-between px-5 pb-2">
          <p className="text-muted-500 dark:text-muted-300">{t("Stock")}</p>{" "}
          {product === null || product === void 0 ? void 0 : product.inventoryQuantity}
        </li>
      </ul>
    </Card_1.default>);
};
exports.ProductDetails = (0, react_1.memo)(ProductDetailsBase);
