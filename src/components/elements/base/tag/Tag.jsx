"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const tag_variants_1 = require("@/components/elements/variants/tag-variants");
const Tag = ({ children, variant, color, shape, shadow, className: classes = "", ...props }) => {
    return (<span className={(0, tag_variants_1.tagVariants)({
            shape,
            variant,
            color,
            shadow,
            className: `${classes}`,
        })} {...props}>
      {children}
    </span>);
};
exports.default = Tag;
