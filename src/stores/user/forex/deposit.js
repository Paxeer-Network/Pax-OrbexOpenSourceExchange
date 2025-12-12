"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDepositStore = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
const sonner_1 = require("sonner");
const endpoint = "/api/finance";
exports.useDepositStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    step: 1,
    walletTypes: [
        { value: "FIAT", label: "Fiat" },
        { value: "SPOT", label: "Spot" },
    ],
    selectedWalletType: { value: "", label: "Select a wallet type" },
    currencies: [],
    selectedCurrency: "Select a currency",
    depositMethods: [],
    selectedDepositMethod: null,
    depositAmount: 0,
    loading: false,
    deposit: null,
    setStep: (step) => set((state) => {
        state.step = step;
    }),
    setSelectedWalletType: (walletType) => set((state) => {
        state.selectedWalletType = walletType;
    }),
    setSelectedCurrency: (currency) => set((state) => {
        state.selectedCurrency = currency;
    }),
    setDepositMethods: (methods) => set((state) => {
        state.depositMethods = methods;
    }),
    setSelectedDepositMethod: (method) => set((state) => {
        state.selectedDepositMethod = method;
    }),
    setDepositAmount: (amount) => set((state) => {
        state.depositAmount = amount;
    }),
    setDeposit: (deposit) => set((state) => {
        state.deposit = deposit;
    }),
    setLoading: (loading) => set((state) => {
        state.loading = loading;
    }),
    handleDeposit: async (id) => {
        const { selectedWalletType, depositAmount, selectedCurrency, selectedDepositMethod, setLoading, } = get();
        setLoading(true);
        const url = `/api/ext/forex/account/${id}/deposit`;
        const { data, error } = await (0, api_1.default)({
            url,
            silent: true,
            method: "POST",
            body: {
                type: selectedWalletType.value,
                currency: selectedCurrency,
                chain: selectedWalletType.value !== "FIAT"
                    ? selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.chain
                    : undefined,
                amount: depositAmount,
            },
        });
        if (!error) {
            set((state) => {
                state.deposit = data;
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
                sonner_1.toast.error("An error occurred while fetching currencies");
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
    fetchDepositMethods: async () => {
        const { selectedWalletType, selectedCurrency } = get();
        try {
            const { data, error } = await (0, api_1.default)({
                url: `${endpoint}/currency/${selectedWalletType.value}/${selectedCurrency}?action=withdraw`,
                silent: true,
            });
            if (!error) {
                set((state) => {
                    state.depositMethods = data;
                    state.step = 3;
                });
            }
            else {
                sonner_1.toast.error("An error occurred while fetching currency deposit methods");
                set((state) => {
                    state.step = 2;
                });
            }
        }
        catch (error) {
            console.error("Error in fetching deposit methods:", error);
            sonner_1.toast.error("An error occurred while fetching deposit methods");
        }
    },
    clearAll: () => set(() => ({
        step: 1,
        selectedWalletType: { value: "", label: "Select a wallet type" },
        currencies: [],
        selectedCurrency: "Select a currency",
        depositMethods: [],
        selectedDepositMethod: null,
        depositAmount: 0,
        loading: false,
        deposit: null,
        stripeListener: false,
        transactionHash: "",
    })),
})));
