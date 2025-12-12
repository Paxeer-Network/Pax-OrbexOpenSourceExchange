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
const select_variants_1 = require("@/components/elements/variants/select-variants");
const Loader_1 = __importDefault(require("@/components/elements/base/loader/Loader"));
const Select = ({ label, options, icon, color = "default", shape, size = "md", error, loading = false, className: classes = "", containerClasses = "", onClose, setFirstErrorInputRef, ...props }) => {
    const inputRef = (0, react_1.useRef)(null);
    const selectRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (setFirstErrorInputRef) {
            setFirstErrorInputRef(selectRef.current);
        }
    }, [setFirstErrorInputRef, error]);
    const closeDropdown = () => {
        if (onClose) {
            onClose();
        }
    };
    if (!Array.isArray(options)) {
        throw new Error("options must be an array!");
    }
    const transformedOptions = options.map((option) => typeof option === "string" ? { label: option, value: option } : option);
    return (<div className={`w-full font-sans ${containerClasses}`}>
      {!!label && (<label className={`"font-sans text-${size === "sm" ? "xs" : "sm"} text-muted-400 dark:text-muted-500"`}>
          {label}
        </label>)}
      <div className="relative">
        <div ref={inputRef} className={`group relative inline-block w-full after:pointer-events-none after:absolute after:right-[.9em] after:top-1/2 after:z-4 after:block after:h-[.5em] after:w-[.5em] after:rounded-[2px] after:border-b-[2.4px] after:border-s-[2.4px] after:border-muted-400 after:transition-all after:duration-300 after:content-[''] after:[transform:scale(0.8)_rotate(-45deg)] focus-within:after:[transform:scale(0.8)_rotate(-225deg)]
            ${size === "sm"
            ? "after:-mt-[.366em] focus-within:after:top-[60%]"
            : ""}
            ${size === "md"
            ? "after:-mt-[.366em] focus-within:after:top-[60%]"
            : ""}
            ${size === "lg"
            ? "after:-mt-[.366em] focus-within:after:top-[60%]"
            : ""}
            ${loading ? "after:border-transparent! pointer-events-none" : ""}
        `}>
          <select ref={selectRef} onBlur={closeDropdown} className={(0, select_variants_1.selectVariants)({
            size,
            color,
            shape,
            className: `peer 
                ${classes}
                ${size === "sm" && icon ? "ps-8 py-1!" : ""}
                ${size === "md" && icon ? "ps-10" : ""}
                ${size === "lg" && icon ? "ps-12" : ""}
                ${size === "sm" && !icon ? "ps-2 py-1!" : ""}
                ${size === "md" && !icon ? "ps-3" : ""}
                ${size === "lg" && !icon ? "ps-4" : ""}
                ${error ? "border-danger-500!" : ""}
                ${loading ? "text-transparent! shadow-none! select-none!" : ""}
              `,
        })} {...props}>
            {transformedOptions.map((opt, i) => (<option key={i} value={opt.value}>
                {opt.label}
              </option>))}
          </select>
        </div>

        {!!icon ? (<div className={`absolute left-0 top-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 
            ${size === "sm" ? "h-8 w-8" : ""} 
            ${size === "md" ? "h-10 w-10" : ""} 
            ${size === "lg" ? "h-12 w-12" : ""}`}>
            <react_2.Icon icon={icon} className={`
              ${size === "sm" ? "h-3 w-3" : ""} 
              ${size === "md" ? "h-4 w-4" : ""} 
              ${size === "lg" ? "h-5 w-5" : ""}
              ${error ? "text-danger-500!" : ""}
            `}/>
          </div>) : ("")}
        {!!loading ? (<div className={`absolute right-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 
            ${size === "sm" ? "h-8 w-8" : ""} 
            ${size === "md" ? "h-10 w-10" : ""} 
            ${size === "lg" ? "h-12 w-12" : ""}`}>
            <Loader_1.default classNames={`dark:text-muted-200
                ${color === "muted" || color === "mutedContrast"
                ? "text-muted-400"
                : "text-muted-300"}
              `} size={20} thickness={4}/>
          </div>) : ("")}
        {!!error ? (<span className="mt-0.5 block font-sans text-[0.48rem] text-danger-500">
            {error}
          </span>) : ("")}
      </div>
    </div>);
};
exports.default = Select;
