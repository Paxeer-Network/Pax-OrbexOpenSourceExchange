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
const react_1 = __importStar(require("react"));
const MashImage_1 = require("@/components/elements/MashImage");
const link_1 = __importDefault(require("next/link"));
const Logo_1 = __importDefault(require("@/components/vector/Logo"));
const SidebarIcon_1 = __importDefault(require("@/components/layouts/shared/SidebarIcon"));
const dashboard_1 = require("@/stores/dashboard");
const react_2 = require("@iconify/react");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const next_i18next_1 = require("next-i18next");
const IconSidebar = ({ float = false }) => {
    const { isSidebarOpenedMobile, sidebarOpened, isProfileOpen, filteredMenu, profile, isAdmin, activeMenuType, toggleMenuType, isFetched, } = (0, dashboard_1.useDashboardStore)();
    const { t } = (0, next_i18next_1.useTranslation)();
    const [isMounted, setIsMounted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return null;
    }
    return (<nav className={`fixed start-0 top-0 z-12 ${float ? "" : "h-full"} w-20 overflow-visible border border-muted-200 bg-white transition-all duration-300 dark:border-muted-800 dark:bg-muted-950 lg:translate-x-0 ${isSidebarOpenedMobile ? "translate-x-0" : "-translate-x-full"} ${float
            ? sidebarOpened
                ? "h-full"
                : "h-full lg:m-3 lg:h-[calc(100%-1.5rem)] lg:rounded-2xl"
            : ""}`}>
      <div className="relative h-full">
        <ul className={`${float ? (sidebarOpened ? "" : "my-2") : ""}`}>
          <li className="relative mb-2 flex h-20 w-full items-center justify-center">
            <link_1.default href="/" className="relative flex h-10 w-10 mt-2 items-center justify-center text-sm no-underline transition-all duration-100 ease-linear" aria-label="Home">
              <Logo_1.default className={`${float ? "mt-[-5px]" : "-mt-[5px]"} h-7 w-7 text-primary-500 transition-opacity duration-300 hover:opacity-80`}/>
            </link_1.default>
          </li>

          {filteredMenu.map(({ title, icon, href, menu, subMenu }) => (<SidebarIcon_1.default key={title} icon={icon} name={title} href={href} hasSubMenu={!!menu || !!subMenu}/>))}
        </ul>

        {isFetched && profile && (<>
            <ul className={`absolute bottom-0 start-0 ${float ? "my-3" : ""} w-full`}>
              {isAdmin && (<li className="relative flex h-16 w-full items-center justify-center">
                  <span onClick={toggleMenuType} className="relative z-4">
                    <Tooltip_1.Tooltip content={activeMenuType === "admin" ? t("Admin") : t("User")} position="end">
                      <IconButton_1.default variant={"pastel"} color={activeMenuType === "admin" ? "primary" : "muted"} aria-label="Switch User Type">
                        <react_2.Icon icon={"ph:user-switch"}/>
                      </IconButton_1.default>
                    </Tooltip_1.Tooltip>
                  </span>
                </li>)}
              <li className="relative flex h-16 w-full items-center justify-center">
                <link_1.default href="/user/profile" className="relative z-4" aria-label="Profile">
                  <MashImage_1.MashImage className={`mx-auto h-10 w-10 transition-transform ${float
                ? "rounded-full duration-300"
                : "mask mask-blob duration-[400ms]"} ${isProfileOpen ? "scale-0" : ""}`} src={(profile === null || profile === void 0 ? void 0 : profile.avatar) || "/img/avatars/placeholder.webp"} height={350} width={350} alt="profile"/>

                  <span className={`absolute ${float
                ? "end-[-0.04rem] top-[-0.04rem] h-3 w-3 rounded-[100px] duration-[400ms]"
                : "-end-[.04rem] -top-[.04rem] h-[.64rem] w-[.64rem] rounded-full duration-300"} scale-100 border border-white bg-primary-500 transition-transform  dark:border-muted-950  ${isProfileOpen ? "scale-0" : ""}`}></span>
                </link_1.default>
              </li>
            </ul>
          </>)}
      </div>
    </nav>);
};
exports.default = IconSidebar;
