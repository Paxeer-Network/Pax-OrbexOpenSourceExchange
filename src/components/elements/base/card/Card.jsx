"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const card_variants_1 = require("@/components/elements/variants/card-variants");
const Card = ({ children, color = "default", className: classes = "", shape = "smooth", shadow = "none", ...props }) => {
    return (<div className={(0, card_variants_1.cardVariants)({
            color,
            shape,
            shadow,
            className: `${classes}`,
        })} {...props}>
      {children}
    </div>);
};
exports.default = Card;
