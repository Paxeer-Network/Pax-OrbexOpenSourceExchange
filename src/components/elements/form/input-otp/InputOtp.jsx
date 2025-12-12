"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const strings_1 = require("@/utils/strings");
const InputOtp = ({ value, valueLength, color = "default", shape = "smooth", onChange, }) => {
    const valueItems = (0, react_1.useMemo)(() => {
        const valueArray = value.split("");
        const items = [];
        for (let i = 0; i < valueLength; i++) {
            const char = valueArray[i];
            if (strings_1.RE_DIGIT.test(char)) {
                items.push(char);
            }
            else {
                items.push("");
            }
        }
        return items;
    }, [value, valueLength]);
    const focusToNextInput = (target) => {
        const nextElementSibling = target.nextElementSibling;
        if (nextElementSibling) {
            nextElementSibling.focus();
        }
    };
    const focusToPrevInput = (target) => {
        const previousElementSibling = target.previousElementSibling;
        if (previousElementSibling) {
            previousElementSibling.focus();
        }
    };
    const inputOnChange = (e, idx) => {
        const target = e.target;
        let targetValue = target.value.trim();
        const isTargetValueDigit = strings_1.RE_DIGIT.test(targetValue);
        if (!isTargetValueDigit && targetValue !== "") {
            return;
        }
        const nextInputEl = target.nextElementSibling;
        // only delete digit if next input element has no value
        if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== "") {
            return;
        }
        targetValue = isTargetValueDigit ? targetValue : " ";
        const targetValueLength = targetValue.length;
        if (targetValueLength === 1) {
            const newValue = value.substring(0, idx) + targetValue + value.substring(idx + 1);
            onChange(newValue);
            if (!isTargetValueDigit) {
                return;
            }
            focusToNextInput(target);
        }
        else {
            onChange(targetValue);
            target.blur();
        }
    };
    const inputOnKeyDown = (e) => {
        const { key } = e;
        const target = e.target;
        if (key === "ArrowRight" || key === "ArrowDown") {
            e.preventDefault();
            return focusToNextInput(target);
        }
        if (key === "ArrowLeft" || key === "ArrowUp") {
            e.preventDefault();
            return focusToPrevInput(target);
        }
        const targetValue = target.value;
        // keep the selection range position
        // if the same digit was typed
        target.setSelectionRange(0, targetValue.length);
        if (e.key !== "Backspace" || target.value !== "") {
            return;
        }
        focusToPrevInput(target);
    };
    const inputOnFocus = (e) => {
        const { target } = e;
        // keep focusing back until previous input
        // element has value
        const prevInputEl = target.previousElementSibling;
        if (prevInputEl && prevInputEl.value === "") {
            return prevInputEl.focus();
        }
        target.setSelectionRange(0, target.value.length);
    };
    return (<div className="flex w-full flex-row items-center justify-center gap-3">
      {valueItems.map((digit, idx) => (<input key={idx} type="text" inputMode="numeric" autoComplete="one-time-code" pattern="\d{1}" maxLength={valueLength} className={`flex w-16 flex-col items-center justify-center border py-5 text-center text-4xl text-muted-800 outline-hidden ring-primary-700 placeholder:text-muted-300 focus:ring-1 dark:text-muted-100 dark:placeholder:text-muted-700
          ${color === "default"
                ? "hover:border-muted-300 dark:hover:border-muted-600 border-muted-200 bg-white focus:bg-muted-50 dark:border-muted-700 dark:bg-muted-800 dark:focus:bg-muted-900"
                : ""}
          ${color === "contrast"
                ? "hover:border-muted-300 dark:hover:border-muted-700 bg-white focus:bg-muted-50 dark:border-muted-800 dark:bg-muted-900 dark:focus:bg-muted-900"
                : ""}
          ${color === "muted"
                ? "hover:border-muted-300 dark:hover:border-muted-600 border-muted-200 bg-muted-100 focus:bg-muted-100 dark:border-muted-700 dark:bg-muted-800 dark:focus:bg-muted-900"
                : ""}
          ${color === "mutedContrast"
                ? "hover:border-muted-300 dark:hover:border-muted-700 border-muted-200 bg-muted-100 focus:bg-muted-100 dark:border-muted-800 dark:bg-muted-900 dark:focus:bg-muted-900"
                : ""}
          ${shape === "rounded-sm" ? "rounded-md" : ""}
          ${shape === "smooth" ? "rounded-lg" : ""}
          ${shape === "curved" ? "rounded-xl" : ""}
          ${shape === "full" ? "rounded-full" : ""}
          `} value={digit} onChange={(e) => inputOnChange(e, idx)} onKeyDown={inputOnKeyDown} onFocus={inputOnFocus} placeholder="0"/>))}
    </div>);
};
exports.default = InputOtp;
