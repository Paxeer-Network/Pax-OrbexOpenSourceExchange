"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ThemeSwitcher_1 = __importDefault(require("@/components/widgets/ThemeSwitcher"));
const NotificationsDropdown_1 = require("../shared/NotificationsDropdown");
const AccountDropdown_1 = require("../shared/AccountDropdown");
const LocaleLogo_1 = require("../shared/Locales/LocaleLogo");
const dashboard_1 = require("@/stores/dashboard");
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const react_1 = require("@iconify/react");
const AccountControls = ({ isMobile, setIsMobileSearchActive }) => {
    const { profile, isAdmin, activeMenuType, toggleMenuType, isFetched, announcements, setPanelOpen, isSidebarOpenedMobile, } = (0, dashboard_1.useDashboardStore)();
    return (<div className={isMobile
            ? `w-full flex items-center justify-between sm:justify-end px-7 pb-3 gap-2 ${isSidebarOpenedMobile ? "lg:hidden" : "hidden"}`
            : `hidden lg:flex items-center gap-2 ms-auto me-3`}>
      {isFetched && profile && isAdmin && (<Tooltip_1.Tooltip content={activeMenuType === "admin" ? "Admin" : "User"} position="bottom">
          <react_1.Icon icon={"ph:user-switch"} onClick={toggleMenuType} className={`h-5 w-5 ${activeMenuType === "admin" ? "text-primary-500" : "text-muted-400"} transition-colors duration-300 cursor-pointer`}/>
        </Tooltip_1.Tooltip>)}
      {!isMobile && (<button onClick={() => setIsMobileSearchActive(true)} className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300  md:hidden">
          <react_1.Icon icon="lucide:search" className="h-5 w-5 text-muted-400 transition-colors duration-300"/>
        </button>)}

      <div className="group relative text-start">
        <button className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 rotate-0" onClick={() => setPanelOpen("locales", true)}>
          <LocaleLogo_1.LocaleLogo />
        </button>
      </div>

      {isFetched && profile && (<>
          <div className="group relative text-start">
            {announcements && announcements.length > 0 && (<span className="absolute right-0.5 top-0.5 z-2 block h-2 w-2 rounded-full bg-primary-500 "></span>)}
            <button className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 rotate-0" onClick={() => setPanelOpen("announcements", true)}>
              <react_1.Icon icon="ph:megaphone" className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"/>
            </button>
          </div>

          <NotificationsDropdown_1.NotificationsDropdown />
        </>)}

      <ThemeSwitcher_1.default />

      <AccountDropdown_1.AccountDropdown />
    </div>);
};
exports.default = AccountControls;
