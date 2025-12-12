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
exports.MenuItem = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("@iconify/react");
const MenuContext_1 = require("@/context/MenuContext");
const cn_1 = require("@/utils/cn");
const router_1 = require("next/router");
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const MenuItemBase = ({ href, title, icon, children, collapse = false, active = false, sideblock = false, description, }) => {
    var _a;
    const router = (0, router_1.useRouter)();
    const { t } = (0, next_i18next_1.useTranslation)();
    const { activeSidebarMenu, setActive } = (0, MenuContext_1.useMenuContext)();
    const { sidebarOpened, setSidebarOpened, setIsSidebarOpenedMobile } = (0, dashboard_1.useDashboardStore)();
    const menu = `${title.toLowerCase().replace(/ /g, "-")}-menu`;
    const isActive = activeSidebarMenu === menu || (href && router.pathname.startsWith(href));
    const subMenuRef = (0, react_1.useRef)(null);
    function menuToggle() {
        if (href) {
            setIsSidebarOpenedMobile(false);
            setSidebarOpened(false);
            setActive(menu);
            router.push(href);
        }
        else {
            setActive(isActive ? "" : menu);
            setSidebarOpened(true);
        }
    }
    // Base classes
    const baseFlexClass = "flex w-full items-center";
    const baseIconClass = "block transition-colors duration-300";
    const baseTextClass = "text-sm transition-colors duration-300";
    const baseChevronClass = "block h-5 w-5 transition-transform duration-300";
    // Active state class determination
    const activeStateClass = () => isActive || active
        ? `${collapse ? "text-white" : "text-primary-500 dark:text-primary-400"}`
        : `${collapse
            ? "text-white/70 group-hover/menu-item:text-white dark:group-hover/menu-item:text-muted-200"
            : "text-muted-400 dark:text-muted-400 group-hover/menu-item:text-muted-800 dark:group-hover/menu-item:text-muted-200"}`;
    // MenuItem class adjustment based on `collapse`
    const menuItemClass = (0, cn_1.cn)(`group/menu-item ${baseFlexClass}`, collapse ? "h-[40px] px-5" : "", sideblock ? "h-[40px] ps-3 pe-2" : "", !collapse && !sideblock ? "min-h-[44px]" : "");
    // IconWrapper class: Only applicable when collapsed
    const iconWrapperClass = collapse
        ? "me-2.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xs"
        : "";
    const iconClass = (0, cn_1.cn)(baseIconClass, collapse ? "h-6 w-6" : "me-3 h-5 w-5", activeStateClass());
    // Title class with collapse functionality
    const titleClass = (0, cn_1.cn)(baseTextClass, collapse &&
        "line-clamp-1 grow overflow-hidden whitespace-nowrap text-start", activeStateClass());
    // Chevron class with collapse functionality, acting like title class
    const chevronClass = (0, cn_1.cn)(baseChevronClass, isActive ? "rotate-180" : "", collapse
        ? `text-white/70 ${!isActive ? "group-hover/menu-item:text-white" : ""} ${sidebarOpened ? "opacity-100" : "opacity-0"}`
        : "me-3 ms-auto text-muted-400", !collapse && activeStateClass());
    return (<li className={`${isActive || active ? (collapse ? "text-white" : "text-primary-500") : ""}`}>
      <button className={menuItemClass} onClick={menuToggle}>
        <span className={iconWrapperClass}>
          <react_2.Icon icon={icon} className={iconClass}/>
        </span>{" "}
        <div className="ml-2 flex flex-col items-start">
          <span className={titleClass}>{t(title)}</span>
          {description && (<span className="text-xs text-muted-400 dark:text-muted-500 group-hover/menu-item:text-muted-800 transition-all duration-300 ease-in-out dark:group-hover/menu-item:text-muted-200 leading-none">
              {t(description)}
            </span>)}
        </div>
        {collapse &&
            !href && ( // Only show chevron if collapse is true and href is not provided
        <span className={iconWrapperClass}>
              <react_2.Icon icon="feather:chevron-down" className={chevronClass}/>
            </span>)}
        {!collapse &&
            !href && ( // Adjusted logic to not show chevron when href is provided
        <react_2.Icon icon="lucide:chevron-down" className={chevronClass}/>)}
      </button>
      {!href && ( // Conditionally render submenu if href is not provided
        <div ref={subMenuRef} style={{
                maxHeight: isActive
                    ? ((_a = subMenuRef.current) === null || _a === void 0 ? void 0 : _a.scrollHeight) + "px"
                    : "0px",
            }} className={`overflow-hidden transition-all duration-300 ease-in-out ${collapse ? "bg-primary-900/60" : ""}`}>
          <ul className={collapse ? "py-3 ps-5" : ""}>{children}</ul>
        </div>)}
    </li>);
};
exports.MenuItem = MenuItemBase;
