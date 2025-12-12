"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePaymentStore = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
const sonner_1 = require("sonner");
const dashboard_1 = require("@/stores/dashboard");
const endpoint = "/api/finance";
exports.usePaymentStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    step: 1,
    walletTypes: [],
    selectedWalletType: { value: "", label: "Select a wallet type" },
    currencies: [],
    selectedCurrency: "Select a currency",
    selectedWallet: null,
    exchangeRate: null,
    loading: false,
    initializeWalletTypes: () => {
        const { getSetting, hasExtension } = dashboard_1.useDashboardStore.getState();
        const fiatWalletsEnabled = getSetting("fiatWallets") === "true";
        const ecosystemEnabled = hasExtension("ecosystem");
        const walletTypes = [{ value: "SPOT", label: "Spot" }];
        if (ecosystemEnabled) {
            walletTypes.push({ value: "ECO", label: "Funding" });
        }
        if (fiatWalletsEnabled) {
            walletTypes.unshift({ value: "FIAT", label: "Fiat" });
        }
        set((state) => {
            state.walletTypes = walletTypes;
        });
    },
    setStep: (step) => set((state) => {
        state.step = step;
    }),
    setSelectedWalletType: (walletType) => set((state) => {
        state.selectedWalletType = walletType;
        state.exchangeRate = null; // Reset exchange rate
    }),
    setSelectedCurrency: (currency) => set((state) => {
        state.selectedCurrency = currency;
        state.exchangeRate = null; // Reset exchange rate
    }),
    setSelectedWallet: (wallet) => set((state) => {
        state.selectedWallet = wallet;
    }),
    setLoading: (loading) => set((state) => {
        state.loading = loading;
    }),
    fetchCurrencies: async () => {
        const { selectedWalletType } = get();
        try {
            const { data, error } = await (0, api_1.default)({
                url: `${endpoint}/currency?action=payment&walletType=${selectedWalletType.value}`,
                silent: true,
            });
            if (error) {
                sonner_1.toast.error(error);
                set((state) => {
                    state.step = 1;
                });
            }
            else {
                set((state) => {
                    state.currencies = data;
                    state.step = 2;
                });
            }
        }
        catch (error) {
            console.error("Error in fetching currencies:", error);
            sonner_1.toast.error("An error occurred while fetching currencies");
        }
    },
    fetchWallet: async (type, currency) => {
        const { data, error } = await (0, api_1.default)({
            url: `${endpoint}/wallet/${type}/${currency}`,
            silent: true,
        });
        if (!error) {
            set((state) => {
                state.selectedWallet = data;
                state.step = 3;
            });
        }
        else {
            sonner_1.toast.error("An error occurred while fetching wallet");
            set((state) => {
                state.step = 2;
            });
        }
    },
    fetchExchangeRate: async (fromType, fromCurrency, toType, toCurrency) => {
        try {
            const { data, error } = await (0, api_1.default)({
                url: `${endpoint}/currency/rate`,
                silent: true,
                params: {
                    fromCurrency,
                    fromType,
                    toCurrency,
                    toType,
                },
            });
            if (!error) {
                set((state) => {
                    state.exchangeRate = data;
                });
            }
        }
        catch (error) {
            console.error("Error in fetching exchange rate:", error);
            sonner_1.toast.error("An error occurred while fetching exchange rate");
        }
    },
})));
