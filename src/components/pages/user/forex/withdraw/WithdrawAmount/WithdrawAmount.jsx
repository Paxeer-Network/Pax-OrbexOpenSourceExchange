"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawAmount = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const withdraw_1 = require("@/stores/user/forex/withdraw");
const ethers_1 = require("ethers");
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
// Loading indicator component
const LoadingIndicator = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center space-y-4">
        <react_2.Icon icon="mdi:loading" className="h-12 w-12 animate-spin text-primary-500"/>
        <p className="text-xl text-primary-500">
          {t("Processing withdrawal...")}
        </p>
      </div>
    </div>);
};
const validateAddress = (address) => {
    return ethers_1.ethers.isAddress(address);
};
// Displays withdrawal details like min/max amounts and fees
const WithdrawDetails = ({ selectedWithdrawMethod, selectedCurrency, withdrawAmount, balance, fee, minFee, totalWithdraw, remainingBalance, }) => {
    var _a, _b, _c, _d, _e, _f;
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="card-dashed text-sm mt-5">
      <div className="text-md mb-2 font-semibold text-muted-800 dark:text-muted-100">
        {selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.chain} {t("Network Withdraw Information")}
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">{t("Min Amount")}</p>
        <p className={!withdrawAmount ||
            withdrawAmount < ((_b = (_a = selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.limits) === null || _a === void 0 ? void 0 : _a.withdraw) === null || _b === void 0 ? void 0 : _b.min)
            ? "text-red-500"
            : "text-muted-600 dark:text-muted-300"}>
          {((_d = (_c = selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.limits) === null || _c === void 0 ? void 0 : _c.withdraw) === null || _d === void 0 ? void 0 : _d.min) || 0}{" "}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">{t("Max Amount")}</p>
        <p className="text-muted-600 dark:text-muted-300">
          {balance || ((_f = (_e = selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.limits) === null || _e === void 0 ? void 0 : _e.withdraw) === null || _f === void 0 ? void 0 : _f.max)}{" "}
        </p>
      </div>
      <div className="flex justify-between border-b border-dashed pb-2 border-muted-300 dark:border-muted-700 mb-2">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Withdraw Fee")}{" "}
          {minFee > 0 && (withdrawAmount * fee) / 100 < minFee && (<span className="text-muted-600 dark:text-muted-300">
              {t("Min Fee")} ({minFee})
            </span>)}
        </p>
        <p className="text-muted-600 dark:text-muted-300">{fee}</p>
      </div>

      <div className="flex justify-between border-b border-dashed pb-2 border-muted-300 dark:border-muted-700 mb-2">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Total Withdraw")}
        </p>
        <p className="text-muted-600 dark:text-muted-300">{totalWithdraw}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Remaining Balance")}
        </p>
        <p className="text-muted-600 dark:text-muted-300">
          {remainingBalance >= 0 ? remainingBalance : `--`} {selectedCurrency}
        </p>
      </div>
    </div>);
};
const calculateFees = (method, amount) => {
    var _a, _b;
    let fee = 0;
    let percentageFee = 0;
    let minFee = 0;
    // Apply fixed fee if available
    if (method.fixedFee) {
        fee += method.fixedFee;
    }
    // Apply percentage fee if available
    if (method.percentageFee) {
        percentageFee = method.percentageFee;
        fee += (percentageFee * amount) / 100;
    }
    // Apply dynamic fee structure if available
    if (typeof method.fee === "object") {
        percentageFee = parseFloat(((_a = method.fee) === null || _a === void 0 ? void 0 : _a.percentage) || 0);
        if (percentageFee > 0) {
            fee += (percentageFee * amount) / 100;
        }
        minFee = parseFloat(((_b = method.fee) === null || _b === void 0 ? void 0 : _b.min) || 0);
        if (minFee > 0) {
            fee = Math.max(minFee, fee); // Ensures that the fee does not fall below minFee
        }
    }
    return { fee, minFee };
};
const WithdrawForm = ({ selectedWalletType, selectedCurrency, onBack, onWithdraw, loading, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { account, withdrawAmount, setWithdrawAmount, currencies, selectedWithdrawMethod, } = (0, withdraw_1.useWithdrawStore)();
    const handleChangeAmount = (0, react_1.useCallback)((e) => {
        setWithdrawAmount(parseFloat(e.target.value));
    }, [setWithdrawAmount]);
    // Calculate fees
    const { fee, minFee } = (0, react_1.useMemo)(() => {
        return selectedWalletType.value === "FIAT"
            ? { fee: 0, minFee: 0 }
            : calculateFees(selectedWithdrawMethod, withdrawAmount || 0);
    }, [selectedWithdrawMethod, withdrawAmount]);
    const totalWithdraw = (0, react_1.useMemo)(() => (withdrawAmount || 0) + fee, [withdrawAmount, fee]);
    const remainingBalance = (0, react_1.useMemo)(() => account.balance - totalWithdraw, [account.balance, totalWithdraw]);
    const isWithdrawValid = (0, react_1.useMemo)(() => {
        var _a, _b, _c, _d;
        return (withdrawAmount > 0 &&
            remainingBalance >= 0 &&
            withdrawAmount >= (((_b = (_a = selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.limits) === null || _a === void 0 ? void 0 : _a.withdraw) === null || _b === void 0 ? void 0 : _b.min) || 0) &&
            withdrawAmount <=
                (account.balance || ((_d = (_c = selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.limits) === null || _c === void 0 ? void 0 : _c.withdraw) === null || _d === void 0 ? void 0 : _d.max)));
    }, [
        withdrawAmount,
        remainingBalance,
        account.balance,
        selectedWithdrawMethod,
    ]);
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Withdraw Confirmatio")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Enter the amount you want to withdraw to your")}{" "}
          {selectedWalletType.label} {selectedCurrency} {t("wallet")}
        </p>
      </div>
      <div className="mx-auto mb-4 w-full max-w-md rounded-sm px-8 pb-8">
        <Input_1.default type="number" value={withdrawAmount} placeholder={t("Enter amount")} label={t("Amount")} min={((_b = (_a = selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.limits) === null || _a === void 0 ? void 0 : _a.withdraw) === null || _b === void 0 ? void 0 : _b.min) || 0} max={account.balance || ((_d = (_c = selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.limits) === null || _c === void 0 ? void 0 : _c.withdraw) === null || _d === void 0 ? void 0 : _d.max)} required onChange={handleChangeAmount} error={withdrawAmount &&
            withdrawAmount <
                (((_f = (_e = selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.limits) === null || _e === void 0 ? void 0 : _e.withdraw) === null || _f === void 0 ? void 0 : _f.min) || 0)
            ? "Amount is less than minimum"
            : undefined ||
                withdrawAmount >
                    (account.balance ||
                        ((_h = (_g = selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.limits) === null || _g === void 0 ? void 0 : _g.withdraw) === null || _h === void 0 ? void 0 : _h.max))
                ? "Amount is more your balance"
                : undefined}/>
        <WithdrawDetails selectedWithdrawMethod={selectedWithdrawMethod} selectedCurrency={selectedCurrency} withdrawAmount={withdrawAmount} balance={account.balance} fee={fee} minFee={minFee} totalWithdraw={totalWithdraw} remainingBalance={remainingBalance}/>
        <div className="mx-auto mt-8! max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button_1.default type="button" size="lg" onClick={onBack} disabled={loading}>
              <react_2.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
              {t("Go Back")}
            </Button_1.default>
            <Button_1.default type="button" color="primary" size="lg" onClick={onWithdraw} disabled={!isWithdrawValid || loading}>
              {t("Withdraw")}
            </Button_1.default>
          </div>
        </div>
      </div>
    </div>);
};
const WithdrawAmountBase = () => {
    const { loading, setStep, selectedCurrency, handleWithdraw, setSelectedWithdrawMethod, selectedWalletType, } = (0, withdraw_1.useWithdrawStore)();
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    if (loading || !id)
        return <LoadingIndicator />;
    return (<WithdrawForm selectedCurrency={selectedCurrency} onBack={() => {
            setSelectedWithdrawMethod(null);
            setStep(selectedWalletType.value === "FIAT" ? 2 : 3);
        }} onWithdraw={() => handleWithdraw(id)} loading={loading} selectedWalletType={selectedWalletType}/>);
};
exports.WithdrawAmount = (0, react_1.memo)(WithdrawAmountBase);
