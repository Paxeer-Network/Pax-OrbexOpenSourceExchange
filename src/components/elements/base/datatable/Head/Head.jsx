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
exports.Head = void 0;
const react_1 = __importStar(require("react"));
const HeadCell_1 = __importDefault(require("./HeadCell"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const ToggleSwitch_1 = __importDefault(require("@/components/elements/form/toggle-switch/ToggleSwitch"));
const react_2 = require("@iconify/react");
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const datatable_1 = require("@/stores/datatable");
const Tooltip_1 = require("../../tooltips/Tooltip");
const useEditState_1 = __importDefault(require("@/hooks/useEditState"));
const datatable_2 = require("@/utils/datatable");
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const next_i18next_1 = require("next-i18next");
const getFilterKey = (columnConfig, field) => {
    var _a;
    return ((_a = columnConfig.find((col) => col.field === field)) === null || _a === void 0 ? void 0 : _a.sortName) || field;
};
const HeadBase = ({ columnConfig, hasActions, canDelete, dynamicColumnWidths, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { filter, setFilter, selectAllItems, clearSelection, filterOperator, isLoading, items, selectedItems, } = (0, datatable_1.useDataTable)((state) => state);
    const isAllSelected = selectedItems.length === items.length && items.length > 0;
    const { editState, enableEdit, handleEditChange, saveEdit, handleKeyPress } = (0, useEditState_1.default)(columnConfig, setFilter);
    const [isOperatorOpen, setIsOperatorOpen] = (0, react_1.useState)({});
    const renderEditInput = (column, value, onChange, onBlur, onKeyPress) => {
        switch (column.type) {
            case "text":
            case "tag":
            case "tags":
                return (<Input_1.default type="text" size="sm" icon="mdi:magnify" value={value !== null && value !== void 0 ? value : ""} onChange={onChange} onBlur={onBlur} onKeyPress={onKeyPress} autoFocus noPadding/>);
            case "rating":
            case "number":
                return (<Input_1.default type="number" size="sm" icon="mdi:magnify" value={value !== null && value !== void 0 ? value : ""} onChange={onChange} onBlur={onBlur} onKeyPress={onKeyPress} autoFocus noPadding/>);
            case "switch":
                return (<div className="flex items-center">
            <ToggleSwitch_1.default checked={value === "true"} onChange={onChange} color="success"/>
            <Tooltip_1.Tooltip content={t("Clear filter")}>
              <react_2.Icon onClick={() => saveEdit(editState.field, undefined, true)} icon="ph:x" className="cursor-pointer text-red-500 dark:text-red-400 dark:hover:text-red-500 hover:text-red-600"/>
            </Tooltip_1.Tooltip>
          </div>);
            case "select":
                return (<Listbox_1.default options={[{ value: "", label: t("All") }, ...column.options]} selected={column.options.find((option) => option.value === value) || {
                        label: "",
                        value: "",
                    }} setSelected={(e) => {
                        onChange({ target: { value: e.value } });
                    }} onClose={onBlur} size="sm" loading={isLoading}/>);
            default:
                return null;
        }
    };
    const handleFilterTypeChange = (0, react_1.useCallback)((sortField, value) => {
        setFilter(sortField, filter[sortField], value);
    }, [filter, setFilter]);
    const widthStyles = (0, react_1.useMemo)(() => {
        return columnConfig.reduce((acc, column, index) => {
            var _a;
            const isSwitch = column.type === "switch";
            const isSelect = column.type === "select";
            const width = ((_a = dynamicColumnWidths[index]) === null || _a === void 0 ? void 0 : _a.width) || "auto";
            acc[column.field] = {
                width: typeof width === "number" ? `${width}px` : width,
                maxWidth: typeof width === "number" ? `${width}px` : width,
                minWidth: isSwitch || isSelect ? "80px" : "auto",
            };
            return acc;
        }, {});
    }, [columnConfig, dynamicColumnWidths]);
    const renderCellContent = (0, react_1.useCallback)((column, currentFilterValue, isEditingThisField, filterKey) => {
        const { field, label, sortable, filterable, sortName, tooltip } = column;
        return isEditingThisField ? (renderEditInput(column, editState.value, handleEditChange, () => saveEdit(filterKey, editState.value), handleKeyPress)) : isOperatorOpen[sortName || field] ? (<div className="flex items-center justify-between gap-4">
          <Listbox_1.default options={["number", "rating"].includes(column.type)
                ? datatable_2.numberFilterOptions
                : datatable_2.stringFilterOptions} selected={filterOperator[sortName || field] || {
                label: t("Select Operator"),
                value: "",
            }} setSelected={(e) => {
                handleFilterTypeChange(sortName || field, e);
                setIsOperatorOpen({
                    ...isOperatorOpen,
                    [sortName || field]: false,
                });
            }} onClose={() => setIsOperatorOpen({
                ...isOperatorOpen,
                [sortName || field]: false,
            })} size="sm" loading={isLoading}/>
        </div>) : sortable ? (<HeadCell_1.default label={currentFilterValue ? `(${t(currentFilterValue)})` : t(label)} sortField={sortName || field} tooltip={`${t("Double click to filter by")} ${t(tooltip || field)}`} isOperatorOpen={isOperatorOpen[sortName || field]} setIsOperatorOpen={(value) => setIsOperatorOpen({
                ...isOperatorOpen,
                [sortName || field]: value,
            })} options={["number", "rating"].includes(column.type)
                ? datatable_2.numberFilterOptions
                : datatable_2.stringFilterOptions} filterable={filterable}/>) : (<div className="flex items-center justify-between gap-4 font-sans">
          {filterable ? (<Tooltip_1.Tooltip content={`${t("Double-click to filter by")} ${t(label)}`}>
              <span className="text-xs font-medium uppercase text-muted cursor-help">
                {currentFilterValue
                    ? `${t(label)} (${t(currentFilterValue)})`
                    : t(label)}
              </span>
            </Tooltip_1.Tooltip>) : (<span className="text-xs py-3 font-medium uppercase text-muted">
              {currentFilterValue
                    ? `${t(label)} (${t(currentFilterValue)})`
                    : t(label)}
            </span>)}
        </div>);
    }, [
        editState.value,
        filterOperator,
        handleEditChange,
        handleFilterTypeChange,
        handleKeyPress,
        isLoading,
        isOperatorOpen,
        renderEditInput,
        saveEdit,
        t,
    ]);
    return (<tr className="divide-x divide-muted-200 dark:divide-muted-800">
      {canDelete && (<th className="w-[41.6px] min-w-[41.6px]">
          <div className="pt-2">
            <Checkbox_1.default className="cursor-pointer" color="primary" checked={isAllSelected} aria-label={t("Select all items")} onChange={(e) => {
                if (e.target.checked) {
                    selectAllItems();
                }
                else {
                    clearSelection();
                }
            }}/>
          </div>
        </th>)}
      {columnConfig.map((column) => {
            const { field } = column;
            const filterKey = getFilterKey(columnConfig, field);
            const currentFilterValue = filter[filterKey];
            const isEditingThisField = editState.isEditing && editState.field === filterKey;
            return (<th key={field} style={widthStyles[field]} className={`${!hasActions && ""} px-4`} onDoubleClick={() => enableEdit(field, currentFilterValue, column.type)}>
            {renderCellContent(column, currentFilterValue, isEditingThisField, filterKey)}
          </th>);
        })}

      {hasActions && (<th className="w-20 min-w-20">
          <div className="flex items-center justify-center gap-4 font-sans">
            <span className="text-xs font-medium uppercase  text-muted">
              {t("Actions")}
            </span>
          </div>
        </th>)}
    </tr>);
};
exports.Head = (0, react_1.memo)(HeadBase);
