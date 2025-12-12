"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedTooltip = void 0;
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const AnimatedTooltip = ({ children, content, position = "top", classNames, }) => {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const x = (0, framer_motion_1.useMotionValue)(50); // Centered initial value
    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        // Reduce range to make the effect barely noticeable
        x.set(((event.clientX - rect.left) / rect.width) * 100);
    };
    return (<div className={`tooltip-wrapper ${classNames || ""}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onMouseMove={handleMouseMove}>
      {children}
      <framer_motion_1.AnimatePresence>
        {isHovered && (<framer_motion_1.motion.div initial={{ opacity: 0, y: 20, scale: 0.6 }} animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                },
            }} exit={{ opacity: 0, y: 18, scale: 0.6 }} className={`tooltip tooltip-${position} text-xs flex-col items-center justify-center rounded-md shadow-xl px-4 py-2 -translate-x-1/2 cursor-help`}>
            {content}
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>
    </div>);
};
exports.AnimatedTooltip = AnimatedTooltip;
