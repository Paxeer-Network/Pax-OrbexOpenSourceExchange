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
const useScroll_1 = __importDefault(require("@/hooks/useScroll"));
const react_2 = require("@iconify/react");
const ThemeSwitcher_1 = __importDefault(require("@/components/widgets/ThemeSwitcher"));
const breakpoints_1 = require("@/utils/breakpoints");
const react_responsive_1 = __importDefault(require("react-responsive"));
const dashboard_1 = require("@/stores/dashboard");
const SearchResults_1 = require("../shared/SearchResults");
const NotificationsDropdown_1 = require("../shared/NotificationsDropdown");
const AccountDropdown_1 = require("../shared/AccountDropdown");
const HEIGHT = 36;
const AppNavbar = ({ fullwidth = false, horizontal = false, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [isMobileSearchActive, setIsMobileSearchActive] = (0, react_1.useState)(false);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const scrolled = (0, useScroll_1.default)(HEIGHT);
    const { setPanelOpen, profile, isFetched } = (0, dashboard_1.useDashboardStore)();
    return (<div className={`fixed left-0 top-[56px] z-10 w-full transition-all duration-300`}>
      <div className={`relative mx-auto w-full px-4 lg:px-10
          ${fullwidth ? "max-w-full" : "mx-auto max-w-7xl"}
          ${horizontal ? "xl:px-10" : "xl:px-0"}
        `}>
        <div className={`relative z-1 flex h-[40px] w-full items-center justify-end rounded-2xl border transition-all duration-300 ${scrolled
            ? "-mt-12 border-muted-200 bg-white px-2 shadow-lg shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-900 dark:shadow-muted-800/30"
            : "border-transparent dark:border-transparent px-2"}`}>
          <react_responsive_1.default minWidth={parseInt(breakpoints_1.breakpoints.md)}>
            <div className={`flex-grow-2 items-center md:max-w-[680px] ${isMobileSearchActive ? "hidden" : "flex "}`}>
              <div className="hidden w-full max-w-[380px]">
                <div className="relative text-base">
                  <input type="text" className="peer relative inline-flex h-10 w-full max-w-full items-center justify-start rounded-lg border border-muted-200 bg-white py-2 pe-3 ps-10 font-sans text-base leading-snug text-muted-600 outline-hidden outline-0 outline-offset-0 outline-current transition-all duration-300 placeholder:text-muted-300 focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-900 dark:text-muted-300 dark:placeholder:text-muted-700 dark:focus-visible:shadow-muted-800/30" placeholder={t("Search our platform...")} value={searchTerm} onChange={(event) => {
            setSearchTerm(event.currentTarget.value);
        }}/>

                  <div className="absolute left-0 top-0 z-1 flex h-10 w-10 items-center justify-center text-muted-400 transition-colors duration-300 dark:text-muted-500 [&>svg]:peer-checked:text-primary-500 [&>svg]:peer-focus:stroke-primary-500 [&>svg]:peer-focus:text-primary-500 ">
                    <react_2.Icon icon="lucide:search" className="text-lg transition-colors duration-300"/>
                  </div>

                  <SearchResults_1.SearchResults searchTerm={searchTerm} id="mobile"/>
                </div>
              </div>
            </div>
          </react_responsive_1.default>
          <div className={`items-center gap-2 ${isMobileSearchActive ? "hidden" : "flex"}`}>
            <react_responsive_1.default maxWidth={parseInt(breakpoints_1.breakpoints.md)}>
              <button onClick={() => setIsMobileSearchActive(true)} className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300">
                <react_2.Icon icon="lucide:search" className="h-5 w-5 text-muted-400 transition-colors duration-300"/>
              </button>
            </react_responsive_1.default>

            <div className="group relative text-start">
              <button className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 rotate-0" onClick={() => setPanelOpen("locales", true)}>
                <react_2.Icon icon="iconoir:language" className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"/>
              </button>
            </div>

            {isFetched && profile && (<>
                <div className="group relative text-start">
                  <span className="absolute right-0.5 top-0.5 z-2 block h-2 w-2 rounded-full bg-primary-500 "></span>
                  <button className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 rotate-0" onClick={() => setPanelOpen("announcements", true)}>
                    <react_2.Icon icon="ph:megaphone" className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"/>
                  </button>
                </div>

                <NotificationsDropdown_1.NotificationsDropdown />
              </>)}

            <ThemeSwitcher_1.default />

            <AccountDropdown_1.AccountDropdown />
          </div>

          <react_responsive_1.default maxWidth={parseInt(breakpoints_1.breakpoints.md)}>
            <div className={`w-full ${isMobileSearchActive ? "flex" : "hidden"}`}>
              <div className="w-full">
                <div className="relative text-base">
                  <input type="text" value={searchTerm} placeholder={t("Search...")} className="peer relative inline-flex h-10 w-full max-w-full items-center justify-start rounded-lg border border-muted-200 bg-white py-2 pe-3 ps-10 text-base leading-tight text-muted-500 outline-hidden outline-0 outline-offset-0 outline-current transition-all duration-300 placeholder:text-muted-300 focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-900 dark:text-muted-300 dark:placeholder:text-muted-700 dark:focus-visible:shadow-muted-800/30" onChange={(event) => {
            setSearchTerm(event.currentTarget.value);
        }}/>

                  <div className="absolute left-0 top-0 z-1 flex h-10 w-10 items-center justify-center transition-colors duration-300">
                    <react_2.Icon icon="lucide:search" className="h-4 w-4 text-muted-400 transition-colors duration-300"/>
                  </div>

                  <button onClick={() => {
            setSearchTerm("");
            setIsMobileSearchActive(false);
        }} className="absolute right-0 top-0 z-1 flex h-10 w-10 items-center justify-center transition-colors duration-300">
                    <react_2.Icon icon="lucide:x" className="h-4 w-4 text-muted-400 transition-colors duration-300"/>
                  </button>

                  <SearchResults_1.SearchResults searchTerm={searchTerm} id="mobile"/>
                </div>
              </div>
            </div>
          </react_responsive_1.default>
        </div>
      </div>
    </div>);
};
exports.default = AppNavbar;
