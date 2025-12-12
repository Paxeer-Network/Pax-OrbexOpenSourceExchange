"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectNetwork = void 0;
const react_1 = require("react");
const withdraw_1 = require("@/stores/user/wallet/withdraw");
const wallet_1 = require("@/stores/user/wallet"); // Adjust the import path as needed
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const next_i18next_1 = require("next-i18next");
const strings_1 = require("@/utils/strings");
const dashboard_1 = require("@/stores/dashboard");
const SelectNetworkBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { selectedCurrency, setSelectedCurrency, selectedWithdrawMethod, setSelectedWithdrawMethod, setStep, withdrawMethods, selectedWalletType, } = (0, withdraw_1.useWithdrawStore)();
    const { wallet, fetchWallet } = (0, wallet_1.useWalletStore)();
    const [balances, setBalances] = (0, react_1.useState)({}); // To store balances per chain
    const { settings } = (0, dashboard_1.useDashboardStore)();
    (0, react_1.useEffect)(() => {
        if (selectedWalletType.value === "ECO") {
            // Fetch the wallet for the selected currency and type
            fetchWallet(selectedWalletType.value, selectedCurrency);
        }
    }, [selectedWalletType.value, selectedCurrency]);
    (0, react_1.useEffect)(() => {
        if (selectedWalletType.value === "ECO" && wallet) {
            // Process the addresses to get balances per chain
            const addresses = typeof wallet.address === "string"
                ? JSON.parse(wallet.address)
                : wallet.address;
            // addresses is an object with keys as chains and values as objects with address and balance
            const chainBalances = {};
            for (const [chain, data] of Object.entries(addresses)) {
                chainBalances[chain] = data.balance;
            }
            setBalances(chainBalances);
        }
    }, [selectedWalletType.value, wallet]);
    if (!withdrawMethods || withdrawMethods.length === 0) {
        return (<div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <react_2.Icon icon="mdi:loading" className="h-12 w-12 animate-spin text-primary-500"/>
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
            const chain = item.chain;
            const balance = balances[chain] || 0;
            const isDisabled = selectedWalletType.value === "ECO" && balance <= 0;
            return (<div key={index} onClick={() => {
                    if (!isDisabled) {
                        setSelectedWithdrawMethod(item);
                    }
                }} className={`cursor-pointer transition-colors duration-300 border rounded ${(selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.chain) === item.chain
                    ? "border border-primary-600 dark:border-primary-400 bg-white dark:bg-muted-950"
                    : "group relative border rounded-sm transition-colors duration-300 border-muted-200 dark:border-muted-800 hover:border-primary-600 dark:hover:border-primary-400 bg-muted-100 dark:bg-muted-800 hover:bg-white dark:hover:bg-muted-900"} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <div className="flex items-center justify-between gap-5 px-4 py-3 font-sans text-sm text-muted-600 transition-colors duration-300">
                      <div className="flex flex-col w-full">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-800 dark:text-muted-200 text-md font-semibold">
                              {item.chain}
                            </span>
                          </div>
                          {selectedWalletType.value === "ECO" && (<div className="flex items-center gap-2">
                              <span className="text-muted-800 dark:text-muted-200 text-md font-semibold">
                                {t("Balance")}: {balance}
                              </span>
                            </div>)}
                        </div>
                        {/* Existing fee and limit information */}
                        <div className="flex flex-col mt-2 text-sm">
                          <div className="flex gap-1">
                            <span className="text-muted-500 dark:text-muted-400">
                              {t("Minimum Withdraw")}
                            </span>
                            <span className="text-muted-800 dark:text-muted-200">
                              {(0, strings_1.formatNumber)(((_b = (_a = item.limits) === null || _a === void 0 ? void 0 : _a.withdraw) === null || _b === void 0 ? void 0 : _b.min) ||
                    ((_d = (_c = item.limits) === null || _c === void 0 ? void 0 : _c.amount) === null || _d === void 0 ? void 0 : _d.min) ||
                    0)}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-muted-500 dark:text-muted-400">
                              {t("Maximum Withdraw")}
                            </span>
                            <span className="text-muted-800 dark:text-muted-200">
                              {(0, strings_1.formatNumber)(((_f = (_e = item.limits) === null || _e === void 0 ? void 0 : _e.withdraw) === null || _f === void 0 ? void 0 : _f.max) ||
                    ((_h = (_g = item.limits) === null || _g === void 0 ? void 0 : _g.amount) === null || _h === void 0 ? void 0 : _h.max) ||
                    "Unlimited")}
                            </span>
                          </div>
                          {typeof ((_j = item.fee) === null || _j === void 0 ? void 0 : _j.min) === "number" && (<div className="flex gap-1">
                              <span className="text-muted-500 dark:text-muted-400">
                                {t("Minimum Fee")}
                              </span>
                              <span className="text-muted-800 dark:text-muted-200">
                                {(0, strings_1.formatNumber)(item.fee.min)} {selectedCurrency}
                              </span>
                            </div>)}
                          {typeof ((_k = item.fee) === null || _k === void 0 ? void 0 : _k.percentage) === "number" && (<div className="flex gap-1">
                              <span className="text-muted-500 dark:text-muted-400">
                                {t("Percentage Fee")}
                              </span>
                              <span className="text-muted-800 dark:text-muted-200">
                                {selectedWalletType.value === "SPOT"
                        ? `${item.fee.percentage +
                            parseFloat(settings.walletTransferFee || "0")}%`
                        : `${item.fee.percentage}%`}
                              </span>
                            </div>)}

                          {typeof item.fixedFee === "number" && (<div className="flex gap-1">
                              <span className="text-muted-500 dark:text-muted-400">
                                {t("Fixed Withdraw Fee")}
                              </span>
                              <span className="text-muted-800 dark:text-muted-200">
                                {(0, strings_1.formatNumber)(item.fixedFee)}
                              </span>
                            </div>)}
                          {typeof item.percentageFee === "number" && (<div className="flex gap-1">
                              <span className="text-muted-500 dark:text-muted-400">
                                {t("Percentage Withdraw Fee")}
                              </span>
                              <span className="text-muted-800 dark:text-muted-200">
                                {selectedWalletType.value === "SPOT"
                        ? `${item.percentageFee +
                            parseFloat(settings.walletTransferFee || "0")}%`
                        : `${item.percentageFee}%`}
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
              <react_2.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
              {t("Go Back")}
            </Button_1.default>
            <Button_1.default type="button" color="primary" size="lg" className="w-full" onClick={() => {
            setStep(4);
        }} disabled={!selectedWithdrawMethod}>
              {t("Continue")}
              <react_2.Icon icon="mdi:chevron-right" className="h-5 w-5"/>
            </Button_1.default>
          </div>
        </div>
      </div>
    </div>);
};
exports.SelectNetwork = (0, react_1.memo)(SelectNetworkBase);
