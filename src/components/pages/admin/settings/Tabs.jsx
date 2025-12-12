"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const next_i18next_1 = require("next-i18next");
const router_1 = require("next/router");
const Tab = ({ label, activeTab, setActiveTab, tabName, }) => {
    const router = (0, router_1.useRouter)();
    const handleTabClick = () => {
        setActiveTab(tabName);
        router.push({
            pathname: router.pathname,
            query: { ...router.query, tab: tabName.toLowerCase() },
        }, undefined, { shallow: true });
    };
    return (<button type="button" className={`shrink-0 border-b-2 px-6 py-2 text-sm transition-colors duration-300
          ${activeTab === tabName
            ? "border-primary-500 text-primary-500 dark:text-primary-400"
            : "border-transparent text-muted"}
        `} onClick={handleTabClick}>
      {label}
    </button>);
};
const Tabs = ({ mainTab, setMainTab }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="flex gap-2 border-b border-muted-200 dark:border-muted-800 overflow-x-auto">
      <Tab label={t("General")} activeTab={mainTab} setActiveTab={setMainTab} tabName="GENERAL"/>
      <Tab label={t("KYC Restrictions")} activeTab={mainTab} setActiveTab={setMainTab} tabName="RESTRICTIONS"/>
      <Tab label={t("Wallet")} activeTab={mainTab} setActiveTab={setMainTab} tabName="WALLET"/>
      <Tab label={t("Animations")} activeTab={mainTab} setActiveTab={setMainTab} tabName="ANIMATIONS"/>
      <Tab label={t("Logos")} activeTab={mainTab} setActiveTab={setMainTab} tabName="LOGOS"/>
      <Tab label={t("Investments")} activeTab={mainTab} setActiveTab={setMainTab} tabName="INVEST"/>
      <Tab label={t("P2P")} activeTab={mainTab} setActiveTab={setMainTab} tabName="P2P"/>
      <Tab label={t("Affiliate")} activeTab={mainTab} setActiveTab={setMainTab} tabName="AFFILIATE"/>
      <Tab label={t("Social")} activeTab={mainTab} setActiveTab={setMainTab} tabName="SOCIAL"/>
    </div>);
};
exports.default = Tabs;
