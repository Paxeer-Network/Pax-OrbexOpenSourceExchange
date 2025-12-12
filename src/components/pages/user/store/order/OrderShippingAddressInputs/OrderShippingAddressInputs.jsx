"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderShippingAddressInputs = void 0;
const react_1 = require("react");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const next_i18next_1 = require("next-i18next");
const OrderShippingAddressInputsBase = ({ shippingAddress, handleInputChange, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input_1.default label={t("Name")} name="name" type="text" value={shippingAddress.name} onChange={handleInputChange}/>
      <Input_1.default label={t("Email")} name="email" type="text" value={shippingAddress.email} onChange={handleInputChange}/>
      <Input_1.default label={t("Phone")} name="phone" type="text" value={shippingAddress.phone} onChange={handleInputChange}/>
      <Input_1.default label={t("Street")} name="street" type="text" value={shippingAddress.street} onChange={handleInputChange}/>
      <Input_1.default label={t("City")} name="city" type="text" value={shippingAddress.city} onChange={handleInputChange}/>
      <Input_1.default label={t("State")} name="state" type="text" value={shippingAddress.state} onChange={handleInputChange}/>
      <Input_1.default label={t("Country")} name="country" type="text" value={shippingAddress.country} onChange={handleInputChange}/>
      <Input_1.default label={t("Postal Code")} name="postalCode" type="text" value={shippingAddress.postalCode} onChange={handleInputChange}/>
    </div>);
};
exports.OrderShippingAddressInputs = (0, react_1.memo)(OrderShippingAddressInputsBase);
