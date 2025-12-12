import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import WebSocketManager from "@/utils/ws";
import $fetch from "@/utils/api";
import { toast } from "sonner";
import { useDashboardStore } from "../../dashboard";
import { imageUploader } from "@/utils/upload";

interface TicketState {
  ticket: any | null;
  ws: WebSocketManager | null;
  isSupport: boolean;
  isReplying: boolean;

  setIsSupport: (value: boolean) => void;
  initializeWebSocket: (id: string) => void;
  disconnectWebSocket: () => void;
  fetchTicket: (id: string) => Promise<void>;

  replyToTicket: (message: string, attachment?: string) => Promise<void>;
  handleFileUpload: (file?: File) => Promise<void>;
  resolveTicket: (id: string, status: string) => Promise<void>;

  fetchLiveTicket: () => Promise<void>;
}

const useSupportStore = create<TicketState>()(
  immer((set, get) => ({
    ticket: null,
    ws: null,
    isReplying: false,
    isSupport: false,

    setIsSupport: (value: boolean) => {
      set({ isSupport: value });
    },

    initializeWebSocket: (id: string) => {
      const wsPath = `/api/user/support/ticket`;
      const wsManager = new WebSocketManager(wsPath);

      wsManager.connect();
      wsManager.on("open", () =>
        wsManager.send({ action: "SUBSCRIBE", payload: { id } })
      );
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

      wsManager.on("close", () =>
        wsManager.send({ action: "UNSUBSCRIBE", payload: { id } })
      );

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
        const { data, error } = await $fetch({
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
      } catch (error) {
        console.error("Error fetching live ticket:", error);
      }
    },

    fetchTicket: async (id: string) => {
      const { isSupport } = get();
      const url = isSupport
        ? `/api/admin/crm/support/ticket/${id}`
        : `/api/user/support/ticket/${id}`;
      try {
        const { data, error } = await $fetch({
          url,
          silent: true,
        });
        if (error) {
          toast.error("Ticket not found");
        } else {
          set((state) => {
            state.ticket = data;
          });
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    },

    replyToTicket: async (message, attachment) => {
      const { isSupport, isReplying, ticket } = get();

      if ((!message.trim() && attachment === "") || isReplying) return;
      set({ isReplying: true });

      const profile = useDashboardStore.getState().profile;
      if (!profile) return;

      await $fetch({
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
      if (!file) return;

      try {
        const response = await imageUploader({
          file,
          dir: `support/tickets/${ticket?.id}`,
          size: { maxWidth: 1024, maxHeight: 728 },
        });

        if (response.success) {
          return replyToTicket("", response.url);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    },

    resolveTicket: async (id, status) => {
      const { isSupport } = get();
      const url = isSupport
        ? `/api/admin/crm/support/ticket/${id}/status`
        : `/api/user/support/ticket/${id}/close`;

      await $fetch({
        url: url,
        method: "PUT",
        body: { status },
      });
    },
  }))
);

export default useSupportStore;
