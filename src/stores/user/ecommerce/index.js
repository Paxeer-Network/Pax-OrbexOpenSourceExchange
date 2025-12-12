"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEcommerceStore = void 0;
// store.ts
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
const debounce_1 = __importDefault(require("lodash/debounce"));
exports.useEcommerceStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    category: null,
    product: null,
    products: [],
    categories: [],
    wishlist: [],
    wishlistFetched: false,
    reviewProduct: async (productId, rating, comment) => {
        const { error } = await (0, api_1.default)({
            url: `/api/ext/ecommerce/review/${productId}`,
            method: "POST",
            body: {
                rating,
                comment,
            },
        });
        if (!error) {
            return true;
        }
        return false;
    },
    fetchWishlist: (0, debounce_1.default)(async () => {
        if (get().wishlistFetched)
            return; // Prevent duplicate fetches
        const { data, error } = await (0, api_1.default)({
            url: "/api/ext/ecommerce/wishlist",
            silent: true,
        });
        if (!error) {
            set((state) => {
                state.wishlist = data;
                state.wishlistFetched = true; // Mark as fetched
            });
        }
    }, 100),
    addToWishlist: async (product) => {
        const { error } = await (0, api_1.default)({
            url: `/api/ext/ecommerce/wishlist`,
            method: "POST",
            silent: true,
            body: {
                productId: product.id,
            },
        });
        if (!error) {
            set((state) => {
                state.wishlist.push(product);
            });
        }
    },
    removeFromWishlist: async (productId) => {
        const { error } = await (0, api_1.default)({
            url: `/api/ext/ecommerce/wishlist/${productId}`,
            method: "DELETE",
            silent: true,
        });
        if (!error) {
            set((state) => {
                state.wishlist = state.wishlist.filter((product) => product.id !== productId);
            });
        }
    },
})));
