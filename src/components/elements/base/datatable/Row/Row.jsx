"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Row = void 0;
const react_1 = __importDefault(require("react"));
const Switch_1 = require("@/components/elements/base/datatable/Switch");
const ActionItem_1 = __importDefault(require("../../dropdown-action/ActionItem"));
const DropdownAction_1 = __importDefault(require("../../dropdown-action/DropdownAction"));
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const datatable_1 = require("@/stores/datatable");
const datatable_2 = require("@/utils/datatable");
const router_1 = require("next/router");
const Tag_1 = __importDefault(require("../../tag/Tag"));
const MashImage_1 = require("@/components/elements/MashImage");
const link_1 = __importDefault(require("next/link"));
const Rating_1 = __importDefault(require("@/components/elements/structures/Rating"));
const next_i18next_1 = require("next-i18next");
const IconButton_1 = __importDefault(require("../../button-icon/IconButton"));
const react_2 = require("@iconify/react");
const getPathValue = (item, path) => {
    let updatedPath = path;
    let match;
    // Use a loop to replace all instances of `[key]`
    while ((match = updatedPath.match(/\[(.*?)\]/))) {
        const pathKey = match[1];
        const pathValue = (0, datatable_2.getNestedValue)(item, pathKey);
        if (pathValue === undefined) {
            console.error(`Path key "${pathKey}" not found in item in ${updatedPath}`);
            return path;
        }
        updatedPath = updatedPath.replace(`[${pathKey}]`, pathValue);
    }
    return updatedPath;
};
const clampText = (text, maxLength) => {
    if (!maxLength || !text)
        return text;
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength) + "...";
};
// Utility to clean up path
const cleanPath = (path) => {
    return path.replace(/\/+/g, "/");
};
const RowBase = ({ item, columnConfig, dropdownActionsSlot, isParanoid, canDelete, hasActions, viewPath, editPath, blank, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { selectedItems, toggleItemSelection, updateItemStatus, actionConfigs, handleAction, } = (0, datatable_1.useDataTable)((state) => state);
    const dropdownActionsConfig = (0, datatable_2.getAdjustedActionsForItem)(isParanoid, actionConfigs === null || actionConfigs === void 0 ? void 0 : actionConfigs.dropdownActionsConfig, item);
    const renderCombinedActions = () => {
        const allActionItems = dropdownActionsConfig === null || dropdownActionsConfig === void 0 ? void 0 : dropdownActionsConfig.map((action, index) => {
            if (!action || !item)
                return null;
            let link = action.link;
            if (viewPath && action.name === "View") {
                link = cleanPath(getPathValue(item, viewPath));
                return {
                    ...action,
                    link,
                    onClick: () => router.push(link),
                };
            }
            if (editPath && action.name === "Edit") {
                link = cleanPath(getPathValue(item, editPath));
                if (!link)
                    return null;
                return {
                    ...action,
                    link,
                    onClick: () => router.push(link),
                };
            }
            return {
                ...action,
                link: link ? cleanPath(link.replace(":id", item.id)) : undefined,
                onClick: () => link
                    ? router.push(cleanPath(link.replace(":id", item.id)))
                    : handleAction(action, item),
            };
        }).filter(Boolean); // Ensure correct type after filtering
        const customActions = dropdownActionsSlot
            ? dropdownActionsSlot(item)
            : null;
        if (allActionItems.length === 1) {
            const singleAction = allActionItems[0];
            return (<td className="px-4 py-3 align-middle">
          <div className="flex w-full justify-end">
            <IconButton_1.default name={singleAction.name || ""} aria-label={singleAction.name || ""} className="flex items-center justify-center p-2" color="primary" variant="outlined" onClick={singleAction.onClick}>
              <react_2.Icon icon={singleAction.icon} className="w-4 h-4"/>
            </IconButton_1.default>
          </div>
        </td>);
        }
        return (<td className="px-4 py-3 align-middle">
        <div className="flex w-full justify-end">
          <DropdownAction_1.default orientation="end" canRotate aria-label={t("Actions")}>
            <div className="py-2">
              {customActions}
              {allActionItems.map((action, index) => (<ActionItem_1.default key={action.name + index} icon={action.icon} text={action.name} subtext={action.label || ""} href={action.link} onClick={action.onClick} aria-label={action.name}/>))}
            </div>
          </DropdownAction_1.default>
        </div>
      </td>);
    };
    const isSelected = selectedItems.includes(item.id);
    return (<tr className="border-b border-muted-200 transition-colors duration-300 last:border-none hover:bg-muted-200/40 dark:border-muted-800 dark:hover:bg-muted-950/60">
      {canDelete && (<td className="pt-2 text-center">
          <Checkbox_1.default className="cursor-pointer" color="primary" checked={isSelected} aria-label={t("Select item")} onChange={() => toggleItemSelection(item.id)}/>
        </td>)}
      {columnConfig.map(({ field, sublabel, type, active = true, disabled = false, api, hasImage, imageKey, placeholder, options, getValue, getSubValue, getImage, className, precision, color, path, subpath, maxLength, imageWidth, imageHeight, }, index) => {
            var _a, _b, _c;
            if (typeof active === "string")
                active = active === "true";
            if (typeof disabled === "string")
                disabled = disabled === "false";
            let value = item[field];
            if (type === "number" && precision) {
                value = (_a = item[field]) === null || _a === void 0 ? void 0 : _a.toFixed(precision);
            }
            let content;
            switch (type) {
                case "switch":
                    content = (<Switch_1.Switch key={field} initialState={item.status === active} endpoint={(api === null || api === void 0 ? void 0 : api.replace(":id", item.id)) || ""} active={active} disabled={disabled} onUpdate={(newStatus) => updateItemStatus(item.id, newStatus)}/>);
                    break;
                case "select":
                    content = (<Tag_1.default key={field} variant="pastel" shape="smooth" color={((_b = options === null || options === void 0 ? void 0 : options.find((opt) => opt.value === value)) === null || _b === void 0 ? void 0 : _b.color) ||
                            "warning"}>
                  {((_c = options === null || options === void 0 ? void 0 : options.find((opt) => opt.value === value)) === null || _c === void 0 ? void 0 : _c.label) ||
                            "Pending"}
                </Tag_1.default>);
                    break;
                case "datetime":
                    if (!value)
                        return <td key={field}></td>;
                    content = (<span key={field} className="line-clamp-1 text-muted-800 dark:text-muted-100">
                  {new Date(value).toLocaleString()}
                </span>);
                    break;
                case "rating":
                    if (!value)
                        return <td key={field}></td>;
                    content = (<Rating_1.default key={field} rating={getValue ? getValue(item) : value}/>);
                    break;
                case "tag":
                    if (!value || value.length === 0)
                        return <td key={field}></td>;
                    content = (<link_1.default key={field} href={cleanPath(getPathValue(item, path))}>
                  <Tag_1.default variant="pastel" shape="smooth" color={color || "muted"}>
                    {getValue ? getValue(item) : value}
                  </Tag_1.default>
                </link_1.default>);
                    break;
                case "tags":
                    if (!value || value.length === 0)
                        return <td key={field}></td>;
                    content = (<div key={field} className="flex flex-wrap gap-1">
                  {value.slice(0, 2).map((tag, idx) => (<Tag_1.default key={tag.name + idx} variant="pastel" shape="smooth" color={color || "muted"}>
                      {tag.name}
                    </Tag_1.default>))}
                  {value.length > 2 && (<Tag_1.default key="more" variant="pastel" shape="smooth" color={color || "muted"}>
                      +{value.length - 2} {t("more")}
                    </Tag_1.default>)}
                </div>);
                    break;
                case "image":
                    const imageLink = getImage ? getImage(item) : value;
                    content = (<MashImage_1.MashImage key={field} src={imageLink || placeholder} alt={value || "image"} width={imageWidth || item.width || 32} height={imageHeight || item.height || 32} className={`${className || "rounded-md"}`}/>);
                    break;
                default:
                    const truncatedText = clampText(getValue ? getValue(item) : value, maxLength);
                    const labelContent = (<span key={field} className={`text-muted-900 dark:text-muted-100 line-clamp-${maxLength}`}>
                  {truncatedText}
                </span>);
                    const sublabelContent = sublabel && (<span key={field + "-sublabel"} className="text-muted-500 dark:text-muted-400">
                  {getSubValue ? getSubValue(item) : item[sublabel]}
                </span>);
                    const imageContent = hasImage && imageKey && (<MashImage_1.MashImage key={field + "-image"} src={getImage
                            ? getImage(item)
                            : (0, datatable_2.getNestedValue)(item, imageKey) || placeholder} alt={value || "image"} width={imageWidth || item.width || 32} height={imageHeight || item.height || 32} className={`${className || "rounded-md"}`}/>);
                    content = (<div key={field} className="flex items-center gap-2">
                  {path && hasImage && imageKey ? (<link_1.default href={cleanPath(getPathValue(item, path))}>
                      {imageContent}
                    </link_1.default>) : (imageContent)}
                  <div className="flex flex-col line-clamp-1">
                    {path ? (<link_1.default href={cleanPath(getPathValue(item, path))} className="text-purple-600 dark:text-purple-400 hover:underline">
                        {labelContent}
                      </link_1.default>) : (labelContent)}
                    {subpath ? (<link_1.default href={cleanPath(getPathValue(item, subpath))} className="text-purple-600 dark:text-purple-400 hover:underline">
                        {sublabelContent}
                      </link_1.default>) : (sublabelContent)}
                  </div>
                </div>);
                    break;
            }
            return (<td key={field + index} className="px-4 py-3 align-middle">
              {content}
            </td>);
        })}
      {hasActions && renderCombinedActions()}
    </tr>);
};
exports.Row = RowBase;
