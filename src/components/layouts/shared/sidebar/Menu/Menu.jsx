"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const react_1 = __importDefault(require("react"));
const MashImage_1 = require("@/components/elements/MashImage");
const MenuItems_1 = require("../MenuItems");
const MenuContext_1 = require("@/context/MenuContext");
const dashboard_1 = require("@/stores/dashboard");
const UserProfileButton_1 = require("../sideblock/UserProfileButton");
const UserProfileButton_2 = require("../collapse/UserProfileButton");
const TopBar_1 = require("../TopBar");
const TopBar_2 = require("../collapse/TopBar");
const MenuBase = ({ float = false, sideblock = false, collapse = false, }) => {
    const { sidebarOpened, isSidebarOpenedMobile, setSidebarOpened, setIsSidebarOpenedMobile, filteredMenu, profile, isFetched, activeSidebar, } = (0, dashboard_1.useDashboardStore)();
    const { setActive } = (0, MenuContext_1.useMenuContext)();
    function collapseSidebarToggle() {
        if (collapse) {
            setSidebarOpened(!sidebarOpened);
        }
        else {
            setSidebarOpened(false);
            setIsSidebarOpenedMobile(false);
        }
        setActive("");
    }
    function generateNavClassNames() {
        // Define base classes
        const baseClasses = [
            "fixed left-0 top-0 z-11 h-full overflow-hidden transition-all duration-300 dark:border-muted-800 dark:bg-muted-900",
        ];
        // Conditional classes based on the provided states
        const conditionalClasses = [
            collapse ? "w-[280px]" : "w-[calc(100%-80px)]",
            collapse ? "bg-primary-800" : "bg-white",
            !collapse || sideblock || float ? "border-r" : "border-0",
            collapse ? "" : "border-muted-200",
            sideblock ? "text-muted-500 dark:text-muted-400" : "",
            collapse ? "" : "md:w-[250px]",
            collapse ? "" : sideblock ? "lg:w-[280px]" : "lg:left-20",
            !collapse
                ? sideblock
                    ? ""
                    : float
                        ? sidebarOpened
                            ? "is-sidebar-translated translate-x-0 border-r"
                            : "-translate-x-[130%]"
                        : sidebarOpened
                            ? "translate-x-0"
                            : "-translate-x-[101%]"
                : sidebarOpened
                    ? "lg:w-[280px]"
                    : "lg:w-20",
            collapse
                ? isSidebarOpenedMobile
                    ? "is-translated-mobile translate-x-0"
                    : "-translate-x-[101%] lg:translate-x-0"
                : sideblock
                    ? isSidebarOpenedMobile
                        ? ""
                        : "-translate-x-[101%]"
                    : float
                        ? isSidebarOpenedMobile
                            ? "is-menu-sidebar-translated-mobile left-20 translate-x-0"
                            : "-translate-x-[130%]"
                        : isSidebarOpenedMobile
                            ? "left-20 translate-x-0"
                            : "-translate-x-[101%]",
        ];
        // Join all classes into a single string
        const classes = [...baseClasses, ...conditionalClasses]
            .filter((cls) => cls) // Remove empty strings to avoid unnecessary spaces
            .join(" ");
        return classes;
    }
    const navClassNames = generateNavClassNames();
    const renderMenus = () => {
        return filteredMenu.map((section, key) => (<MenuItems_1.MenuItems key={`${section.title}-menu`} menuId={`${section.title}-menu`} activeMenuKey={section.title} menuItems={filteredMenu[key].menu} collapse={collapse} sideblock={sideblock}/>));
    };
    const activeMenuItem = filteredMenu.find((item) => item.title === activeSidebar);
    if (!activeMenuItem || (!activeMenuItem.menu && !activeMenuItem.subMenu)) {
        return null;
    }
    return (<nav className={navClassNames}>
      {collapse && (<div className="absolute inset-0 z-1 block overflow-hidden opacity-20">
          <MashImage_1.MashImage src="/img/sidebar-bg.webp" 
        // fill
        width={80} height={869} className="h-full w-full object-cover object-center" alt="sidebar background"/>
        </div>)}
      <div className={collapse || sideblock
            ? "relative z-2 flex h-full flex-col"
            : "h-full"}>
        {sideblock || collapse ? (<TopBar_2.TopBar collapse={collapse} sidebarOpened={sidebarOpened} setIsSidebarOpenedMobile={setIsSidebarOpenedMobile} collapseSidebarToggle={collapseSidebarToggle}/>) : (<TopBar_1.TopBar float={float} sidebarOpened={sidebarOpened} isSidebarOpenedMobile={isSidebarOpenedMobile} setIsSidebarOpenedMobile={setIsSidebarOpenedMobile} setSidebarOpened={setSidebarOpened}/>)}

        {isFetched && sideblock && (<UserProfileButton_1.UserProfileButton userName={(profile === null || profile === void 0 ? void 0 : profile.firstName) || "Clark Smith"} userImageSrc={(profile === null || profile === void 0 ? void 0 : profile.avatar) || "/img/avatars/placeholder.webp"}/>)}

        {isFetched && renderMenus()}

        {isFetched && collapse && (<UserProfileButton_2.UserProfileButton userName={(profile === null || profile === void 0 ? void 0 : profile.firstName) || "Clark Smith"} userImageSrc={(profile === null || profile === void 0 ? void 0 : profile.avatar) || "/img/avatars/placeholder.webp"} isVisible={sidebarOpened}/>)}
      </div>
    </nav>);
};
exports.Menu = MenuBase;
