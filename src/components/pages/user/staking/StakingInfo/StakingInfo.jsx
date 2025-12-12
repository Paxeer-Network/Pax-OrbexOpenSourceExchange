"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingInfo = void 0;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const StakingInfoBase = ({ hasStaked, selectedPool, wallet, selectedDuration, amount, }) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const { t } = (0, next_i18next_1.useTranslation)();
    if (!selectedPool || !wallet) {
        console.error("StakingInfo component received invalid props");
        return null;
    }
    const stakedAmount = hasStaked
        ? ((_b = (_a = selectedPool.stakingLogs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.amount) || 0
        : amount || 0;
    const interestRate = hasStaked
        ? ((_e = (_d = (_c = selectedPool.stakingLogs) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.duration) === null || _e === void 0 ? void 0 : _e.interestRate) || 0
        : ((_g = (_f = selectedPool.stakingDurations) === null || _f === void 0 ? void 0 : _f.find((d) => d.id === (selectedDuration === null || selectedDuration === void 0 ? void 0 : selectedDuration.value))) === null || _g === void 0 ? void 0 : _g.interestRate) || 0;
    const estimatedEarnings = (stakedAmount * interestRate) / 100;
    return (<div className="rounded-lg bg-muted-100 p-4 dark:bg-muted-900">
      <div className="flex flex-col divide-y divide-muted-200 rounded-lg border border-muted-200 bg-white text-center dark:divide-muted-800 dark:border-muted-800 dark:bg-muted-950 md:flex-row md:divide-x md:divide-y-0">
        <div className="my-2 flex-1 py-3">
          <h3 className="mb-1 text-sm leading-tight text-muted-500 dark:text-muted-400 flex gap-1 justify-center items-center">
            {hasStaked ? ("Staked Amount") : (<>
                {t("Balance")}
                <link_1.default href={`/user/wallet/deposit`}>
                  <react_2.Icon icon="mdi:plus" className="h-5 w-5 hover:text-primary-500 cursor-pointer"/>
                </link_1.default>
              </>)}
          </h3>
          <span className="text-lg font-semibold text-muted-800 dark:text-muted-100">
            {hasStaked ? (stakedAmount) : (<>
                {wallet.balance || 0} {selectedPool.currency}
              </>)}
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
exports.StakingInfo = (0, react_1.memo)(StakingInfoBase);
