"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketInformation = void 0;
const react_1 = require("react");
const ListWidgetItem_1 = __importDefault(require("@/components/widgets/ListWidgetItem"));
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const lodash_1 = require("lodash");
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@iconify/react");
const date_fns_1 = require("date-fns");
const support_1 = __importDefault(require("@/stores/user/support"));
const next_i18next_1 = require("next-i18next");
const TicketInformationBase = () => {
    var _a, _b;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { ticket, isSupport } = (0, support_1.default)();
    // Mapping for icon configurations based on the ticket status
    const statusIcons = {
        PENDING: {
            icon: "ph:circle-duotone",
            className: "bg-warning-500/10",
            iconClasses: "text-warning-500",
        },
        OPEN: {
            icon: "ph:circle-duotone",
            className: "bg-info-500/10",
            iconClasses: "text-info-500",
        },
        REPLIED: {
            icon: "ph:circle-duotone",
            className: "bg-primary-500/10",
            iconClasses: "text-primary-500",
        },
        CLOSED: {
            icon: "ph:check-circle-duotone",
            className: "bg-success-500/10",
            iconClasses: "text-success-500",
        },
    };
    // Function to get icon configuration based on status
    const getIconConfig = (status) => {
        return statusIcons[status] || statusIcons["PENDING"]; // Default to PENDING if status is undefined
    };
    return (<div className="border-b-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
      <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
        {t("Information")}
      </h4>

      <ul className="relative">
        <li>
          <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:credit-card-duotone" className="h-8! w-8! rounded-lg! bg-primary-500/10" iconClasses="h-5! w-5! text-primary-500"/>} title={t("Ticket ID")} text={(ticket === null || ticket === void 0 ? void 0 : ticket.id) || "Loading..."} itemAction={<></>}/>
          <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:timer-duotone" className="h-8! w-8! rounded-lg! bg-success-500/10" iconClasses="h-5! w-5! text-success-500"/>} title={t("Priority")} text={(0, lodash_1.capitalize)(ticket === null || ticket === void 0 ? void 0 : ticket.importance) || "Loading..."} itemAction={<></>}/>
          {isSupport && (<ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:envelope-duotone" className="h-8! w-8! rounded-lg! bg-info-500/10" iconClasses="h-5! w-5! text-info-500"/>} title={t("Email")} text={((_a = ticket === null || ticket === void 0 ? void 0 : ticket.user) === null || _a === void 0 ? void 0 : _a.email) || "Loading..."} itemAction={<link_1.default href={`mailto:${(_b = ticket === null || ticket === void 0 ? void 0 : ticket.user) === null || _b === void 0 ? void 0 : _b.email}`} className="cursor-pointer text-muted-400 transition-colors duration-300 hover:text-primary-500">
                  <react_2.Icon icon="lucide:arrow-right"/>
                </link_1.default>}/>)}
          <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default {...getIconConfig(ticket === null || ticket === void 0 ? void 0 : ticket.status.toUpperCase())} className="h-8! w-8! rounded-lg!"/>} title={t("Status")} text={`${(0, lodash_1.capitalize)(ticket === null || ticket === void 0 ? void 0 : ticket.status) || "Loading..."} ${(0, date_fns_1.formatDate)(new Date((ticket === null || ticket === void 0 ? void 0 : ticket.updatedAt) || new Date()), "MMM dd, yyyy h:mm a")}`} itemAction={<></>}/>
        </li>
      </ul>
    </div>);
};
exports.TicketInformation = (0, react_1.memo)(TicketInformationBase);
