"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
const sonner_1 = require("sonner");
const dashboard_1 = require("@/stores/dashboard");
const useAffiliateStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    nodes: [],
    tree: null,
    selectedNode: null,
    referrals: [],
    selectedReferral: null,
    loading: false,
    setTree: (tree) => {
        set({ tree });
    },
    fetchNodes: async () => {
        var _a;
        const { setTree } = get();
        const { profile } = dashboard_1.useDashboardStore.getState();
        set({ loading: true });
        try {
            const { data, error } = await (0, api_1.default)({
                url: "/api/ext/affiliate/referral/node",
                silent: true,
            });
            if (error) {
                throw new Error("Error fetching nodes");
            }
            if (!error && ((_a = data === null || data === void 0 ? void 0 : data.downlines) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                setTree(data);
            }
            else {
                if (!profile)
                    return;
                setTree({
                    id: profile.id,
                    userId: profile.id,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    avatar: profile.avatar || "/img/avatars/placeholder.webp",
                    level: 0, // Root level
                    rewardsCount: 0, // Assuming no rewards initially
                    referredCount: 0, // Assuming no referrals initially
                    downlines: [], // No downlines initially
                });
            }
        }
        catch (error) {
            console.error("Error fetching nodes:", error);
            sonner_1.toast.error("Error fetching nodes");
        }
        set({ loading: false });
    },
    selectNodeByUserId: (userId) => {
        const node = get().nodes.find((node) => node.userId === userId) || null;
        set({ selectedNode: node });
    },
    fetchReferrals: async () => {
        set({ loading: true });
        try {
            const { data, error } = await (0, api_1.default)({
                url: "/api/affiliate/referrals/list",
                silent: true,
            });
            if (error) {
                throw new Error("Error fetching referrals");
            }
            set((state) => {
                state.referrals = data;
            });
        }
        catch (error) {
            console.error("Error fetching referrals:", error);
            sonner_1.toast.error("Error fetching referrals");
        }
        set({ loading: false });
    },
    updateReferralStatus: async (id, status) => {
        try {
            await (0, api_1.default)({
                url: `/api/affiliate/referral/${id}/status`,
                method: "POST",
                body: { status },
            });
            set((state) => {
                const referral = state.referrals.find((ref) => ref.id === id);
                if (referral) {
                    referral.status = status;
                }
            });
        }
        catch (error) {
            console.error("Error updating referral status:", error);
            sonner_1.toast.error("Error updating referral status");
        }
    },
    selectReferral: (referral) => {
        set({ selectedReferral: referral });
    },
    selectReferralById: (id) => {
        const referral = get().referrals.find((ref) => ref.id === id) || null;
        set({ selectedReferral: referral });
    },
})));
exports.default = useAffiliateStore;
