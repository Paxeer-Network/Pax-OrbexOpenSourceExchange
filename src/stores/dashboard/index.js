"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboardStore = exports.THEME_KEY = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const lodash_1 = require("lodash");
const menu_1 = require("@/data/constants/menu");
const api_1 = __importDefault(require("@/utils/api"));
const defaultTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME || "system";
exports.THEME_KEY = "theme";
const readMode = () => {
    if (typeof window === "undefined") {
        return false;
    }
    try {
        const setting = localStorage.getItem(exports.THEME_KEY) || `${defaultTheme}`;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return setting === "dark" || (prefersDark && setting !== "light");
    }
    catch (_a) {
        return false;
    }
};
exports.useDashboardStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => {
    const loadMenuTypeFromStorage = () => {
        if (typeof window !== "undefined") {
            try {
                const storedMenuType = localStorage.getItem("menuType");
                return storedMenuType === "admin" ? "admin" : "user";
            }
            catch (error) {
                console.error("Error loading menu type from localStorage:", error);
                return "user";
            }
        }
        return "user";
    };
    const saveMenuTypeToStorage = (menuType) => {
        if (typeof window !== "undefined") {
            try {
                localStorage.setItem("menuType", menuType);
            }
            catch (error) {
                console.error("Error saving menu type to localStorage:", error);
            }
        }
    };
    const initialMenuType = loadMenuTypeFromStorage();
    const initialFilteredMenu = [];
    return {
        profile: null,
        settings: null,
        extensions: null,
        notifications: [],
        announcements: [],
        filteredMenu: initialFilteredMenu,
        isFetched: false,
        isPanelOpened: false,
        sidebarOpened: false,
        panels: {},
        isProfileOpen: false,
        isSidebarOpenedMobile: false,
        activeSidebar: "",
        isDark: readMode(),
        isAdmin: false,
        activeMenuType: initialMenuType,
        walletConnected: false,
        toggleMenuType: () => {
            set((state) => {
                const newMenuType = state.activeMenuType === "user" ? "admin" : "user";
                const menuToFilter = newMenuType === "admin" ? menu_1.adminMenu : menu_1.userMenu;
                const newFilteredMenu = state.filterMenu(menuToFilter);
                state.activeMenuType = newMenuType;
                state.filteredMenu = newFilteredMenu;
                saveMenuTypeToStorage(newMenuType);
            });
        },
        filterMenu: (menu) => {
            const { profile, checkPermission, hasExtension, getSetting, settings, extensions, } = get();
            if (!settings || !extensions)
                return []; // Ensure settings and extensions are available
            return menu
                .filter((menuItem) => {
                const hasPermission = menuItem.auth === false
                    ? !profile
                    : menuItem.auth
                        ? profile &&
                            checkPermission(menuItem.permission, profile.role.permissions)
                        : true;
                const hasRequiredExtension = !menuItem.extension || hasExtension(menuItem.extension);
                const hasRequiredSetting = !menuItem.settings ||
                    menuItem.settings.every((setting) => getSetting(setting) === "true");
                const isEnvValid = !menuItem.env || menuItem.env === "true";
                return (hasPermission &&
                    hasRequiredExtension &&
                    hasRequiredSetting &&
                    isEnvValid);
            })
                .map((menuItem) => {
                var _a;
                return ({
                    ...menuItem,
                    menu: (_a = menuItem.menu) === null || _a === void 0 ? void 0 : _a.filter((subItem) => {
                        const hasSubPermission = subItem.auth === false
                            ? !profile
                            : subItem.auth
                                ? profile &&
                                    checkPermission(subItem.permission, profile.role.permissions)
                                : true;
                        const hasSubExtension = !subItem.extension || hasExtension(subItem.extension);
                        const hasSubSetting = !subItem.settings ||
                            subItem.settings.every((setting) => getSetting(setting) === "true");
                        const isSubEnvValid = !subItem.env || subItem.env === "true";
                        return (hasSubPermission &&
                            hasSubExtension &&
                            hasSubSetting &&
                            isSubEnvValid);
                    }).map((subItem) => {
                        var _a;
                        return ({
                            ...subItem,
                            subMenu: (_a = subItem.subMenu) === null || _a === void 0 ? void 0 : _a.filter((subMenuItem) => {
                                const hasSubMenuPermission = subMenuItem.auth === false
                                    ? !profile
                                    : subMenuItem.auth
                                        ? profile &&
                                            checkPermission(subMenuItem.permission, profile.role.permissions)
                                        : true;
                                const hasSubMenuExtension = !subMenuItem.extension ||
                                    hasExtension(subMenuItem.extension);
                                const hasSubMenuSetting = !subMenuItem.settings ||
                                    subMenuItem.settings.every((setting) => getSetting(setting) === "true");
                                const isSubMenuEnvValid = !subMenuItem.env || subMenuItem.env === "true";
                                return (hasSubMenuPermission &&
                                    hasSubMenuExtension &&
                                    hasSubMenuSetting &&
                                    isSubMenuEnvValid);
                            }),
                        });
                    }),
                });
            });
        },
        fetchProfile: (0, lodash_1.debounce)(async () => {
            const { setProfile, checkPermission, setFetchInitiated, setFilteredMenu, filterMenu, activeMenuType, fetchSettings, settings, } = get();
            setFetchInitiated(true);
            if (!settings) {
                await fetchSettings();
            }
            const { data, error } = await (0, api_1.default)({
                url: "/api/user/profile",
                method: "GET",
                silent: true,
            });
            if (!error && data) {
                const { profile, ...rest } = data;
                setProfile({
                    ...rest,
                    metadata: profile
                        ? typeof profile === "string"
                            ? JSON.parse(profile)
                            : profile
                        : null,
                });
                const walletProvider = rest.providerUsers.find((provider) => provider.provider === "WALLET");
                const hasAdminAccess = menu_1.adminMenu.some((menuItem) => checkPermission(menuItem.permission, data.role.permissions));
                const newFilteredMenu = filterMenu(hasAdminAccess && activeMenuType === "admin" ? menu_1.adminMenu : menu_1.userMenu);
                set((state) => {
                    state.isAdmin = hasAdminAccess;
                    state.walletConnected = !!walletProvider;
                    state.isFetched = true;
                });
                setFilteredMenu(newFilteredMenu);
            }
            else {
                const newFilteredMenu = filterMenu(menu_1.userMenu);
                setFilteredMenu(newFilteredMenu);
                set((state) => {
                    state.isFetched = true;
                });
            }
        }, 5),
        fetchSettings: async () => {
            const { data, error } = await (0, api_1.default)({
                url: "/api/settings",
                silent: true,
            });
            if (data && !error) {
                set((state) => {
                    state.extensions = data.extensions;
                    state.settings = data.settings.reduce((acc, setting) => {
                        acc[setting.key] = setting.value;
                        return acc;
                    }, {}); // Provide an initial value of an empty object
                });
                // Initialize menu after settings are fetched
                get().initializeMenu();
            }
        },
        setProfile: (profile) => {
            set((state) => {
                state.profile = profile;
            });
        },
        setSettings: (data) => {
            set((state) => {
                state.extensions = data.extensions;
                state.settings = data.settings.reduce((acc, setting) => {
                    acc[setting.key] = setting.value;
                    return acc;
                }, {});
            });
            get().initializeMenu();
        },
        initializeMenu: () => {
            const { filterMenu, activeMenuType } = get();
            const menuToFilter = activeMenuType === "admin" ? menu_1.adminMenu : menu_1.userMenu;
            const filteredMenu = filterMenu(menuToFilter);
            set({ filteredMenu });
        },
        setWalletConnected: (value) => {
            set((state) => {
                state.walletConnected = value;
            });
        },
        getSetting: (key) => {
            const { settings } = get();
            if (!settings)
                return null;
            return settings[key];
        },
        hasExtension: (name) => {
            const { extensions } = get();
            if (!extensions)
                return false;
            return extensions.includes(name);
        },
        setIsPanelOpened: (isOpen) => {
            set((state) => {
                state.isPanelOpened = isOpen;
            });
        },
        setIsFetched: (value) => {
            set((state) => {
                state.isFetched = value;
            });
        },
        updateProfile2FA: async (status) => {
            const { profile } = get();
            if (!profile || !profile.twoFactor)
                return;
            const { error } = await (0, api_1.default)({
                url: "/api/auth/otp/toggle",
                method: "POST",
                body: { status },
                silent: true,
            });
            if (!error) {
                set((state) => {
                    state.profile.twoFactor.enabled = status;
                });
            }
        },
        toggleTheme: () => {
            const { isDark } = get();
            const currentTheme = isDark;
            const newTheme = !currentTheme;
            localStorage.setItem(exports.THEME_KEY, newTheme ? "dark" : "light");
            set({ isDark: newTheme });
            const rootClass = document.documentElement.classList;
            rootClass.add("no-transition");
            if (newTheme) {
                rootClass.add("dark");
            }
            else {
                rootClass.remove("dark");
            }
            setTimeout(() => {
                rootClass.remove("no-transition");
            }, 0);
        },
        checkPermission: (permissions, rolePermissions) => {
            const { profile } = get();
            if (!profile)
                return false;
            if (profile.role.name === "Super Admin")
                return true;
            if (!permissions || permissions.length === 0)
                return true;
            return permissions.every((perm) => rolePermissions === null || rolePermissions === void 0 ? void 0 : rolePermissions.some((rp) => rp.name === perm));
        },
        setFetchInitiated: (value) => {
            set((state) => {
                state.isFetched = value;
            });
        },
        setFilteredMenu: (menu) => {
            set((state) => {
                state.filteredMenu = menu;
            });
        },
        setActiveSidebar: (s) => {
            set((state) => {
                state.activeSidebar = s;
            });
        },
        setPanelOpen: (title, isOpen) => {
            set((state) => {
                state.panels[title] = isOpen;
            });
        },
        setIsSidebarOpenedMobile: (b) => {
            set((state) => {
                state.isSidebarOpenedMobile = b;
            });
        },
        setSidebarOpened: (b) => {
            set((state) => {
                state.sidebarOpened = b;
            });
        },
        setIsProfileOpen: (b) => {
            set((state) => {
                state.isProfileOpen = b;
            });
        },
        removeNotification: async (id) => {
            const { error } = await (0, api_1.default)({
                url: `/api/user/notification/${id}`,
                method: "DELETE",
                silent: true,
            });
            if (!error) {
                set((state) => {
                    state.notifications = state.notifications.filter((n) => n.id !== id);
                });
            }
        },
        clearNotifications: async (type) => {
            const { error } = await (0, api_1.default)({
                url: "/api/user/notification/clean",
                method: "DELETE",
                silent: true,
                params: { type },
            });
            if (!error) {
                set((state) => ({
                    notifications: state.notifications.filter((notification) => notification.type.toLowerCase() !== type.toLowerCase()),
                }));
            }
        },
        store: (stateKey, data) => {
            set((state) => {
                state[stateKey] = Array.isArray(data)
                    ? [...state[stateKey], ...data]
                    : [...state[stateKey], data];
            });
        },
        update: (stateKey, id, data) => {
            set((state) => {
                const ids = Array.isArray(id) ? id : [id];
                state[stateKey] = state[stateKey].map((item) => ids.includes(item.id) ? { ...item, ...data } : item);
            });
        },
        delete: (stateKey, id) => {
            set((state) => {
                const ids = Array.isArray(id) ? id : [id];
                state[stateKey] = state[stateKey].filter((item) => !ids.includes(item.id));
            });
        },
    };
}));
