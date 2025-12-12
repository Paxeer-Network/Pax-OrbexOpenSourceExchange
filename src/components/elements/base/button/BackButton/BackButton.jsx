"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackButton = void 0;
const react_1 = require("react");
const ButtonLink_1 = __importDefault(require("../../button-link/ButtonLink"));
const react_2 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const BackButtonBase = ({ href, size = "md", children }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<ButtonLink_1.default href={href} shape="rounded" color="muted" size={size}>
      <react_2.Icon icon="line-md:chevron-left" className={`"h-4 w-4 ${!children && "mr-2"}"`}/>
      {children || t("Back")}
    </ButtonLink_1.default>);
};
exports.BackButton = (0, react_1.memo)(BackButtonBase);
