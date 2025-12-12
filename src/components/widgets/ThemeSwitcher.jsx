"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const dashboard_1 = require("@/stores/dashboard");
const ThemeSwitcher = ({ className: classes = "" }) => {
    const { toggleTheme, isDark, settings } = (0, dashboard_1.useDashboardStore)();
    if ((settings === null || settings === void 0 ? void 0 : settings.themeSwitcher) === "false")
        return null;
    return (<label className={`mask mask-blob relative block overflow-hidden ${classes}`}>
      <input type="checkbox" onClick={() => toggleTheme()} className="peer absolute left-0 top-0 z-2 h-full w-full cursor-pointer opacity-0" checked={isDark} onChange={() => { }} aria-label="Toggle theme"/>
      <span className="relative block h-10 w-10 bg-white text-lg dark:bg-muted-800 [&>.moon-icon]:peer-checked:opacity-100 [&>.moon-icon]:peer-checked:[transform:translate(-45%,-50%)] [&>.sun-icon]:peer-checked:opacity-0 [&>.sun-icon]:peer-checked:[transform:translate(-45%,-150%)]">
        <react_2.Icon icon="lucide:sun" className="sun-icon pointer-events-none absolute left-1/2 top-1/2 block -translate-x-[48%] -translate-y-[50%] text-yellow-400 opacity-100 transition-all duration-300 *:fill-yellow-400"/>
        <react_2.Icon icon="material-symbols:dark-mode" className="moon-icon pointer-events-none absolute left-1/2 top-1/2 block text-yellow opacity-0 transition-all duration-300 *:fill-yellow-400"/>
      </span>
    </label>);
};
exports.default = ThemeSwitcher;
