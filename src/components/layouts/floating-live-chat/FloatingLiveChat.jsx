"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@iconify/react");
const Chat_1 = require("@/components/pages/user/Chat");
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const support_1 = __importDefault(require("@/stores/user/support"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const FloatingLiveChat = () => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile, settings } = (0, dashboard_1.useDashboardStore)();
    const floatingLiveChatEnabled = (_a = (settings === null || settings === void 0 ? void 0 : settings.floatingLiveChat) === "true") !== null && _a !== void 0 ? _a : false;
    const { ticket, fetchLiveTicket, disconnectWebSocket, replyToTicket, handleFileUpload, isReplying, } = (0, support_1.default)();
    const [open, setOpen] = (0, react_1.useState)(false);
    // Manage WebSocket connection based on the open state
    (0, react_1.useEffect)(() => {
        if (open) {
            if (!ticket)
                fetchLiveTicket();
        }
        else {
            disconnectWebSocket(); // Cleanup WebSocket connection
        }
    }, [open, ticket]);
    const toggleOpen = () => {
        setOpen((state) => !state);
    };
    const messageSide = (userId) => (userId === (profile === null || profile === void 0 ? void 0 : profile.id) ? "right" : "left");
    return (<div className={`group/layouts fixed bottom-5 ${floatingLiveChatEnabled ? "right-20" : "right-5"} ${open ? "z-50" : "z-40"}`}>
      {/* Support Button */}
      <Tooltip_1.Tooltip content={t("Live Chat")}>
        <button name="supportChatToggle" aria-label="Support Chat" type="button" className={`flex items-center rounded-lg border border-muted-200 bg-white p-3 text-start shadow-lg shadow-muted-300/30 transition-all duration-300 hover:border-primary-500 dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/30 dark:hover:border-info-500 ${open
            ? "pointer-events-none translate-y-full opacity-0"
            : "pointer-events-auto translate-y-0 opacity-100"}`} onClick={toggleOpen}>
          <react_2.Icon icon="ph:chat-teardrop-text" className="h-6 w-6 shrink-0 text-muted-400 transition-colors duration-300 group-hover/layouts:text-info-500"/>
        </button>
      </Tooltip_1.Tooltip>

      {/* Chat Panel */}
      <div className={`fixed bottom-5 right-5 z-1000 h-[420px] w-[300px] max-w-[90%] overflow-hidden rounded-lg border border-muted-200 bg-white shadow-lg shadow-muted-300/30 transition-all duration-300 hover:border-info-500 dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/30 dark:hover:border-info-500 ${open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0"}`}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-muted-200 px-4 dark:border-muted-800">
          <h3 className="font-sans font-medium text-muted-800 dark:text-muted-100 text-lg">
            {t("Support Chat")}
          </h3>
          <button type="button" aria-label="Close Support Chat" className="flex h-8 w-8 items-center justify-center rounded-full bg-muted-100 transition-colors duration-300 hover:bg-muted-200 dark:bg-muted-800 dark:hover:bg-muted-700" onClick={toggleOpen}>
            <react_2.Icon icon="lucide:x" className="h-4 w-4 text-muted-500 dark:text-muted-200"/>
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex flex-col h-full">
          <Chat_1.Chat messages={(ticket === null || ticket === void 0 ? void 0 : ticket.messages) || []} handleFileUpload={handleFileUpload} messageSide={messageSide} user1={ticket === null || ticket === void 0 ? void 0 : ticket.user} user2={ticket === null || ticket === void 0 ? void 0 : ticket.agent} reply={replyToTicket} isReplying={isReplying} canReply={true} floating={true}/>
        </div>
      </div>
    </div>);
};
exports.default = FloatingLiveChat;
