"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFields = void 0;
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const ToggleSwitch_1 = __importDefault(require("@/components/elements/form/toggle-switch/ToggleSwitch"));
const next_i18next_1 = require("next-i18next");
const CustomFieldsBase = ({ value = [] }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="card-dashed space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm text-muted-400 dark:text-muted-600">
          {t("Custom Fields")}
        </label>
      </div>
      {value === null || value === void 0 ? void 0 : value.map((field, index) => (<div key={index} className="flex gap-4">
          <Input_1.default type="text" placeholder={t("Field Name")} value={field.title} readOnly={true}/>
          <Input_1.default type="text" placeholder={t("Field Type")} value={field.type} readOnly={true}/>
          <ToggleSwitch_1.default id={`required-${index}`} label={t("Required")} color="primary" checked={field.required}/>
        </div>))}
    </div>);
};
exports.CustomFields = CustomFieldsBase;
