"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWithdrawStore = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
const sonner_1 = require("sonner");
const dashboard_1 = require("@/stores/dashboard");
const endpoint = "/api/finance";
exports.useWithdrawStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    step: 1,
    walletTypes: [],
    selectedWalletType: { value: "", label: "Select a wallet type" },
    currencies: [],
    selectedCurrency: "Select a currency",
    withdrawMethods: [],
    selectedWithdrawMethod: null,
    withdrawAddress: "",
    withdrawAmount: 0,
    loading: false,
    withdraw: null,
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
    setWithdrawAddress: (address) => set((state) => {
        state.withdrawAddress = address;
    }),
    setSelectedWalletType: (walletType) => set((state) => {
        state.selectedWalletType = walletType;
    }),
    setSelectedCurrency: (currency) => set((state) => {
        state.selectedCurrency = currency;
    }),
    setWithdrawMethods: (methods) => set((state) => {
        state.withdrawMethods = methods;
    }),
    setSelectedWithdrawMethod: (method) => set((state) => {
        state.selectedWithdrawMethod = method;
    }),
    setWithdrawAmount: (amount) => set((state) => {
        state.withdrawAmount = amount;
    }),
    setWithdraw: (withdraw) => set((state) => {
        state.withdraw = withdraw;
    }),
    setLoading: (loading) => set((state) => {
        state.loading = loading;
    }),
    handleFiatWithdraw: async (values) => {
        const { selectedWithdrawMethod, withdrawAmount, selectedCurrency } = get();
        try {
            const { data, error } = await (0, api_1.default)({
                url: `${endpoint}/withdraw/fiat`,
                method: "POST",
                silent: true,
                body: {
                    amount: withdrawAmount,
                    currency: selectedCurrency,
                    methodId: selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.id,
                    customFields: values,
                },
            });
            if (!error) {
                set((state) => {
                    state.withdraw = data;
                    state.step = 5;
                });
            }
            else {
                sonner_1.toast.error(error || "An unexpected error occurred");
            }
        }
        catch (error) {
            console.error("Error in fiat withdraw:", error);
            sonner_1.toast.error("An error occurred while processing withdraw");
        }
    },
    handleWithdraw: async () => {
        const { selectedWalletType, withdrawAmount, selectedCurrency, selectedWithdrawMethod, withdrawAddress, setLoading, } = get();
        setLoading(true);
        const url = selectedWalletType.value === "ECO"
            ? `/api/ext/ecosystem/withdraw`
            : `${endpoint}/withdraw/${selectedWalletType.value}`;
        const { data, error } = await (0, api_1.default)({
            url,
            silent: true,
            method: "POST",
            body: {
                currency: selectedCurrency,
                chain: selectedWithdrawMethod === null || selectedWithdrawMethod === void 0 ? void 0 : selectedWithdrawMethod.chain,
                amount: withdrawAmount,
                toAddress: withdrawAddress,
            },
        });
        if (!error) {
            set((state) => {
                state.withdraw = data;
                state.step = 5;
            });
        }
        else {
            sonner_1.toast.error(error || "An unexpected error occurred");
        }
        setLoading(false);
    },
    fetchCurrencies: async () => {
        const { selectedWalletType } = get();
        try {
            const { data, error } = await (0, api_1.default)({
                url: `${endpoint}/currency?action=withdraw&walletType=${selectedWalletType.value}`,
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
            sonner_1.toast.error(error);
        }
    },
    fetchWithdrawMethods: async () => {
        const { selectedWalletType, selectedCurrency } = get();
        try {
            const { data, error } = await (0, api_1.default)({
                url: `${endpoint}/currency/${selectedWalletType.value}/${selectedCurrency}?action=withdraw`,
                silent: true,
            });
            if (!error) {
                // change limits in methods to object from json string if it is a string
                if (data && data.length > 0) {
                    data.forEach((method) => {
                        if (typeof method.limits === "string") {
                            method.limits = JSON.parse(method.limits);
                        }
                    });
                }
                set((state) => {
                    state.withdrawMethods = data;
                    state.step = 3;
                });
            }
            else {
                sonner_1.toast.error("An error occurred while fetching currency withdraw methods");
                set((state) => {
                    state.step = 2;
                });
            }
        }
        catch (error) {
            console.error("Error in fetching withdraw methods:", error);
            sonner_1.toast.error("An error occurred while fetching withdraw methods");
        }
    },
    clearAll: () => set(() => ({
        step: 1,
        selectedWalletType: { value: "", label: "Select a wallet type" },
        currencies: [],
        selectedCurrency: "Select a currency",
        withdrawMethods: [],
        selectedWithdrawMethod: null,
        withdrawAddress: "",
        withdrawAmount: 0,
        loading: false,
        withdraw: null,
        stripeListener: false,
        transactionHash: "",
    })),
})));
