"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeInfo = void 0;
const react_1 = require("react");
const ListWidgetItem_1 = __importDefault(require("@/components/widgets/ListWidgetItem"));
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const lodash_1 = require("lodash");
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@iconify/react");
const trade_1 = __importDefault(require("@/stores/user/p2p/trade"));
const next_i18next_1 = require("next-i18next");
const TradeInfoBase = () => {
    var _a, _b, _c, _d;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { trade, isSeller } = (0, trade_1.default)();
    const disputeStatus = {
        PENDING: {
            icon: "ph:circle-duotone",
            className: "bg-warning-500/10",
            iconClasses: "text-warning-500",
        },
        IN_PROGRESS: {
            icon: "ph:circle-duotone",
            className: "bg-info-500/10",
            iconClasses: "text-info-500",
        },
        RESOLVED: {
            icon: "ph:circle-duotone",
            className: "bg-success-500/10",
            iconClasses: "text-success-500",
        },
        CANCELLED: {
            icon: "ph:circle-duotone",
            className: "bg-danger-500/10",
            iconClasses: "text-danger-500",
        },
    };
    const statusIcons = {
        PENDING: {
            icon: "ph:circle-duotone",
            className: "bg-warning-500/10",
            iconClasses: "text-warning-500",
        },
        PAID: {
            icon: "ph:circle-duotone",
            className: "bg-info-500/10",
            iconClasses: "text-info-500",
        },
        DISPUTE_OPEN: {
            icon: "ph:circle-duotone",
            className: "bg-danger-500/10",
            iconClasses: "text-danger-500",
        },
        ESCROW_REVIEW: {
            icon: "ph:circle-duotone",
            className: "bg-info-500/10",
            iconClasses: "text-info-500",
        },
        CANCELLED: {
            icon: "ph:circle-duotone",
            className: "bg-danger-500/10",
            iconClasses: "text-danger-500",
        },
        COMPLETED: {
            icon: "ph:circle-duotone",
            className: "bg-success-500/10",
            iconClasses: "text-success-500",
        },
        REFUNDED: {
            icon: "ph:circle-duotone",
            className: "bg-secondary-500/10",
            iconClasses: "text-secondary-500",
        },
    };
    // Function to get icon configuration based on status
    const getIconConfig = (status) => {
        return statusIcons[status] || statusIcons["PENDING"]; // Default to PENDING if status is undefined
    };
    return (<>
      <div className="border-b-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
        <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
          {t("Payment Method")}
        </h4>

        <ul className="relative">
          <li>
            <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:calendar-duotone" className="h-8! w-8! rounded-lg! bg-success-500/10" iconClasses="h-5! w-5! text-success-500"/>} title={t("Method")} text={(trade === null || trade === void 0 ? void 0 : trade.offer.paymentMethod.name) || "Loading..."} itemAction={<></>}/>
            <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:calendar-duotone" className="h-8! w-8! rounded-lg! bg-success-500/10" iconClasses="h-5! w-5! text-success-500"/>} title={t("Currency")} text={(trade === null || trade === void 0 ? void 0 : trade.offer.currency) || "Loading..."} itemAction={<></>}/>
            {(trade === null || trade === void 0 ? void 0 : trade.offer.paymentMethod.chain) && (<ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:calendar-duotone" className="h-8! w-8! rounded-lg! bg-success-500/10" iconClasses="h-5! w-5! text-success-500"/>} title={t("Chain")} text={(trade === null || trade === void 0 ? void 0 : trade.offer.paymentMethod.chain) || "Loading..."} itemAction={<></>}/>)}
            <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:timer-duotone" className="h-8! w-8! rounded-lg! bg-success-500/10" iconClasses="h-5! w-5! text-success-500"/>} title={t("Instructions")} text={(trade === null || trade === void 0 ? void 0 : trade.offer.paymentMethod.instructions) || "Loading..."} itemAction={<></>}/>
          </li>
        </ul>
      </div>
      <div className="p-6">
        <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
          {t("Summary")}
        </h4>

        <ul className="relative">
          <li>
            <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:timer-duotone" className="h-8! w-8! rounded-lg! bg-success-500/10" iconClasses="h-5! w-5! text-success-500"/>} title={t("Transaction Hash")} text={(trade === null || trade === void 0 ? void 0 : trade.txHash) || "Not provided by buyer yet..."} itemAction={<></>}/>
            {isSeller && (<ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:envelope-duotone" className="h-8! w-8! rounded-lg! bg-info-500/10" iconClasses="h-5! w-5! text-info-500"/>} title={t("Email")} text={((_a = trade === null || trade === void 0 ? void 0 : trade.user) === null || _a === void 0 ? void 0 : _a.email) || "Loading..."} itemAction={<link_1.default href={`mailto:${(_b = trade === null || trade === void 0 ? void 0 : trade.user) === null || _b === void 0 ? void 0 : _b.email}`} className="cursor-pointer text-muted-400 transition-colors duration-300 hover:text-primary-500">
                    <react_2.Icon icon="lucide:arrow-right"/>
                  </link_1.default>}/>)}
            <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default {...getIconConfig(trade === null || trade === void 0 ? void 0 : trade.status.toUpperCase())} className="h-8! w-8! rounded-lg!"/>} title={t("Status")} text={`${(0, lodash_1.capitalize)(trade === null || trade === void 0 ? void 0 : trade.status) || "Loading..."}`} itemAction={<></>}/>
            <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:info-duotone" className="h-8! w-8! rounded-lg! bg-primary-500/10" iconClasses="h-5! w-5! text-primary-500"/>} title={t("You are the")} text={isSeller ? t("Seller") : t("Buyer")} itemAction={<></>}/>
          </li>
        </ul>
      </div>

      {(trade === null || trade === void 0 ? void 0 : trade.p2pDisputes[0]) && (<div className="border-t-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
          <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
            {t("Dispute")}
          </h4>

          <ul className="relative">
            <li>
              <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default {...getIconConfig(trade === null || trade === void 0 ? void 0 : trade.p2pDisputes[0].status.toUpperCase())} className="h-8! w-8! rounded-lg!"/>} title={t("Status")} text={`${(0, lodash_1.capitalize)(trade === null || trade === void 0 ? void 0 : trade.p2pDisputes[0].status) || "Loading..."}`} itemAction={<></>}/>
              <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:calendar-duotone" className="h-8! w-8! rounded-lg! bg-success-500/10" iconClasses="h-5! w-5! text-success-500"/>} title={t("Raised by")} text={`${(_c = trade === null || trade === void 0 ? void 0 : trade.p2pDisputes[0].raisedBy) === null || _c === void 0 ? void 0 : _c.firstName} ${(_d = trade === null || trade === void 0 ? void 0 : trade.p2pDisputes[0].raisedBy) === null || _d === void 0 ? void 0 : _d.lastName}`} itemAction={<></>}/>
              <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:calendar-duotone" className="h-8! w-8! rounded-lg! bg-success-500/10" iconClasses="h-5! w-5! text-success-500"/>} title={t("Reason")} text={(trade === null || trade === void 0 ? void 0 : trade.p2pDisputes[0].reason) || "Not provided by buyer yet..."} itemAction={<></>}/>
              <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:calendar-duotone" className="h-8! w-8! rounded-lg! bg-success-500/10" iconClasses="h-5! w-5! text-success-500"/>} title={t("Resolution")} text={(trade === null || trade === void 0 ? void 0 : trade.p2pDisputes[0].resolution) ||
                "Not provided by buyer yet..."} itemAction={<></>}/>
            </li>
          </ul>
        </div>)}
    </>);
};
exports.TradeInfo = (0, react_1.memo)(TradeInfoBase);
