"use client";
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
exports.Tooltip = void 0;
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const Tooltip = ({ children, content, position = "top", className, }) => {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const springConfig = { stiffness: 100, damping: 5 };
    const x = (0, framer_motion_1.useMotionValue)(0);
    const rotate = (0, framer_motion_1.useSpring)((0, framer_motion_1.useTransform)(x, [-100, 100], [-20, 20]), springConfig);
    const translateX = (0, framer_motion_1.useSpring)((0, framer_motion_1.useTransform)(x, [-100, 100], [-30, 30]), springConfig);
    const handleMouseMove = (event) => {
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        const halfWidth = rect.width / 2;
        x.set(event.nativeEvent.offsetX - halfWidth);
    };
    const positionClasses = {
        top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
        bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
        start: "right-full mr-2 top-1/2 -translate-y-1/2",
        end: "left-full ml-2 top-1/2 -translate-y-1/2",
    };
    const getLines = (pos) => {
        switch (pos) {
            case "top":
                return (<>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px w-10 pointer-events-none z-30"/>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-10 pointer-events-none z-29"/>
          </>);
            case "bottom":
                return (<>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px w-10 pointer-events-none z-30"/>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-10 pointer-events-none z-29"/>
          </>);
            case "start":
                return (<>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-emerald-500 to-transparent w-px h-6 pointer-events-none z-30"/>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-sky-500 to-transparent w-px h-6 pointer-events-none z-29"/>
          </>);
            case "end":
                return (<>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-emerald-500 to-transparent w-px h-6 pointer-events-none z-30"/>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-sky-500 to-transparent w-px h-6 pointer-events-none z-29"/>
          </>);
        }
    };
    if (!content) {
        return <>{children}</>;
    }
    return (<div className={`relative inline-block ${className || ""}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onMouseMove={handleMouseMove}>
      {children}
      <framer_motion_1.AnimatePresence>
        {isHovered && (<framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.9, y: 5 }} animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                },
            }} exit={{ opacity: 0, scale: 0.9, y: 5 }} style={{
                rotate: rotate,
                translateX: translateX,
                pointerEvents: "none",
                whiteSpace: "nowrap",
            }} className={`z-50 absolute px-4 py-2 text-xs flex flex-col items-center justify-center rounded-md bg-white dark:bg-black text-black dark:text-white ${positionClasses[position]} transition-colors duration-300`}>
            {getLines(position)}
            <div className="relative z-40 text-sm">{content}</div>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>
    </div>);
};
exports.Tooltip = Tooltip;
