"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderPanels = void 0;
const react_1 = require("react");
const FixedPanel_1 = __importDefault(require("@/components/elements/base/panel/FixedPanel"));
const Locales_1 = require("../Locales");
const Announcements_1 = require("../Announcements");
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const HeaderPanelsBase = ({}) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { panels } = (0, dashboard_1.useDashboardStore)();
    return (<>
      <FixedPanel_1.default title={t("Languages")} name="locales">
        {panels["locales"] && <Locales_1.Locales />}
      </FixedPanel_1.default>

      <FixedPanel_1.default title={t("Announcements")} name="announcements">
        {panels["announcements"] && <Announcements_1.Announcements />}
      </FixedPanel_1.default>
    </>);
};
exports.HeaderPanels = (0, react_1.memo)(HeaderPanelsBase);
