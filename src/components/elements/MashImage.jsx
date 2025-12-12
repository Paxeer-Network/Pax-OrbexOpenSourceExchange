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
exports.MashImage = exports.sanitizePath = void 0;
const react_1 = __importStar(require("react"));
const path_1 = __importDefault(require("path"));
const sanitizePath = (inputPath) => {
    // Normalize the path to resolve any '..' sequences
    const normalizedPath = path_1.default.normalize(inputPath);
    // Check if the normalized path is still within the intended directory
    if (normalizedPath.includes("..")) {
        throw new Error("Invalid path: Path traversal detected");
    }
    return normalizedPath;
};
exports.sanitizePath = sanitizePath;
const MashImageBase = ({ src, alt, fill, width, height, className, ...props }) => {
    const [imgSrc, setImgSrc] = (0, react_1.useState)(src);
    (0, react_1.useEffect)(() => {
        if (src) {
            setImgSrc(src);
        }
        else {
            setImgSrc((src === null || src === void 0 ? void 0 : src.includes("uploads/avatar")) || (src === null || src === void 0 ? void 0 : src.includes("uploads/users"))
                ? "/img/avatars/placeholder.webp"
                : "/img/placeholder.svg");
        }
    }, [src]);
    // Separate imgProps for HTML img element
    const imgProps = { ...props, width, height, className };
    return <img src={imgSrc} alt={alt} {...imgProps}/>;
};
exports.MashImage = (0, react_1.memo)(MashImageBase);
