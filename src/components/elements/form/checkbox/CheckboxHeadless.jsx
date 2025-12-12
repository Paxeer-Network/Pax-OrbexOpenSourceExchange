"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const CheckboxHeadless = ({ id, checked, label, children, ...props }) => {
    return (<div className="group/checkbox-headless relative">
      {label ? (<label className="mb-1 inline-block cursor-pointer select-none font-sans text-sm text-muted-400">
          {label}
        </label>) : ("")}
      <label htmlFor={id} className="relative block">
        <input id={id} className="peer absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0" type="checkbox" checked={checked} {...props}/>
        {children}
      </label>
    </div>);
};
exports.default = CheckboxHeadless;
