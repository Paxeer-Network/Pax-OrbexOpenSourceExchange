"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogout = void 0;
const router_1 = require("next/router");
const api_1 = __importDefault(require("@/utils/api"));
const dashboard_1 = require("@/stores/dashboard");
const menu_1 = require("@/data/constants/menu");
const useLogout = () => {
    const router = (0, router_1.useRouter)();
    const { setProfile, setIsFetched, setFilteredMenu, filterMenu } = (0, dashboard_1.useDashboardStore)();
    return async () => {
        const { error } = await (0, api_1.default)({
            url: "/api/auth/logout",
            method: "POST",
        });
        if (!error) {
            setProfile(null);
            setIsFetched(false); // Reset the isFetched state
            const newFilteredMenu = filterMenu(menu_1.userMenu);
            setFilteredMenu(newFilteredMenu);
            router.push("/");
        }
    };
};
exports.useLogout = useLogout;
