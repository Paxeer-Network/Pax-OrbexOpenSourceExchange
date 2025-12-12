// store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";
import debounce from "lodash/debounce";

type EcommerceStore = {
  product: Product | null;
  products: Product[];
  category: Category | null;
  categories: Category[];
  wishlist: Product[];
  wishlistFetched: boolean;

  reviewProduct: (
    productId: string,
    rating: number,
    comment: string
  ) => Promise<boolean>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  fetchWishlist: () => void;
};

export const useEcommerceStore = create<EcommerceStore>()(
  immer((set, get) => ({
    category: null,
    product: null,
    products: [],
    categories: [],
    wishlist: [],
    wishlistFetched: false,

    reviewProduct: async (
      productId: string,
      rating: number,
      comment: string
    ) => {
      const { error } = await $fetch({
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

    fetchWishlist: debounce(async () => {
      if (get().wishlistFetched) return; // Prevent duplicate fetches
      const { data, error } = await $fetch({
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

    addToWishlist: async (product: Product) => {
      const { error } = await $fetch({
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

    removeFromWishlist: async (productId: string) => {
      const { error } = await $fetch({
        url: `/api/ext/ecommerce/wishlist/${productId}`,
        method: "DELETE",
        silent: true,
      });

      if (!error) {
        set((state) => {
          state.wishlist = state.wishlist.filter(
            (product) => product.id !== productId
          );
        });
      }
    },
  }))
);
