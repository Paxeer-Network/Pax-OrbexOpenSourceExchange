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
const react_1 = __importStar(require("react"));
const react_2 = require("@iconify/react");
const dashboard_1 = require("@/stores/dashboard");
const FixedPanel = ({ title, name, children }) => {
    const { panels, setPanelOpen } = (0, dashboard_1.useDashboardStore)();
    const isPanelOpened = panels[name] || false;
    (0, react_1.useEffect)(() => {
        if (isPanelOpened) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
    }, [isPanelOpened]);
    return (<div className={`fixed right-0 top-0 z-11 h-full w-[340px] border bg-white shadow-lg shadow-muted-300/30 transition-all duration-300 dark:border-muted-800 dark:bg-muted-900 dark:shadow-muted-800/30 ${isPanelOpened ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex h-20 items-center justify-between px-6 text-base">
        <h2 className="font-sans text-sm font-light uppercase leading-tight tracking-wide text-muted-800 dark:text-muted-100">
          {title}
        </h2>
        <button aria-label="Close panel" onClick={() => setPanelOpen(name, false)} className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center text-xl text-muted-400 transition-colors duration-300 hover:bg-muted-200 dark:text-muted-100 dark:hover:bg-muted-800">
          <react_2.Icon icon="lucide:arrow-right"/>
        </button>
      </div>
      <div className="mb-16 p-6 pt-0 h-full">{children}</div>
    </div>);
};
exports.default = FixedPanel;
