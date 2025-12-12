"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiatWithdrawAmount = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const withdraw_1 = require("@/stores/user/wallet/withdraw");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const next_i18next_1 = require("next-i18next");
const FiatWithdrawAmountBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { selectedWithdrawMethod, setSelectedWithdrawMethod, setStep, handleFiatWithdraw, setWithdrawAmount, withdrawAmount, loading, } = (0, withdraw_1.useWithdrawStore)();
    const [customFields, setCustomFields] = (0, react_1.useState)({});
    const [filePreviews] = (0, react_1.useState)({});
    const [formValues, setFormValues] = (0, react_1.useState)({});
    const [formErrors] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        if (selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.customFields) {
            const fields = JSON.parse(selectedWithdrawMethod.customFields);
            setCustomFields(fields);
        }
    }, [selectedWithdrawMethod]);
    const handleChange = (0, react_1.useCallback)((name, values) => {
        setFormValues((prevValues) => {
            const newValues = { ...prevValues };
            newValues[name] = values;
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
        const value = formValues[name];
        const error = formErrors[name];
        const commonProps = {
            key: name,
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
                return <Input_1.default {...commonProps}/>;
            case "textarea":
                return <Textarea_1.default {...commonProps}/>;
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
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.title} {t("Withdraw Confirmation")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Enter the amount you want to withdraw")}
        </p>
      </div>
      <div className="mx-auto mb-4 w-full max-w-md space-y-5 rounded-sm px-8 pb-8">
        <div>
          <Input_1.default type="number" placeholder={t("Enter amount")} label={t("Amount")} className="w-full" min={Number(selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.minAmount)} max={Number(selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.maxAmount)} required onChange={(e) => {
            setWithdrawAmount(parseFloat(e.target.value));
        }}/>
        </div>
        {customFields && renderFormFields(customFields)}

        <div className="mx-auto mt-16! max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button_1.default type="button" size="lg" className="w-full" onClick={() => {
            setSelectedWithdrawMethod(null);
            setStep(3);
        }} disabled={loading}>
              <react_2.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
              {t("Go Back")}
            </Button_1.default>
            {(selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.alias) !== "paypal" && (<Button_1.default type="button" color="primary" size="lg" className="w-full" onClick={() => {
                handleFiatWithdraw(formValues);
            }} disabled={!withdrawAmount || withdrawAmount === 0 || loading}>
                {t("Withdraw")}
                <react_2.Icon icon="mdi:chevron-right" className="h-5 w-5"/>
              </Button_1.default>)}
          </div>
        </div>
      </div>
    </div>);
};
exports.FiatWithdrawAmount = (0, react_1.memo)(FiatWithdrawAmountBase);
