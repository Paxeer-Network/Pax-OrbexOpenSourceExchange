"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const ActionItem = ({ href, icon, image, text, subtext, shape = "smooth", blank, onClick, }) => {
    const handleClick = (event) => {
        if (onClick && !href) {
            event.preventDefault();
            onClick();
        }
    };
    return (<link_1.default href={href || "#"} target={blank ? "_blank" : "_self"} onClick={handleClick} className={`group/option mx-2 flex cursor-pointer items-center gap-3 px-4 py-2 transition-colors duration-300
        hover:bg-muted-100 dark:hover:bg-muted-800
        ${shape === "rounded-sm" ? "rounded-md" : ""}
        ${shape === "smooth" ? "rounded-lg" : ""}
        ${shape === "curved" ? "rounded-xl" : ""}
        ${!href ? "role='button'" : ""}`}>
      {image || null}
      {icon ? (<react_2.Icon icon={icon} className="h-5 w-5 text-muted-400 transition-colors duration-300 group-hover:option:text-primary-500"/>) : null}
      <div className="font-sans">
        <span className="block cursor-pointer text-xs font-normal leading-tight text-muted-800 dark:text-muted-100">
          {text}
        </span>
        <span className="block text-xs leading-tight text-muted-400">
          {subtext}
        </span>
      </div>
    </link_1.default>);
};
exports.default = ActionItem;
