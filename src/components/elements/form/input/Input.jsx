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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@iconify/react");
const input_variants_1 = require("@/components/elements/variants/input-variants");
const Loader_1 = __importDefault(require("@/components/elements/base/loader/Loader"));
const Input = ({ label, addon, size = "md", color = "default", shape = "smooth", error, loading = false, icon, className: classes = "", noPadding = false, setFirstErrorInputRef, warning, ...props }) => {
    const inputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (setFirstErrorInputRef) {
            setFirstErrorInputRef(inputRef.current);
        }
    }, [setFirstErrorInputRef, error]);
    return (<div className="w-full">
      {!!label && (<label className="font-sans text-[.68rem] text-muted-400">
          {label}
        </label>)}
      <div className={`relative w-full ${addon ? "flex" : ""}`}>
        {!!addon ? (<div className={`inline-flex cursor-pointer items-center justify-center border border-muted-200 border-e-transparent bg-muted-100 ${!noPadding && "px-4 py-2"} text-center text-sm leading-tight text-muted-500 dark:border-muted-800 dark:border-e-transparent dark:bg-muted-700 dark:text-muted-300
            ${size === "sm" ? "h-8" : ""}
            ${size === "md" ? "h-10" : ""}
            ${size === "lg" ? "h-12" : ""}
            ${shape === "rounded-sm" ? "rounded-s-md" : ""}
            ${shape === "smooth" ? "rounded-s-lg" : ""}
            ${shape === "curved" ? "rounded-s-xl" : ""}
            ${shape === "full" ? "rounded-s-full" : ""}
          `}>
            {addon}
          </div>) : ("")}
        <input ref={inputRef} className={(0, input_variants_1.inputVariants)({
            size,
            color,
            shape,
            className: `peer 
      ${classes}
      ${size === "sm" && icon ? "pe-2 ps-8" : ""}
      ${size === "md" && icon ? "pe-3 ps-10" : ""}
      ${size === "lg" && icon ? "pe-4 ps-12" : ""}
      ${size === "sm" && !icon ? "px-2" : ""}
      ${size === "md" && !icon ? "px-3" : ""}
      ${size === "lg" && !icon ? "px-4" : ""}
      ${error ? "border-danger-500!" : ""}
      ${addon ? "rounded-s-none!" : ""}
      ${loading
                ? "text-transparent! placeholder:text-transparent! shadow-none! pointer-events-none select-none!"
                : ""}
      ring-1 ring-transparent focus:ring-${warning ? "warning" : "primary"}-500 focus:ring-opacity-50
    `,
        })} {...props}/>

        {!!icon ? (<div className={`absolute left-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-${warning ? "warning" : "primary"}-500 dark:text-muted-500 
            ${size === "sm" ? "h-9 w-9" : ""} 
            ${size === "md" ? "h-10 w-10" : ""} 
            ${size === "lg" ? "h-12 w-12" : ""}`}>
            <react_2.Icon icon={icon} className={`
              ${size === "sm" ? "h-4 w-4" : ""} 
              ${size === "md" ? "h-[14px] w-[14px]" : ""} 
              ${size === "lg" ? "h-6 w-6" : ""}
              ${error ? "text-danger-500!" : ""}
            `}/>
          </div>) : ("")}
        {!!loading ? (<div className={`absolute right-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 
            ${size === "sm" ? "h-9 w-9" : ""} 
            ${size === "md" ? "h-10 w-10" : ""} 
            ${size === "lg" ? "h-12 w-12" : ""}`}>
            <Loader_1.default classNames={`dark:text-muted-200
                ${color === "muted" || color === "mutedContrast"
                ? "text-muted-400"
                : "text-muted-300"}
              `} size={20} thickness={4}/>
          </div>) : ("")}
        {error ? (<span className="mt-0.5 block font-sans text-[0.6rem] text-danger-500">
            {error}
          </span>) : ("")}
      </div>
    </div>);
};
exports.default = Input;
