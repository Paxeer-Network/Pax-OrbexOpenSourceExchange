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
const textarea_variants_1 = require("@/components/elements/variants/textarea-variants");
const Loader_1 = __importDefault(require("@/components/elements/base/loader/Loader"));
const constants_1 = require("@/utils/constants");
const Textarea = ({ label, error, color = "default", shape = "smooth", resize = false, loading = false, className: classes = "", setFirstErrorInputRef, ...props }) => {
    const textareaRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (setFirstErrorInputRef) {
            setFirstErrorInputRef(textareaRef.current);
        }
    }, [setFirstErrorInputRef, error]);
    return (<div className="w-full font-sans">
      {!!label ? <label className="text-sm text-muted-400">{label}</label> : ""}
      <div className="relative w-full text-base">
        <textarea ref={textareaRef} rows={4} className={(0, textarea_variants_1.textareaVariants)({
            color,
            shape,
            className: ` 
              ${classes}
              ${!resize ? "resize-none" : ""}
              ${error ? "border-danger-500!" : ""}
              ${loading
                ? "pointer-events-none text-transparent! shadow-none! placeholder:text-transparent! select-none!"
                : ""}
              ${constants_1.focusClass}
            `,
        })} {...props}></textarea>
        {!!loading ? (<div className={`absolute right-0 top-0 z-0 flex h-10 w-10 items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 
          `}>
            <Loader_1.default classNames={`dark:text-muted-200
                ${color === "muted" || color === "mutedContrast"
                ? "text-muted-400"
                : "text-muted-300"}
              `} size={20} thickness={4}/>
          </div>) : ("")}
        {!!error ? (<span className="-mt-1 block font-sans text-[0.6rem] text-danger-500">
            {error}
          </span>) : ("")}
      </div>
    </div>);
};
exports.default = Textarea;
