"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cn_1 = require("@/utils/cn");
const react_1 = require("react");
const Paragraph = ({ size = "md", className, children, }) => {
    const classes = (0, cn_1.cn)({
        "text-xs": size === "xs",
        "text-sm": size === "sm",
        "text-md": size === "md",
        "text-lg": size === "lg",
        "text-xl": size === "xl",
    }, className);
    return <p className={classes}>{children}</p>;
};
exports.default = (0, react_1.memo)(Paragraph);
