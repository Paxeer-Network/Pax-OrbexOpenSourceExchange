"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItems = void 0;
const MenuContext_1 = require("@/context/MenuContext");
const MenuItem_1 = require("../sidebar-menu/MenuItem");
const SubMenuItem_1 = require("../sidebar-menu/SubMenuItem");
const MenuDivider_1 = require("../sidebar-menu/MenuDivider");
const router_1 = require("next/router");
const cn_1 = require("@/utils/cn");
const dashboard_1 = require("@/stores/dashboard");
const react_1 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const react_2 = require("react");
const MenuItemsBase = ({ menuId, activeMenuKey, menuItems = [], specialRender, collapse = false, sideblock = false, }) => {
    const { activeSidebar, isFetched } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const { t } = (0, next_i18next_1.useTranslation)();
    const [isMounted, setIsMounted] = (0, react_2.useState)(false);
    (0, react_2.useEffect)(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted || activeSidebar !== activeMenuKey) {
        return null;
    }
    const isMenuChildActive = (items) => {
        return items.some((item) => router.pathname.startsWith(item.href));
    };
    const renderMenuItems = (items) => items.length > 0 ? (items.map((item, index) => item.subMenu ? (<MenuItem_1.MenuItem key={index} title={item.title} icon={item.icon} collapse={collapse} active={isMenuChildActive(item.subMenu)} sideblock={sideblock} description={item.description}>
            {item.subMenu.map((subItem, subIndex) => (<SubMenuItem_1.SubMenuItem key={subIndex} title={subItem.title} href={subItem.href} collapse={collapse} sideblock={sideblock}/>))}
          </MenuItem_1.MenuItem>) : (<MenuItem_1.MenuItem key={index} title={item.title} icon={item.icon} href={item.href} collapse={collapse} sideblock={sideblock} description={item.description}/>))) : (<li className="text-muted-500 dark:text-muted-400 text-sm px-4 py-2 h-full flex flex-col items-center justify-center">
        <span className="flex items-center justify-center gap-2">
          <react_1.Icon icon="akar-icons:arrow-left" className="w-4 h-4"/>
          {t("Select a menu item")}
        </span>
      </li>);
    const content = specialRender ? specialRender() : renderMenuItems(menuItems);
    const listClasses = (0, cn_1.cn)("slimscroll h-[calc(100%_-_52px)] animate-[fadeInLeft_.5s] overflow-y-auto px-4 pb-10", {
        "m-0 list-none p-0": collapse,
        "py-3": !sideblock,
    });
    if (collapse) {
        return (<li className="slimscroll grow overflow-y-auto overflow-x-hidden py-3">
        <nav>
          <ul className={listClasses}>{content}</ul>
        </nav>
      </li>);
    }
    return (<ul id={menuId} className={listClasses}>
      <MenuContext_1.MenuContextProvider>
        {isFetched && content}
        {isFetched && menuItems.length > 0 && <MenuDivider_1.MenuDivider />}
      </MenuContext_1.MenuContextProvider>
    </ul>);
};
exports.MenuItems = MenuItemsBase;
