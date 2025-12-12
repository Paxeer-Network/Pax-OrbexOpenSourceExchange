"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const next_i18next_1 = require("next-i18next");
const RenderField_1 = __importDefault(require("../RenderField"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const socialFields = [
    {
        name: "facebookLink",
        label: "Facebook Link",
        placeholder: "Enter Facebook link",
        type: "url",
    },
    {
        name: "twitterLink",
        label: "Twitter Link",
        placeholder: "Enter Twitter link",
        type: "url",
    },
    {
        name: "instagramLink",
        label: "Instagram Link",
        placeholder: "Enter Instagram link",
        type: "url",
    },
    {
        name: "linkedinLink",
        label: "LinkedIn Link",
        placeholder: "Enter LinkedIn link",
        type: "url",
    },
    {
        name: "telegramLink",
        label: "Telegram Link",
        placeholder: "Enter Telegram link",
        type: "url",
    },
];
const SocialLinksSection = ({ formData, handleInputChange, handleCancel, handleSave, hasChanges, isLoading, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="mt-4 grid w-full grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 ltablet:col-span-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium tracking-wide text-muted-800 dark:text-muted-100">
            {t("Social Links")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t("Manage social media links for the footer.")}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 ltablet:col-span-7">
        <div className="lg:max-w-xl">
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
            {socialFields.map((field) => (0, RenderField_1.default)({ field, formData, handleInputChange }))}
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
exports.default = SocialLinksSection;
