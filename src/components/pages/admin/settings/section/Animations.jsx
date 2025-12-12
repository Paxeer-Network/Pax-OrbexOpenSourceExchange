"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_i18next_1 = require("next-i18next");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const RenderField_1 = __importDefault(require("../RenderField"));
const lottie_1 = require("@/components/elements/base/lottie");
const animations_1 = require("@/utils/animations");
const animationsFields = [
    {
        name: "lottieAnimationStatus",
        label: "Enable Lottie Animations",
        placeholder: "Enable or disable",
        description: "Toggle the display of Lottie animated images in the application.",
        type: "switch",
        defaultValue: true,
    },
];
const AnimationsSection = ({ formData, handleInputChange, handleFileChange, handleCancel, handleSave, hasChanges, isLoading, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const renderLottieField = (config) => {
        const enabledName = `${config.name}Enabled`;
        const isEnabled = typeof formData[enabledName] === "undefined"
            ? true
            : String(formData[enabledName]) === "true";
        const switchField = {
            name: enabledName,
            label: config.label,
            placeholder: `Enable ${config.label}`,
            description: "Enable or disable this specific lottie animation",
            type: "switch",
            defaultValue: true,
        };
        let category = config.category;
        let path = config.path;
        let max = config.max;
        const height = 250;
        const maxWidth = config.maxWidth;
        const maxHeight = config.maxHeight;
        if (config.dynamic) {
            const isForex = formData.forexInvestment === "true";
            category = isForex ? "stock-market" : "cryptocurrency-2";
            path = isForex ? "stock-market-monitoring" : "analysis-1";
            max = isForex ? 2 : undefined;
        }
        else {
            if (typeof max === "function")
                max = max(formData);
        }
        return (<div key={config.name} className="col-span-12 flex flex-col space-y-4 border-b border-muted-200 dark:border-muted-800 pb-4">
        <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
          {(0, RenderField_1.default)({
                field: switchField,
                formData,
                handleInputChange,
            })}
        </div>

        <div className={`${isEnabled ? "block" : "hidden"} flex justify-center`}>
          <lottie_1.Lottie category={category} path={path} max={max} height={height} classNames={`mx-auto `}/>
        </div>

        <div className={`${!isEnabled ? "block" : "hidden"}`}>
          {(0, RenderField_1.default)({
                field: {
                    name: `${config.name}File`,
                    label: `${config.label} Alternative Image`,
                    type: "file",
                    description: "Upload your own image to replace the lottie animation",
                    dir: "lottie",
                    size: {
                        width: maxWidth,
                        height: maxHeight,
                        maxWidth,
                        maxHeight,
                    },
                },
                formData,
                handleInputChange,
                handleFileChange,
            })}
        </div>
      </div>);
    };
    return (<div className="mt-4 grid w-full grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 ltablet:col-span-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium tracking-wide text-muted-800 dark:text-muted-100">
            {t("Animations")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t("Manage Lottie animation settings and per-feature animations.")}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 ltablet:col-span-7">
        <div className="lg:max-w-xl space-y-8">
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
            {animationsFields.map((field) => (0, RenderField_1.default)({ field, formData, handleInputChange }))}
          </div>

          {animations_1.lottiesConfig.map((config) => renderLottieField(config))}

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
    </div>);
};
exports.default = AnimationsSection;
