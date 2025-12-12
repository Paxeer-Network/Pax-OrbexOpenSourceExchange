import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";

type OrderStore = {
  wallet: any;
  ask: number;
  bid: number;
  ordersTab: "OPEN" | "HISTORY";
  orders: binaryOrderAttributes[];
  openOrders: binaryOrderAttributes[];
  loading: boolean;
  practiceBalances: Record<string, number>;

  fetchWallet: (currency: string) => void;
  fetchOrders: (currency: string, pair: string, isDemo?: boolean) => void;
  setAsk: (ask: number) => void;
  setBid: (bid: number) => void;
  removeOrder: (orderId: string) => void;

  placeOrder: (
    currency: string,
    pair: string,
    side: BinaryOrderSide,
    amount: number,
    closedAt: string,
    isDemo?: boolean,
    type?: BinaryOrderType,
    barrier?: number,
    strikePrice?: number,
    payoutPerPoint?: number
  ) => void;
  setOrdersTab: (tab: "OPEN" | "HISTORY") => void;
  setOrders: (orders: binaryOrderAttributes[]) => void;
  setOpenOrders: (openOrders: binaryOrderAttributes[]) => void;

  cancelOrder: (
    id: string,
    pair: string,
    isDemo?: boolean,
    amount?: number
  ) => void;

  setPracticeBalance: (currency: string, pair: string, balance: number) => void;
  updatePracticeBalance: (
    currency: string,
    pair: string,
    amount: number,
    type?: "add" | "subtract"
  ) => void;
  getPracticeBalance: (currency: string, pair: string) => number;
};

function shallowCompareOrders(
  a: binaryOrderAttributes[],
  b: binaryOrderAttributes[]
) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id) return false;
  }
  return true;
}

export const useBinaryOrderStore = create<OrderStore>()(
  immer((set, get) => ({
    wallet: null,
    ask: 0,
    bid: 0,
    ordersTab: "OPEN",
    orders: [],
    openOrders: [],
    loading: false,
    practiceBalances: {},

    setOrdersTab: (tab: "OPEN" | "HISTORY") => {
      set((state) => {
        state.ordersTab = tab;
      });
    },

    fetchWallet: async (currency: string) => {
      set((state) => {
        state.loading = true;
      });
      const { data, error } = await $fetch({
        url: `/api/finance/wallet/SPOT/${currency}`,
        silent: true,
      });

      if (!error) {
        set((state) => {
          state.wallet = data;
        });
      }

      set((state) => {
        state.loading = false;
      });
    },

    fetchOrders: async (currency: string, pair: string, isDemo = false) => {
      set((state) => {
        state.loading = true;
      });

      const { ordersTab } = get();
      const url = `/api/exchange/binary/order`;
      const { data, error } = await $fetch({
        url: `${url}?currency=${currency}&pair=${pair}&type=${ordersTab}&isDemo=${isDemo}`,
        silent: true,
      });

      if (!error && Array.isArray(data)) {
        set((state) => {
          const isOpen = ordersTab === "OPEN";
          const currentOrders = isOpen ? state.openOrders : state.orders;

          // Only update if there's a difference
          if (!shallowCompareOrders(currentOrders, data)) {
            if (isOpen) {
              state.openOrders = data;
            } else {
              state.orders = data;
            }
          }
        });
      }

      set((state) => {
        state.loading = false;
      });
    },

    setAsk: (ask: number) => {
      set((state) => {
        state.ask = Number(ask);
      });
    },

    setBid: (bid: number) => {
      set((state) => {
        state.bid = Number(bid);
      });
    },

    placeOrder: async (
      currency: string,
      pair: string,
      side: BinaryOrderSide,
      amount: number,
      closedAt: string,
      isDemo: boolean = false,
      type: BinaryOrderType = "RISE_FALL",
      barrier?: number,
      strikePrice?: number,
      payoutPerPoint?: number
    ) => {
      set((state) => {
        state.loading = true;
      });

      const { fetchWallet, setPracticeBalance, getPracticeBalance } = get();
      const url = "/api/exchange/binary/order";
      const body: any = {
        currency,
        pair,
        amount,
        side,
        closedAt,
        isDemo,
        type,
      };

      if (
        type === "HIGHER_LOWER" ||
        type === "TOUCH_NO_TOUCH" ||
        type === "TURBO"
      ) {
        body.barrier = barrier;
      }
      if (type === "CALL_PUT") {
        body.strikePrice = strikePrice;
        body.payoutPerPoint = payoutPerPoint;
      }
      if (type === "TURBO") {
        body.payoutPerPoint = payoutPerPoint;
      }

      const { data, error } = await $fetch({
        url,
        method: "POST",
        body,
      });

      if (!error && data?.order) {
        if (isDemo) {
          const newBalance = getPracticeBalance(currency, pair) - amount;
          setPracticeBalance(currency, pair, newBalance);
        } else {
          fetchWallet(pair);
        }

        set((state) => {
          state.openOrders.push(data.order);
        });
      }

      set((state) => {
        state.loading = false;
      });
    },

    setOrders: (orders: binaryOrderAttributes[]) => {
      set((state) => {
        state.orders = orders;
      });
    },

    setOpenOrders: (openOrders: binaryOrderAttributes[]) => {
      set((state) => {
        state.openOrders = openOrders;
      });
    },

    cancelOrder: async (
      id: string,
      pair: string,
      isDemo?: boolean,
      amount?: number
    ) => {
      set((state) => {
        state.loading = true;
      });
      const { fetchWallet, setPracticeBalance } = get();

      const url = `/api/exchange/binary/order/${id}`;
      const { error } = await $fetch({
        url,
        method: "DELETE",
      });

      if (!error) {
        set((state) => {
          state.openOrders = state.openOrders.filter(
            (order) => order.id !== id
          );
        });

        if (isDemo && amount) {
          const [cur, p] = pair.split("/");
          const currentBalance = get().getPracticeBalance(cur, p);
          setPracticeBalance(cur, p, currentBalance + amount);
        } else {
          fetchWallet(pair);
        }
      }

      set((state) => {
        state.loading = false;
      });
    },

    removeOrder: (orderId: string) => {
      set((state) => {
        state.openOrders = state.openOrders.filter(
          (order) => order.id !== orderId
        );
      });
    },

    setPracticeBalance: (currency: string, pair: string, balance: number) => {
      set((state) => {
        state.practiceBalances[`${currency}/${pair}`] = balance;
        localStorage.setItem(
          "practiceBalances",
          JSON.stringify(state.practiceBalances)
        );
      });
    },

    updatePracticeBalance: (
      currency: string,
      pair: string,
      amount: number,
      type = "subtract"
    ) => {
      set((state) => {
        const key = `${currency}/${pair}`;
        const newBalance =
          type === "add"
            ? (state.practiceBalances[key] || 10000) + amount
            : (state.practiceBalances[key] || 10000) - amount;
        state.practiceBalances[key] = newBalance;
        localStorage.setItem(
          "practiceBalances",
          JSON.stringify(state.practiceBalances)
        );
      });
    },

    getPracticeBalance: (currency: string, pair: string) => {
      const key = `${currency}/${pair}`;
      const savedBalances = localStorage.getItem("practiceBalances");
      if (savedBalances) {
        const balances = JSON.parse(savedBalances);
        return balances[key] !== undefined ? balances[key] : 10000;
      }
      return 10000;
    },
  }))
);
