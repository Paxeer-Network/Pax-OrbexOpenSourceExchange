import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";

type NftStore = {
  // Asset-related
  assets: NftAsset[];
  fetchAssets: (params?: FetchAssetsParams) => void;
  featuredAssets: FeaturedNftAsset[];
  setFeaturedAssets: (assets: FeaturedNftAsset[]) => void;

  // Collection-related
  collection: NftCollection | null;
  setCollection: (collection: NftCollection) => void;
  collections: NftCollection[];
  topCollections: TopCollection[];
  setTopCollections: (collections: TopCollection[]) => void;
  featuredCollections: FeaturedNftCollection[];
  setFeaturedCollections: (collections: FeaturedNftCollection[]) => void;
  trendingCollections: TrendingCollection[];
  setTrendingCollections: (collections: TrendingCollection[]) => void;

  // Auction-related
  auctions: NftAuction[];
  upcomingAuctions: NftAuction[];
  setUpcomingAuctions: (collections: NftAuction[]) => void;

  // Creator-related
  creators: Creator[];
  setCreators: (creators: Creator[]) => void;

  // Like/unlike actions
  likeAsset: (id: string) => void;
  unlikeAsset: (id: string) => void;
  checkLikeStatus: (nftAssetId: string) => Promise<boolean>;

  // Asset selection
  selectedAssetIndex: number | null;
  setSelectedAssetIndex: (index: number) => void;
  openModal: (index: number) => void;
  closeModal: () => void;
  goToPrevAsset: () => void;
  goToNextAsset: () => void;

  // Purchase Modal Controls
  isPurchaseModalVisible: boolean;
  purchaseAsset: NftAsset | null;
  openPurchaseModal: (asset: NftAsset) => void;
  closePurchaseModal: () => void;

  // Follow/unfollow collection
  followCollection: (id: string) => void;
  unfollowCollection: (id: string) => void;
  checkFollowStatus: (collectionId: string) => Promise<boolean>;
};

export const useNftStore = create<NftStore>()(
  immer((set, get) => ({
    // Consolidated state
    assets: [],
    collection: null,
    collections: [],
    auctions: [],
    trendingCollections: [],
    featuredCollections: [],
    upcomingAuctions: [],
    creators: [],
    topCollections: [],

    selectedAssetIndex: null,

    // Featured asset actions
    featuredAssets: [],
    setFeaturedAssets: (assets) => {
      set((state) => {
        state.featuredAssets = assets;
      });
    },

    setFeaturedCollections: (collections) => {
      set((state) => {
        state.featuredCollections = collections;
      });
    },
    setTrendingCollections: (collections) => {
      set((state) => {
        state.trendingCollections = collections;
      });
    },
    setTopCollections: (collections) => {
      set((state) => {
        state.topCollections = collections;
      });
    },
    setUpcomingAuctions: (collections) => {
      set((state) => {
        state.upcomingAuctions = collections;
      });
    },
    setCreators: (creators) => {
      set((state) => {
        state.creators = creators;
      });
    },

    setCollection: (collection) => {
      set((state) => {
        state.collection = collection;
      });
    },

    setSelectedAssetIndex: (index) => {
      set((state) => {
        state.selectedAssetIndex = index;
      });
    },
    openModal: (index) => {
      set((state) => {
        state.selectedAssetIndex = index;
      });
    },
    closeModal: () => {
      set((state) => {
        state.selectedAssetIndex = null;
      });
    },
    goToPrevAsset: () => {
      const { selectedAssetIndex, assets } = get();
      if (selectedAssetIndex !== null && selectedAssetIndex > 0) {
        set({ selectedAssetIndex: selectedAssetIndex - 1 });
      }
    },
    goToNextAsset: () => {
      const { selectedAssetIndex, assets } = get();
      if (
        selectedAssetIndex !== null &&
        selectedAssetIndex < assets.length - 1
      ) {
        set({ selectedAssetIndex: selectedAssetIndex + 1 });
      }
    },

    // Purchase Modal Controls
    isPurchaseModalVisible: false,
    purchaseAsset: null,
    openPurchaseModal: (asset) => {
      set((state) => {
        state.isPurchaseModalVisible = true;
        state.purchaseAsset = asset;
      });
    },
    closePurchaseModal: () => {
      set((state) => {
        state.isPurchaseModalVisible = false;
        state.purchaseAsset = null;
      });
    },

    // Asset-related actions
    fetchAssets: async (params?: FetchAssetsParams) => {
      const { data, error } = await $fetch({
        url: "/api/ext/nft/asset",
        params,
        silent: true,
      });
      if (!error && data)
        set((state) => {
          state.assets = data;
        });
    },

    // New like/unlike actions
    likeAsset: async (id: string) => {
      const { error } = await $fetch({
        url: `/api/ext/nft/asset/${id}/like`,
        method: "POST",
        silent: true,
      });
      if (!error) {
        set((state) => {
          const asset = state.assets.find((asset) => asset.id === id);
          if (asset) asset.likes += 1;
        });
      }
    },

    unlikeAsset: async (id: string) => {
      const { error } = await $fetch({
        url: `/api/ext/nft/asset/${id}/like`,
        method: "DELETE",
        silent: true,
      });
      if (!error) {
        set((state) => {
          const asset = state.assets.find((asset) => asset.id === id);
          if (asset) asset.likes -= 1;
        });
      }
    },

    checkLikeStatus: async (id: string) => {
      const { data, error } = await $fetch({
        url: `/api/ext/nft/asset/${id}/like`,
        silent: true,
      });
      return data ? data.isLiked : false;
    },

    followCollection: async (id: string) => {
      const { error } = await $fetch({
        url: `/api/ext/nft/collection/${id}/follow`,
        method: "POST",
        silent: true,
      });
      if (!error) {
        set((state) => {
          const collection = state.collections.find(
            (collection) => collection.id === id
          );
          if (collection) collection.followers += 1;
        });
      }
    },

    unfollowCollection: async (id: string) => {
      const { error } = await $fetch({
        url: `/api/ext/nft/collection/${id}/follow`,
        method: "DELETE",
        silent: true,
      });
      if (!error) {
        set((state) => {
          const collection = state.collections.find(
            (collection) => collection.id === id
          );
          if (collection) collection.followers -= 1;
        });
      }
    },

    checkFollowStatus: async (id: string) => {
      const { data, error } = await $fetch({
        url: `/api/ext/nft/collection/${id}/follow`,
        silent: true,
      });
      return data ? data.isFollowed : false;
    },
  }))
);
