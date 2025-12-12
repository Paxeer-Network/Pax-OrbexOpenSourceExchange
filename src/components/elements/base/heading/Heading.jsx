"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cn_1 = require("@/utils/cn");
const react_1 = require("react");
const Heading = ({ as: Tag = "h2", size = "md", weight = "normal", className, children, }) => {
    const classes = (0, cn_1.cn)({
        "text-xs": size === "xs",
        "text-sm": size === "sm",
        "text-md": size === "md",
        "text-lg": size === "lg",
        "text-xl": size === "xl",
        "font-light": weight === "light",
        "font-normal": weight === "normal",
        "font-medium": weight === "medium",
        "font-bold": weight === "bold",
    }, className);
    return <Tag className={classes}>{children}</Tag>;
};
exports.default = (0, react_1.memo)(Heading);
