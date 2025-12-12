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
const dashboard_1 = require("@/stores/dashboard");
const react_1 = __importStar(require("react"));
const MashImage_1 = require("../elements/MashImage");
const LogoText = ({ className: classes }) => {
    const { isDark, settings } = (0, dashboard_1.useDashboardStore)();
    const fullLogoSrc = (0, react_1.useMemo)(() => {
        if ((settings === null || settings === void 0 ? void 0 : settings.fullLogo) || (settings === null || settings === void 0 ? void 0 : settings.fullLogoDark)) {
            return isDark
                ? (settings === null || settings === void 0 ? void 0 : settings.fullLogoDark) || (settings === null || settings === void 0 ? void 0 : settings.fullLogo)
                : settings === null || settings === void 0 ? void 0 : settings.fullLogo;
        }
        return "";
    }, [isDark, settings]);
    return (<div className={`flex items-center h-[30px] w-[100px] ${classes}`}>
      <MashImage_1.MashImage className="max-h-full w-full fill-current" src={fullLogoSrc} alt="Workflow" width={100} height={30}/>
    </div>);
};
exports.default = LogoText;
