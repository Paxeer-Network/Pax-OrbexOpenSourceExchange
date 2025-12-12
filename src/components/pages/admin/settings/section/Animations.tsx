import { useTranslation } from "next-i18next";
import Button from "@/components/elements/base/button/Button";
import renderField from "../RenderField";
import { Lottie } from "@/components/elements/base/lottie";
import { lottiesConfig } from "@/utils/animations";

const animationsFields = [
  {
    name: "lottieAnimationStatus",
    label: "Enable Lottie Animations",
    placeholder: "Enable or disable",
    description:
      "Toggle the display of Lottie animated images in the application.",
    type: "switch",
    defaultValue: true,
  },
];

const AnimationsSection = ({
  formData,
  handleInputChange,
  handleFileChange,
  handleCancel,
  handleSave,
  hasChanges,
  isLoading,
}: {
  formData: any;
  handleInputChange: (params: { name: string; value: any }) => void;
  handleFileChange: (files: FileList, field: any) => Promise<void>;
  handleCancel: () => void;
  handleSave: () => Promise<void>;
  hasChanges: boolean;
  isLoading: boolean;
}) => {
  const { t } = useTranslation();

  const renderLottieField = (config: any) => {
    const enabledName = `${config.name}Enabled`;
    const isEnabled =
      typeof formData[enabledName] === "undefined"
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
    } else {
      if (typeof max === "function") max = max(formData);
    }

    return (
      <div
        key={config.name}
        className="col-span-12 flex flex-col space-y-4 border-b border-muted-200 dark:border-muted-800 pb-4"
      >
        <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
          {renderField({
            field: switchField,
            formData,
            handleInputChange,
          })}
        </div>

        <div
          className={`${isEnabled ? "block" : "hidden"} flex justify-center`}
        >
          <Lottie
            category={category}
            path={path}
            max={max}
            height={height}
            classNames={`mx-auto `}
          />
        </div>

        <div className={`${!isEnabled ? "block" : "hidden"}`}>
          {renderField({
            field: {
              name: `${config.name}File`,
              label: `${config.label} Alternative Image`,
              type: "file",
              description:
                "Upload your own image to replace the lottie animation",
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
      </div>
    );
  };

  return (
    <div className="mt-4 grid w-full grid-cols-12 gap-6">
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
            {animationsFields.map((field) =>
              renderField({ field, formData, handleInputChange })
            )}
          </div>

          {lottiesConfig.map((config) => renderLottieField(config))}

          {hasChanges && (
            <div className="col-span-12 flex justify-end space-x-4">
              <Button color="default" onClick={handleCancel}>
                {t("Cancel")}
              </Button>
              <Button color="primary" onClick={handleSave} loading={isLoading}>
                {t("Save Changes")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimationsSection;
