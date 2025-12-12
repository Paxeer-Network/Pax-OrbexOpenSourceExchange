"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const ws_1 = __importDefault(require("@/utils/ws"));
const api_1 = __importDefault(require("@/utils/api"));
const sonner_1 = require("sonner");
const dashboard_1 = require("../../../dashboard");
const upload_1 = require("@/utils/upload");
const useP2PStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    trade: null,
    ws: null,
    isReplying: false,
    isSeller: false,
    isSupport: false,
    reviewRating: 0,
    hoverRating: 0,
    comment: "",
    setReviewRating: (value) => {
        set({ reviewRating: value });
    },
    setHoverRating: (value) => {
        set({ hoverRating: value });
    },
    setComment: (value) => {
        set({ comment: value });
    },
    setIsSeller: (value) => {
        set({ isSeller: value });
    },
    setIsSupport: (value) => {
        set({ isSupport: value });
    },
    initializeWebSocket: (userId, id) => {
        const wsPath = `/api/ext/p2p/trade?userId=${userId}`;
        const wsManager = new ws_1.default(wsPath);
        wsManager.on("open", () => {
            console.log("WebSocket connection opened.");
            wsManager.send({
                action: "SUBSCRIBE",
                payload: { id },
            });
        });
        wsManager.on("message", (msg) => {
            const { trade } = get();
            if (!trade)
                return;
            console.log(msg.method);
            if (msg.method && trade) {
                switch (msg.method) {
                    case "update": {
                        const { data } = msg;
                        set((state) => {
                            state.trade = {
                                ...state.trade,
                                ...data,
                            };
                        });
                        break;
                    }
                    case "reply": {
                        const { data } = msg;
                        const messages = trade.messages || [];
                        set((state) => {
                            state.trade = {
                                ...trade,
                                messages: [...messages, data.message],
                                updatedAt: data.updatedAt,
                            };
                        });
                        break;
                    }
                    default:
                        break;
                }
            }
        });
        wsManager.on("close", () => {
            console.log("WebSocket connection closed");
            wsManager.send({
                action: "UNSUBSCRIBE",
                payload: { id },
            });
            wsManager.reconnect();
        });
        wsManager.on("error", (error) => {
            console.error("WebSocket error:", error);
        });
        wsManager.connect();
        set((state) => {
            state.ws = wsManager;
        });
    },
    disconnectWebSocket: () => {
        const { ws } = get();
        if (ws) {
            ws.disconnect();
            set({ ws: null });
        }
    },
    fetchTrade: async (id) => {
        const url = `/api/ext/p2p/trade/${id}`;
        try {
            const { data, error } = await (0, api_1.default)({
                url,
                silent: true,
            });
            if (error) {
                sonner_1.toast.error("Trade not found");
            }
            else {
                set((state) => {
                    state.trade = data;
                });
            }
        }
        catch (error) {
            console.error("Error fetching trades:", error);
        }
    },
    replyToTrade: async (message, attachment) => {
        var _a;
        const { isSeller, ws, isReplying } = get();
        if ((!message.trim() && attachment === "") || isReplying)
            return;
        set({ isReplying: true });
        const profile = dashboard_1.useDashboardStore.getState().profile;
        if (!profile)
            return;
        const type = isSeller ? "seller" : "buyer";
        const messageData = {
            type,
            text: message,
            time: new Date(),
            userId: profile.id,
            attachment: attachment || "",
        };
        ws === null || ws === void 0 ? void 0 : ws.send({
            payload: {
                id: (_a = get().trade) === null || _a === void 0 ? void 0 : _a.id,
                message: messageData,
            },
        });
        set({ isReplying: false });
    },
    handleFileUpload: async (file) => {
        const { replyToTrade, trade } = get();
        if (!file)
            return;
        try {
            const response = await (0, upload_1.imageUploader)({
                file,
                dir: `p2p/trade/${trade === null || trade === void 0 ? void 0 : trade.id}`,
                size: { maxWidth: 1024, maxHeight: 728 },
            });
            if (response.success) {
                return replyToTrade("", response.url);
            }
        }
        catch (error) {
            console.error("Error uploading file:", error);
        }
    },
    cancelTrade: async () => {
        const { trade } = get();
        if (!trade)
            return;
        await (0, api_1.default)({
            url: `/api/ext/p2p/trade/${trade.id}/cancel`,
            method: "POST",
        });
    },
    markAsPaidTrade: async (txHash) => {
        const { trade } = get();
        if (!trade)
            return;
        await (0, api_1.default)({
            url: `/api/ext/p2p/trade/${trade.id}/status`,
            method: "POST",
            body: { txHash },
        });
    },
    disputeTrade: async (reason) => {
        const { trade } = get();
        if (!trade)
            return;
        await (0, api_1.default)({
            url: `/api/ext/p2p/trade/${trade.id}/dispute`,
            method: "POST",
            body: { reason },
        });
    },
    cancelDisputeTrade: async () => {
        const { trade } = get();
        if (!trade)
            return;
        await (0, api_1.default)({
            url: `/api/ext/p2p/trade/${trade.id}/dispute/cancel`,
            method: "POST",
        });
    },
    releaseTrade: async () => {
        const { trade } = get();
        if (!trade)
            return;
        await (0, api_1.default)({
            url: `/api/ext/p2p/trade/${trade.id}/release`,
            method: "POST",
        });
    },
    refundTrade: async () => {
        const { trade } = get();
        if (!trade)
            return;
        await (0, api_1.default)({
            url: `/api/ext/p2p/trade/${trade.id}/refund`,
            method: "POST",
        });
    },
    adminResolveDispute: async (resolution) => {
        const { trade } = get();
        if (!trade)
            return;
        await (0, api_1.default)({
            url: `/api/admin/ext/p2p/dispute/${trade.id}/resolve`,
            method: "POST",
            body: { resolution },
        });
    },
    adminCloseDispute: async () => {
        const { trade } = get();
        if (!trade)
            return;
        await (0, api_1.default)({
            url: `/api/admin/ext/p2p/dispute/${trade.id}/close`,
            method: "POST",
        });
    },
    adminCompleteTrade: async () => {
        const { trade } = get();
        if (!trade)
            return;
        await (0, api_1.default)({
            url: `/api/admin/ext/p2p/trade/${trade.id}/release`,
            method: "POST",
        });
    },
    adminCancelTrade: async () => {
        const { trade } = get();
        if (!trade)
            return;
        await (0, api_1.default)({
            url: `/api/admin/ext/p2p/trade/${trade.id}/cancel`,
            method: "POST",
        });
    },
    submitReview: async () => {
        const { trade, reviewRating, comment } = get();
        if (!trade)
            return;
        const { error } = await (0, api_1.default)({
            url: `/api/ext/p2p/offer/${trade.offer.id}/review`,
            method: "POST",
            body: {
                rating: reviewRating,
                comment,
            },
        });
        if (!error) {
            get().fetchTrade(trade.id);
        }
    },
})));
exports.default = useP2PStore;
