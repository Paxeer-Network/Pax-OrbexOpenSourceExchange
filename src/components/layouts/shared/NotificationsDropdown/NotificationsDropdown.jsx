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
exports.NotificationsDropdown = void 0;
const react_1 = __importStar(require("react"));
const NotificationTabs_1 = __importDefault(require("@/components/layouts/shared/NotificationsDropdown/NotificationTabs"));
const panel_1 = require("@/components/elements/base/panel");
const react_2 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const dashboard_1 = require("@/stores/dashboard");
const NotificationsDropdownBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [isPanelOpened, setIsPanelOpened] = (0, react_1.useState)(false);
    const { notifications } = (0, dashboard_1.useDashboardStore)();
    const categories = {
        activity: notifications.filter((notification) => notification.type.toLowerCase() === "activity"),
        system: notifications.filter((notification) => notification.type.toLowerCase() === "system"),
        security: notifications.filter((notification) => notification.type.toLowerCase() === "security"),
    };
    const hasNotifications = Object.values(categories).some((category) => category.length > 0);
    return (<>
      <div className="group relative text-start">
        {hasNotifications && (<span className="absolute right-0.5 top-0.5 z-2 block h-2 w-2 rounded-full bg-primary-500 "></span>)}
        <button type="button" name="notificationsDropdownToggle" aria-label="Notifications dropdown" className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 rotate-0" onClick={() => setIsPanelOpened(!isPanelOpened)}>
          <react_2.Icon icon="ph:bell-duotone" className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"/>
        </button>
      </div>

      <panel_1.Panel side="top" isOpen={!!isPanelOpened} title={t("Notifications")} size="xl" onClose={() => setIsPanelOpened(false)}>
        <NotificationTabs_1.default shape="rounded-sm"/>
      </panel_1.Panel>
    </>);
};
exports.NotificationsDropdown = NotificationsDropdownBase;
