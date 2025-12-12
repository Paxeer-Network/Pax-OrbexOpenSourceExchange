"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectCurrency = void 0;
const react_1 = require("react");
const ComboBox_1 = __importDefault(require("@/components/elements/form/combobox/ComboBox"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const transfer_1 = require("@/stores/user/wallet/transfer");
const next_i18next_1 = require("next-i18next");
const SelectCurrencyBase = ({}) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { selectedWalletType, setSelectedWalletType, currencies, selectedCurrency, setSelectedCurrency, targetCurrency, setTargetCurrency, setStep, transferType, } = (0, transfer_1.useTransferStore)();
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select a")} {selectedWalletType.label} {t("Source Currency")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Choose the currency you want to transfer")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded-sm px-4 md:px-8 pb-8">
        <div className="flex flex-col gap-5">
          <ComboBox_1.default label={t("Source Currency")} selected={selectedCurrency} options={currencies === null || currencies === void 0 ? void 0 : currencies.from} setSelected={setSelectedCurrency} loading={!(currencies === null || currencies === void 0 ? void 0 : currencies.from)}/>
          {transferType.value === "wallet" &&
            !["ECO", "FUTURES"].includes(selectedWalletType.value) && (<ComboBox_1.default label={t("Target Currency")} selected={targetCurrency} options={currencies === null || currencies === void 0 ? void 0 : currencies.to} setSelected={setTargetCurrency} loading={!(currencies === null || currencies === void 0 ? void 0 : currencies.to)}/>)}
        </div>
        <div className="px-8">
          <div className="mx-auto mt-12 max-w-sm">
            <div className="flex w-full gap-4 justify-center">
              <Button_1.default type="button" size="lg" className="w-full" onClick={() => {
            setSelectedWalletType({
                value: "",
                label: "Select a wallet type",
            });
            setStep(2);
        }}>
                <react_2.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
                {t("Go Back")}
              </Button_1.default>
              <Button_1.default type="button" color="primary" size="lg" className="w-full" onClick={() => {
            setStep(5);
        }} disabled={!selectedCurrency || selectedCurrency === "Select a currency"}>
                {t("Continue")}
                <react_2.Icon icon="mdi:chevron-right" className="h-5 w-5"/>
              </Button_1.default>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.SelectCurrency = (0, react_1.memo)(SelectCurrencyBase);
