"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositAmount = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const deposit_1 = require("@/stores/user/forex/deposit");
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
// Loading indicator component
const LoadingIndicator = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center space-y-4">
        <react_2.Icon icon="mdi:loading" className="h-12 w-12 animate-spin text-primary-500"/>
        <p className="text-xl text-primary-500">{t("Processing deposit...")}</p>
      </div>
    </div>);
};
// Displays deposital details like min/max amounts and fees
const DepositDetails = ({ selectedDepositMethod, selectedCurrency, depositAmount, balance, fee, minFee, totalDeposit, remainingBalance, }) => {
    var _a, _b, _c, _d, _e, _f;
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="card-dashed text-sm mt-5">
      <div className="text-md mb-2 font-semibold text-muted-800 dark:text-muted-100">
        {selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.chain} {t("Network Deposit Information")}
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">{t("Min Amount")}</p>
        <p className={!depositAmount ||
            depositAmount < ((_b = (_a = selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.limits) === null || _a === void 0 ? void 0 : _a.deposit) === null || _b === void 0 ? void 0 : _b.min)
            ? "text-red-500"
            : "text-muted-600 dark:text-muted-300"}>
          {((_d = (_c = selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.limits) === null || _c === void 0 ? void 0 : _c.deposit) === null || _d === void 0 ? void 0 : _d.min) || 0}{" "}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">{t("Max Amount")}</p>
        <p className="text-muted-600 dark:text-muted-300">
          {balance || ((_f = (_e = selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.limits) === null || _e === void 0 ? void 0 : _e.deposit) === null || _f === void 0 ? void 0 : _f.max)}{" "}
        </p>
      </div>
      <div className="flex justify-between border-b border-dashed pb-2 border-muted-300 dark:border-muted-700 mb-2">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Deposit Fee")}{" "}
          {minFee > 0 && (depositAmount * fee) / 100 < minFee && (<span className="text-muted-600 dark:text-muted-300">
              {t("Min Fee")} ({minFee})
            </span>)}
        </p>
        <p className="text-muted-600 dark:text-muted-300">{fee}</p>
      </div>

      <div className="flex justify-between border-b border-dashed pb-2 border-muted-300 dark:border-muted-700 mb-2">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Total Deposit")}
        </p>
        <p className="text-muted-600 dark:text-muted-300">{totalDeposit}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Remaining Balance")}
        </p>
        <p className="text-muted-600 dark:text-muted-300">
          {remainingBalance > 0 ? remainingBalance : `--`} {selectedCurrency}
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
const DepositForm = ({ selectedWalletType, selectedCurrency, onBack, onDeposit, loading, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { depositAmount, setDepositAmount, currencies, selectedDepositMethod } = (0, deposit_1.useDepositStore)();
    const balance = (0, react_1.useMemo)(() => {
        var _a;
        return (((_a = currencies
            .find((currency) => currency.value === selectedCurrency)) === null || _a === void 0 ? void 0 : _a.label.split(" - ")[1]) || 0);
    }, [currencies, selectedCurrency]);
    const handleChangeAmount = (0, react_1.useCallback)((e) => {
        setDepositAmount(parseFloat(e.target.value));
    }, [setDepositAmount]);
    // Calculate fees
    const { fee, minFee } = (0, react_1.useMemo)(() => {
        return selectedWalletType.value === "FIAT"
            ? { fee: 0, minFee: 0 }
            : calculateFees(selectedDepositMethod, depositAmount || 0);
    }, [selectedDepositMethod, depositAmount]);
    const totalDeposit = (0, react_1.useMemo)(() => (depositAmount || 0) + fee, [depositAmount, fee]);
    const remainingBalance = (0, react_1.useMemo)(() => balance - totalDeposit, [balance, totalDeposit]);
    const isDepositValid = (0, react_1.useMemo)(() => {
        var _a, _b, _c, _d;
        return (depositAmount > 0 &&
            remainingBalance >= 0 &&
            depositAmount >= (((_b = (_a = selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.limits) === null || _a === void 0 ? void 0 : _a.deposit) === null || _b === void 0 ? void 0 : _b.min) || 0) &&
            depositAmount <= (balance || ((_d = (_c = selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.limits) === null || _c === void 0 ? void 0 : _c.deposit) === null || _d === void 0 ? void 0 : _d.max)));
    }, [depositAmount, remainingBalance, balance, selectedDepositMethod]);
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {selectedCurrency} {t("Deposit Confirmation")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Enter the amount you want to deposit")}
        </p>
      </div>
      <div className="mx-auto mb-4 w-full max-w-md rounded-sm px-8 pb-8">
        <Input_1.default type="number" value={depositAmount} placeholder={t("Enter amount")} label={t("Amount")} min={((_b = (_a = selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.limits) === null || _a === void 0 ? void 0 : _a.deposit) === null || _b === void 0 ? void 0 : _b.min) || 0} max={balance || ((_d = (_c = selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.limits) === null || _c === void 0 ? void 0 : _c.deposit) === null || _d === void 0 ? void 0 : _d.max)} required onChange={handleChangeAmount} error={depositAmount &&
            depositAmount < (((_f = (_e = selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.limits) === null || _e === void 0 ? void 0 : _e.deposit) === null || _f === void 0 ? void 0 : _f.min) || 0)
            ? "Amount is less than minimum"
            : undefined ||
                depositAmount >
                    (balance || ((_h = (_g = selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.limits) === null || _g === void 0 ? void 0 : _g.deposit) === null || _h === void 0 ? void 0 : _h.max))
                ? "Amount is more your balance"
                : undefined}/>
        <DepositDetails selectedDepositMethod={selectedDepositMethod} selectedCurrency={selectedCurrency} depositAmount={depositAmount} balance={balance} fee={fee} minFee={minFee} totalDeposit={totalDeposit} remainingBalance={remainingBalance}/>
        <div className="mx-auto mt-8! max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button_1.default type="button" size="lg" onClick={onBack} disabled={loading}>
              <react_2.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
              {t("Go Back")}
            </Button_1.default>
            <Button_1.default type="button" color="primary" size="lg" onClick={onDeposit} disabled={!isDepositValid || loading}>
              {t("Deposit")}
            </Button_1.default>
          </div>
        </div>
      </div>
    </div>);
};
const DepositAmountBase = () => {
    const { loading, setStep, selectedCurrency, handleDeposit, setSelectedDepositMethod, selectedWalletType, } = (0, deposit_1.useDepositStore)();
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    if (loading || !id)
        return <LoadingIndicator />;
    return (<DepositForm selectedCurrency={selectedCurrency} onBack={() => {
            setSelectedDepositMethod(null);
            setStep(selectedWalletType.value === "FIAT" ? 2 : 3);
        }} onDeposit={() => handleDeposit(id)} loading={loading} selectedWalletType={selectedWalletType}/>);
};
exports.DepositAmount = (0, react_1.memo)(DepositAmountBase);
