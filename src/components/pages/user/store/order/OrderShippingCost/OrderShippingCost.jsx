"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderShippingCost = void 0;
const react_1 = require("react");
const next_i18next_1 = require("next-i18next");
const OrderShippingCostBase = ({ shipping }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="mt-10 flex justify-end">
      <table className="w-72">
        <thead>
          <tr>
            <th className="text-end"></th>
            <th className="text-end"></th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-sm">
            <td className="p-1 text-end text-muted-400">{t("Shipping")}</td>
            <td className="p-1 text-end text-muted-800 dark:text-muted-100">
              {shipping.cost}
              {t("USD")}
            </td>
          </tr>
          <tr className="text-sm">
            <td className="p-1 text-end text-muted-400">{t("Taxes")}</td>
            <td className="p-1 text-end text-muted-800 dark:text-muted-100">
              {shipping.tax} {t("USD")}
            </td>
          </tr>
          <tr>
            <td className="p-1 text-end font-medium text-muted-800 dark:text-muted-100">
              {t("TOTAL")}
            </td>
            <td className="p-1 text-end font-medium text-muted-800 dark:text-muted-100">
              {shipping.cost && shipping.tax && shipping.cost + shipping.tax}{" "}
              {t("USD")}
            </td>
          </tr>
        </tbody>
      </table>
    </div>);
};
exports.OrderShippingCost = (0, react_1.memo)(OrderShippingCostBase);
