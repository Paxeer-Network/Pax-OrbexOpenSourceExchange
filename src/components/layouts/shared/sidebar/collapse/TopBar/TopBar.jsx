"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopBar = void 0;
const react_1 = require("@iconify/react");
const LogoText_1 = __importDefault(require("@/components/vector/LogoText"));
const cn_1 = require("@/utils/cn");
const TopBarBase = ({ collapse, sidebarOpened, setIsSidebarOpenedMobile, collapseSidebarToggle, }) => {
    const containerClasses = (0, cn_1.cn)("flex h-16 min-h-[64px] items-center justify-between border-b px-6", {
        "border-primary-700": collapse,
        "border-muted-200 dark:border-muted-800": !collapse,
    });
    const logoTextClasses = (0, cn_1.cn)("max-w-[110px]", {
        "text-white": collapse,
        "text-muted-900 dark:text-white": !collapse,
        "lg:hidden": !sidebarOpened,
    });
    const collapseButtonClasses = (0, cn_1.cn)("mask mask-blob hidden h-10 w-10 items-center justify-center transition-all duration-300 lg:flex", {
        "cursor-pointer hover:bg-primary-700": collapse,
        "text-muted-400 hover:bg-muted-100 dark:text-muted-100 dark:hover:bg-muted-800": !collapse,
        "rotate-180": !sidebarOpened,
    });
    const collapseIconClasses = (0, cn_1.cn)({
        "h-4 w-4 text-muted-100": collapse,
        "h-5 w-5": !collapse,
    });
    const mobileButtonClasses = (0, cn_1.cn)("flex h-10 w-10 items-center justify-center duration-300 lg:hidden", {
        "cursor-pointer transition-transform": collapse,
        "transition-colors": !collapse,
    });
    const mobileIconClasses = (0, cn_1.cn)({
        "h-4 w-4 text-muted-100": collapse,
        "h-5 w-5 text-muted-400": !collapse,
    });
    return (<div className={containerClasses}>
      <LogoText_1.default className={logoTextClasses}/>
      <button type="button" className={collapseButtonClasses} onClick={collapseSidebarToggle}>
        <react_1.Icon icon="lucide:arrow-left" className={collapseIconClasses}/>
      </button>
      <button type="button" className={mobileButtonClasses} onClick={() => setIsSidebarOpenedMobile(false)}>
        <react_1.Icon icon="lucide:arrow-left" className={mobileIconClasses}/>
      </button>
    </div>);
};
exports.TopBar = TopBarBase;
