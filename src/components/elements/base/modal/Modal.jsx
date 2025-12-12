"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};
const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 150, damping: 20 },
    },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.5 } },
};
const Modal = ({ open, size = "md", classes, children, onBackdropClick, }) => {
    if (!open)
        return null;
    return (<framer_motion_1.motion.div className={`fixed inset-0 z-9999 flex items-center justify-center ${classes === null || classes === void 0 ? void 0 : classes.wrapper}`} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.5 }}>
      <framer_motion_1.motion.div role="button" className={`fixed inset-0 cursor-default bg-muted-800/70 dark:bg-muted-900/80 ${classes === null || classes === void 0 ? void 0 : classes.backdrop}`} variants={backdropVariants} onClick={onBackdropClick}></framer_motion_1.motion.div>
      <div className={`fixed inset-0 mx-auto
          ${size === "sm" ? "max-w-sm" : ""}
          ${size === "md" ? "max-w-md" : ""}
          ${size === "lg" ? "max-w-xl" : ""}
          ${size === "xl" ? "max-w-2xl" : ""}
          ${size === "2xl" ? "max-w-3xl" : ""}
          ${size === "3xl" ? "max-w-5xl" : ""}
        `}>
        <div className={`flex min-h-full items-center justify-center p-4 text-center ${classes === null || classes === void 0 ? void 0 : classes.dialog}`}>
          <framer_motion_1.motion.div className="w-full text-start" variants={modalVariants}>
            {children}
          </framer_motion_1.motion.div>
        </div>
      </div>
    </framer_motion_1.motion.div>);
};
exports.default = Modal;
