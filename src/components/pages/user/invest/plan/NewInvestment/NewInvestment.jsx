"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewInvestment = void 0;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const next_i18next_1 = require("next-i18next");
const NewInvestmentBase = ({ plan, duration, setDuration, amount, setAmount, invest, isLoading, }) => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const looseToNumber = (value) => {
        if (typeof value === "string" &&
            (value === "" || value === "." || value.endsWith("."))) {
            return value; // Allow incomplete decimal inputs
        }
        const n = Number.parseFloat(value);
        return Number.isNaN(n) ? value : n;
    };
    return (<div className="flex flex-col gap-4">
      <div className="text-sm">
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-semibold text-muted-800 dark:text-muted-100">
            {t("Investment Plan Details")}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <p className="text-sm text-muted-400">{t("Min Amount")}</p>
            <p className="text-sm text-muted-800 dark:text-muted-100">
              {plan === null || plan === void 0 ? void 0 : plan.minAmount} {plan === null || plan === void 0 ? void 0 : plan.currency}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-400">{t("Max Amount")}</p>
            <p className="text-sm text-muted-800 dark:text-muted-100">
              {plan === null || plan === void 0 ? void 0 : plan.maxAmount} {plan === null || plan === void 0 ? void 0 : plan.currency}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-400">{t("Profit Percentage")}</p>
            <p className="text-success-500">{plan === null || plan === void 0 ? void 0 : plan.profitPercentage}%</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-400">{t("Wallet Type")}</p>
            <link_1.default href={`/user/wallet/${plan === null || plan === void 0 ? void 0 : plan.walletType}`}>
              <span className="text-primary-500">{plan === null || plan === void 0 ? void 0 : plan.walletType}</span>
            </link_1.default>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-400">{t("Currency")}</p>
            <link_1.default href={`/user/wallet/${plan === null || plan === void 0 ? void 0 : plan.walletType}/${plan === null || plan === void 0 ? void 0 : plan.currency}`}>
              <span className="text-primary-500">{plan === null || plan === void 0 ? void 0 : plan.currency}</span>
            </link_1.default>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <Listbox_1.default label={t("Duration")} options={(_a = plan === null || plan === void 0 ? void 0 : plan.durations) === null || _a === void 0 ? void 0 : _a.map((duration) => ({
            value: duration.id,
            label: `${duration.duration} ${duration.timeframe}`,
        }))} selected={duration} setSelected={(e) => setDuration(e)}/>
        </div>
        <div className="w-full">
          <Input_1.default label={t("Amount")} placeholder={t("Ex: 2600")} value={amount} onChange={(e) => setAmount(looseToNumber(e.target.value))} type="number" step="any"/>
        </div>
      </div>
      <div>
        <Button_1.default type="button" className="w-full" color={amount && amount >= (plan === null || plan === void 0 ? void 0 : plan.minAmount) && duration.value
            ? "success"
            : "muted"} loading={isLoading} disabled={!amount || // Ensure the amount is provided
            isNaN(amount) || // Avoid invalid numbers
            (plan ? amount < plan.minAmount : false) || // Check min limit
            (plan ? amount > (plan === null || plan === void 0 ? void 0 : plan.maxAmount) : false) || // Check max limit
            !duration.value // Ensure duration is selected
        } onClick={invest}>
          <span>{t("Invest")}</span>
        </Button_1.default>
      </div>
    </div>);
};
exports.NewInvestment = (0, react_1.memo)(NewInvestmentBase);
