"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormRenderer = void 0;
const datatable_1 = require("@/stores/datatable");
const react_1 = require("react");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const InputFileField_1 = __importDefault(require("@/components/elements/form/input-file-field/InputFileField"));
const InputFileProfile_1 = __importDefault(require("@/components/elements/form/input-file-profile/InputFileProfile"));
const ToggleSwitch_1 = __importDefault(require("@/components/elements/form/toggle-switch/ToggleSwitch"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const DatePicker_1 = __importDefault(require("@/components/elements/form/datepicker/DatePicker"));
const datatable_2 = require("@/utils/datatable");
const CustomFields_1 = require("../CustomFields");
const InputFile_1 = __importDefault(require("@/components/elements/form/input-file/InputFile"));
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const Button_1 = __importDefault(require("../../../button/Button"));
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const next_i18next_1 = require("next-i18next");
const FormRendererBase = ({ formValues, setFormValues }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { modalItem, modalAction, formErrors } = (0, datatable_1.useDataTable)((state) => state);
    const isNew = (modalAction === null || modalAction === void 0 ? void 0 : modalAction.topic) === "create";
    const [filePreviews, setFilePreviews] = (0, react_1.useState)({});
    const initializeValues = (0, react_1.useCallback)((formItems) => {
        const initialValues = {};
        const initialPreviews = {};
        if (isNew)
            return { initialValues, initialPreviews };
        const deepParseObject = (obj) => {
            if (typeof obj !== "object" || obj === null)
                return obj;
            const parsedObj = Array.isArray(obj) ? [] : {};
            for (const key in obj) {
                if (typeof obj[key] === "string" && key !== "customFields") {
                    try {
                        parsedObj[key] = (0, datatable_2.safeJSONParse)(obj[key]);
                    }
                    catch (error) {
                        parsedObj[key] = obj[key];
                    }
                }
                else {
                    parsedObj[key] = deepParseObject(obj[key]);
                }
            }
            return parsedObj;
        };
        const parsedModalItem = modalItem ? deepParseObject(modalItem) : {};
        const parseItemValue = (itemValue, formItem) => {
            switch (formItem.ts) {
                case "number":
                    itemValue = parseFloat(itemValue);
                    return isNaN(itemValue) ? formItem.defaultValue || 0 : itemValue;
                case "boolean":
                    return itemValue === true || itemValue === "true";
                case "object":
                    if (typeof itemValue === "string") {
                        try {
                            itemValue = (0, datatable_2.safeJSONParse)(itemValue);
                        }
                        catch (error) {
                            itemValue = {};
                        }
                    }
                    return itemValue || formItem.defaultValue || {};
                case "string":
                default:
                    return itemValue || formItem.defaultValue || null;
            }
        };
        const setInitialValue = (path, itemValue, formItem) => {
            if (path) {
                const value = parseItemValue(itemValue, formItem);
                (0, datatable_2.setNestedValue)(initialValues, path, value);
            }
        };
        const handleFileValue = (path, value) => {
            if (value instanceof File) {
                initialPreviews[path] = URL.createObjectURL(value);
            }
            else if (typeof value === "string") {
                initialPreviews[path] = value;
            }
        };
        const parseFormItems = (items, pathPrefix = "") => {
            if (!items)
                return;
            items.forEach((item) => {
                if (!item)
                    return;
                if (Array.isArray(item)) {
                    item.forEach((nestedItem) => parseFormItems([nestedItem], pathPrefix));
                    return;
                }
                const path = pathPrefix ? `${pathPrefix}.${item.name}` : item.name;
                let value;
                switch (item.type) {
                    case "tags":
                        value = parsedModalItem === null || parsedModalItem === void 0 ? void 0 : parsedModalItem[item.name];
                        break;
                    case "select":
                        value = parsedModalItem
                            ? (0, datatable_2.getNestedValue)(parsedModalItem, path)
                            : item.defaultValue;
                        if (item.multiple &&
                            item.structure &&
                            Array.isArray(parsedModalItem === null || parsedModalItem === void 0 ? void 0 : parsedModalItem[item.name])) {
                            value = (0, datatable_2.parseMultipleSelect)(parsedModalItem[item.name], item.structure);
                        }
                        break;
                    case "object":
                        value = parsedModalItem
                            ? (0, datatable_2.getNestedValue)(parsedModalItem, path)
                            : undefined;
                        if (typeof value === "string") {
                            value = (0, datatable_2.safeJSONParse)(value);
                        }
                        break;
                    case "file":
                        value = parsedModalItem
                            ? (0, datatable_2.getNestedValue)(parsedModalItem, path)
                            : undefined;
                        handleFileValue(path, value);
                        break;
                    case "customFields":
                        value = (parsedModalItem === null || parsedModalItem === void 0 ? void 0 : parsedModalItem.customFields) || item.defaultValue;
                        break;
                    default:
                        value = parsedModalItem
                            ? (0, datatable_2.getNestedValue)(parsedModalItem, path)
                            : undefined;
                        break;
                }
                setInitialValue(path, value, item);
                if (item.type === "object" && item.fields) {
                    parseFormItems(item.fields, path);
                }
                else if (Array.isArray(item.fields)) {
                    item.fields.forEach((subItem) => {
                        if (Array.isArray(subItem)) {
                            subItem.forEach((nestedSubItem) => parseFormItems([nestedSubItem], path));
                        }
                        else {
                            parseFormItems([subItem], path);
                        }
                    });
                }
            });
        };
        parseFormItems(formItems);
        return { initialValues, initialPreviews };
    }, [modalItem, isNew]);
    const { initialValues, initialPreviews } = (0, react_1.useMemo)(() => initializeValues(modalAction === null || modalAction === void 0 ? void 0 : modalAction.formItems), [initializeValues, modalAction === null || modalAction === void 0 ? void 0 : modalAction.formItems]);
    (0, react_1.useEffect)(() => {
        setFormValues((prevValues) => ({
            ...prevValues,
            ...initialValues,
        }));
        setFilePreviews(initialPreviews);
    }, [initialValues, initialPreviews, setFormValues]);
    const selectAllTags = (tagName, options) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [tagName]: [...options],
        }));
    };
    const clearAllTags = (tagName) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [tagName]: [],
        }));
    };
    const handleChange = (0, react_1.useCallback)((name, values, type, ts = "string", multiple = false) => {
        if (type === "file") {
            if (!values.length)
                return;
            const formItem = modalAction === null || modalAction === void 0 ? void 0 : modalAction.formItems.flat().find((item) => item.name === name);
            const { maxSize } = formItem;
            const maxSizeBytes = (maxSize ? maxSize : 16) * 1024 * 1024;
            const files = multiple ? Array.from(values) : [values[0]];
            files.forEach((file) => {
                if (maxSizeBytes && file.size > maxSizeBytes) {
                    alert(`File size should not exceed ${maxSize} MB`);
                    if (filePreviews[name]) {
                        URL.revokeObjectURL(filePreviews[name]);
                    }
                    return;
                }
                setFilePreviews((prev) => ({
                    ...prev,
                    [name]: URL.createObjectURL(file),
                }));
                setFormValues((prev) => ({
                    ...prev,
                    [name]: {
                        data: file,
                        width: formItem.width,
                        height: formItem.height,
                    },
                }));
            });
        }
        else {
            let formattedValue = values;
            switch (ts) {
                case "number":
                    const decimalPart = values.toString().split(".")[1];
                    if (decimalPart) {
                        const firstDecimalDigit = decimalPart[0];
                        const significantPart = decimalPart.slice(1);
                        if (!(firstDecimalDigit === "0" && !significantPart)) {
                            formattedValue = parseFloat(values);
                        }
                    }
                    else {
                        formattedValue = parseFloat(values);
                    }
                    break;
                case "boolean":
                    formattedValue = Boolean(values);
                    break;
                case "object":
                    formattedValue = values || {};
                    break;
                default:
                    formattedValue = values || null;
            }
            if (type === "select" && multiple) {
                return setFormValues((prevValues) => ({
                    ...prevValues,
                    [name]: values,
                }));
            }
            else if (type === "select") {
                return setFormValues((prevValues) => ({
                    ...prevValues,
                    [name]: values,
                }));
            }
            setFormValues((prevValues) => {
                const newValues = { ...prevValues };
                (0, datatable_2.setNestedValue)(newValues, name, formattedValue);
                return newValues;
            });
            // Update dependent fields based on the conditions
            if (modalAction === null || modalAction === void 0 ? void 0 : modalAction.formItems) {
                const formItems = modalAction.formItems.flat();
                formItems.forEach((item) => {
                    if (item.conditions && item.conditions[name]) {
                        const conditionValue = item.conditions[name][formattedValue];
                        setFormValues((prevValues) => ({
                            ...prevValues,
                            [item.name]: conditionValue,
                        }));
                    }
                });
            }
        }
    }, [setFormValues, filePreviews, modalAction === null || modalAction === void 0 ? void 0 : modalAction.formItems]);
    const renderFormField = (0, react_1.useCallback)((formItem, parentPath = "") => {
        if (!formItem)
            return null;
        const path = parentPath
            ? `${parentPath}.${formItem.name}`
            : formItem.name;
        const value = getFormItemValue(formItem, path);
        const error = (0, datatable_2.getNestedValue)(formErrors, path);
        const filePreview = filePreviews[path];
        if (formItem.notNull && !value) {
            return null;
        }
        if (formItem.condition &&
            !(0, datatable_2.evaluateCondition)(formItem.condition, formValues)) {
            return null;
        }
        const editable = (0, datatable_2.isEditable)(formItem.editable, formValues);
        // Update options based on conditions
        let options = formItem.options || [];
        let isDisabled = false;
        let defaultOptionLabel = t("Select an option");
        if (formItem.conditions) {
            const conditionKey = Object.keys(formItem.conditions)[0];
            const conditionValue = formValues[conditionKey];
            if (!conditionValue) {
                isDisabled = true;
                defaultOptionLabel = t(`Please select a ${conditionKey}`);
            }
            else {
                options = formItem.conditions[conditionKey][conditionValue] || [];
            }
        }
        // Add the default "Select an option" value
        if (options.length > 0 || isDisabled) {
            options = [{ value: null, label: defaultOptionLabel }, ...options];
        }
        const commonProps = {
            name: path,
            label: formItem.label,
            placeholder: formItem.placeholder,
            readOnly: !editable,
            disabled: !editable,
            onChange: (e) => handleChange(path, e.target.value, formItem.type, formItem.ts),
            setFirstErrorInputRef: (inputRef) => setFirstErrorInputRef(inputRef, error),
        };
        switch (formItem.type) {
            case "input":
                return (<Input_1.default key={path} value={value} {...commonProps} error={error} icon={formItem.icon} type={formItem.ts === "number" ? "number" : "text"} step={formItem.ts === "number" ? "any" : undefined}/>);
            case "select":
                return renderSelectField(formItem, path, value, error, commonProps, options, isDisabled, editable);
            case "datetime":
                return renderDateTimeField(formItem, path, value, error, commonProps);
            case "tags":
                return renderTagsField(formItem, value);
            case "file":
                return renderFileField(formItem, path, value, filePreview, error);
            case "switch":
                return renderSwitchField(formItem, path, value, error);
            case "textarea":
                return (<Textarea_1.default key={path} {...commonProps} value={value} error={error}/>);
            case "date":
                return <DatePicker_1.default key={path} {...commonProps} value={value}/>;
            case "customFields":
                return (<CustomFields_1.CustomFields key={path} value={typeof value === "string" ? (0, datatable_2.safeJSONParse)(value) : value || {}} onFieldsChange={(fields) => handleChange(path, fields, "customFields")}/>);
            case "object":
                return renderObjectField(formItem, path);
            default:
                return null;
        }
    }, [formValues, formErrors, filePreviews, handleChange]);
    const renderObjectField = (formItem, path) => (<div key={path} className={formItem.label &&
            "border p-4 rounded-md border-gray-300 dark:border-gray-600 border-dashed"}>
      {formItem.label && (<p className="text-sm text-muted-700 dark:text-muted-300 font-semibold mb-2">
          {t(formItem.label)}
        </p>)}
      <div className="mx-auto w-full space-y-4">
        {renderFormFields(formItem.fields, path)}
      </div>
    </div>);
    const renderSelectField = (formItem, path, value, error, commonProps, options, isDisabled, editable) => {
        if (formItem.multiple) {
            return (<div key={path}>
          <Listbox_1.default key={path} error={error} multiple disabled={!editable || isDisabled} selected={value} setSelected={(newSelected) => {
                    const updatedSelected = formItem.options.filter((option) => newSelected.some((sel) => sel.value === option.value));
                    handleChange(path, updatedSelected, formItem.type, formItem.ts, formItem.multiple);
                }} options={options}/>
          {error && <p className="text-danger-500 text-xs mt-2">{error}</p>}
        </div>);
        }
        else {
            return (<div key={path}>
          <Select_1.default {...commonProps} value={value} options={options} error={error} disabled={!editable || isDisabled} onChange={(e) => handleChange(path, e.target.value, formItem.type, formItem.ts)}/>
        </div>);
        }
    };
    const renderDateTimeField = (formItem, path, value, error, commonProps) => (<div key={path}>
      <DatePicker_1.default {...commonProps} value={value} onChange={(e) => handleChange(path, new Date(e.target.value), formItem.type)} icon="ion:calendar-outline" placeholder={t("Pick a date")}/>
      {error && <p className="text-danger-500 text-xs mt-2">{error}</p>}
    </div>);
    const renderTagsField = (formItem, value) => {
        const selectedCount = Array.isArray(value) ? value.length : 0;
        return (<div key={formItem.name} className="card-dashed">
        <div className="flex justify-between items-center mb-5">
          <div className="text-sm text-muted-400 dark:text-muted-600">
            {t("Selected")} {formItem.name}: {selectedCount}
          </div>
          <div className="flex gap-4">
            <Button_1.default color="success" size="sm" onClick={() => selectAllTags(formItem.name, formItem.options)}>
              {t("Select All")}
            </Button_1.default>
            <Button_1.default color="danger" size="sm" onClick={() => clearAllTags(formItem.name)}>
              {t("Clear All")}
            </Button_1.default>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formItem.options.map((item, index) => (<Checkbox_1.default key={index} label={item.name} checked={Array.isArray(value) &&
                    value.some((v) => Number(v.id) === Number(item.id))} color="success" onChange={() => {
                    setFormValues((prev) => {
                        const existingTags = Array.isArray(prev[formItem.name])
                            ? prev[formItem.name]
                            : [];
                        return existingTags.some((v) => Number(v.id) === Number(item.id))
                            ? {
                                ...prev,
                                [formItem.name]: existingTags.filter((v) => Number(v.id) !== Number(item.id)),
                            }
                            : { ...prev, [formItem.name]: [...existingTags, item] };
                    });
                }}/>))}
        </div>
      </div>);
    };
    const renderFileField = (formItem, path, value, filePreview, error) => {
        switch (formItem.fileType) {
            case "avatar":
                return (<div key={path} className="w-full pb-5 text-center">
            <InputFileProfile_1.default id={path} value={value ? value.name : ""} preview={filePreview} previewSize="lg" color="primary" onChange={(e) => handleChange(path, e.target.files, "file")} onRemoveFile={() => {
                        setFormValues((prev) => ({ ...prev, [path]: "" }));
                        setFilePreviews((prev) => ({ ...prev, [path]: "" }));
                    }}/>
            {error && <p className="text-danger-500 text-sm mt-2">{error}</p>}
          </div>);
            case "image":
                return (<span key={path}>
            <InputFile_1.default id={path} acceptedFileTypes={[
                        "image/png",
                        "image/jpeg",
                        "image/jpg",
                        "image/gif",
                        "image/svg+xml",
                        "image/webp",
                    ]} preview={filePreview} previewPlaceholder="/img/placeholder.svg" maxFileSize={formItem.maxSize || 16} label={`${t("Max File Size")}: ${formItem.maxSize || 16} MB`} labelAlt={`${t("Size")}: ${formItem.width}x${formItem.height} px`} bordered color="default" onChange={(files) => handleChange(path, files, "file")} onRemoveFile={() => setFormValues((prev) => ({ ...prev, [path]: null }))}/>
            {error && <p className="text-danger-500 text-sm mt-2">{error}</p>}
          </span>);
            default:
                return (<span key={path}>
            <InputFileField_1.default id={path} label={`${t("Max File Size")}: ${formItem.maxSize || 16} MB`} value={value ? value.name : ""} maxFileSize={formItem.maxSize || 16} acceptedFileTypes={formItem.acceptedFileTypes} onChange={(e) => handleChange(path, e.target.files, "file")}/>
            {error && <p className="text-danger-500 text-sm mt-2">{error}</p>}
          </span>);
        }
    };
    const renderSwitchField = (formItem, path, value, error) => (<span key={path}>
      <ToggleSwitch_1.default id={path} name={path} color="primary" label={t(formItem.label)} checked={!!value} onChange={(e) => handleChange(path, e.target.checked, "switch", formItem.ts)} setFirstErrorInputRef={(inputRef) => setFirstErrorInputRef(inputRef, error)}/>
      {error && <p className="text-danger-500 text-sm mt-2">{error}</p>}
    </span>);
    const getFormItemValue = (formItem, path) => {
        return formItem.type === "tags" ||
            (formItem.type === "select" && formItem.multiple && formItem.structure)
            ? formValues[formItem.name]
            : (0, datatable_2.getNestedValue)(formValues, path);
    };
    const renderFormFields = (0, react_1.useCallback)((formItems, parentPath = "") => {
        const activeItems = (0, datatable_2.filterFormItemsByCondition)(formItems, formValues);
        return activeItems
            .flatMap((formItem, index) => {
            if (Array.isArray(formItem)) {
                const gridCols = `grid-cols-${formItem.length}`;
                return (<div key={index} className={`grid gap-4 ${gridCols}`}>
                {formItem.map((nestedItem) => renderFormField(nestedItem, parentPath))}
              </div>);
            }
            else {
                return (<div key={index} className="space-y-5">
                {renderFormField(formItem, parentPath)}
              </div>);
            }
        })
            .filter(Boolean); // Filter out null items
    }, [renderFormField, formValues]);
    const firstErrorInputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (firstErrorInputRef.current) {
            firstErrorInputRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            setTimeout(() => {
                var _a;
                (_a = firstErrorInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }, 200);
        }
    }, [formErrors]);
    const setFirstErrorInputRef = (inputRef, error) => {
        if (error && !firstErrorInputRef.current) {
            firstErrorInputRef.current = inputRef;
        }
        else if (!error && firstErrorInputRef.current === inputRef) {
            firstErrorInputRef.current = null;
        }
    };
    return <>{renderFormFields(modalAction === null || modalAction === void 0 ? void 0 : modalAction.formItems)}</>;
};
exports.FormRenderer = FormRendererBase;
