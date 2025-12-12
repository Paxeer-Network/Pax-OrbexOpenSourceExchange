"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectTargetWalletType = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const transfer_1 = require("@/stores/user/wallet/transfer");
const next_i18next_1 = require("next-i18next");
const RadioHeadless_1 = __importDefault(require("@/components/elements/form/radio/RadioHeadless"));
const SelectTargetWalletTypeBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { walletTypes, selectedWalletType, selectedTargetWalletType, setSelectedTargetWalletType, setStep, fetchCurrencies, } = (0, transfer_1.useTransferStore)();
    // Filtered wallet types logic
    const getFilteredWalletTypes = () => {
        const { value: fromWalletType } = selectedWalletType;
        if (fromWalletType === "ECO") {
            return walletTypes.filter((type) => type.value === "FIAT" ||
                type.value === "SPOT" ||
                type.value === "FUTURES");
        }
        else if (fromWalletType === "FUTURES") {
            return walletTypes.filter((type) => type.value === "ECO");
        }
        else {
            return walletTypes.filter((type) => type.value !== "FUTURES" && type.value !== fromWalletType);
        }
    };
    // Determine the number of columns based on the number of filtered wallet types
    const getGridCols = () => {
        const filteredTypes = getFilteredWalletTypes();
        switch (filteredTypes.length) {
            case 1:
                return "grid-cols-1";
            case 2:
                return "grid-cols-1 sm:grid-cols-2";
            case 3:
                return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
            default:
                return "grid-cols-1";
        }
    };
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select a Target Wallet Type")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Choose the wallet type you want to transfer to")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded-sm px-8 pb-8">
        <div className={`grid gap-4 ${getGridCols()}`}>
          {getFilteredWalletTypes().map((walletType) => (<RadioHeadless_1.default key={walletType.value} name="targetWalletType" checked={selectedTargetWalletType.value === walletType.value} onChange={() => setSelectedTargetWalletType(walletType)}>
              <div className={`flex items-center justify-between p-4 bg-white dark:bg-muted-800 rounded-md border ${selectedTargetWalletType.value === walletType.value
                ? "border-success-500"
                : "border-muted-200 dark:border-muted-800"}`}>
                <div className="flex items-center space-x-4">
                  <h5 className="text-lg font-medium text-muted-800 dark:text-muted-100">
                    {t(walletType.label)}
                  </h5>
                </div>
                <div className="flex items-center">
                  {selectedTargetWalletType.value === walletType.value && (<react_2.Icon icon="ph:check-circle-duotone" className="h-6 w-6 text-success-500"/>)}
                </div>
              </div>
            </RadioHeadless_1.default>))}
        </div>

        <div className="mx-auto mt-8! max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button_1.default type="button" size="lg" onClick={() => {
            setStep(2);
        }}>
              <react_2.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
              {t("Go Back")}
            </Button_1.default>
            <Button_1.default type="button" color="primary" size="lg" className="w-full" onClick={() => {
            fetchCurrencies();
            setStep(4);
        }} disabled={selectedTargetWalletType.value === ""}>
              {t("Continue")}
              <react_2.Icon icon="mdi:chevron-right" className="h-5 w-5"/>
            </Button_1.default>
          </div>
        </div>
      </div>
    </div>);
};
exports.SelectTargetWalletType = (0, react_1.memo)(SelectTargetWalletTypeBase);
