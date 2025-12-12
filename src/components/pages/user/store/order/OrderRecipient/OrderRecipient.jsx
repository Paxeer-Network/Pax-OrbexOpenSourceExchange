"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRecipient = void 0;
const react_1 = require("react");
const next_i18next_1 = require("next-i18next");
const OrderRecipientBase = ({ shippingAddress }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<>
      <div className="flex flex-col">
        <span className="mb-2 text-xs uppercase text-muted-400">
          {t("Recipient")}
        </span>
        <ul className="text-muted-800">
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Name")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shippingAddress === null || shippingAddress === void 0 ? void 0 : shippingAddress.name}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Email")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shippingAddress === null || shippingAddress === void 0 ? void 0 : shippingAddress.email}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Phone")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shippingAddress === null || shippingAddress === void 0 ? void 0 : shippingAddress.phone}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Street")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shippingAddress === null || shippingAddress === void 0 ? void 0 : shippingAddress.street}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("City")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shippingAddress === null || shippingAddress === void 0 ? void 0 : shippingAddress.city}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("State")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shippingAddress === null || shippingAddress === void 0 ? void 0 : shippingAddress.state}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Postal Code")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shippingAddress === null || shippingAddress === void 0 ? void 0 : shippingAddress.postalCode}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Country")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shippingAddress === null || shippingAddress === void 0 ? void 0 : shippingAddress.country}
            </div>
          </li>
        </ul>
      </div>
    </>);
};
exports.OrderRecipient = (0, react_1.memo)(OrderRecipientBase);
