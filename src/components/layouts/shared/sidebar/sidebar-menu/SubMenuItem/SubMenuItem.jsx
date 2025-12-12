"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubMenuItem = void 0;
const dashboard_1 = require("@/stores/dashboard");
const MenuContext_1 = require("@/context/MenuContext");
const cn_1 = require("@/utils/cn");
const link_1 = __importDefault(require("next/link"));
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
const SubMenuItemBase = ({ href, title, collapse = false, sideblock = false, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { activeSidebarMenu, setActive } = (0, MenuContext_1.useMenuContext)();
    const { setIsSidebarOpenedMobile, setSidebarOpened } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const isActive = router.pathname.startsWith(href) || activeSidebarMenu === title;
    const handleClick = () => {
        setIsSidebarOpenedMobile(false);
        setSidebarOpened(false);
        setActive(title.toLowerCase().replace(/ /g, "-") + "-menu");
    };
    const baseClass = "relative flex items-center text-sm transition-colors";
    const activeBaseClass = 'after:absolute after:top-0 after:h-full after:w-1 after:content-[""]';
    const activeClass = `text-white ${activeBaseClass} after:-right-[2.4px] after:rounded-full after:bg-primary-400`;
    const inactiveClass = "text-white/70 hover:text-white";
    const activeDarkClass = `text-primary-500 ${activeBaseClass} after:right-[-2.4px] after:rounded-xl after:bg-primary-500 dark:after:bg-primary-400 dark:text-primary-400`;
    const inactiveDarkClass = "text-muted-400 hover:text-muted-500 dark:text-muted-400 dark:hover:text-muted-300";
    const dynamicClass = (0, cn_1.cn)(collapse
        ? "ms-6 me-12 min-h-[27.2px] border-r-[2px] border-primary-800 duration-300"
        : sideblock
            ? "ms-9 me-7 min-h-[27.2px] border-r-[3px] border-muted-100 dark:border-muted-800"
            : "ms-3 me-5 min-h-[24px] border-r-[2px] border-muted-200/80 duration-200 dark:border-muted-800/80", isActive
        ? collapse
            ? activeClass
            : activeDarkClass
        : collapse
            ? inactiveClass
            : inactiveDarkClass);
    const linkClass = `${baseClass} ${dynamicClass}`;
    return (<li>
      <link_1.default onClick={handleClick} className={linkClass} href={href}>
        {t(title)}
      </link_1.default>
    </li>);
};
exports.SubMenuItem = SubMenuItemBase;
