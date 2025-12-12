"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.radioVariants = void 0;
const class_variance_authority_1 = require("class-variance-authority");
exports.radioVariants = (0, class_variance_authority_1.cva)("relative left-[.4px] z-2 h-2 w-2 scale-0 transition-transform delay-150 duration-300 peer-checked:scale-100", {
    variants: {
        color: {
            primary: "text-primary-500",
            info: "text-info-500",
            success: "text-success-500",
            warning: "text-warning-500",
            danger: "text-danger-500",
            default: "text-muted-500 dark:text-white",
        },
    },
    defaultVariants: {
        color: "default",
    },
});
