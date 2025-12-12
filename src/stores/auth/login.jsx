"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoginStore = exports.googleClientId = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const dashboard_1 = require("@/stores/dashboard");
const sonner_1 = require("sonner");
const api_1 = __importDefault(require("@/utils/api"));
exports.googleClientId = process.env
    .NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const recaptchaEnabled = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_STATUS === "true" || false;
const recaptchaSiteKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;
const defaultUserPath = process.env.NEXT_PUBLIC_DEFAULT_USER_PATH || "/user";
exports.useLoginStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => {
    const decrementCooldown = () => {
        const interval = setInterval(() => {
            set((state) => {
                if (state.resendCooldown > 0) {
                    state.resendCooldown -= 1;
                }
                else {
                    clearInterval(interval);
                }
            });
        }, 1000);
    };
    return {
        recaptchaRef: null,
        cooldownInterval: null,
        loading: false,
        email: "",
        password: "",
        isVerificationStep: false,
        verificationCode: "",
        is2FAVerificationStep: false,
        otp: "",
        userId: "",
        twoFactorType: "",
        resendCooldown: 0,
        resendAttempts: 0,
        script: null,
        errors: {
            email: undefined,
            password: undefined,
        },
        setErrors: (errors) => set((state) => {
            state.errors = errors;
        }),
        setEmail: (email) => set((state) => {
            state.email = email;
        }),
        setPassword: (password) => set((state) => {
            state.password = password;
        }),
        setVerificationCode: (code) => set((state) => {
            state.verificationCode = code;
        }),
        setOtp: (otp) => set((state) => {
            state.otp = otp;
        }),
        setLoading: (loading) => set((state) => {
            state.loading = loading;
        }),
        initializeRecaptcha: () => {
            if (typeof window !== "undefined" && recaptchaEnabled) {
                const { recaptchaRef } = get();
                const script = document.createElement("script");
                script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);
                script.onload = () => {
                    const { grecaptcha } = window;
                    if (grecaptcha) {
                        grecaptcha.ready(() => {
                            if (recaptchaRef) {
                                set((state) => {
                                    state.recaptchaRef = grecaptcha.render("recaptcha-container", {
                                        sitekey: recaptchaSiteKey,
                                        size: "invisible",
                                    });
                                });
                            }
                        });
                    }
                };
            }
        },
        decrementCooldown,
        handleSubmit: async (router) => {
            set((state) => {
                state.loading = true;
            });
            let recaptchaToken = null;
            if (recaptchaEnabled) {
                const { grecaptcha } = window;
                if (grecaptcha && typeof grecaptcha.execute === "function") {
                    try {
                        recaptchaToken = await grecaptcha.execute(recaptchaSiteKey, {
                            action: "login",
                        });
                    }
                    catch (error) {
                        sonner_1.toast.error("Recaptcha execution failed. Please try again.");
                        set((state) => {
                            state.loading = false;
                        });
                        return;
                    }
                }
                else {
                    sonner_1.toast.error("Recaptcha failed to load. Please refresh the page.");
                    set((state) => {
                        state.loading = false;
                    });
                    return;
                }
            }
            const { data, error, validationErrors } = await (0, api_1.default)({
                url: "/api/auth/login",
                method: "POST",
                body: {
                    email: get().email,
                    password: get().password,
                    recaptchaToken,
                },
            });
            set((state) => {
                state.loading = false;
            });
            if (validationErrors) {
                if (validationErrors.email === 'Email must match format "email".') {
                    validationErrors.email = "Invalid email format";
                }
                set((state) => {
                    state.errors = validationErrors;
                });
                return;
            }
            if (error) {
                set((state) => {
                    state.errors = {
                        email: "Invalid email or password",
                        password: "Invalid email or password",
                    };
                });
                return;
            }
            if (data.message &&
                data.message.startsWith("User email not verified")) {
                set((state) => {
                    state.isVerificationStep = true;
                });
            }
            else if (data.message && data.message.includes("2FA required")) {
                set((state) => {
                    state.is2FAVerificationStep = true;
                    state.userId = data.id;
                    state.twoFactorType = data.twoFactor.type;
                });
            }
            else {
                // Reset isFetched before redirecting
                dashboard_1.useDashboardStore.getState().setIsFetched(false);
                // Trigger profile fetch after successful login
                await dashboard_1.useDashboardStore.getState().fetchProfile();
                // Get the return URL from the query parameters
                const returnUrl = router.query.return || defaultUserPath;
                router.push(returnUrl);
            }
        },
        handleVerificationSubmit: async (router) => {
            set((state) => {
                state.loading = true;
            });
            const { verificationCode } = get();
            const { error } = await (0, api_1.default)({
                url: "/api/auth/verify/email",
                method: "POST",
                body: { token: verificationCode },
            });
            if (!error) {
                dashboard_1.useDashboardStore.getState().setIsFetched(false);
                // Redirect to return URL if specified
                const returnUrl = router.query.return || defaultUserPath;
                router.push(returnUrl);
            }
            set((state) => {
                state.loading = false;
            });
        },
        handle2FASubmit: async (router) => {
            set((state) => {
                state.loading = true;
            });
            const { data, error } = await (0, api_1.default)({
                url: "/api/auth/otp/login",
                method: "POST",
                body: { id: get().userId, otp: get().otp },
            });
            if (data && !error) {
                dashboard_1.useDashboardStore.getState().setIsFetched(false);
                const returnUrl = router.query.return || defaultUserPath;
                router.push(returnUrl);
            }
            set((state) => {
                state.loading = false;
            });
        },
        handleResendOtp: async () => {
            if (get().resendCooldown > 0 || get().resendAttempts >= 5) {
                sonner_1.toast.error("Please wait before resending the OTP.");
                return;
            }
            set((state) => {
                state.loading = true;
            });
            const { data, error } = await (0, api_1.default)({
                url: "/api/auth/otp/resend",
                method: "POST",
                body: { id: get().userId, type: get().twoFactorType },
            });
            set((state) => {
                state.loading = false;
            });
            if (data && !error) {
                set((state) => {
                    state.resendAttempts += 1;
                    state.resendCooldown = 60;
                });
                get().decrementCooldown();
            }
        },
    };
}));
