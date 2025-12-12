"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = require("@/stores/dashboard");
const react_1 = __importDefault(require("react"));
const AppOverlay = () => {
    const { setIsSidebarOpenedMobile, isSidebarOpenedMobile } = (0, dashboard_1.useDashboardStore)();
    return (<div className={`inset-O fixed w-full h-full z-10 bg-muted-900 transition-opacity duration-300 ${isSidebarOpenedMobile
            ? "pointer-events-auto opacity-60 dark:opacity-50 lg:opacity-0 lg:pointer-events-none lg:hidden"
            : "pointer-events-none opacity-0!"}`} onClick={() => setIsSidebarOpenedMobile(!isSidebarOpenedMobile)}></div>);
};
exports.default = AppOverlay;
