"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_i18next_1 = require("next-i18next");
const RenderField_1 = __importDefault(require("../RenderField"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
const react_1 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const restrictionFields = [
    {
        name: "kycStatus",
        label: "Enable KYC",
        placeholder: "Enable or disable",
        description: "Toggle KYC verification for user accounts.",
        type: "switch",
    },
    {
        name: "tradeRestrictions",
        label: "Trade Restrictions",
        placeholder: "Select an option",
        description: "Restrict trading for clients with incomplete KYC",
        type: "switch",
    },
    {
        name: "binaryRestrictions",
        label: "Binary Restrictions",
        placeholder: "Select an option",
        description: "Restrict binary trading for clients with incomplete KYC",
        type: "switch",
    },
    {
        name: "forexRestrictions",
        label: "Forex Restrictions",
        placeholder: "Select an option",
        description: "Restrict forex trading for clients with incomplete KYC",
        type: "switch",
    },
    {
        name: "aiInvestmentRestrictions",
        label: "AI Investment Restrictions",
        placeholder: "Select an option",
        description: "Restrict AI investment for clients with incomplete KYC",
        type: "switch",
    },
    {
        name: "icoRestrictions",
        label: "ICO Restrictions",
        placeholder: "Select an option",
        description: "Restrict ICO investment for clients with incomplete KYC",
        type: "switch",
    },
    {
        name: "mlmRestrictions",
        label: "MLM Restrictions",
        placeholder: "Select an option",
        description: "Restrict MLM investment for clients with incomplete KYC",
        type: "switch",
    },
    {
        name: "walletRestrictions",
        label: "Wallet Restrictions",
        placeholder: "Select an option",
        description: "Restrict wallet usage for clients with incomplete KYC",
        type: "switch",
    },
    {
        name: "depositRestrictions",
        label: "Deposit Restrictions",
        placeholder: "Select an option",
        description: "Restrict deposits for clients with incomplete KYC",
        type: "switch",
    },
    {
        name: "transferRestrictions",
        label: "Transfer Restrictions",
        placeholder: "Select an option",
        description: "Restrict transfers for clients with incomplete KYC",
        type: "switch",
    },
    {
        name: "withdrawalRestrictions",
        label: "Withdrawal Restrictions",
        placeholder: "Select an option",
        description: "Restrict withdrawals for clients with incomplete KYC",
        type: "switch",
    },
    {
        name: "ecommerceRestrictions",
        label: "Ecommerce Restrictions",
        placeholder: "Select an option",
        description: "Restrict ecommerce for clients with incomplete KYC",
        type: "switch",
    },
    {
        name: "stakingRestrictions",
        label: "Staking Restrictions",
        placeholder: "Select an option",
        description: "Restrict staking for clients with incomplete KYC",
        type: "switch",
    },
];
const RestrictionsSection = ({ formData, handleInputChange, handleCancel, handleSave, hasChanges, isLoading, kycStatus, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="mt-4 grid w-full grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 ltablet:col-span-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium tracking-wide text-muted-800 dark:text-muted-100">
            {t("Restrictions")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t("Control client restrictions in the system depending on their KYC status.")}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 ltablet:col-span-7">
        <div className="lg:max-w-xl">
          {!kycStatus && (<div className="mb-4">
              <Alert_1.default color={"danger"} canClose={false}>
                <div className="flex items-center justify-start gap-4">
                  <react_1.Icon icon="mdi:alert" className="text-danger-500 h-7 w-7"/>
                  <div className="flex flex-col items-start w-full">
                    <h3>{t("Template Required")}</h3>
                    <span className="text-sm">
                      {t("Please set up a KYC template before configuring restrictions:")}{" "}
                      <link_1.default href="/admin/crm/kyc/template" className="text-primary-500 underline">
                        {t("KYC Templates")}
                      </link_1.default>
                    </span>
                  </div>
                </div>
              </Alert_1.default>
            </div>)}
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
            {restrictionFields.map((field) => (0, RenderField_1.default)({ field, formData, handleInputChange }))}
            {hasChanges && (<div className="col-span-12 flex justify-end space-x-4">
                <Button_1.default color="default" onClick={handleCancel}>
                  {t("Cancel")}
                </Button_1.default>
                <Button_1.default color="primary" onClick={handleSave} loading={isLoading}>
                  {t("Save Changes")}
                </Button_1.default>
              </div>)}
          </div>
        </div>
      </div>
    </div>);
};
exports.default = RestrictionsSection;
