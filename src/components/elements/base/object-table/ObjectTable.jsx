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
exports.ObjectTable = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("@iconify/react");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const Pagination_1 = __importDefault(require("@/components/elements/base/pagination/Pagination"));
const HeadCell_1 = __importDefault(require("@/components/pages/user/markets/HeadCell"));
const framer_motion_1 = require("framer-motion");
const IconButton_1 = __importDefault(require("../button-icon/IconButton"));
const Tooltip_1 = require("../tooltips/Tooltip");
const next_i18next_1 = require("next-i18next");
const useOnClickOutside_1 = __importDefault(require("@/hooks/useOnClickOutside"));
const ObjectTableBase = ({ title = "", items, setItems, shape = "rounded-md", navSlot, columnConfig, filterField, size = "md", border = true, initialPerPage = 5, expandable = false, renderExpandedContent, expansionMode = "dropdown", }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [filter, setFilter] = (0, react_1.useState)("");
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [sorted, setSorted] = (0, react_1.useState)({ field: "", rule: "asc" });
    const [pagination, setPagination] = (0, react_1.useState)({
        totalItems: 0,
        totalPages: 0,
        perPage: initialPerPage,
        currentPage: 1,
        from: 1,
        to: initialPerPage,
    });
    const [expandedItem, setExpandedItem] = (0, react_1.useState)(null);
    const modalRef = (0, react_1.useRef)(null);
    const uniqueId = (0, react_1.useId)(); // For stable layoutIds
    const startIndex = (currentPage - 1) * pagination.perPage;
    const endIndex = startIndex + pagination.perPage;
    const filteredItems = (items &&
        items.length > 0 &&
        items.filter((item) => {
            const filterLower = filter.toLowerCase();
            return columnConfig.some((col) => {
                var _a;
                const value = ((_a = item[col.field]) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase()) || "";
                return value.includes(filterLower);
            });
        })) ||
        [];
    const pageItems = filteredItems.slice(startIndex, endIndex) || [];
    const changePage = (0, react_1.useCallback)((page) => {
        if (page >= 1 && page <= pagination.totalPages) {
            setCurrentPage(page);
            const newFrom = (page - 1) * pagination.perPage + 1;
            const newTo = page * pagination.perPage;
            setPagination((p) => ({
                ...p,
                currentPage: page,
                from: newFrom,
                to: newTo,
            }));
        }
    }, [pagination.totalPages, pagination.perPage]);
    const sort = (field, rule) => {
        const copy = [...items];
        copy.sort((a, b) => {
            if (typeof a[field] === "string" && typeof b[field] === "string") {
                return rule === "asc"
                    ? a[field].localeCompare(b[field])
                    : b[field].localeCompare(a[field]);
            }
            if (Array.isArray(a[field]) && Array.isArray(b[field])) {
                return rule === "asc"
                    ? a[field].length - b[field].length
                    : b[field].length - a[field].length;
            }
            return rule === "asc" ? a[field] - b[field] : b[field] - a[field];
        });
        setItems === null || setItems === void 0 ? void 0 : setItems(copy);
        setSorted({ field, rule });
    };
    (0, react_1.useEffect)(() => {
        setPagination((p) => ({
            ...p,
            totalItems: filteredItems.length,
            totalPages: Math.ceil(filteredItems.length / p.perPage),
        }));
    }, [items, filter, pagination.perPage, filteredItems.length]);
    (0, react_1.useEffect)(() => {
        const newFrom = (currentPage - 1) * pagination.perPage + 1;
        const newTo = currentPage * pagination.perPage;
        setPagination((p) => ({
            ...p,
            from: newFrom,
            to: newTo,
        }));
    }, [currentPage, pagination.perPage]);
    const handleRowClick = (item) => {
        if (!expandable)
            return;
        if (expansionMode === "dropdown") {
            setExpandedItem((prev) => ((prev === null || prev === void 0 ? void 0 : prev.id) === item.id ? null : item));
        }
        else {
            // modal mode
            setExpandedItem(item);
        }
    };
    (0, useOnClickOutside_1.default)(modalRef, () => {
        if (expansionMode === "modal")
            setExpandedItem(null);
    });
    (0, react_1.useEffect)(() => {
        function onKeyDown(event) {
            if (event.key === "Escape" && expansionMode === "modal")
                setExpandedItem(null);
        }
        if (expandedItem && expansionMode === "modal") {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [expandedItem, expansionMode]);
    return (<div className="relative h-full">
      <div className={`flex items-center justify-between ${shape === "straight" && "px-4"} ${(title || navSlot || filterField) && "py-3"}`}>
        {title && (<h2 className="text-lg text-muted-800 dark:text-muted-200">
            {title}
          </h2>)}
        {(navSlot || filterField) && (<div className="flex items-center gap-4">
            {filterField && (<Input_1.default value={filter} onChange={(e) => setFilter(e.target.value)} icon="lucide:search" color="contrast" placeholder={`Search ${title}`} className="max-w-xs"/>)}
            {navSlot}
          </div>)}
      </div>

      <div className={`flex w-full flex-col overflow-x-auto lg:overflow-x-visible ltablet:overflow-x-visible ${shape !== "straight" && `rounded-lg`}`}>
        <table className={`bg-white font-sans dark:bg-muted-900 mb-16 ${shape !== "straight" && "table-rounded"} ${border && "border border-muted-200 dark:border-muted-800 "}`}>
          <thead className="border-b border-fade-grey-2 dark:border-muted-800">
            <tr className="divide-x divide-muted-200 dark:divide-muted-800">
              {columnConfig.map((col) => (<th key={col.field} className="p-4">
                  <HeadCell_1.default label={col.label} sortFn={sort} sortField={col.field} sorted={sorted} sortable={col.sortable}/>
                </th>))}
            </tr>
          </thead>

          <tbody>
            {pageItems.map((item, i) => {
            const layoutId = `item-${item.id}-${uniqueId}`;
            return (<react_1.default.Fragment key={i}>
                  <framer_motion_1.motion.tr layoutId={layoutId} className={`text-${size} text-muted-800 dark:text-muted-200
                     border-b border-muted-200 transition-colors duration-300 last:border-none hover:bg-muted-200/40 dark:border-muted-800 dark:hover:bg-muted-950/60
                     ${expandable ? "cursor-pointer" : ""}`} onClick={() => handleRowClick(item)} initial={false} // needed to prevent layout animation issues
             animate={{}}>
                    {columnConfig.map((col) => {
                    var _a;
                    return (<td key={col.field} className="px-4 py-3 align-middle">
                        {col.type === "actions"
                            ? (_a = col.actions) === null || _a === void 0 ? void 0 : _a.map((action, index) => {
                                return !action.condition ||
                                    !action.condition(item) ? (<Tooltip_1.Tooltip key={index} content={action.tooltip}>
                                  <IconButton_1.default key={index} variant="pastel" color={action.color} onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick(item);
                                    }} loading={action.loading} size={action.size} disabled={action.disabled}>
                                    <react_2.Icon icon={action.icon} className="h-5 w-5"/>
                                  </IconButton_1.default>
                                </Tooltip_1.Tooltip>) : null;
                            })
                            : col.renderCell
                                ? col.renderCell(item)
                                : col.getValue
                                    ? col.getValue(item)
                                    : item[col.field]}
                      </td>);
                })}
                  </framer_motion_1.motion.tr>

                  {/* Dropdown Expansion */}
                  {expandable &&
                    expansionMode === "dropdown" &&
                    (expandedItem === null || expandedItem === void 0 ? void 0 : expandedItem.id) === item.id &&
                    renderExpandedContent && (<tr className="border-b border-muted-200 dark:border-muted-800">
                        <td colSpan={columnConfig.length} className="p-4 bg-muted-50 dark:bg-muted-900">
                          <framer_motion_1.AnimatePresence>
                            <framer_motion_1.motion.div key={item.id} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                              {renderExpandedContent(item)}
                            </framer_motion_1.motion.div>
                          </framer_motion_1.AnimatePresence>
                        </td>
                      </tr>)}
                </react_1.default.Fragment>);
        })}
            {!pagination.totalItems && (<tr>
                <td colSpan={columnConfig.length} className="py-3 text-center">
                  <div className="py-32">
                    <react_2.Icon icon="arcticons:samsung-finder" className="mx-auto h-20 w-20 text-muted-400"/>
                    <h3 className="mb-2 font-sans text-xl text-muted-700 dark:text-muted-200">
                      {t("Nothing found")}
                    </h3>
                    <p className="mx-auto max-w-[280px] font-sans text-md text-muted-400">
                      {t("Sorry, looks like we couldn't find any matching records. Try different search terms.")}
                    </p>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
      <framer_motion_1.AnimatePresence>
        <framer_motion_1.motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.3 }} className={`absolute w-full flex gap-4 items-start ${shape === "straight" ? "bottom-0" : "-bottom-5"}`}>
          <div className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 ${shape !== "straight" &&
            `border border-muted-200 dark:border-muted-800 rounded-lg`} bg-muted-50 dark:bg-muted-900`}>
            <div className="w-full md:w-auto md:max-w-[164px]">
              <Select_1.default color="contrast" name="pageSize" value={pagination.perPage} options={[
            {
                value: "5",
                label: "5 per page",
            },
            {
                value: "10",
                label: "10 per page",
            },
            {
                value: "25",
                label: "25 per page",
            },
            {
                value: "50",
                label: "50 per page",
            },
            {
                value: "100",
                label: "100 per page",
            },
            {
                value: "250",
                label: "250 per page",
            },
            {
                value: "500",
                label: "500 per page",
            },
            {
                value: "1000",
                label: "1000 per page",
            },
        ]} onChange={(e) => setPagination({
            ...pagination,
            perPage: parseInt(e.target.value, 10),
        })}/>
            </div>
            <Pagination_1.default buttonSize={"md"} currentPage={pagination.currentPage} totalCount={pagination.totalItems} pageSize={pagination.perPage} onPageChange={(page) => changePage(page)}/>
          </div>
        </framer_motion_1.motion.div>
      </framer_motion_1.AnimatePresence>

      {/* Modal Expansion */}
      {expandable && expansionMode === "modal" && (<framer_motion_1.AnimatePresence>
          {expandedItem && (<>
              {/* Faded background with blur */}
              <framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 h-full w-full z-50 backdrop-filter backdrop-blur-xs"/>

              <div className="fixed inset-0 grid place-items-center z-[100]">
                <framer_motion_1.motion.button key={`close-button-${expandedItem.id}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.05 } }} className="flex absolute top-2 right-2 items-center justify-center bg-white rounded-full h-6 w-6 cursor-pointer" onClick={() => setExpandedItem(null)}>
                  <react_2.Icon icon="mdi:close" className="text-neutral-600"/>
                </framer_motion_1.motion.button>

                <framer_motion_1.motion.div ref={modalRef} layoutId={`item-${expandedItem.id}-${uniqueId}`} className="w-full max-w-[600px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-muted-950 sm:rounded-xl overflow-hidden border border-muted-100 dark:border-muted-900" initial={false} // needed for layout transitions
            >
                  {/* Render expanded content inside modal */}
                  <div className="p-4 overflow-auto">
                    {renderExpandedContent &&
                    renderExpandedContent(expandedItem)}
                  </div>
                </framer_motion_1.motion.div>
              </div>
            </>)}
        </framer_motion_1.AnimatePresence>)}
    </div>);
};
exports.ObjectTable = (0, react_1.memo)(ObjectTableBase);
