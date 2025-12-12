"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNftStore = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
exports.useNftStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
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
        if (selectedAssetIndex !== null &&
            selectedAssetIndex < assets.length - 1) {
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
    fetchAssets: async (params) => {
        const { data, error } = await (0, api_1.default)({
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
    likeAsset: async (id) => {
        const { error } = await (0, api_1.default)({
            url: `/api/ext/nft/asset/${id}/like`,
            method: "POST",
            silent: true,
        });
        if (!error) {
            set((state) => {
                const asset = state.assets.find((asset) => asset.id === id);
                if (asset)
                    asset.likes += 1;
            });
        }
    },
    unlikeAsset: async (id) => {
        const { error } = await (0, api_1.default)({
            url: `/api/ext/nft/asset/${id}/like`,
            method: "DELETE",
            silent: true,
        });
        if (!error) {
            set((state) => {
                const asset = state.assets.find((asset) => asset.id === id);
                if (asset)
                    asset.likes -= 1;
            });
        }
    },
    checkLikeStatus: async (id) => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/ext/nft/asset/${id}/like`,
            silent: true,
        });
        return data ? data.isLiked : false;
    },
    followCollection: async (id) => {
        const { error } = await (0, api_1.default)({
            url: `/api/ext/nft/collection/${id}/follow`,
            method: "POST",
            silent: true,
        });
        if (!error) {
            set((state) => {
                const collection = state.collections.find((collection) => collection.id === id);
                if (collection)
                    collection.followers += 1;
            });
        }
    },
    unfollowCollection: async (id) => {
        const { error } = await (0, api_1.default)({
            url: `/api/ext/nft/collection/${id}/follow`,
            method: "DELETE",
            silent: true,
        });
        if (!error) {
            set((state) => {
                const collection = state.collections.find((collection) => collection.id === id);
                if (collection)
                    collection.followers -= 1;
            });
        }
    },
    checkFollowStatus: async (id) => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/ext/nft/collection/${id}/follow`,
            silent: true,
        });
        return data ? data.isFollowed : false;
    },
})));
