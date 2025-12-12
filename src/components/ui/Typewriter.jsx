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
const react_1 = __importStar(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const react_2 = require("@iconify/react");
const Typewriter = (props) => {
    const { children, className, lineClassName, as = "div", lines = [], interval = 3000, withIcon = true, ...rest } = props;
    const [index, setIndex] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (lines.length < 1 && !children)
            return;
        const linesLength = children ? 1 : lines.length;
        if (linesLength === 1) {
            setTimeout(() => setIndex(0), 1500);
        }
        if (linesLength > 1) {
            const intervalID = setInterval(() => setIndex((i) => (i + 1) % linesLength), interval);
            return () => clearInterval(intervalID);
        }
    }, [lines, children, interval]);
    const Component = as;
    return (<Component className={(0, clsx_1.default)("m-0 inline-flex items-baseline font-mono", className)}>
      {withIcon && (<react_2.Icon icon="carbon:chevron-right" className="hidden shrink-0 grow-0 self-center text-omega-500 md:block"/>)}
      <span key={index} className={(0, clsx_1.default)("animate-typewriter overflow-hidden whitespace-nowrap", lineClassName)} {...rest}>
        {index !== null && (lines[index] || children)}
      </span>
      <div className="ml-2 -translate-y-2 animate-blink">_</div>
    </Component>);
};
exports.default = Typewriter;
