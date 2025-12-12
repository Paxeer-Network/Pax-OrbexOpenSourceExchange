"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const button_icon_variants_1 = require("@/components/elements/variants/button-icon-variants");
const Loader_1 = __importDefault(require("@/components/elements/base/loader/Loader"));
const framer_motion_1 = require("framer-motion");
const animations_1 = require("@/utils/animations");
const IconButton = ({ variant, color, shape, size = "md", shadow, className: classes, children, loading = false, ...props }) => {
    return (<framer_motion_1.motion.div variants={animations_1.buttonMotionVariants} initial="initial" whileHover="hover" whileTap="tap">
      <button className={(0, button_icon_variants_1.buttonIconVariants)({
            variant,
            shape,
            color,
            size,
            shadow,
            className: `shrink-0 ${loading ? "pointer-events-none relative text-transparent!" : ""} ${classes}`,
        })} {...props}>
        {children}
        {loading ? (<Loader_1.default classNames="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" size={20} thickness={4}/>) : ("")}
      </button>
    </framer_motion_1.motion.div>);
};
exports.default = IconButton;
