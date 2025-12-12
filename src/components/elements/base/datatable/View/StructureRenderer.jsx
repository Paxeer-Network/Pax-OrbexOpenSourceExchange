"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const MashImage_1 = require("@/components/elements/MashImage");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const ToggleSwitch_1 = __importDefault(require("@/components/elements/form/toggle-switch/ToggleSwitch"));
const DatePicker_1 = __importDefault(require("@/components/elements/form/datepicker/DatePicker"));
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const datatable_1 = require("@/utils/datatable");
const datatable_2 = require("@/utils/datatable");
const CustomFields_1 = require("./CustomFields");
const Tags_1 = require("./Tags");
const next_i18next_1 = require("next-i18next");
const infoBlock_1 = __importDefault(require("@/components/elements/base/infoBlock"));
const lodash_1 = require("lodash");
const lazyImport = (componentKey) => {
    return react_1.default.lazy(() => Promise.resolve(`${`@/components/elements/structures/${componentKey}`}`).then(s => __importStar(require(s))).catch(() => {
        const { t } = (0, next_i18next_1.useTranslation)();
        return {
            default: () => (<Card_1.default shape="smooth" color="danger" className="p-6">
            <h5 className="font-sans text-base font-semibold text-muted-800">
              {t("Failed to load `")} {componentKey}`
            </h5>
            <p className="font-sans text-sm text-muted-400">
              {t("There was an error loading the component. Please try again or contact support if the problem persists.")}
            </p>
          </Card_1.default>),
        };
    }));
};
const componentsMap = {
    Input: Input_1.default,
    Textarea: Textarea_1.default,
    DatePicker: DatePicker_1.default,
    Image: MashImage_1.MashImage,
    Select: Select_1.default,
    ToggleSwitch: ToggleSwitch_1.default,
    InfoBlock: infoBlock_1.default,
    Checkbox: Checkbox_1.default,
};
const StructureRenderer = ({ formValues, modalItem }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const initializeValues = (formItems) => {
        const initialValues = {};
        const initialPreviews = {};
        const deepParseObject = (obj) => {
            if (typeof obj !== "object" || obj === null)
                return obj;
            const parsedObj = Array.isArray(obj) ? [] : {};
            for (const key in obj) {
                if (typeof obj[key] === "string") {
                    try {
                        parsedObj[key] = (0, datatable_1.safeJSONParse)(obj[key]);
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
        const setInitialValue = (path, itemValue, formItem) => {
            if (!path)
                return;
            switch (formItem.ts) {
                case "number":
                    itemValue = parseFloat(itemValue);
                    if (isNaN(itemValue))
                        itemValue = formItem.defaultValue || 0;
                    break;
                case "boolean":
                    itemValue = itemValue === true || itemValue === "true";
                    break;
                case "object":
                    if (typeof itemValue === "string") {
                        itemValue = (0, datatable_1.robustJSONParse)(itemValue);
                    }
                    itemValue = itemValue || formItem.defaultValue || {};
                    break;
                case "string":
                default:
                    itemValue = itemValue || formItem.defaultValue || null;
                    break;
            }
            (0, datatable_1.setNestedValue)(initialValues, path, itemValue);
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
                            ? (0, datatable_1.getNestedValue)(parsedModalItem, path)
                            : undefined;
                        if (item.multiple &&
                            item.structure &&
                            Array.isArray(parsedModalItem === null || parsedModalItem === void 0 ? void 0 : parsedModalItem[item.name])) {
                            value = (0, datatable_1.parseMultipleSelect)(parsedModalItem[item.name], item.structure);
                        }
                        break;
                    case "object":
                        value = parsedModalItem
                            ? item.fields
                                ? (0, datatable_1.getNestedValue)(parsedModalItem, path)
                                : parsedModalItem[item.name]
                            : undefined;
                        if (typeof value === "string") {
                            value = (0, datatable_1.robustJSONParse)(value);
                        }
                        break;
                    case "file":
                        value = parsedModalItem
                            ? (0, datatable_1.getNestedValue)(parsedModalItem, path)
                            : undefined;
                        if (value instanceof File) {
                            initialPreviews[path] = URL.createObjectURL(value);
                        }
                        else if (typeof value === "string") {
                            initialPreviews[path] = value;
                        }
                        break;
                    default:
                        value = parsedModalItem
                            ? (0, datatable_1.getNestedValue)(parsedModalItem, path)
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
    };
    const { initialValues } = (0, react_1.useMemo)(() => initializeValues(formValues), [modalItem]);
    const getFormItemValue = (formItem, path) => {
        return (formItem.type === "select" &&
            formItem.multiple &&
            formItem.structure) ||
            formItem.type === "tags" ||
            (formItem.type === "object" && !formItem.fields)
            ? initialValues[formItem.name]
            : (0, datatable_1.getNestedValue)(initialValues, path);
    };
    const isChecked = (value) => {
        if (typeof value === "boolean") {
            return value;
        }
        else if (typeof value === "string") {
            return value === "true";
        }
        else {
            return false;
        }
    };
    const renderField = (0, react_1.useCallback)((formItem, parentPath = "") => {
        const path = parentPath
            ? `${parentPath}.${formItem.name}`
            : formItem.name;
        const value = getFormItemValue(formItem, path);
        if (formItem.notNull && !value)
            return null;
        if (formItem.condition &&
            !(0, datatable_2.evaluateCondition)(formItem.condition, initialValues))
            return null;
        const commonProps = {
            name: path,
            label: formItem.label,
            placeholder: formItem.placeholder,
            readOnly: true,
        };
        if (formItem.fields && !formItem.type) {
            return renderObjectField(formItem, path);
        }
        const Component = formItem.component
            ? componentsMap[formItem.component]
            : null;
        if (Component) {
            return <Component {...formItem} value={value}/>;
        }
        switch (formItem.type) {
            case "input":
            case "select":
                return <Input_1.default key={path} {...commonProps} value={value}/>;
            case "datetime":
                return <DatePicker_1.default key={path} {...commonProps} value={value}/>;
            case "textarea":
                return <Textarea_1.default key={path} {...commonProps} value={value}/>;
            case "file":
                return (<MashImage_1.MashImage key={path} src={value || "/img/placeholder.svg"} alt={formItem.label} width={64} height={64}/>);
            case "switch":
            case "checkbox":
                return (<Checkbox_1.default key={path} {...commonProps} checked={isChecked(value)} color={formItem.color || "primary"}/>);
            case "customFields":
                if (!Array.isArray(value))
                    return null;
                return <CustomFields_1.CustomFields key={path} value={value}/>;
            case "component":
                const DynamicComponent = lazyImport(formItem.filepath);
                const filteredData = Object.keys(formItem.props).reduce((obj, key) => {
                    var _a;
                    obj[key] = (_a = value[formItem.name]) === null || _a === void 0 ? void 0 : _a[key];
                    return obj;
                }, {});
                return (<react_1.Suspense key={path} fallback={<div>
                  {t("Loading")}
                  {formItem.name}...
                </div>}>
              <DynamicComponent field={formItem.props} data={filteredData} key={formItem.name}/>
            </react_1.Suspense>);
            case "tags":
                return (<Tags_1.Tags key={path} {...commonProps} value={value} item={formItem}/>);
            case "object":
                if (!formItem.fields) {
                    if (typeof value === "object") {
                        return Object.entries(value).map(([key, val]) => (<Input_1.default key={`${path}.${key}`} name={`${path}.${key}`} label={(0, lodash_1.capitalize)(key)} value={val} readOnly/>));
                    }
                    return (<Input_1.default key={path} {...commonProps} value={JSON.stringify(value)}/>);
                }
                return renderObjectField(formItem, path);
            default:
                return (<p key={path}>
              {t("Unknown field type")} {formItem.type}
            </p>);
        }
    }, [initialValues, t]);
    const renderObjectField = (formItem, path) => (<div key={path} className={formItem.label &&
            "border p-4 rounded-md border-gray-300 dark:border-gray-600 border-dashed"}>
      {formItem.label && (<p className="text-sm text-muted-700 dark:text-muted-300 font-semibold mb-2">
          {t(formItem.label)}
        </p>)}
      <div className="mx-auto w-full space-y-4">
        {renderFields(formItem.fields, path)}
      </div>
    </div>);
    const renderFields = (0, react_1.useCallback)((formItems, parentPath = "") => {
        const activeItems = (0, datatable_2.filterFormItemsByCondition)(formItems, initialValues);
        return activeItems.map((formItem, index) => {
            const fieldClassName = formItem.className || "";
            if (Array.isArray(formItem)) {
                const gridCols = `grid-cols-${formItem.length}`;
                return (<div key={index} className={`grid gap-4 ${gridCols} ${fieldClassName}`}>
              {formItem.map((nestedItem) => renderField(nestedItem, parentPath))}
            </div>);
            }
            else if (formItem.fields && !formItem.type) {
                const layoutClass = formItem.fields
                    ? `flex justify-start ${formItem.grid === "column" ? "flex-col" : "flex-row"} gap-x-5 gap-y-2`
                    : "col-span-1";
                return (<div key={index} className={`${layoutClass} ${fieldClassName}`}>
              {formItem.fields
                        ? renderFields(formItem.fields, "")
                        : renderField(formItem, "")}
            </div>);
            }
            else {
                return (<div key={index} className={`col-span-1 ${fieldClassName}`}>
              {renderField(formItem, parentPath)}
            </div>);
            }
        });
    }, [renderField, initialValues]);
    return <div className="space-y-4">{renderFields(formValues)}</div>;
};
exports.default = StructureRenderer;
