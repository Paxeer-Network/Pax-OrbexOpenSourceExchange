"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferAmount = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const transfer_1 = require("@/stores/user/wallet/transfer");
const next_i18next_1 = require("next-i18next");
const LoadingIndicator = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center space-y-4">
        <react_2.Icon icon="mdi:loading" className="h-12 w-12 animate-spin text-primary-500"/>
        <p className="text-xl text-primary-500">
          {t("Processing transfer...")}
        </p>
      </div>
    </div>);
};
const TransferDetails = ({ selectedCurrency, remainingBalance, details }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="card-dashed text-sm mt-5 space-y-2">
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Remaining Balance")}
        </p>
        <p className="text-muted-600 dark:text-muted-300">
          {remainingBalance > 0 ? remainingBalance : `--`} {selectedCurrency}
        </p>
      </div>

      {/* Additional details based on transfer type */}
      {details.fromCurrency && details.fromType && (<>
          <div className="flex justify-between">
            <p className="text-muted-600 dark:text-muted-300">
              {t("From Currency")}
            </p>
            <p className="text-muted-600 dark:text-muted-300">
              {details.fromCurrency}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-600 dark:text-muted-300">
              {t("From Type")}
            </p>
            <p className="text-muted-600 dark:text-muted-300">
              {details.fromType}
            </p>
          </div>
        </>)}

      {details.toType && (<>
          <div className="flex justify-between">
            <p className="text-muted-600 dark:text-muted-300">{t("To Type")}</p>
            <p className="text-muted-600 dark:text-muted-300">
              {details.toType}
            </p>
          </div>
        </>)}

      {details.toClient && (<div className="flex justify-between">
          <p className="text-muted-600 dark:text-muted-300">{t("To Client")}</p>
          <p className="text-muted-600 dark:text-muted-300">
            {details.toClient}
          </p>
        </div>)}
    </div>);
};
const TransferForm = ({ selectedCurrency, onBack, onTransfer, loading, transferDetails, }) => {
    const { transferAmount, setTransferAmount } = (0, transfer_1.useTransferStore)();
    const handleChangeAmount = (0, react_1.useCallback)((e) => {
        const value = parseFloat(e.target.value);
        if (value >= 0)
            setTransferAmount(value);
    }, [setTransferAmount]);
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {transferDetails.fromType} {t("to")} {transferDetails.toType}{" "}
          {t("Transfer Confirmation")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Enter the amount you want to transfer")}
        </p>
      </div>
      <div className="mx-auto mb-4 w-full max-w-md rounded-sm px-8 pb-8">
        <Input_1.default type="number" value={transferAmount} placeholder={t("Enter amount")} label={t("Amount")} required onChange={handleChangeAmount} min="0"/>
        <TransferDetails selectedCurrency={selectedCurrency} remainingBalance={transferDetails.remainingBalance} details={transferDetails}/>
        <div className="mx-auto mt-8! max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button_1.default type="button" size="lg" onClick={onBack} disabled={loading}>
              <react_2.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
              {t("Go Back")}
            </Button_1.default>
            <Button_1.default type="button" color="primary" size="lg" onClick={onTransfer} disabled={!transferDetails.isTransferValid || loading}>
              {t("Transfer")}
            </Button_1.default>
          </div>
        </div>
      </div>
    </div>);
};
const TransferAmountBase = () => {
    const { loading, setStep, selectedCurrency, handleTransfer, selectedWalletType, selectedTargetWalletType, transferAmount, currencies, transferType, clientId, } = (0, transfer_1.useTransferStore)();
    const balance = (0, react_1.useMemo)(() => {
        var _a, _b;
        return (((_b = (_a = currencies === null || currencies === void 0 ? void 0 : currencies.from) === null || _a === void 0 ? void 0 : _a.find((currency) => currency.value === selectedCurrency)) === null || _b === void 0 ? void 0 : _b.label.split(" - ")[1]) || 0);
    }, [currencies, selectedCurrency]);
    const remainingBalance = (0, react_1.useMemo)(() => balance - transferAmount, [balance, transferAmount]);
    const transferDetails = (0, react_1.useMemo)(() => {
        const details = {
            fromType: (selectedWalletType === null || selectedWalletType === void 0 ? void 0 : selectedWalletType.label) || "N/A",
            toType: transferType.value === "client"
                ? "Client"
                : (selectedTargetWalletType === null || selectedTargetWalletType === void 0 ? void 0 : selectedTargetWalletType.label) || "N/A",
            fromCurrency: selectedCurrency || "N/A",
            remainingBalance,
            isTransferValid: transferAmount > 0 && remainingBalance >= 0,
            toClient: transferType.value === "client" ? clientId || "N/A" : undefined,
        };
        return details;
    }, [
        selectedWalletType,
        selectedTargetWalletType,
        selectedCurrency,
        transferType,
        clientId,
        remainingBalance,
        transferAmount,
    ]);
    if (loading)
        return <LoadingIndicator />;
    return (<TransferForm selectedCurrency={selectedCurrency} onBack={() => {
            setStep(4);
        }} onTransfer={handleTransfer} loading={loading} transferDetails={transferDetails}/>);
};
exports.TransferAmount = (0, react_1.memo)(TransferAmountBase);
