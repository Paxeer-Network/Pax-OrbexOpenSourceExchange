"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Progress = ({ color = "primary", contrast = "default", shape = "full", size = "sm", value, max = 100, classNames, }) => {
    return (<div role="progressbar" aria-valuenow={value} aria-valuemax={max} className={`relative w-full overflow-hidden 
        ${size === "xs" ? "h-1" : ""}
        ${size === "sm" ? "h-2" : ""}
        ${size === "md" ? "h-3" : ""}
        ${size === "lg" ? "h-4" : ""}
        ${size === "xl" ? "h-5" : ""}
        ${shape === "rounded-sm" ? "rounded-md" : ""}
        ${shape === "curved" ? "rounded-lg" : ""}
        ${shape === "full" ? "rounded-full" : ""}
        ${contrast === "default" ? "bg-muted-200 dark:bg-muted-700" : ""}
        ${contrast === "contrast" ? "bg-muted-200 dark:bg-muted-900" : ""}
        ${classNames}
      `}>
      <div className={`absolute left-0 top-0 h-full transition-all duration-300
          ${color === "primary" ? "bg-primary-500" : ""}
          ${color === "info" ? "bg-info-500" : ""}
          ${color === "success" ? "bg-success-500" : ""}
          ${color === "warning" ? "bg-warning-500" : ""}
          ${color === "danger" ? "bg-danger-500" : ""}
          ${shape === "rounded-sm" ? "rounded-md" : ""}
          ${shape === "curved" ? "rounded-lg" : ""}
          ${shape === "full" ? "rounded-full" : ""}
          ${value === undefined ? "animate-indeterminate w-full" : ""}
        `} style={{ width: value !== undefined ? `${value}%` : "" }}></div>
    </div>);
};
exports.default = Progress;
