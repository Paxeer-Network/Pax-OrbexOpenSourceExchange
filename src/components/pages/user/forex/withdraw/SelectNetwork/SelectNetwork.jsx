"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectNetwork = void 0;
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const withdraw_1 = require("@/stores/user/forex/withdraw");
const react_1 = require("@iconify/react");
const react_2 = require("react");
const next_i18next_1 = require("next-i18next");
const SelectNetworkBase = ({}) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { selectedCurrency, setSelectedCurrency, selectedWithdrawMethod, setSelectedWithdrawMethod, setStep, withdrawMethods, } = (0, withdraw_1.useWithdrawStore)();
    if (!withdrawMethods || withdrawMethods.length === 0) {
        return (<div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <react_1.Icon icon="mdi:loading" className="h-12 w-12 animate-spin text-primary-500"/>
          <p className="text-xl text-primary-500">
            {t("Loading")} {selectedCurrency} {t("networks...")}
          </p>
        </div>
      </div>);
    }
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select a Network")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Pick one of the following currency networks to continue")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-4xl space-y-10 rounded-sm px-8 pb-8">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <h3 className="mb-1 font-sans font-medium text-muted-800 dark:text-muted-100">
              {selectedCurrency} {t("Networks")}
            </h3>
            <p className="font-sans text-sm text-muted-500 dark:text-muted-400 md:max-w-[190px]">
              {t("Select a network to continue")}
            </p>
          </div>
          <div className="md:col-span-8">
            <div className="mx-auto mb-4 w-full max-w-xl space-y-5 rounded-sm px-8 pb-8">
              {withdrawMethods.map((item, index) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return (<div key={index} onClick={() => {
                    setSelectedWithdrawMethod(item);
                }} className={`cursor-pointer transition-colors duration-300 border rounded ${(selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.chain) === item.chain
                    ? "border border-primary-600 dark:border-primary-400 rounded-sm cursor-pointer transition-colors duration-30 bg-white dark:bg-muted-950"
                    : "group relative border rounded-sm cursor-pointer transition-colors duration-300 border-muted-200 dark:border-muted-800 hover:border-primary-600 dark:hover:border-primary-400 bg-muted-100 dark:bg-muted-800 hover:bg-white dark:hover:bg-muted-900"}`}>
                  <div className="flex items-center justify-between gap-5 px-4 py-3 font-sans text-sm text-muted-600 transition-colors duration-300">
                    <div className="flex gap-10">
                      <div className="flex justify-start items-center gap-2">
                        <Avatar_1.default src={`/img/crypto/${(item.id || item.chain).toLowerCase()}.webp` || "/img/placeholder.svg"} alt={item.chain} size="sm"/>
                        <span className="text-muted-800 dark:text-muted-200 text-md font-semibold">
                          {item.chain}
                        </span>
                      </div>
                      <div className="flex flex-col text-sm">
                        <div className="flex gap-1">
                          <span className="text-muted-500 dark:text-muted-400">
                            {t("Minimum Withdraw")}
                          </span>
                          <span className="text-muted-800 dark:text-muted-200">
                            {((_b = (_a = item.limits) === null || _a === void 0 ? void 0 : _a.withdraw) === null || _b === void 0 ? void 0 : _b.min) ||
                    ((_d = (_c = item.limits) === null || _c === void 0 ? void 0 : _c.amount) === null || _d === void 0 ? void 0 : _d.min) ||
                    0}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-muted-500 dark:text-muted-400">
                            {t("Maximum Withdraw")}
                          </span>
                          <span className="text-muted-800 dark:text-muted-200">
                            {((_f = (_e = item.limits) === null || _e === void 0 ? void 0 : _e.withdraw) === null || _f === void 0 ? void 0 : _f.max) ||
                    ((_h = (_g = item.limits) === null || _g === void 0 ? void 0 : _g.amount) === null || _h === void 0 ? void 0 : _h.max) ||
                    "Unlimited"}
                          </span>
                        </div>
                        {item.fee && ((_j = item.fee) === null || _j === void 0 ? void 0 : _j.min) && (<div className="flex gap-1">
                            <span className="text-muted-500 dark:text-muted-400">
                              {t("Minimum Fee")}
                            </span>
                            <span className="text-muted-800 dark:text-muted-200">
                              {item.fee.min} {selectedCurrency}
                            </span>
                          </div>)}
                        {item.fee && ((_k = item.fee) === null || _k === void 0 ? void 0 : _k.percentage) && (<div className="flex gap-1">
                            <span className="text-muted-500 dark:text-muted-400">
                              {t("Percentage Fee")}
                            </span>
                            <span className="text-muted-800 dark:text-muted-200">
                              {item.fee.percentage}%
                            </span>
                          </div>)}
                        {item.fixedFee && (<div className="flex gap-1">
                            <span className="text-muted-500 dark:text-muted-400">
                              {t("Fixed Withdraw Fee")}
                            </span>
                            <span className="text-muted-800 dark:text-muted-200">
                              {item.fixedFee}
                            </span>
                          </div>)}
                        {item.percentageFee && (<div className="flex gap-1">
                            <span className="text-muted-500 dark:text-muted-400">
                              {t("Percentage Withdraw Fee")}
                            </span>
                            <span className="text-muted-800 dark:text-muted-200">
                              {item.percentageFee}%
                            </span>
                          </div>)}
                      </div>
                    </div>
                  </div>
                </div>);
        })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16! max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button_1.default type="button" size="lg" className="w-full" onClick={() => {
            setSelectedCurrency("Select a currency");
            setStep(2);
        }}>
              <react_1.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
              {t("Go Back")}
            </Button_1.default>
            <Button_1.default type="button" color="primary" size="lg" className="w-full" onClick={() => {
            setStep(4);
        }} disabled={!selectedWithdrawMethod}>
              {t("Continue")}
              <react_1.Icon icon="mdi:chevron-right" className="h-5 w-5"/>
            </Button_1.default>
          </div>
        </div>
      </div>
    </div>);
};
exports.SelectNetwork = (0, react_2.memo)(SelectNetworkBase);
