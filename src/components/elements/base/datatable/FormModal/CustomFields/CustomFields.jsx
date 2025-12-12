"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFields = void 0;
const react_1 = require("react");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const ToggleSwitch_1 = __importDefault(require("@/components/elements/form/toggle-switch/ToggleSwitch"));
const IconButton_1 = __importDefault(require("../../../button-icon/IconButton"));
const react_2 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const CustomFieldsBase = ({ value = [], onFieldsChange, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [customFields, setCustomFields] = (0, react_1.useState)(value);
    (0, react_1.useEffect)(() => {
        if (Array.isArray(value)) {
            setCustomFields(value);
        }
    }, [value]);
    const addField = () => {
        const newField = {
            title: "",
            type: "input",
            required: false,
        };
        const updatedFields = [...customFields, newField];
        setCustomFields(updatedFields);
        onFieldsChange === null || onFieldsChange === void 0 ? void 0 : onFieldsChange(updatedFields);
    };
    const updateField = (index, field, value) => {
        const newFields = [...customFields];
        newFields[index] = { ...newFields[index], [field]: value };
        setCustomFields(newFields);
        onFieldsChange === null || onFieldsChange === void 0 ? void 0 : onFieldsChange(newFields);
    };
    const removeField = (index) => {
        const newFields = [...customFields];
        newFields.splice(index, 1);
        setCustomFields(newFields);
        onFieldsChange === null || onFieldsChange === void 0 ? void 0 : onFieldsChange(newFields);
    };
    return (<div className="card-dashed space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm text-muted-400 dark:text-muted-600">
          {t("Custom Fields")}
        </label>
        <IconButton_1.default variant="pastel" color="success" onClick={addField} className="flex items-center" size={"sm"}>
          <react_2.Icon icon="ph:plus" className="h-5 w-5"/>
        </IconButton_1.default>
      </div>
      {Array.isArray(customFields) &&
            customFields.map((field, index) => (<div key={index} className="flex gap-4">
            <Input_1.default type="text" placeholder={t("Field Name")} value={field.title} onChange={(e) => updateField(index, "title", e.target.value)}/>
            <Select_1.default value={field.type} options={[
                    { value: "input", label: "Input" },
                    { value: "textarea", label: "Textarea" },
                ]} onChange={(e) => updateField(index, "type", e.target.value)}/>
            <ToggleSwitch_1.default id={`required-${index}`} label={t("Required")} color="primary" checked={field.required} onChange={(e) => updateField(index, "required", e.target.checked)}/>
            <IconButton_1.default variant="pastel" color="danger" onClick={() => removeField(index)}>
              <react_2.Icon icon="ph:x" className="h-5 w-5"/>
            </IconButton_1.default>
          </div>))}
    </div>);
};
exports.CustomFields = CustomFieldsBase;
