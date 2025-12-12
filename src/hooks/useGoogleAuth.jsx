"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGoogleAuth = exports.googleClientId = void 0;
const router_1 = require("next/router");
const dashboard_1 = require("@/stores/dashboard");
const google_1 = require("@react-oauth/google");
const api_1 = __importDefault(require("@/utils/api"));
exports.googleClientId = process.env
    .NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const defaultUserPath = process.env.NEXT_PUBLIC_DEFAULT_USER_PATH || "/user";
const useGoogleAuth = () => {
    const router = (0, router_1.useRouter)();
    const handleGoogleLogin = (0, google_1.useGoogleLogin)({
        onSuccess: async (tokenResponse) => {
            const { access_token } = tokenResponse;
            const { data, error } = await (0, api_1.default)({
                url: "/api/auth/login/google",
                method: "POST",
                body: { token: access_token },
            });
            if (data && !error) {
                dashboard_1.useDashboardStore.getState().setIsFetched(false);
                // Trigger profile fetch after successful login
                await dashboard_1.useDashboardStore.getState().fetchProfile();
                const returnUrl = router.query.return || defaultUserPath;
                router.push(returnUrl);
            }
        },
        onError: (errorResponse) => {
            console.error("Google login failed", errorResponse);
        },
    });
    return {
        handleGoogleLogin,
    };
};
exports.useGoogleAuth = useGoogleAuth;
