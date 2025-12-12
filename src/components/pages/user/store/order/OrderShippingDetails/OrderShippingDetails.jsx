"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderShippingDetails = void 0;
const react_1 = require("react");
const lodash_1 = require("lodash");
const next_i18next_1 = require("next-i18next");
const OrderShippingDetailsBase = ({ shipping }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<>
      <div className="flex flex-col ">
        <span className="mb-2 text-xs uppercase text-muted-400">
          {t("Shipping")}
        </span>
        <ul className="text-muted-800">
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Load ID")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              #{shipping.loadId}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Load status")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {(0, lodash_1.capitalize)(shipping.loadStatus)}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Shipper")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shipping.shipper}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Transporter")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shipping.transporter}
            </div>
          </li>
        </ul>
      </div>
      <div className="flex flex-col ">
        <span className="mb-2 text-xs uppercase text-muted-400">
          {t("Delivered goods")}
        </span>
        <ul className="text-muted-800">
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Goods Type")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shipping.goodsType}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Weight (Kg")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shipping.weight}
              {t("kg")}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Volume (Cm")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shipping.volume}
              {t("cm")}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Description")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              {shipping.description}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
            <div className="flex-1 p-2 text-muted-400">{t("Vehicle")}</div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
              #{shipping.vehicle}
            </div>
          </li>
        </ul>
      </div>
    </>);
};
exports.OrderShippingDetails = (0, react_1.memo)(OrderShippingDetailsBase);
