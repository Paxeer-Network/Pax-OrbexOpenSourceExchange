"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const button_variants_1 = require("@/components/elements/variants/button-variants");
const Loader_1 = __importDefault(require("@/components/elements/base/loader/Loader"));
const framer_motion_1 = require("framer-motion");
const animations_1 = require("@/utils/animations");
const Button = ({ children, variant, color, shape, size = "md", shadow, className: classes, loading = false, animated = true, ...props }) => {
    return (<framer_motion_1.motion.div variants={animated ? animations_1.buttonMotionVariants : {}} initial="initial" whileHover="hover" whileTap="tap">
      <button className={(0, button_variants_1.buttonVariants)({
            variant,
            color,
            shape,
            size,
            shadow,
            className: `inline-flex items-center gap-1 whitespace-nowrap text-center text-sm ${loading ? "relative text-transparent! pointer-events-none" : ""} ${classes}`,
        })} {...props}>
        {children}
        {loading ? (<Loader_1.default classNames={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`} size={20} thickness={4}/>) : ("")}
      </button>
    </framer_motion_1.motion.div>);
};
exports.default = Button;
