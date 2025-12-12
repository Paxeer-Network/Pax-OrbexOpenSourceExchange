"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const radio_variants_1 = require("@/components/elements/variants/radio-variants");
const Radio = ({ id, color, label, className: classes = "", ...props }) => {
    // const radioId = label.toLocaleLowerCase().replaceAll(" ", "-");
    return (<div className={`radio-${color || "default"}  relative inline-block cursor-pointer leading-tight`}>
      <label htmlFor={id} className="flex items-center">
        <span className="shrink-0 relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-muted-300 bg-muted-100 text-white transition-shadow duration-300 dark:border-muted-700 dark:bg-muted-800">
          <input id={id} type="radio" className={`peer absolute top-0 left-0 z-3 h-full w-full cursor-pointer appearance-none ${classes}`} {...props}/>
          <react_2.Icon icon="octicon:dot-fill-24" className={(0, radio_variants_1.radioVariants)({ color })}/>
          <span className="absolute top-0 left-0 z-1 block h-full  w-full scale-0 rounded-full bg-white transition-transform duration-300 peer-checked:scale-[1.1] peer-checked:rounded-[.28rem] dark:bg-muted-900"></span>
        </span>
        <span className="ms-2 cursor-pointer text-[.72rem] text-muted-500 dark:text-muted-400">
          {label}
        </span>
      </label>
    </div>);
};
exports.default = Radio;
