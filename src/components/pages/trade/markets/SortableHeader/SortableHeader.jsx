"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortableHeader = void 0;
const react_1 = require("react");
const SortableHeaderBase = ({ field, title, setSort, sort, className, size = "xs", }) => {
    const isSorted = (field) => sort.field === field;
    return (<div className={`flex flex-row items-center cursor-pointer text-${size} gap-1 ${className}`} onClick={() => setSort({
            field: field,
            rule: sort.rule === "asc" && isSorted(field) ? "desc" : "asc",
        })}>
      {title ? title : field.charAt(0).toUpperCase() + field.slice(1)}{" "}
      {/* Capitalize the first letter */}
      <div className="flex flex-col items-center">
        <svg fill="none" role="button" tabIndex={0} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" viewBox="0 0 24 24" stroke="currentColor" className={`h-2 w-2 cursor-pointer fill-none ${sort.rule === "asc" && isSorted(field)
            ? "text-warning-500"
            : "text-muted-400"}`}>
          <path d="M5 15l7-7 7 7"></path>
        </svg>
        <svg fill="none" role="button" tabIndex={0} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" viewBox="0 0 24 24" stroke="currentColor" className={`h-2 w-2 cursor-pointer fill-none ${sort.rule === "desc" && isSorted(field)
            ? "text-warning-500"
            : "text-muted-400"}`}>
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>);
};
exports.SortableHeader = (0, react_1.memo)(SortableHeaderBase);
