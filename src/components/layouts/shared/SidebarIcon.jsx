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
const react_2 = require("@iconify/react");
const router_1 = require("next/router");
const dashboard_1 = require("@/stores/dashboard");
const link_1 = __importDefault(require("next/link"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const i18next_1 = require("i18next");
const findActiveMenu = (menu, pathname) => {
    for (const item of menu) {
        if (item.href && pathname.startsWith(item.href)) {
            return item;
        }
        if (item.menu) {
            const found = findActiveMenu(item.menu, pathname);
            if (found) {
                return item;
            }
        }
        if (item.subMenu) {
            const found = findActiveMenu(item.subMenu, pathname);
            if (found) {
                return item;
            }
        }
    }
    return null;
};
const SidebarIcon = ({ icon, name, href, hasSubMenu, }) => {
    const { setActiveSidebar, setIsPanelOpened, setSidebarOpened, sidebarOpened, activeSidebar, filteredMenu, setIsSidebarOpenedMobile, } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [isMounted, setIsMounted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setIsMounted(true);
    }, []);
    const openSidebar = (name) => {
        const item = filteredMenu.find((item) => item.title === name);
        if (item && !hasSubMenu) {
            setActiveSidebar(name);
            setSidebarOpened(false);
            setIsSidebarOpenedMobile(false);
            if (href) {
                return router.push(href);
            }
            return;
        }
        const hasItems = (menu) => menu && menu.length > 0;
        if (item && (hasItems(item.menu) || hasItems(item.subMenu))) {
            if (!sidebarOpened) {
                setSidebarOpened(true);
            }
            setActiveSidebar(name);
            setIsPanelOpened(false);
        }
    };
    (0, react_1.useEffect)(() => {
        if (!filteredMenu.length)
            return;
        const activeMenu = findActiveMenu(filteredMenu, router.pathname);
        if (activeMenu) {
            setActiveSidebar(activeMenu.title);
        }
    }, [filteredMenu.length, router.pathname]);
    if (!isMounted) {
        return null; // Prevent rendering on the server side
    }
    const iconElement = (<div className={`side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 ${activeSidebar === name ? "bg-primary-500/10 dark:bg-primary-500/20" : ""}`}>
      <react_2.Icon icon={icon} className={`relative text-2xl text-muted-400 transition-colors duration-300 ${activeSidebar === name
            ? "text-primary-500"
            : "group-hover/side-icon:text-muted-500 "}`}/>
    </div>);
    return (<li className={`side-icon group/side-icon relative flex h-[52px] w-full cursor-pointer items-center justify-center ${activeSidebar === name ? "is-active" : ""}`} onClick={() => openSidebar(name)}>
      <Tooltip_1.Tooltip content={(0, i18next_1.t)(name)} position="end">
        {hasSubMenu ? (iconElement) : (<link_1.default href={href || "#"} aria-label={name}>
            {iconElement}
          </link_1.default>)}
      </Tooltip_1.Tooltip>
    </li>);
};
exports.default = SidebarIcon;
