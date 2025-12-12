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
const dashboard_1 = require("@/stores/dashboard");
const endpoint = "/api/finance";
exports.useDepositStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    step: 1,
    walletTypes: [],
    selectedWalletType: { value: "", label: "Select a wallet type" },
    currencies: [],
    selectedCurrency: "Select a currency",
    depositMethods: [],
    selectedDepositMethod: null,
    depositAddress: "",
    depositAmount: 0,
    loading: false,
    deposit: null,
    stripeListener: false,
    transactionHash: "",
    transactionSent: false,
    contractType: null,
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
    }),
    setSelectedCurrency: (currency) => set((state) => {
        state.selectedCurrency = currency;
    }),
    setDepositMethods: (methods) => {
        set((state) => {
            state.depositMethods = methods;
        });
    },
    unlockAddress: async (address) => {
        await (0, api_1.default)({
            url: `/api/ext/ecosystem/deposit/unlock?address=${address}`,
            silent: true,
        });
    },
    setSelectedDepositMethod: async (method, newContractType) => {
        set((state) => {
            state.selectedDepositMethod = method;
            state.contractType = newContractType;
        });
    },
    setDepositAmount: (amount) => set((state) => {
        state.depositAmount = amount;
    }),
    setDeposit: (deposit) => set((state) => {
        state.deposit = deposit;
    }),
    setTransactionHash: (hash) => set((state) => {
        state.transactionHash = hash;
    }),
    setLoading: (loading) => set((state) => {
        state.loading = loading;
    }),
    stripeDeposit: async () => {
        set((state) => {
            state.loading = true;
            state.stripeListener = true;
        });
        const { depositAmount, selectedCurrency, verifySession } = get();
        const { data, error } = await (0, api_1.default)({
            url: `${endpoint}/deposit/fiat/stripe`,
            method: "POST",
            silent: true,
            body: {
                amount: depositAmount,
                currency: selectedCurrency,
            },
        });
        set((state) => {
            state.loading = false;
        });
        if (!error && data.url) {
            const stripePopup = window.open(data.url, "stripePopup", "width=500,height=700");
            if (!stripePopup) {
                sonner_1.toast.error("Popup blocked or failed to open.");
                set((state) => {
                    state.stripeListener = false;
                });
                return;
            }
            // Define the message handler function
            const messageHandler = (event) => {
                if (event.origin === window.location.origin) {
                    if (event.data.sessionId) {
                        verifySession(event.data.sessionId);
                    }
                    else if (event.data.status === "canceled") {
                        set((state) => {
                            state.stripeListener = false;
                        });
                        sonner_1.toast.error("Payment was canceled by the user");
                    }
                }
            };
            window.addEventListener("message", messageHandler);
            // Check if the popup window is closed
            const checkPopup = setInterval(() => {
                if (!stripePopup || stripePopup.closed) {
                    clearInterval(checkPopup);
                    window.removeEventListener("message", messageHandler);
                    set((state) => {
                        state.stripeListener = false;
                    });
                }
            }, 500);
        }
        else {
            set((state) => {
                state.stripeListener = false;
            });
            sonner_1.toast.error(error || "An unexpected error occurred");
        }
    },
    stopStripeListener: () => {
        set((state) => {
            state.stripeListener = false;
        });
    },
    verifySession: async (sessionId) => {
        try {
            const { data, error } = await (0, api_1.default)({
                url: `/api/finance/deposit/fiat/stripe/verify`,
                method: "POST",
                silent: true,
                params: { sessionId },
            });
            if (!error) {
                exports.useDepositStore.getState().setDeposit(data);
                exports.useDepositStore.getState().setStep(5);
            }
            else {
                sonner_1.toast.error(error || "An unexpected error occurred during payment verification");
            }
        }
        catch (error) {
            console.error("Error in fetching payment status:", error);
            sonner_1.toast.error("Error in communication with payment verification endpoint");
        }
    },
    paypalDeposit: async () => {
        const { depositAmount, selectedCurrency } = get();
        const { error } = await (0, api_1.default)({
            url: `${endpoint}/deposit/fiat/paypal`,
            method: "POST",
            silent: true,
            body: {
                amount: depositAmount,
                currency: selectedCurrency,
            },
        });
        if (!error) {
            set((state) => {
                state.step = 5;
            });
        }
        else {
            sonner_1.toast.error(error || "An unexpected error occurred");
        }
    },
    handleFiatDeposit: async (values) => {
        const { selectedDepositMethod, depositAmount, selectedCurrency } = get();
        if (!selectedDepositMethod ||
            !depositAmount ||
            !selectedCurrency ||
            depositAmount <= 0 ||
            depositAmount < selectedDepositMethod.minAmount) {
            sonner_1.toast.error("Invalid deposit amount");
            return;
        }
        if ((selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.alias) === "stripe") {
            return get().stripeDeposit();
        }
        else if ((selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.alias) === "paypal") {
            return get().paypalDeposit();
        }
        try {
            const { data, error } = await (0, api_1.default)({
                url: `${endpoint}/deposit/fiat`,
                method: "POST",
                silent: true,
                body: {
                    amount: depositAmount,
                    currency: selectedCurrency,
                    methodId: selectedDepositMethod === null || selectedDepositMethod === void 0 ? void 0 : selectedDepositMethod.id,
                    customFields: values,
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
        }
        catch (error) {
            console.error("Error in fiat deposit:", error);
            sonner_1.toast.error("An error occurred while processing deposit");
        }
    },
    fetchCurrencies: async () => {
        const { selectedWalletType } = get();
        try {
            const { data, error } = await (0, api_1.default)({
                url: `${endpoint}/currency?action=deposit&walletType=${selectedWalletType.value}`,
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
    fetchDepositMethods: async () => {
        const { selectedWalletType, selectedCurrency } = get();
        try {
            const { data, error } = await (0, api_1.default)({
                url: `${endpoint}/currency/${selectedWalletType.value}/${selectedCurrency}?action=deposit`,
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
    fetchDepositAddress: async () => {
        const { selectedWalletType, selectedCurrency, selectedDepositMethod, contractType, } = get();
        const url = selectedWalletType.value === "ECO"
            ? `/api/ext/ecosystem/wallet/${selectedCurrency}${contractType === "NO_PERMIT"
                ? `?contractType=${contractType}&chain=${selectedDepositMethod}`
                : ""}`
            : `${endpoint}/currency/${selectedWalletType.value}/${selectedCurrency}/${selectedDepositMethod}`;
        try {
            const { data, error } = await (0, api_1.default)({
                url,
                silent: true,
            });
            if (!error) {
                if (selectedWalletType.value === "ECO" &&
                    data.address &&
                    selectedDepositMethod) {
                    if (contractType === "NO_PERMIT") {
                        set((state) => {
                            state.depositAddress = data;
                        });
                    }
                    else {
                        set((state) => {
                            state.depositAddress = JSON.parse(data.address)[selectedDepositMethod];
                        });
                    }
                }
                else if (selectedWalletType.value === "SPOT" && data) {
                    set((state) => {
                        state.depositAddress = data;
                    });
                }
            }
            else {
                sonner_1.toast.error(error || "An error occurred while fetching deposit address");
                set((state) => {
                    state.step = 3;
                });
            }
        }
        catch (error) {
            console.error("Error in fetching deposit address:", error);
            sonner_1.toast.error("An error occurred while fetching deposit address");
        }
    },
    sendTransactionHash: async () => {
        const { transactionHash, selectedCurrency, selectedDepositMethod } = get();
        try {
            const { data, error } = await (0, api_1.default)({
                url: `${endpoint}/deposit/spot`,
                method: "POST",
                silent: true,
                body: {
                    currency: selectedCurrency,
                    chain: selectedDepositMethod,
                    trx: transactionHash,
                },
            });
            if (!error) {
                set((state) => {
                    state.deposit = data;
                    state.transactionSent = true;
                    state.loading = true; // Set loading true when sending the transaction
                });
            }
            else {
                sonner_1.toast.error(error || "An unexpected error occurred");
                set((state) => {
                    state.loading = false;
                });
            }
        }
        catch (error) {
            console.error("Error in sending transaction hash:", error);
            sonner_1.toast.error("An error occurred while sending transaction hash");
            set((state) => {
                state.loading = false;
            });
        }
    },
    clearAll: () => set(() => ({
        step: 1,
        selectedWalletType: { value: "", label: "Select a wallet type" },
        currencies: [],
        selectedCurrency: "Select a currency",
        depositMethods: [],
        selectedDepositMethod: null,
        depositAddress: "",
        depositAmount: 0,
        loading: false,
        deposit: null,
        stripeListener: false,
        transactionHash: "",
    })),
})));
