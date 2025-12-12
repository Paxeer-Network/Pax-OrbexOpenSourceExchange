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
const useOnClickOutside_1 = __importDefault(require("@/hooks/useOnClickOutside"));
const react_2 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const Button_1 = __importDefault(require("../button/Button"));
const Dropdown = ({ className: classes = "", children, title, toggleIcon, toggleImage, toggleButton, indicator = true, showAll, toggleClassNames = "", indicatorClasses = "", orientation = "start", shape = "smooth", toggleShape = "smooth", canRotate = false, color = "default", }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [show, setShow] = (0, react_1.useState)(false);
    const dropdownRef = (0, react_1.useRef)(null);
    (0, useOnClickOutside_1.default)(dropdownRef, () => setShow(false));
    return (<div ref={dropdownRef} className={`group relative text-start ${classes} ${show ? "active" : ""}`}>
      {indicator ? (<span className={`absolute right-0.5 top-0.5 z-2 block h-2 w-2 rounded-full bg-primary-500 ${indicatorClasses}`}></span>) : ("")}
      {toggleButton ? (<Button_1.default onClick={() => setShow(!show)} color={color} shape={toggleShape} aria-label="Dropdown toggle">
          {toggleButton}
        </Button_1.default>) : (<button type="button" aria-label="Dropdown toggle" onClick={() => setShow(!show)} className={`mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 ${toggleClassNames} 
        ${canRotate && show ? "rotate-90" : "rotate-0"}`}>
          {toggleImage ? (<>{toggleImage}</>) : (<react_2.Icon icon={toggleIcon} className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"/>)}
        </button>)}
      <div className={`before:content-[' '] after:content-[' '] absolute top-[36px] z-5 min-w-[240px] ${shape !== "straight" && "rounded-xl"} border border-muted-200 bg-white shadow-lg shadow-muted-300/30 transition-all duration-300 before:pointer-events-none before:absolute before:bottom-full before:-ms-3 before:h-0 before:w-0 before:border-[9.6px] before:border-transparent before:border-b-muted-200 after:pointer-events-none after:absolute after:bottom-full after:-ms-[8.3px] after:h-0 after:w-0 after:border-[8.3px] after:border-transparent after:border-b-white dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/30 dark:before:border-b-muted-800 dark:after:border-b-muted-950 
          ${show
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-[4px] opacity-0"}
          ${orientation === "start"
            ? "-left-3 before:right-[85.5%] after:right-[86%]"
            : ""}
          ${orientation === "end"
            ? "-right-3 before:left-[90%] after:left-[90%]"
            : ""}
          ${shape === "rounded-sm" ? "rounded-md" : ""}
          ${shape === "smooth" ? "rounded-lg" : ""}
          ${shape === "curved" ? "rounded-xl" : ""}
        `}>
        <div className="relative h-full w-full">
          {!!title ? (<div className="flex items-center justify-between px-4 pt-3">
              <div className="font-sans text-xs font-light uppercase tracking-wide text-muted-400">
                <span>{title}</span>
              </div>

              {showAll ? (<a href={showAll} className="cursor-pointer font-sans text-xs font-semibold text-primary-500 underline-offset-4 hover:underline">
                  {t("View all")}
                </a>) : ("")}
            </div>) : ("")}
          <div className={`${(title === null || title === void 0 ? void 0 : title.toLowerCase()) + "-items"} ${title && "py-2  space-y-1"}`}>
            {children}
          </div>
        </div>
      </div>
    </div>);
};
exports.default = Dropdown;
