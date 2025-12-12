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
exports.TracingBeam = void 0;
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const cn_1 = require("@/utils/cn");
const TracingBeam = ({ children, className, }) => {
    const ref = (0, react_1.useRef)(null);
    const { scrollYProgress } = (0, framer_motion_1.useScroll)({
        target: ref,
        offset: ["start start", "end end"],
    });
    const contentRef = (0, react_1.useRef)(null);
    const [svgHeight, setSvgHeight] = (0, react_1.useState)(0);
    const updateSvgHeight = () => {
        if (contentRef.current) {
            setSvgHeight(contentRef.current.offsetHeight);
        }
    };
    (0, react_1.useEffect)(() => {
        updateSvgHeight();
        window.addEventListener("resize", updateSvgHeight);
        return () => window.removeEventListener("resize", updateSvgHeight);
    }, []);
    // Force a re-render after initial render to ensure height is accurate
    (0, react_1.useEffect)(() => {
        setTimeout(updateSvgHeight, 100);
    }, []);
    const y1 = (0, framer_motion_1.useSpring)((0, framer_motion_1.useTransform)(scrollYProgress, [0, 1], [50, svgHeight]), {
        stiffness: 500,
        damping: 90,
    });
    const y2 = (0, framer_motion_1.useSpring)((0, framer_motion_1.useTransform)(scrollYProgress, [0, 1], [50, svgHeight - 200]), { stiffness: 500, damping: 90 });
    return (<framer_motion_1.motion.div ref={ref} className={(0, cn_1.cn)("relative w-full max-w-2xl mx-auto h-full", className)}>
      <div className="absolute -left-4 top-3">
        <framer_motion_1.motion.div className="ml-[27px] h-4 w-4 rounded-full border border-neutral-200 shadow-xs flex items-center justify-center" transition={{
            duration: 0.2,
            delay: 0.5,
        }} animate={{
            boxShadow: scrollYProgress.get() > 0
                ? "none"
                : "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}>
          <framer_motion_1.motion.div className="h-2 w-2 rounded-full border border-neutral-300 bg-white" transition={{
            duration: 0.2,
            delay: 0.5,
        }} animate={{
            backgroundColor: scrollYProgress.get() > 0 ? "white" : "var(--emerald-500)",
            borderColor: scrollYProgress.get() > 0 ? "white" : "var(--emerald-600)",
        }}/>
        </framer_motion_1.motion.div>
        <svg viewBox={`0 0 20 ${svgHeight}`} width="20" height={svgHeight} className="ml-4 block" aria-hidden="true">
          <framer_motion_1.motion.path d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`} fill="none" stroke="#9091A0" strokeOpacity="0.16"/>
          <framer_motion_1.motion.path d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`} fill="none" stroke="url(#gradient)" strokeWidth="1.25" transition={{ duration: 10 }}/>
          <defs>
            <framer_motion_1.motion.linearGradient id="gradient" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={y1} y2={y2}>
              <stop stopColor="#18CCFC" stopOpacity="0"></stop>
              <stop stopColor="#18CCFC"></stop>
              <stop offset="0.325" stopColor="#6344F5"></stop>
              <stop offset="1" stopColor="#AE48FF" stopOpacity="0"></stop>
            </framer_motion_1.motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </framer_motion_1.motion.div>);
};
exports.TracingBeam = TracingBeam;
