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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Panel = void 0;
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_2 = require("@iconify/react");
const framer_motion_1 = require("framer-motion");
const animations_1 = require("@/utils/animations");
const constants_1 = require("@/utils/constants");
const ResizeHandler_1 = require("./ResizeHandler");
const useWindowSize_1 = __importDefault(require("@/hooks/useWindowSize"));
const pluralize_1 = __importDefault(require("pluralize"));
const PanelBase = ({ isOpen, side = "right", size = "md", backdrop = true, title = "", children, tableName, onClose, }) => {
    const [isMounted, setIsMounted] = (0, react_1.useState)(false);
    const [portalRoot, setPortalRoot] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        setIsMounted(true);
        if (typeof document !== "undefined") {
            const portalRoot = document.getElementById("portal-root");
            setPortalRoot(portalRoot);
        }
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);
    const [panelOpacity, setPanelOpacity] = (0, react_1.useState)(100);
    const [backdropBlur, setBackdropBlur] = (0, react_1.useState)(0); // New state for backdrop blur
    const [hoverState, setHoverState] = (0, react_1.useState)(false);
    const updatePanelOpacityAndBlur = (0, react_1.useCallback)((percentage) => {
        setPanelOpacity(percentage);
        setBackdropBlur((percentage / 100) * 5);
    }, []);
    const sizeMap = (0, react_1.useMemo)(() => ({
        sm: 240,
        md: 340,
        lg: 440,
        xl: 540,
        "2xl": 640,
        "3xl": 740,
    }), []);
    const { width: windowWidth, height: windowHeight } = (0, useWindowSize_1.default)();
    const [panelWidth, setPanelWidth] = (0, react_1.useState)(0);
    const [panelHeight, setPanelHeight] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        if (windowWidth > 0 && windowHeight > 0) {
            setPanelWidth(windowWidth > 720
                ? sizeMap[size]
                : windowWidth <= 640
                    ? windowWidth
                    : windowWidth * 0.8);
            setPanelHeight(windowHeight > 720
                ? sizeMap[size]
                : windowHeight <= 640
                    ? windowHeight
                    : windowHeight * 0.8);
        }
    }, [windowWidth, windowHeight, size, sizeMap]);
    const panelStyle = (0, react_1.useMemo)(() => ({
        width: ["top", "bottom"].includes(side) ? "100%" : `${panelWidth}px`,
        height: ["left", "right"].includes(side) ? "100%" : `${panelHeight}px`,
    }), [side, panelWidth, panelHeight]);
    const divStyle = (0, react_1.useMemo)(() => {
        return {
            opacity: `${panelOpacity}%`,
        };
    }, [panelOpacity]);
    const backdropStyle = (0, react_1.useMemo)(() => {
        return {
            backdropFilter: `blur-sm(${backdropBlur}px)`,
        };
    }, [backdropBlur]);
    const sideRadiusMap = (0, react_1.useMemo)(() => ({
        top: panelHeight === windowHeight ? "" : "rounded-b-2xl",
        right: panelWidth === windowWidth ? "" : "rounded-l-xl",
        bottom: panelHeight === windowHeight ? "" : "rounded-t-2xl",
        left: panelWidth === windowWidth ? "" : "rounded-r-xl",
    }), [panelHeight, windowHeight, panelWidth, windowWidth]);
    const panelContent = (<framer_motion_1.AnimatePresence>
      {isOpen && (<div className={`fixed inset-0 z-50`} style={divStyle}>
          {backdrop && (<framer_motion_1.motion.div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose} initial="hidden" animate="visible" exit="hidden" variants={(0, animations_1.panelVariants)(side).backdrop} style={backdropStyle}/>)}
          <framer_motion_1.motion.div className={`fixed ${constants_1.positioningClass[side]} bg-white dark:bg-muted-850 border-muted-200 dark:border-muted-700 shadow-lg ${sideRadiusMap[side]}`} style={panelStyle} variants={(0, animations_1.panelVariants)(side).panel} initial="hidden" animate="visible" exit="hidden">
            <div className={`flex ${(side === "top" || side === "bottom") && "flex-col"} h-full`}>
              {side === "right" && (<span className={`resizer resizer-x ${hoverState && "hover-effect"}`}></span>)}
              {side === "bottom" && (<span className={`resizer resizer-y ${hoverState && "hover-effect"}`}></span>)}
              <div className="w-full h-full">
                <div className="flex h-20 items-center justify-between px-6">
                  <h2 className="font-sans text-lg font-light uppercase leading-tight tracking-wide text-muted-800 dark:text-white">
                    {`${title} ${tableName ? pluralize_1.default.singular(tableName) : ""}` || "Panel"}
                  </h2>
                  <button onClick={onClose} className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center text-muted-400 bg-muted-100 dark:bg-muted-850 hover:bg-muted-200 hover:text-muted-500 dark:text-white dark:hover:bg-muted-950">
                    <react_2.Icon icon={`lucide:arrow-${constants_1.arrowMap[side]}`}/>
                  </button>
                </div>
                <div className="overflow-y-auto px-6 py-2 h-[calc(100%-5rem)]">
                  {children}
                </div>
              </div>
              {side === "left" && (<span className={`resizer resizer-x -m-4 ${hoverState && "hover-effect"}`}></span>)}
              {side === "top" && (<span className={`resizer resizer-y -m-4 ${hoverState && "hover-effect"}`}></span>)}
            </div>
            <ResizeHandler_1.ResizeHandler size={size} sizeMap={sizeMap} side={side} panelWidth={panelWidth} panelHeight={panelHeight} setPanelWidth={setPanelWidth} setPanelHeight={setPanelHeight} setHoverState={setHoverState} updatePanelOpacity={updatePanelOpacityAndBlur} // Updated callback
         onClose={onClose}/>
          </framer_motion_1.motion.div>
        </div>)}
    </framer_motion_1.AnimatePresence>);
    return isMounted && portalRoot
        ? react_dom_1.default.createPortal(panelContent, portalRoot)
        : null;
};
exports.Panel = PanelBase;
