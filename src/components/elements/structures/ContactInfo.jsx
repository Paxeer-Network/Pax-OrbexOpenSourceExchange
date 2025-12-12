"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// components/ContactInfo.js
const react_1 = __importDefault(require("react"));
const ToggleSwitch_1 = __importDefault(require("@/components/elements/form/toggle-switch/ToggleSwitch"));
const Card_1 = __importDefault(require("../base/card/Card"));
const next_i18next_1 = require("next-i18next");
const ContactInfo = ({ field, data }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Card_1.default className="p-5 flex w-full gap-5 items-start justify-start mb-5">
      <ToggleSwitch_1.default label={t("Email Verified")} color="success" name={field.emailVerified.name} checked={data.emailVerified} disabled/>
    </Card_1.default>);
};
exports.default = ContactInfo;
