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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const datatable_1 = require("@/stores/datatable");
const react_2 = require("@iconify/react");
const Tooltip_1 = require("../../tooltips/Tooltip");
const next_i18next_1 = require("next-i18next");
const HeadCell = ({ label, sortField, tooltip, isOperatorOpen, setIsOperatorOpen, options, filterable = true, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    if (!label) {
        throw new Error(t("label prop is required!"));
    }
    const { sort, setSort, filter, filterOperator } = (0, datatable_1.useDataTable)((state) => state);
    const isSorted = (0, react_1.useMemo)(() => sort.field === sortField, [sort.field, sortField]);
    const handleSort = (rule) => {
        setSort({ field: sortField, rule });
    };
    const handleKeyPress = (event, rule) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSort(rule);
        }
    };
    const filterLabel = (0, react_1.useMemo)(() => {
        var _a;
        if (filter[sortField]) {
            return (((_a = filterOperator[sortField]) === null || _a === void 0 ? void 0 : _a.label) || (options && t(options[0].label)));
        }
        return null;
    }, [filter, filterOperator, options, sortField, t]);
    return (<div className="flex items-center justify-between gap-4 font-sans h-[40px]">
      {tooltip && filterable ? (<Tooltip_1.Tooltip content={t(tooltip)}>
          <span className="text-xs font-medium uppercase text-muted">
            {t(label)}
          </span>
        </Tooltip_1.Tooltip>) : (<span className="text-xs font-medium uppercase text-muted">
          {t(label)}
        </span>)}
      <div className="flex flex-row items-center justify-center gap-2">
        {filterable && setIsOperatorOpen && !isOperatorOpen && (<Tooltip_1.Tooltip content={t("Filter by")}>
            <span className="flex cursor-pointer items-center justify-center gap-1" onClick={() => setIsOperatorOpen(!isOperatorOpen)}>
              {filter[sortField] && (<span className="text-xs font-medium text-muted">
                  (
                  <span className="text-primary-500 dark:text-primary-400">
                    {filterLabel}
                  </span>
                  )
                </span>)}
              <react_2.Icon icon={filter[sortField] ? "mdi:filter" : "mdi:filter-outline"} className={`h-4 w-4 ${filter[sortField]
                ? "text-primary-500 dark:text-primary-400"
                : "text-muted"}`}/>
            </span>
          </Tooltip_1.Tooltip>)}
        <div className="flex flex-col">
          <svg onClick={() => handleSort("asc")} onKeyDown={(event) => handleKeyPress(event, "asc")} fill="none" role="button" tabIndex={0} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" viewBox="0 0 24 24" stroke="currentColor" className={`h-2.5 w-2.5 cursor-pointer fill-none ${sort.rule === "asc" && isSorted
            ? "text-primary-500"
            : "text-muted-400"}`}>
            <path d="M5 15l7-7 7 7"/>
          </svg>
          <svg onClick={() => handleSort("desc")} onKeyDown={(event) => handleKeyPress(event, "desc")} fill="none" role="button" tabIndex={0} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" viewBox="0 0 24 24" stroke="currentColor" className={`h-2.5 w-2.5 cursor-pointer fill-none ${sort.rule === "desc" && isSorted
            ? "text-primary-500"
            : "text-muted-400"}`}>
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </div>);
};
exports.default = HeadCell;
