"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const iconbox_variants_1 = require("@/components/elements/variants/iconbox-variants");
const IconBox = ({ variant, color = "default", icon, shape = "full", size = "md", mask, shadow, className: classes = "", iconClasses = "", rotating = false, ...props }) => {
    return (<div className={(0, iconbox_variants_1.iconboxVariants)({
            variant,
            color,
            shape,
            size,
            shadow,
            className: `relative flex items-center justify-center shrink-0 ${classes} 
        ${shape === "straight" && variant !== "outlined" && mask === "hex"
                ? "mask mask-hex"
                : ""} 
        ${shape === "straight" && variant !== "outlined" && mask === "hexed"
                ? "mask mask-hexed"
                : ""} 
        ${shape === "straight" && variant !== "outlined" && mask === "blob"
                ? "mask mask-blob"
                : ""} 
        ${shape === "straight" && variant !== "outlined" && mask === "deca"
                ? "mask mask-deca"
                : ""} 
        ${shape === "straight" && variant !== "outlined" && mask === "diamond"
                ? "mask mask-diamond"
                : ""}`,
        })} {...props}>
      <react_2.Icon icon={icon} className={`${iconClasses} ${rotating ? "rotating" : ""}`}/>
    </div>);
};
exports.default = IconBox;
