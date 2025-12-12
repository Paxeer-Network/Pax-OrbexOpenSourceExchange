"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWalletStore = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
exports.useWalletStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    wallet: null,
    fiatWallets: [],
    spotWallets: [],
    ecoWallets: [],
    futuresWallets: [],
    pnl: null,
    fetchWallets: async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/finance/wallet",
            silent: true,
        });
        if (!error) {
            set((state) => {
                state.fiatWallets = data.FIAT;
                state.spotWallets = data.SPOT;
                state.ecoWallets = data.ECO;
                state.futuresWallets = data.FUTURES;
            });
        }
    },
    fetchPnl: async () => {
        const { pnl } = get();
        if (pnl)
            return;
        const { data, error } = await (0, api_1.default)({
            url: "/api/finance/wallet?pnl=true",
            silent: true,
        });
        if (!error && data) {
            set((state) => {
                state.pnl = data;
            });
        }
    },
    fetchWallet: async (type, currency) => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/finance/wallet/${type}/${currency}`,
            silent: true,
        });
        if (!error) {
            set((state) => {
                state.wallet = data;
            });
        }
    },
    setWallet: (wallet) => {
        set((state) => {
            state.wallet = wallet;
        });
    },
})));
