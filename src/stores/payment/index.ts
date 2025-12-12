import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";
import { toast } from "sonner";
import { useDashboardStore } from "@/stores/dashboard";

type WalletType = {
  value: string;
  label: string;
};

type Currency = any;

type PaymentStore = {
  step: number;
  walletTypes: WalletType[];
  selectedWalletType: WalletType;
  currencies: Currency[];
  selectedCurrency: string;
  selectedWallet: any;
  exchangeRate: number | null;
  loading: boolean;

  setStep: (step: number) => void;
  setSelectedWalletType: (walletType: WalletType) => void;
  setSelectedCurrency: (currency: string) => void;
  setSelectedWallet: (wallet: any) => void;
  fetchCurrencies: () => void;
  fetchWallet: (type: string, currency: string) => void;
  fetchExchangeRate: (
    fromType: string,
    fromCurrency: string,
    toType: string,
    toCurrency: string
  ) => void;
  initializeWalletTypes: () => void;
  setLoading: (loading: boolean) => void;
};

const endpoint = "/api/finance";

export const usePaymentStore = create<PaymentStore>()(
  immer((set, get) => ({
    step: 1,
    walletTypes: [],
    selectedWalletType: { value: "", label: "Select a wallet type" },
    currencies: [],
    selectedCurrency: "Select a currency",
    selectedWallet: null,
    exchangeRate: null,
    loading: false,

    initializeWalletTypes: () => {
      const { getSetting, hasExtension } = useDashboardStore.getState();
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

    setStep: (step) =>
      set((state) => {
        state.step = step;
      }),

    setSelectedWalletType: (walletType) =>
      set((state) => {
        state.selectedWalletType = walletType;
        state.exchangeRate = null; // Reset exchange rate
      }),

    setSelectedCurrency: (currency) =>
      set((state) => {
        state.selectedCurrency = currency;
        state.exchangeRate = null; // Reset exchange rate
      }),

    setSelectedWallet: (wallet) =>
      set((state) => {
        state.selectedWallet = wallet;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),

    fetchCurrencies: async () => {
      const { selectedWalletType } = get();
      try {
        const { data, error } = await $fetch({
          url: `${endpoint}/currency?action=payment&walletType=${selectedWalletType.value}`,
          silent: true,
        });

        if (error) {
          toast.error(error);
          set((state) => {
            state.step = 1;
          });
        } else {
          set((state) => {
            state.currencies = data;
            state.step = 2;
          });
        }
      } catch (error) {
        console.error("Error in fetching currencies:", error);
        toast.error("An error occurred while fetching currencies");
      }
    },

    fetchWallet: async (type: string, currency: string) => {
      const { data, error } = await $fetch({
        url: `${endpoint}/wallet/${type}/${currency}`,
        silent: true,
      });

      if (!error) {
        set((state) => {
          state.selectedWallet = data;
          state.step = 3;
        });
      } else {
        toast.error("An error occurred while fetching wallet");
        set((state) => {
          state.step = 2;
        });
      }
    },

    fetchExchangeRate: async (
      fromType: string,
      fromCurrency: string,
      toType: string,
      toCurrency: string
    ) => {
      try {
        const { data, error } = await $fetch({
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
      } catch (error) {
        console.error("Error in fetching exchange rate:", error);
        toast.error("An error occurred while fetching exchange rate");
      }
    },
  }))
);
