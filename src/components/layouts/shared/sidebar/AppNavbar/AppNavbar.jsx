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
exports.AppNavbar = void 0;
const react_1 = __importStar(require("react"));
const useScroll_1 = __importDefault(require("@/hooks/useScroll"));
const react_2 = require("@iconify/react");
const ThemeSwitcher_1 = __importDefault(require("@/components/widgets/ThemeSwitcher"));
const NotificationsDropdown_1 = require("../../NotificationsDropdown");
const AccountDropdown_1 = require("../../AccountDropdown");
const SearchResults_1 = require("../../SearchResults");
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const cn_1 = require("@/utils/cn");
const HEIGHT = 60;
const AppNavbarBase = ({ fullwidth = false, horizontal = false, nopush = false, sideblock = false, collapse = false, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [isMobileSearchActive, setIsMobileSearchActive] = (0, react_1.useState)(false);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const scrolled = (0, useScroll_1.default)(HEIGHT);
    const { sidebarOpened, setPanelOpen, setIsSidebarOpenedMobile, setSidebarOpened, isSidebarOpenedMobile, profile, isFetched, announcements, } = (0, dashboard_1.useDashboardStore)();
    function showSidebar() {
        setIsSidebarOpenedMobile(true);
        setSidebarOpened(true);
    }
    const containerClasses = (0, cn_1.cn)("fixed left-0 top-0 z-10 w-full transition-all duration-300", {
        "lg:ms-[64px] lg:w-[calc(100%-64px)]": collapse && !sideblock,
        "lg:ms-20 lg:w-[calc(100%-64px)]": !collapse && !sideblock,
        active: scrolled && sideblock,
        "z-10": scrolled && !sideblock,
        "lg:ms-[280px] lg:w-[calc(100%-280px)] xl:px-10": sideblock && sidebarOpened,
        "translate-x-[250px]": sidebarOpened && !nopush && !sideblock,
    });
    const innerContainerClasses = (0, cn_1.cn)("relative mx-auto w-full px-4 lg:px-10", {
        "max-w-full": fullwidth,
        "max-w-7xl": !fullwidth,
        "xl:px-10": horizontal,
        "xl:px-0": !horizontal,
    });
    const navbarClasses = (0, cn_1.cn)("relative z-1 flex h-[60px] w-full items-center justify-between rounded-2xl transition-all duration-300", {
        border: !sideblock || (sideblock && scrolled),
        "mt-4 border-muted-200 bg-white px-4 shadow-lg shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/30": scrolled,
        "border-transparent": !scrolled && !sideblock,
    });
    const searchContainerClasses = (0, cn_1.cn)("flex-grow-2 items-center md:max-w-[680px]", {
        hidden: isMobileSearchActive,
        flex: !isMobileSearchActive,
    });
    const sidebarButtonClasses = (0, cn_1.cn)("relative me-4 inline-block h-[1em] w-[1em] cursor-pointer text-[1.28rem]", {
        "is-open": !sideblock && sidebarOpened,
        "before:absolute before:left-[0.125em] before:top-1/2 before:-mt-[0.225em] before:hidden before:h-[0.05em] before:w-[.35em] before:bg-muted-400 before:content-[''] after:absolute after:left-[0.125em] after:top-1/2 after:mt-[0.225em] after:hidden after:h-[0.05em] after:w-[.75em] after:bg-muted-400 after:content-[''] *:pointer-events-none": true,
    });
    const searchInputClasses = (0, cn_1.cn)("peer relative inline-flex h-10 w-full max-w-full items-center justify-start rounded-lg border border-muted-200 bg-white py-2 pe-3 ps-10 font-sans text-base leading-snug text-muted-600 outline-hidden outline-0 outline-offset-0 outline-current transition-all duration-300 placeholder:text-muted-300 focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-950 dark:text-muted-300 dark:placeholder:text-muted-700 dark:focus-visible:shadow-muted-800/30", {
        "psaceholder:text-muted-300": !sideblock,
    });
    const searchIconClasses = "absolute left-0 top-0 z-1 flex h-10 w-10 items-center justify-center text-muted-400 transition-colors duration-300 dark:text-muted-500 [&>svg]:peer-checked:text-primary-500 [&>svg]:peer-focus:stroke-primary-500 [&>svg]:peer-focus:text-primary-500";
    const mobileSearchContainerClasses = (0, cn_1.cn)("w-full", {
        "flex md:hidden": isMobileSearchActive,
        hidden: !isMobileSearchActive,
    });
    return (<div className={containerClasses}>
      <div className={innerContainerClasses}>
        <div className={navbarClasses}>
          <div className={searchContainerClasses}>
            <div className={(0, cn_1.cn)(sideblock
            ? `h-10 items-center justify-center ps-2 ${sidebarOpened ? "lg:hidden" : "flex"}`
            : "flex lg:hidden ps-2")}>
              <button type="button" name="sidebarToggle" onClick={sideblock
            ? showSidebar
            : () => setIsSidebarOpenedMobile(!isSidebarOpenedMobile)} className={sidebarButtonClasses} aria-label="Toggle Sidebar">
                <span className="absolute left-[0.125em] top-1/2 mt-[.025em] block h-[0.05em] w-[.75em] bg-muted-400 transition-all duration-[250ms] ease-in-out before:absolute before:left-0 before:top-0 before:block before:h-[.05em] before:w-[.75em] before:-translate-y-[.25em] before:bg-muted-400 before:content-[''] after:absolute after:left-0 after:top-0 after:block after:h-[.05em] after:w-[.75em] after:translate-y-[.25em] after:bg-muted-400 after:content-['']"></span>
              </button>
            </div>

            <div className="w-full max-w-[380px] hidden md:block">
              <div className="relative text-base">
                <input type="text" className={searchInputClasses} placeholder={t("Search our platform...")} value={searchTerm} onChange={(event) => {
            setSearchTerm(event.currentTarget.value);
        }}/>

                <div className={searchIconClasses}>
                  <react_2.Icon icon="lucide:search" className="text-lg transition-colors duration-300"/>
                </div>

                <SearchResults_1.SearchResults searchTerm={searchTerm} id="mobile"/>
              </div>
            </div>
          </div>
          <div className={(0, cn_1.cn)("items-center gap-2", {
            hidden: isMobileSearchActive,
            flex: !isMobileSearchActive,
        })}>
            <button type="button" name="mobileSearch" aria-label="Search" onClick={() => setIsMobileSearchActive(true)} className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300  md:hidden">
              <react_2.Icon icon="lucide:search" className="h-5 w-5 text-muted-400 transition-colors duration-300"/>
            </button>

            <div className="group relative text-start">
              <button type="button" name="locales" aria-label="Locales" className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 rotate-0" onClick={() => setPanelOpen("locales", true)}>
                <react_2.Icon icon="iconoir:language" className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"/>
              </button>
            </div>

            {isFetched && profile && (<>
                <div className="group relative text-start">
                  {announcements && announcements.length > 0 && (<span className="absolute right-0.5 top-0.5 z-2 block h-2 w-2 rounded-full bg-primary-500 "></span>)}
                  <button type="button" aria-label="Announcements" name="announcements" className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 rotate-0" onClick={() => setPanelOpen("announcements", true)}>
                    <react_2.Icon icon="ph:megaphone" className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"/>
                  </button>
                </div>

                <NotificationsDropdown_1.NotificationsDropdown />
              </>)}

            <ThemeSwitcher_1.default />

            <AccountDropdown_1.AccountDropdown />
          </div>

          <div className={mobileSearchContainerClasses}>
            <div className="w-full">
              <div className="relative text-base">
                <input type="text" value={searchTerm} placeholder={`${t("Search")}...`} className="peer relative inline-flex h-10 w-full max-w-full items-center justify-start rounded-lg border border-muted-200 bg-white py-2 pe-3 ps-10 text-base leading-tight text-muted-500 outline-hidden outline-0 outline-offset-0 outline-current transition-all duration-300 placeholder:text-muted-300 focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-950 dark:text-muted-300 dark:placeholder:text-muted-700 dark:focus-visible:shadow-muted-800/30" onChange={(event) => {
            setSearchTerm(event.currentTarget.value);
        }} aria-label="Search"/>

                <div className="absolute left-0 top-0 z-1 flex h-10 w-10 items-center justify-center transition-colors duration-300">
                  <react_2.Icon icon="lucide:search" className="h-4 w-4 text-muted-400 transition-colors duration-300"/>
                </div>

                <button type="button" aria-label="Close Search" name="closeMobileSearch" onClick={() => {
            setSearchTerm("");
            setIsMobileSearchActive(false);
        }} className="absolute right-0 top-0 z-1 flex h-10 w-10 items-center justify-center transition-colors duration-300">
                  <react_2.Icon icon="lucide:x" className="h-4 w-4 text-muted-400 transition-colors duration-300"/>
                </button>

                <SearchResults_1.SearchResults searchTerm={searchTerm} id="mobile"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.AppNavbar = AppNavbarBase;
