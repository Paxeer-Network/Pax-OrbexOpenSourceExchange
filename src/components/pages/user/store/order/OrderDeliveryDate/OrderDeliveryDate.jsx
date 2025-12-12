"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDeliveryDate = void 0;
const react_1 = require("react");
const ListWidgetItem_1 = __importDefault(require("@/components/widgets/ListWidgetItem"));
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const date_fns_1 = require("date-fns");
const next_i18next_1 = require("next-i18next");
const OrderDeliveryDateBase = ({ shipping }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<li>
      <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:truck-duotone" className="h-8! w-8! rounded-lg! bg-success-500/10" iconClasses="h-5! w-5! text-success-500"/>} title={t("Estimated Delivery")} text={shipping.deliveryDate
            ? (0, date_fns_1.formatDate)(new Date(shipping.deliveryDate), "dd MMM yyyy")
            : "Pending"} itemAction={<></>}/>
    </li>);
};
exports.OrderDeliveryDate = (0, react_1.memo)(OrderDeliveryDateBase);
