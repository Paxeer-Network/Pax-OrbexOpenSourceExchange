import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Chat } from "@/components/pages/user/Chat";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
import useSupportStore from "@/stores/user/support";
import { Tooltip } from "@/components/elements/base/tooltips/Tooltip";

const FloatingLiveChat = () => {
  const { t } = useTranslation();
  const { profile, settings } = useDashboardStore();
  const floatingLiveChatEnabled = settings?.floatingLiveChat === true;
  const {
    ticket,
    fetchLiveTicket,
    disconnectWebSocket,
    replyToTicket,
    handleFileUpload,
    isReplying,
  } = useSupportStore();

  const [open, setOpen] = useState(false);

  // Manage WebSocket connection based on the open state
  useEffect(() => {
    if (open) {
      if (!ticket) fetchLiveTicket();
    } else {
      disconnectWebSocket(); // Cleanup WebSocket connection
    }
  }, [open, ticket]);

  const toggleOpen = () => {
    setOpen((state) => !state);
  };

  const messageSide = (userId) => (userId === profile?.id ? "right" : "left");

  return (
    <div
      className={`group/layouts fixed bottom-5 ${floatingLiveChatEnabled ? "right-20" : "right-5"} ${open ? "z-50" : "z-40"}`}
    >
      {/* Support Button */}
      <Tooltip content={t("Live Chat")}>
        <button
          name="supportChatToggle"
          aria-label="Support Chat"
          type="button"
          className={`flex items-center rounded-lg border border-muted-200 bg-white p-3 text-start shadow-lg shadow-muted-300/30 transition-all duration-300 hover:border-primary-500 dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/30 dark:hover:border-info-500 ${
            open
              ? "pointer-events-none translate-y-full opacity-0"
              : "pointer-events-auto translate-y-0 opacity-100"
          }`}
          onClick={toggleOpen}
        >
          <Icon
            icon="ph:chat-teardrop-text"
            className="h-6 w-6 shrink-0 text-muted-400 transition-colors duration-300 group-hover/layouts:text-info-500"
          />
        </button>
      </Tooltip>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-5 right-5 z-1000 h-[420px] w-[300px] max-w-[90%] overflow-hidden rounded-lg border border-muted-200 bg-white shadow-lg shadow-muted-300/30 transition-all duration-300 hover:border-info-500 dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/30 dark:hover:border-info-500 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-muted-200 px-4 dark:border-muted-800">
          <h3 className="font-sans font-medium text-muted-800 dark:text-muted-100 text-lg">
            {t("Support Chat")}
          </h3>
          <button
            type="button"
            aria-label="Close Support Chat"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted-100 transition-colors duration-300 hover:bg-muted-200 dark:bg-muted-800 dark:hover:bg-muted-700"
            onClick={toggleOpen}
          >
            <Icon
              icon="lucide:x"
              className="h-4 w-4 text-muted-500 dark:text-muted-200"
            />
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex flex-col h-full">
          <Chat
            messages={ticket?.messages || []}
            handleFileUpload={handleFileUpload}
            messageSide={messageSide}
            user1={ticket?.user}
            user2={ticket?.agent}
            reply={replyToTicket}
            isReplying={isReplying}
            canReply={true}
            floating={true}
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingLiveChat;
