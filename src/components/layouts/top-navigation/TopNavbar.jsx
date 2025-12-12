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
const next_i18next_1 = require("next-i18next");
const react_1 = __importStar(require("react"));
const link_1 = __importDefault(require("next/link"));
const LogoText_1 = __importDefault(require("@/components/vector/LogoText"));
const react_2 = require("@iconify/react");
const dashboard_1 = require("@/stores/dashboard");
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const Menu_1 = require("./Menu");
const AccountControls_1 = __importDefault(require("./AccountControls"));
const TopNavbar = ({ trading, transparent }) => {
    const [isMobileSearchActive, setIsMobileSearchActive] = (0, react_1.useState)(false);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile, isSidebarOpenedMobile, setIsSidebarOpenedMobile, isAdmin, activeMenuType, toggleMenuType, isFetched, } = (0, dashboard_1.useDashboardStore)();
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Orbex";
    return (<nav className={`relative z-11 ${!transparent &&
            "border-b border-muted-200 bg-white dark:border-muted-900 dark:bg-muted-900"}`} role="navigation" aria-label="main navigation">
      <div className={`${transparent &&
            "fixed border-b border-muted-200 bg-white dark:border-muted-900 dark:bg-muted-900"} flex flex-col lg:flex-row min-h-[64px] items-center justify-between w-full max-w-7xl mx-auto px-4 lg:px-6`}>
        {/* Logo Section */}
        <div className="flex items-center">
          <link_1.default className="relative flex shrink-0 grow-0 items-center rounded-[.52rem] py-2 no-underline transition-all duration-300" href="/">
            <LogoText_1.default className={`max-w-[120px] w-[120px] text-muted-900 dark:text-white`}/>
          </link_1.default>
        </div>

        {/* Navigation Menu - Center */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <Menu_1.Menu />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          {isSidebarOpenedMobile && isAdmin && isFetched && profile && (<Tooltip_1.Tooltip content={activeMenuType === "admin" ? "Admin" : "User"} position="bottom">
              <react_2.Icon icon={"ph:user-switch"} onClick={toggleMenuType} className={`h-5 w-5 mr-2 ${activeMenuType === "admin"
                ? "text-primary-500"
                : "text-muted-400"} transition-colors duration-300 cursor-pointer`}/>
            </Tooltip_1.Tooltip>)}
          <button type="button" className="relative block h-10 w-10 cursor-pointer appearance-none border-none bg-none text-muted-400" aria-label="menu" aria-expanded="false" onClick={() => {
            setIsSidebarOpenedMobile(!isSidebarOpenedMobile);
            setIsMobileSearchActive(false);
        }}>
            <span aria-hidden="true" className={`absolute left-[calc(50%-8px)] top-[calc(50%-6px)] block h-px w-4 origin-center bg-current transition-all duration-[86ms] ease-out ${isSidebarOpenedMobile
            ? "tranmuted-y-[5px] rotate-45"
            : "scale-[1.1] "}`}></span>
            <span aria-hidden="true" className={`absolute left-[calc(50%-8px)] top-[calc(50%-1px)] block h-px w-4 origin-center scale-[1.1] bg-current transition-all duration-[86ms] ease-out ${isSidebarOpenedMobile ? "opacity-0" : ""}`}></span>
            <span aria-hidden="true" className={`absolute left-[calc(50%-8px)] top-[calc(50%+4px)] block h-px w-4 origin-center scale-[1.1] bg-current transition-all duration-[86ms] ease-out  ${isSidebarOpenedMobile
            ? "-tranmuted-y-[5px] -rotate-45"
            : "scale-[1.1] "}`}></span>
          </button>
        </div>

        {/* Account Controls - Right */}
        <div className="hidden lg:flex items-center">
          <AccountControls_1.default isMobile={false} setIsMobileSearchActive={setIsMobileSearchActive}/>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-white dark:bg-muted-900 border-t border-muted-200 dark:border-muted-800 z-50 ${isSidebarOpenedMobile ? "block" : "hidden"}`}>
          <div className="flex flex-col p-4 space-y-2">
            <Menu_1.Menu />
            <div className="border-t border-muted-200 dark:border-muted-800 pt-4 mt-4">
              <AccountControls_1.default isMobile={true} setIsMobileSearchActive={setIsMobileSearchActive}/>
            </div>
          </div>
        </div>

      </div>
    </nav>);
};
exports.default = TopNavbar;
