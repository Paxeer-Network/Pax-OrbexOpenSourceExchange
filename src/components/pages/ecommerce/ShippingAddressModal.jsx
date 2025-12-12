"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const react_1 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const ShippingAddressModal = ({ open, onClose, onSubmit, address, setAddress, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Modal_1.default open={open} size="lg">
      <Card_1.default shape="smooth">
        <div className="flex items-center justify-between p-4 md:p-6">
          <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
            {t("Shipping Address")}
          </p>
          <IconButton_1.default size="sm" shape="full" onClick={onClose}>
            <react_1.Icon icon="lucide:x" className="h-4 w-4"/>
          </IconButton_1.default>
        </div>
        <div className="p-4 md:px-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input_1.default type="text" label={t("Name")} placeholder={t("Enter your name")} value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })}/>
            <Input_1.default type="text" label={t("Email")} placeholder={t("Enter your email")} value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })}/>
            <Input_1.default type="text" label={t("Phone")} placeholder={t("Enter your phone number")} value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })}/>
            <Input_1.default type="text" label={t("Street")} placeholder={t("Enter your street address")} value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })}/>
            <Input_1.default type="text" label={t("City")} placeholder={t("Enter your city")} value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })}/>
            <Input_1.default type="text" label={t("State")} placeholder={t("Enter your state")} value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}/>
            <Input_1.default type="text" label={t("Postal Code")} placeholder={t("Enter your postal code")} value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}/>
            <Input_1.default type="text" label={t("Country")} placeholder={t("Enter your country")} value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })}/>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="flex w-full justify-end gap-2">
            <Button_1.default shape="smooth" onClick={onClose}>
              {t("Cancel")}
            </Button_1.default>
            <Button_1.default variant="solid" color="primary" shape="smooth" onClick={onSubmit}>
              {t("Confirm")}
            </Button_1.default>
          </div>
        </div>
      </Card_1.default>
    </Modal_1.default>);
};
exports.default = ShippingAddressModal;
