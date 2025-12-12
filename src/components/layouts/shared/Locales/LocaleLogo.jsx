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
exports.LocaleLogo = void 0;
const react_1 = __importStar(require("react"));
const next_i18next_1 = require("next-i18next");
const Locales_1 = require("./Locales");
const react_2 = require("@iconify/react");
const LocaleLogoBase = () => {
    const { i18n } = (0, next_i18next_1.useTranslation)();
    const [currentLocale, setCurrentLocale] = (0, react_1.useState)(null);
    const [isMounted, setIsMounted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // Set mounted state after hydration to avoid SSR mismatch
        setIsMounted(true);
        const locale = Locales_1.locales.find((locale) => locale.code === i18n.language) || null;
        // Provide a fallback name if it's undefined
        if (locale) {
            setCurrentLocale({
                ...locale,
                name: locale.name || "Unknown", // Fallback to "Unknown" if name is undefined
            });
        }
        else {
            setCurrentLocale(null);
        }
    }, [i18n.language]);
    if (!isMounted) {
        return null; // Avoid rendering until after the component has mounted
    }
    return currentLocale ? (<img src={`/img/flag/${currentLocale.flag}.svg`} alt={currentLocale.name} width={16} height={"auto"}/>) : (<react_2.Icon icon="iconoir:language" className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"/>);
};
exports.LocaleLogo = (0, react_1.memo)(LocaleLogoBase);
