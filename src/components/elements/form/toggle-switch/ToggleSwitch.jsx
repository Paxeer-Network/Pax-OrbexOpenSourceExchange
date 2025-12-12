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
const toggle_switch_variants_1 = require("@/components/elements/variants/toggle-switch-variants");
const ToggleSwitch = ({ id, checked, label, sublabel, color, className: classes = "", error, setFirstErrorInputRef, ...props }) => {
    const inputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (setFirstErrorInputRef) {
            setFirstErrorInputRef(inputRef.current);
        }
    }, [setFirstErrorInputRef, error]);
    return (<div className={`relative flex items-center gap-2 text-base ${classes}`}>
      <label htmlFor={id} className="relative inline-flex items-center gap-3 cursor-pointer">
        <span className="relative inline-flex">
          <input ref={inputRef} id={id} type="checkbox" checked={checked} className={`peer pointer-events-none absolute opacity-0`} {...props}/>
          <i className={(0, toggle_switch_variants_1.toggleSwitchVariants)({ color })}></i>
        </span>

        {!sublabel ? (<span className="font-sans text-sm text-muted-400">{label}</span>) : (<div className="ms-1">
            <span className="block font-sans text-sm text-muted-800 dark:text-muted-100">
              {label}
            </span>
            <span className="block font-sans text-xs text-muted-400 dark:text-muted-400">
              {sublabel}
            </span>
          </div>)}
      </label>
    </div>);
};
exports.default = ToggleSwitch;
