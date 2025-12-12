"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakeLogInfo = void 0;
const react_1 = require("react");
const next_i18next_1 = require("next-i18next");
const StakeLogInfoBase = ({ log }) => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const stakedAmount = log.amount;
    const interestRate = (_a = log.duration) === null || _a === void 0 ? void 0 : _a.interestRate;
    const estimatedEarnings = (stakedAmount * interestRate) / 100;
    return (<div className="rounded-lg bg-muted-100 p-4 dark:bg-muted-900">
      <div className="flex flex-col divide-y divide-muted-200 rounded-lg border border-muted-200 bg-white text-center dark:divide-muted-800 dark:border-muted-800 dark:bg-muted-950 md:flex-row md:divide-x md:divide-y-0">
        <div className="my-2 flex-1 py-3">
          <h3 className="mb-1 text-sm leading-tight text-muted-500 dark:text-muted-400 flex gap-1 justify-center items-center">
            {t("Staked Amount")}
          </h3>
          <span className="text-lg font-semibold text-muted-800 dark:text-muted-100">
            {stakedAmount}
          </span>
        </div>
        <div className="my-2 flex-1 py-3">
          <h3 className="mb-1 text-sm leading-tight text-muted-500 dark:text-muted-400">
            {t("Interest Rate")}
          </h3>
          <span className="text-lg font-semibold text-primary-500">
            {interestRate}%
          </span>
        </div>
        <div className="my-2 flex-1 py-3">
          <h3 className="mb-1 text-sm leading-tight text-muted-500 dark:text-muted-400">
            {t("Estimated Earnings")}
          </h3>
          <span className="text-lg font-semibold text-success-500">
            {estimatedEarnings}
          </span>
        </div>
      </div>
    </div>);
};
exports.StakeLogInfo = (0, react_1.memo)(StakeLogInfoBase);
