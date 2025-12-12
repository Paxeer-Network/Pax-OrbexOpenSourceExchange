"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const RadioHeadless = ({ id, checked, label, name, children, ...props }) => {
    return (<div className="group/radio-headless relative">
      {label ? (<label className="mb-1 inline-block cursor-pointer select-none font-sans text-sm text-muted-400">
          {label}
        </label>) : ("")}
      <div className="relative">
        <input type="radio" id={id} name={name} checked={checked} {...props} className="peer absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"/>
        {children}
      </div>
    </div>);
};
exports.default = RadioHeadless;
