"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_i18next_1 = require("next-i18next");
const RenderField_1 = __importDefault(require("../RenderField"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const mlmFields = [
    {
        name: "referralApprovalRequired",
        label: "Referral Approval Required",
        type: "switch",
    },
    {
        name: "mlmSystem",
        label: "MLM System",
        placeholder: "Select MLM system",
        type: "select",
        options: [
            { label: "DIRECT", value: "DIRECT" },
            { label: "BINARY", value: "BINARY" },
            { label: "UNILEVEL", value: "UNILEVEL" },
        ],
    },
    {
        name: "binaryLevels",
        label: "Binary Levels",
        placeholder: "Enter binary levels",
        type: "number",
        min: 2,
        max: 7,
        step: 1,
        showIf: (formData) => formData.mlmSystem === "BINARY",
    },
    {
        name: "unilevelLevels",
        label: "Unilevel Levels",
        placeholder: "Enter unilevel levels",
        type: "number",
        min: 2,
        max: 7,
        step: 1,
        showIf: (formData) => formData.mlmSystem === "UNILEVEL",
    },
];
const AffiliateSection = ({ formData, handleInputChange, handleCancel, handleSave, hasChanges, isLoading, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="mt-4 grid w-full grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 ltablet:col-span-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium tracking-wide text-muted-800 dark:text-muted-100">
            {t("Affiliate")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t("Manage Affiliate-related settings and restrictions.")}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 ltablet:col-span-7">
        <div className="lg:max-w-xl">
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
            {mlmFields.map((field) => (0, RenderField_1.default)({ field, formData, handleInputChange }))}
            {formData.mlmSystem === "BINARY" && (<div className="col-span-12">
                <h4 className="text-md font-medium text-muted-800 dark:text-muted-100">
                  {t("Binary Levels")}
                </h4>
                {/* render inputs up to number of levels of this type */}
                <div className="grid grid-cols-12 gap-6">
                  {[...Array(Number(formData.binaryLevels || 1))].map((_, i) => (<div className="col-span-12 md:col-span-6" key={i}>
                        <Input_1.default label={`Level ${i + 1} Percentage`} placeholder="0" type="number" min={0} max={100} value={formData[`binaryLevel${i + 1}`] || ""} onChange={(e) => handleInputChange({
                    name: `binaryLevel${i + 1}`,
                    value: e.target.value,
                })}/>
                      </div>))}
                </div>
              </div>)}
            {formData.mlmSystem === "UNILEVEL" && (<div className="col-span-12">
                <h4 className="text-md font-medium text-muted-800 dark:text-muted-100">
                  {t("Unilevel Levels")}
                </h4>
                {/* render inputs up to number of levels of this type */}
                <div className="grid grid-cols-12 gap-6">
                  {[...Array(Number(formData.unilevelLevels || 1))].map((_, i) => (<div className="col-span-12 md:col-span-6" key={i}>
                        <Input_1.default label={`Level ${i + 1} Percentage`} placeholder="0" type="number" min={0} max={100} value={formData[`unilevelLevel${i + 1}`] || ""} onChange={(e) => handleInputChange({
                    name: `unilevelLevel${i + 1}`,
                    value: e.target.value,
                })}/>
                      </div>))}
                </div>
              </div>)}
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
exports.default = AffiliateSection;
