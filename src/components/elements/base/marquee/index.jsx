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
const react_1 = require("@iconify/react");
const react_2 = __importStar(require("react"));
const Marquee = ({ children, speed = 50, showGradients = true, direction = "rtl", }) => {
    const containerRef = (0, react_2.useRef)(null);
    const contentRef = (0, react_2.useRef)(null);
    const [hovered, setHovered] = (0, react_2.useState)(false);
    const [hoveredSide, setHoveredSide] = (0, react_2.useState)(null);
    const [currentPosition, setCurrentPosition] = (0, react_2.useState)(0);
    (0, react_2.useEffect)(() => {
        const updateAnimation = () => {
            if (containerRef.current && contentRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const contentWidth = contentRef.current.scrollWidth / 2;
                const duration = contentWidth / speed;
                containerRef.current.style.setProperty("--animation-duration", `${duration}s`);
                containerRef.current.style.setProperty("--content-width", `${contentWidth}px`);
            }
        };
        updateAnimation();
        window.addEventListener("resize", updateAnimation);
        return () => window.removeEventListener("resize", updateAnimation);
    }, [speed, children]);
    (0, react_2.useEffect)(() => {
        let animationFrame;
        let startTime;
        let previousTimestamp;
        const animate = (timestamp) => {
            var _a, _b;
            if (hovered)
                return;
            if (!startTime)
                startTime = timestamp;
            if (!previousTimestamp)
                previousTimestamp = timestamp;
            const elapsed = timestamp - startTime;
            const delta = timestamp - previousTimestamp;
            const contentWidth = Number((_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.style.getPropertyValue("--content-width").replace("px", "")) || 0;
            const duration = Number((_b = containerRef.current) === null || _b === void 0 ? void 0 : _b.style.getPropertyValue("--animation-duration").replace("s", "")) || 0;
            const pixelsPerMillisecond = contentWidth / (duration * 1000);
            let movement = pixelsPerMillisecond * delta * (hoveredSide ? 2 : 1);
            if (direction === "rtl") {
                movement = -movement;
            }
            setCurrentPosition((prevPosition) => {
                let newPosition = prevPosition + movement;
                if (newPosition <= -contentWidth) {
                    newPosition += contentWidth;
                }
                else if (newPosition > 0) {
                    newPosition -= contentWidth;
                }
                return newPosition;
            });
            previousTimestamp = timestamp;
            animationFrame = requestAnimationFrame(animate);
        };
        animationFrame = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [hovered, hoveredSide, direction, speed]);
    const handleMouseEnter = () => {
        setHovered(true);
    };
    const handleMouseLeave = () => {
        setHovered(false);
    };
    const handleSideMouseEnter = (side) => {
        setHoveredSide(side);
    };
    const handleSideMouseLeave = () => {
        setHoveredSide(null);
    };
    return (<div className="marquee-container relative overflow-hidden" ref={containerRef}>
      <style jsx>{`
        .marquee-content {
          display: flex;
          width: fit-content;
        }
        .marquee-item {
          transition: filter 0.3s ease;
        }
        .marquee-content:hover .marquee-item:not(:hover) {
          filter: blur(2px);
        }
      `}</style>
      <div className="marquee-content" ref={contentRef} style={{
            transform: `translateX(${currentPosition}px)`,
        }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {react_2.default.Children.map(children, (child, index) => (<div key={index} className="marquee-item">
            {child}
          </div>))}
        {react_2.default.Children.map(children, (child, index) => (<div key={`dup-${index}`} className="marquee-item">
            {child}
          </div>))}
      </div>
      {showGradients && (<>
          <div className="absolute top-0 bottom-0 left-0 w-40 z-50 flex items-center justify-center bg-linear-to-r from-white to-transparent dark:from-black dark:to-transparent pointer-events-auto" onMouseEnter={() => handleSideMouseEnter("left")} onMouseLeave={handleSideMouseLeave}>
            <react_1.Icon className={`text-black dark:text-white transition-opacity duration-300 ${hoveredSide === "left" ? "opacity-100" : "opacity-0"}`} icon="akar-icons:chevron-left" width="32" height="32"/>
          </div>
          <div className="absolute top-0 bottom-0 right-0 w-40 z-50 flex items-center justify-center bg-linear-to-l from-white to-transparent dark:from-black dark:to-transparent pointer-events-auto" onMouseEnter={() => handleSideMouseEnter("right")} onMouseLeave={handleSideMouseLeave}>
            <react_1.Icon className={`text-black dark:text-white transition-opacity duration-300 ${hoveredSide === "right" ? "opacity-100" : "opacity-0"}`} icon="akar-icons:chevron-right" width="32" height="32"/>
          </div>
        </>)}
    </div>);
};
exports.default = Marquee;
