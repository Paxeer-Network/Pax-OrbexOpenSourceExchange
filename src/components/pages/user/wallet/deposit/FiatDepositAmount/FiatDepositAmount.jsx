"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiatDepositAmount = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const deposit_1 = require("@/stores/user/wallet/deposit");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const sonner_1 = require("sonner");
const api_1 = __importDefault(require("@/utils/api"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const next_i18next_1 = require("next-i18next");
const APP_PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_APP_PAYPAL_CLIENT_ID;
const FiatDepositAmountBase = ({}) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { selectedDepositMethod, setSelectedDepositMethod, setStep, handleFiatDeposit, setDepositAmount, depositAmount, loading, selectedCurrency, setDeposit, stripeListener, } = (0, deposit_1.useDepositStore)();
    const [paypal, setPaypal] = (0, react_1.useState)(null);
    const [paypalLoaded, setPaypalLoaded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if ((selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.alias) === "paypal") {
            const scriptId = "paypal-js";
            if (typeof window !== "undefined" && window.paypal) {
                setPaypal(window.paypal);
            }
            else {
                const script = document.createElement("script");
                script.id = scriptId;
                script.src = `https://www.paypal.com/sdk/js?client-id=${APP_PAYPAL_CLIENT_ID}&components=buttons&enable-funding=venmo,paylater`;
                script.onload = () => {
                    setPaypal(window.paypal);
                };
                document.body.appendChild(script);
            }
            return () => {
                const existingScript = document.getElementById(scriptId);
                if (existingScript) {
                    setPaypal(null);
                    setPaypalLoaded(false);
                    existingScript.remove();
                }
            };
        }
    }, [selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.alias]);
    (0, react_1.useEffect)(() => {
        if (paypal &&
            !paypalLoaded &&
            depositAmount >= Number(selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.minAmount)) {
            setPaypalLoaded(true);
            let orderId;
            const FUNDING_SOURCES = [paypal.FUNDING.PAYPAL];
            FUNDING_SOURCES.forEach((fundingSource) => {
                paypal
                    .Buttons({
                    fundingSource,
                    style: {
                        layout: "vertical",
                        shape: "pill",
                        color: fundingSource === paypal.FUNDING.PAYLATER ? "gold" : "",
                    },
                    createOrder: async () => {
                        try {
                            const { data, error } = await (0, api_1.default)({
                                url: `/api/finance/deposit/fiat/paypal`,
                                method: "POST",
                                silent: true,
                                body: {
                                    amount: depositAmount,
                                    currency: selectedCurrency,
                                },
                            });
                            if (!error) {
                                orderId = data.id;
                                return data.id;
                            }
                            else {
                                sonner_1.toast.error("Failed to create order");
                            }
                        }
                        catch (error) {
                            console.error("Create order error:", error);
                            sonner_1.toast.error("Error creating PayPal order");
                        }
                    },
                    onApprove: async () => {
                        try {
                            const { data, error } = await (0, api_1.default)({
                                url: `/api/finance/deposit/fiat/paypal/verify`,
                                method: "POST",
                                silent: true,
                                params: {
                                    orderId,
                                },
                            });
                            if (!error) {
                                setDeposit(data);
                                setStep(5);
                            }
                        }
                        catch (error) {
                            console.error(error);
                            sonner_1.toast.error("Error approving PayPal transaction");
                        }
                    },
                })
                    .render("#paypal-button-container");
            });
        }
    }, [paypalLoaded, paypal, depositAmount, selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.minAmount]);
    const [customFields, setCustomFields] = (0, react_1.useState)({});
    const [filePreviews] = (0, react_1.useState)({});
    const [formValues, setFormValues] = (0, react_1.useState)({});
    const [formErrors] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        if (selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.customFields) {
            const fields = JSON.parse(selectedDepositMethod.customFields);
            setCustomFields(fields);
        }
    }, [selectedDepositMethod]);
    const handleChange = (0, react_1.useCallback)((name, value) => {
        setFormValues((prevValues) => {
            const newValues = { ...prevValues };
            newValues[name] = value;
            return newValues;
        });
    }, [setFormValues, filePreviews, customFields]);
    const firstErrorInputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (firstErrorInputRef.current) {
            firstErrorInputRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            setTimeout(() => {
                var _a;
                (_a = firstErrorInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }, 200);
        }
    }, [formErrors]);
    const setFirstErrorInputRef = (inputRef, error) => {
        if (error && !firstErrorInputRef.current) {
            firstErrorInputRef.current = inputRef;
        }
        else if (!error && firstErrorInputRef.current === inputRef) {
            firstErrorInputRef.current = null;
        }
    };
    const renderFormField = (0, react_1.useCallback)((formItem) => {
        const { name, type, title, required } = formItem;
        const value = formValues[name] || "";
        const error = formErrors[name];
        const commonProps = {
            name,
            label: title,
            placeholder: `Enter ${title}`,
            required,
            error,
            value,
            onChange: (e) => handleChange(name, e.target.value),
            setFirstErrorInputRef: (inputRef) => setFirstErrorInputRef(inputRef, error),
        };
        switch (type) {
            case "input":
                return <Input_1.default key={name} {...commonProps}/>;
            case "textarea":
                return <Textarea_1.default key={name} {...commonProps}/>;
            default:
                return null;
        }
    }, [formValues, formErrors, filePreviews, handleChange]);
    const renderFormFields = (0, react_1.useCallback)((formItems) => {
        if (!Array.isArray(formItems))
            return null;
        return formItems.map((formItem, index) => {
            if (Array.isArray(formItem)) {
                const gridCols = `grid-cols-${formItem.length}`;
                return (<div key={index} className={`grid gap-4 ${gridCols}`}>
              {formItem.map((nestedItem) => renderFormField(nestedItem))}
            </div>);
            }
            else {
                return (<div key={index} className="space-y-5">
              {renderFormField(formItem)}
            </div>);
            }
        });
    }, [renderFormField]);
    const calculateFees = (amount) => {
        const fixedFee = (selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.fixedFee) || 0;
        const percentageFee = (selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.percentageFee) || 0;
        const fee = fixedFee + (percentageFee * amount) / 100;
        const total = amount + fee;
        return { fee, total };
    };
    const { fee, total } = (0, react_1.useMemo)(() => calculateFees(depositAmount || 0), [depositAmount, selectedDepositMethod]);
    if (stripeListener) {
        return (<div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <react_2.Icon icon="mdi:loading" className="h-12 w-12 animate-spin text-primary-500"/>
          <p className="text-xl text-primary-500">
            {t("Processing payment...")}
          </p>
        </div>
      </div>);
    }
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.title} {t("Deposit Amount")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Enter the amount you want to deposit")}
        </p>
      </div>
      <div className="mx-auto w-full max-w-sm space-y-5 rounded-sm">
        <div>
          <Input_1.default type="number" value={depositAmount || ""} placeholder={t("Enter amount")} label={t("Amount")} className="w-full" min={Number(selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.minAmount)} max={Number(selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.maxAmount)} required onChange={(e) => {
            setDepositAmount(parseFloat(e.target.value));
        }}/>
        </div>
        {customFields && renderFormFields(customFields)}

        <div className="card-dashed text-sm mt-5">
          <div className="flex justify-between">
            <p className="text-muted-600 dark:text-muted-300">
              {t("Fixed Fee")}
            </p>
            <p className="text-muted-600 dark:text-muted-300">
              {(selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.fixedFee) || 0}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-600 dark:text-muted-300">
              {t("Percentage Fee")}
            </p>
            <p className="text-muted-600 dark:text-muted-300">
              {(selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.percentageFee) || 0}%
            </p>
          </div>
          <div className="flex justify-between border-b border-dashed pb-2 border-muted-300 dark:border-muted-700 mb-2">
            <p className="text-muted-600 dark:text-muted-300">
              {t("Total Fee")}
            </p>
            <p className="text-muted-600 dark:text-muted-300">
              {fee.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between border-b border-dashed pb-2 border-muted-300 dark:border-muted-700 mb-2">
            <p className="text-muted-600 dark:text-muted-300">
              {t("Total to Pay")}
            </p>
            <p className="text-muted-600 dark:text-muted-300">
              {total.toFixed(2)}
            </p>
          </div>
        </div>

        {(selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.alias) === "paypal" && (<>
            <div id="paypal-button-container" className={depositAmount >= Number(selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.minAmount) &&
                paypalLoaded
                ? ""
                : "hidden"}></div>
            {depositAmount < Number(selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.minAmount) &&
                !paypalLoaded && (<button className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-3xl text-white bg-gray-400 hover:bg-gray-500 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50" type="button" disabled>
                  {t("Pay with PayPal")}
                </button>)}
          </>)}

        <div className="mx-auto mt-16! max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button_1.default type="button" size="lg" className="w-full" onClick={() => {
            setPaypalLoaded(false);
            setPaypal(null);
            setSelectedDepositMethod(null, null);
            setStep(3);
        }} disabled={loading}>
              <react_2.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
              {t("Go Back")}
            </Button_1.default>
            {(selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.alias) !== "paypal" && (<Button_1.default type="button" color="primary" size="lg" className="w-full" onClick={() => {
                handleFiatDeposit(formValues);
            }} disabled={!depositAmount ||
                depositAmount === 0 ||
                loading ||
                stripeListener}>
                {t("Deposit")}
                <react_2.Icon icon="mdi:chevron-right" className="h-5 w-5"/>
              </Button_1.default>)}
          </div>
        </div>
      </div>
    </div>);
};
exports.FiatDepositAmount = (0, react_1.memo)(FiatDepositAmountBase);
