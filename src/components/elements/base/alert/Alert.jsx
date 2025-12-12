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
const react_2 = require("@iconify/react");
const framer_motion_1 = require("framer-motion");
const Alert = ({ children, icon, label, sublabel, color = "default", shape = "smooth", className, iconClassName, style, canClose = true, onClose, button, }) => {
    const [visible, setVisible] = (0, react_1.useState)(true);
    const removeAlert = () => {
        setVisible((prev) => !prev);
        if (onClose) {
            onClose();
        }
    };
    return (<framer_motion_1.motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.3 }} className={`w-full`}>
      <div style={style}>
        {visible ? (<div className={`${className} flex items-center gap-2 border py-3 pe-2 ps-4
        ${shape === "rounded-xs" ? "rounded-xs" : ""}
        ${shape === "rounded-sm" ? "rounded-md" : ""}
        ${shape === "smooth" ? "rounded-lg" : ""}
        ${shape === "curved" ? "rounded-xl" : ""}
        ${color === "default"
                ? "border-muted-300 bg-white text-muted-800 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-100"
                : ""}
        ${color === "contrast"
                ? "border-muted-300 bg-white text-muted-800 dark:border-muted-800 dark:bg-muted-900 dark:text-muted-100"
                : ""}
        ${color === "muted"
                ? "border-muted-300 bg-muted-200 text-muted-800 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-100"
                : ""}
        ${color === "mutedContrast"
                ? "border-muted-300 bg-muted-200 text-muted-800 dark:border-muted-800 dark:bg-muted-900 dark:text-muted-100"
                : ""}
        ${color === "primary"
                ? "border-primary-500 bg-primary-500/10 text-primary-500"
                : ""}
        ${color === "info" ? "border-info-500 bg-info-500/10 text-info-500" : ""}
        ${color === "success"
                ? "border-success-500 bg-success-500/10 text-success-500"
                : ""}
        ${color === "warning"
                ? "border-warning-500 bg-warning-500/10 text-warning-500"
                : ""}
        ${color === "danger"
                ? "border-danger-500 bg-danger-500/10 text-danger-500"
                : ""}
      `}>
            {children ? (<>{children}</>) : (<div className="flex items-center gap-3 w-full ">
                {icon ? (<react_2.Icon height={24} width={24} icon={icon} className={iconClassName}/>) : ("")}
                <div className="w-full">
                  {label ? (<div className={`font-semibold text-sm mb-1
                    ${color === "default"
                        ? "text-muted-900 dark:text-muted-100"
                        : ""}
                    ${color === "contrast"
                        ? "text-muted-900 dark:text-muted-100"
                        : ""}
                    ${color === "muted"
                        ? "text-muted-900 dark:text-muted-100"
                        : ""}
                    ${color === "mutedContrast"
                        ? "text-muted-900 dark:text-muted-100"
                        : ""}
                    ${color === "primary" ? "text-primary-500" : ""}
                    ${color === "info" ? "text-info-500" : ""}
                    ${color === "success" ? "text-success-500" : ""}
                    ${color === "warning" ? "text-warning-500" : ""}
                    ${color === "danger" ? "text-danger-500" : ""}
                  `}>
                      {label}
                    </div>) : ("")}
                  {sublabel ? (<div className={`text-xs
                    ${color === "default"
                        ? "text-muted-700 dark:text-muted-200"
                        : ""}
                    ${color === "contrast"
                        ? "text-muted-700 dark:text-muted-200"
                        : ""}
                    ${color === "muted"
                        ? "text-muted-700 dark:text-muted-200"
                        : ""}
                    ${color === "mutedContrast"
                        ? "text-muted-700 dark:text-muted-200"
                        : ""}
                    ${color === "primary" ? "text-primary-500" : ""}
                    ${color === "info" ? "text-info-500" : ""}
                    ${color === "success" ? "text-success-500" : ""}
                    ${color === "warning" ? "text-warning-500" : ""}
                    ${color === "danger" ? "text-danger-500" : ""}
                  `}>
                      {sublabel}
                    </div>) : ("")}
                </div>
              </div>)}
            <div className="flex items-center gap-2 ms-auto">
              <div className={canClose ? "" : "me-2"}>{button}</div>
              {canClose && (<button className={`flex h-8 w-8 items-center justify-center rounded-full border-none bg-none transition-colors duration-300
            ${color === "default"
                    ? "text-muted-500 hover:bg-muted-100 dark:text-muted-200 dark:hover:bg-muted-700"
                    : ""}
            ${color === "contrast"
                    ? "text-muted-500 hover:bg-muted-100 dark:text-muted-100 dark:hover:bg-muted-800"
                    : ""}
            ${color === "muted"
                    ? "text-muted-700 hover:bg-muted-100 dark:text-muted-200 dark:hover:bg-muted-700"
                    : ""}
            ${color === "mutedContrast"
                    ? "text-muted-700 hover:bg-muted-100 dark:text-muted-200 dark:hover:bg-muted-800"
                    : ""}
            ${color === "primary"
                    ? "text-primary-500 hover:bg-primary-500/20"
                    : ""}
            ${color === "info" ? "text-info-500 hover:bg-info-500/20" : ""}
            ${color === "success"
                    ? "text-success-500 hover:bg-success-500/20"
                    : ""}
            ${color === "warning"
                    ? "text-warning-500 hover:bg-warning-500/20"
                    : ""}
            ${color === "danger" ? "text-danger-500 hover:bg-danger-500/20" : ""}
        `} onClick={removeAlert}>
                  <react_2.Icon height={14} width={14} icon="lucide:x"/>
                </button>)}
            </div>
          </div>) : ("")}
      </div>
    </framer_motion_1.motion.div>);
};
exports.default = Alert;
