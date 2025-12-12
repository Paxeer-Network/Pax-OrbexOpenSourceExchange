"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const ResponsiveIconButton = ({ breakpoint, isActive, hasClasses, onClick, }) => (<Tooltip_1.Tooltip content={breakpoint.toUpperCase()} position="bottom">
    <div className="relative">
      <IconButton_1.default shape="rounded-xs" size="xs" color={isActive ? "primary" : "muted"} variant="outlined" onClick={onClick}>
        <react_2.Icon icon={`mdi:${breakpoint === "xs"
        ? "cellphone"
        : breakpoint === "sm"
            ? "tablet"
            : breakpoint === "md"
                ? "laptop"
                : breakpoint === "lg"
                    ? "desktop-classic"
                    : "monitor"}`} className="h-4 w-4"/>
      </IconButton_1.default>
      {hasClasses && (<span className="absolute top-0 -right-[2px] h-[5px] w-[5px] bg-warning-500 rounded-full"/>)}
    </div>
  </Tooltip_1.Tooltip>);
exports.default = ResponsiveIconButton;
