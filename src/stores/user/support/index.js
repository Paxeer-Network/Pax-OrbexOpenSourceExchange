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
const dashboard_1 = require("../../dashboard");
const upload_1 = require("@/utils/upload");
const useSupportStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    ticket: null,
    ws: null,
    isReplying: false,
    isSupport: false,
    setIsSupport: (value) => {
        set({ isSupport: value });
    },
    initializeWebSocket: (id) => {
        const wsPath = `/api/user/support/ticket`;
        const wsManager = new ws_1.default(wsPath);
        wsManager.connect();
        wsManager.on("open", () => wsManager.send({ action: "SUBSCRIBE", payload: { id } }));
        wsManager.on("message", (msg) => {
            if (msg.method) {
                switch (msg.method) {
                    case "update": {
                        const { data } = msg;
                        set((state) => {
                            state.ticket = {
                                ...state.ticket,
                                ...data,
                            };
                        });
                        break;
                    }
                    case "reply": {
                        const { data } = msg;
                        const messages = get().ticket.messages || [];
                        set((state) => {
                            state.ticket = {
                                ...state.ticket,
                                messages: [...(messages || []), data.message],
                                status: data.status,
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
        wsManager.on("close", () => wsManager.send({ action: "UNSUBSCRIBE", payload: { id } }));
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
    fetchLiveTicket: async () => {
        try {
            const { data, error } = await (0, api_1.default)({
                url: `/api/user/support/chat`,
                silent: true,
            });
            if (!error) {
                const ticketId = data.id;
                set((state) => {
                    state.ticket = data;
                });
                get().initializeWebSocket(ticketId);
            }
        }
        catch (error) {
            console.error("Error fetching live ticket:", error);
        }
    },
    fetchTicket: async (id) => {
        const { isSupport } = get();
        const url = isSupport
            ? `/api/admin/crm/support/ticket/${id}`
            : `/api/user/support/ticket/${id}`;
        try {
            const { data, error } = await (0, api_1.default)({
                url,
                silent: true,
            });
            if (error) {
                sonner_1.toast.error("Ticket not found");
            }
            else {
                set((state) => {
                    state.ticket = data;
                });
            }
        }
        catch (error) {
            console.error("Error fetching tickets:", error);
        }
    },
    replyToTicket: async (message, attachment) => {
        const { isSupport, isReplying, ticket } = get();
        if ((!message.trim() && attachment === "") || isReplying)
            return;
        set({ isReplying: true });
        const profile = dashboard_1.useDashboardStore.getState().profile;
        if (!profile)
            return;
        await (0, api_1.default)({
            url: `/api/user/support/ticket/${ticket.id}`,
            method: "POST",
            silent: true,
            body: {
                type: isSupport ? "agent" : "client",
                text: message,
                time: new Date(),
                userId: profile.id,
                attachment: attachment || "",
            },
        });
        set({ isReplying: false });
    },
    handleFileUpload: async (file) => {
        const { replyToTicket, ticket } = get();
        if (!file)
            return;
        try {
            const response = await (0, upload_1.imageUploader)({
                file,
                dir: `support/tickets/${ticket === null || ticket === void 0 ? void 0 : ticket.id}`,
                size: { maxWidth: 1024, maxHeight: 728 },
            });
            if (response.success) {
                return replyToTicket("", response.url);
            }
        }
        catch (error) {
            console.error("Error uploading file:", error);
        }
    },
    resolveTicket: async (id, status) => {
        const { isSupport } = get();
        const url = isSupport
            ? `/api/admin/crm/support/ticket/${id}/status`
            : `/api/user/support/ticket/${id}/close`;
        await (0, api_1.default)({
            url: url,
            method: "PUT",
            body: { status },
        });
    },
})));
exports.default = useSupportStore;
