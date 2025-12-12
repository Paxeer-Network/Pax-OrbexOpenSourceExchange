"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatePicker_1 = __importDefault(require("@/components/elements/form/datepicker/DatePicker"));
const InputFile_1 = __importDefault(require("@/components/elements/form/input-file/InputFile"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const ToggleSwitch_1 = __importDefault(require("@/components/elements/form/toggle-switch/ToggleSwitch"));
const dashboard_1 = require("@/stores/dashboard");
const RenderField = ({ field, formData, handleInputChange, handleFileChange, isDark, }) => {
    const commonProps = {
        label: field.label,
        placeholder: field.placeholder,
        name: field.name,
    };
    if (field.showIf && !field.showIf(formData)) {
        return null;
    }
    switch (field.type) {
        case "select":
            const selectedValue = formData[field.name];
            const preview = field.preview && selectedValue
                ? field.preview[isDark ? "dark" : "light"][selectedValue]
                : null;
            return (<div className="col-span-12">
          <Select_1.default {...commonProps} value={selectedValue || ""} options={field.options || []} onChange={(e) => handleInputChange({ name: field.name, value: e.target.value })} className="w-full min-w-48"/>
          <span className="text-xs text-muted-400">{field.description}</span>
          {preview && (<div className="w-full min-w-[200px] md:min-w-[400px]">
              <img src={preview} alt={`${field.label} Preview`} className="w-full max-h-[300px] object-contain rounded-lg border border-muted-300 dark:border-muted-800 hover:border-primary-500 transition-all duration-300 dark:hover:border-primary-400"/>
            </div>)}
        </div>);
        case "date":
            return (<div className="col-span-12">
          <DatePicker_1.default {...commonProps} value={formData[field.name] || new Date()} onChange={(e) => handleInputChange({
                    name: field.name,
                    value: new Date(e.target.value),
                })}/>
          <span className="text-xs text-muted-400">{field.description}</span>
        </div>);
        case "switch":
            const value = typeof formData[field.name] === "boolean"
                ? formData[field.name]
                : formData[field.name] === "true"
                    ? true
                    : false;
            return (<div className="col-span-12">
          <ToggleSwitch_1.default {...commonProps} checked={value} sublabel={field.description} color={"success"} onChange={(e) => handleInputChange({
                    name: field.name,
                    value: e.target.checked,
                    save: true,
                })}/>
        </div>);
        case "file":
            return (<div className="col-span-12">
          <InputFile_1.default color={"contrast"} id={field.name} acceptedFileTypes={[
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                    "image/gif",
                    "image/svg+xml",
                    "image/webp",
                ]} preview={formData[field.name] || ""} previewPlaceholder="/img/placeholder.svg" maxFileSize={16} label={`${field.label}`} labelAlt={`Size: ${field.size.width}x${field.size.height}px, Max File Size: 16 MB`} bordered onChange={(files) => handleFileChange(files, field)} onRemoveFile={() => handleInputChange({ name: field.name, value: null, save: true })}/>
        </div>);
        default:
            return (<div className="col-span-12">
          <Input_1.default {...commonProps} type={field.type} min={field.min} max={field.max} step={field.step} value={formData[field.name] || ""} onChange={(e) => handleInputChange({
                    name: field.name,
                    value: e.target.value,
                })}/>
        </div>);
    }
};
const RenderFieldWrapper = (props) => {
    const { isDark } = (0, dashboard_1.useDashboardStore)(); // Move hook call to a wrapper
    return <RenderField {...props} isDark={isDark} key={props.field.name}/>;
};
exports.default = RenderFieldWrapper;
