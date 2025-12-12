"use client";
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
exports.DataTable = void 0;
const react_1 = __importStar(require("react"));
const NoItemsFound_1 = require("@/components/elements/base/datatable/NoItemsFound");
const Row_1 = require("@/components/elements/base/datatable/Row");
const LoadingRow_1 = require("@/components/elements/base/datatable/LoadingRow");
const Head_1 = require("./Head");
const FormModal_1 = require("./FormModal");
const Pagination_1 = __importDefault(require("../pagination/Pagination"));
const Select_1 = __importDefault(require("../../form/select/Select"));
const BulkSelectionMessage_1 = require("./BulkSelectionMessage");
const framer_motion_1 = require("framer-motion");
const datatable_1 = require("@/stores/datatable");
const ConfirmationModal_1 = require("./ConfirmationModal");
const NavActions_1 = require("./NavActions");
const View_1 = require("./View");
const Breadcrumb_1 = __importDefault(require("../breadcrumb/Breadcrumb"));
const router_1 = require("next/router");
const lodash_1 = require("lodash");
const IconBox_1 = __importDefault(require("../iconbox/IconBox"));
const Tooltip_1 = require("../tooltips/Tooltip");
const IconButton_1 = __importDefault(require("../button-icon/IconButton"));
const react_2 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const next_i18next_1 = require("next-i18next");
const DataTableBase = ({ title, endpoint, columnConfig = [], postTitle = "Manage", hasBreadcrumb = true, hasRotatingBackButton = true, hasStructure = true, isCrud = true, isParanoid = true, canView = true, canCreate = true, canImport = false, canEdit = true, canDelete = true, hasAnalytics = false, hasTitle = true, onlySingleActiveStatus = false, fixedPagination = false, paginationLocation = "floating", size = "sm", shape = "rounded-lg", navActionsSlot, navActionsConfig, dropdownActionsSlot, dropdownActionsConfig, formSize, viewPath, editPath, blank, navSlot, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const currentPath = (0, react_1.useRef)(router.asPath.split("?")[0]);
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const { items, selectedItems, isLoading, pagination, setDataTableProps, setPagination, actionConfigs, activeModal, modalAction, viewItem, showDeletedAction, setFilters, fetchData, clearFilters, clearDataTableProps, setParams, } = (0, datatable_1.useDataTable)((state) => state);
    const allowedKeys = (0, react_1.useMemo)(() => {
        return columnConfig.reduce((acc, column) => {
            acc.push(column.sortName || column.field);
            return acc;
        }, []);
    }, [columnConfig]);
    const filterParams = (0, react_1.useMemo)(() => {
        const params = {};
        Object.keys(router.query).forEach((key) => {
            if (allowedKeys.includes(key)) {
                params[key] = router.query[key];
            }
        });
        return params;
    }, [router.query, allowedKeys]);
    const otherParams = (0, react_1.useMemo)(() => {
        const params = {};
        Object.keys(router.query).forEach((key) => {
            if (!allowedKeys.includes(key)) {
                params[key] = router.query[key];
            }
        });
        return params;
    }, [router.query, allowedKeys]);
    (0, react_1.useEffect)(() => {
        setDataTableProps({
            title,
            endpoint,
            hasStructure,
            isCrud,
            isParanoid,
            canView,
            canCreate,
            canImport,
            canEdit,
            canDelete,
            columnConfig,
            formSize,
            navActionsConfig: navActionsConfig,
            dropdownActionsConfig: dropdownActionsConfig,
            onlySingleActiveStatus,
        });
    }, []);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            // Apply the filtered parameters as filters
            if (Object.keys(filterParams).length > 0) {
                setFilters(filterParams);
            }
            // Handle other parameters not included in the columnConfig
            if (Object.keys(otherParams).length > 0) {
                setParams(otherParams);
            }
            fetchData();
        }
    }, [router.isReady]);
    (0, react_1.useEffect)(() => {
        const handleRouteChangeStart = (url) => {
            const newPathname = new URL(url, window.location.href).pathname;
            if (newPathname !== currentPath.current) {
                setParams({});
                clearDataTableProps();
                clearFilters();
            }
        };
        const handleRouteChangeComplete = (url) => {
            currentPath.current = new URL(url, window.location.href).pathname;
        };
        router.events.on("routeChangeStart", handleRouteChangeStart);
        router.events.on("routeChangeComplete", handleRouteChangeComplete);
        return () => {
            router.events.off("routeChangeStart", handleRouteChangeStart);
            router.events.off("routeChangeComplete", handleRouteChangeComplete);
        };
    }, []);
    const breadcrumbItems = hasBreadcrumb
        ? currentPath.current
            .split("/")
            .filter((item) => item !== "")
            .map((item) => ({
            title: (0, lodash_1.capitalize)(item.replace(/-/g, " ").replace(/#/g, "")),
        }))
        : [];
    const tableRef = (0, react_1.useRef)(null);
    const [tableWidth, setTableWidth] = (0, react_1.useState)(null);
    const [dynamicColumnWidths, setDynamicColumnWidths] = (0, react_1.useState)([]);
    const measureTableWidth = (0, react_1.useCallback)(() => {
        if (tableRef.current) {
            const multiSelectWidth = canDelete ? 41.6 : 0;
            const actionsWidth = !!actionConfigs.dropdownActionsConfig || !!dropdownActionsSlot ? 64 : 0;
            const switchColumns = columnConfig.filter((col) => col.type === "switch").length;
            const switchWidth = switchColumns * 64;
            const selectColumns = columnConfig.filter((col) => col.type === "select").length;
            const selectWidth = selectColumns * 128;
            const dynamicColumns = columnConfig.filter((col) => ["switch", "select"].includes(col.type) === false).length;
            const totalFixedWidth = multiSelectWidth + actionsWidth + switchWidth + selectWidth;
            // Calculate dynamic widths considering the text width
            let dynamicColumnWidth = "auto";
            if (tableWidth && dynamicColumns > 0) {
                const availableWidth = Number(tableWidth) - totalFixedWidth;
                dynamicColumnWidth = availableWidth / dynamicColumns;
            }
            // Measure text width
            const textWidths = columnConfig.map((col) => {
                const textElement = document.createElement("span");
                textElement.style.visibility = "hidden";
                textElement.style.whiteSpace = "nowrap";
                textElement.innerText = col.label || "";
                document.body.appendChild(textElement);
                const textWidth = textElement.offsetWidth;
                document.body.removeChild(textElement);
                return textWidth;
            });
            // Set the column widths considering the text width
            const adjustedColumnWidths = columnConfig.map((col, index) => {
                const minWidth = ["switch", "select"].includes(col.type)
                    ? "80px"
                    : "auto";
                const width = dynamicColumnWidth !== "auto"
                    ? Math.max(dynamicColumnWidth, textWidths[index])
                    : textWidths[index];
                return { width, minWidth };
            });
            setDynamicColumnWidths(adjustedColumnWidths);
            setTableWidth(tableRef.current.offsetWidth);
        }
    }, [
        canDelete,
        actionConfigs.dropdownActionsConfig,
        dropdownActionsSlot,
        columnConfig,
        tableWidth,
    ]);
    (0, react_1.useEffect)(() => {
        measureTableWidth();
    }, [measureTableWidth]);
    const basePathWithoutQuery = router.asPath.split("?")[0];
    const analysisPath = `${basePathWithoutQuery}/analysis`.replace("//", "/");
    const hasActions = !!actionConfigs.dropdownActionsConfig ||
        !!dropdownActionsSlot ||
        (isCrud && (canDelete || canEdit || canView));
    return (<div id="datatable" className="h-full">
      <framer_motion_1.AnimatePresence>
        {selectedItems.length > 0 && canDelete && isCrud && (<BulkSelectionMessage_1.BulkSelectionMessage key="bulk-selection-message"/>)}
      </framer_motion_1.AnimatePresence>
      {hasTitle && (<div className={`mb-2 ${hasBreadcrumb && "min-h-16"} py-2 gap-5 flex items-center justify-center md:justify-between w-full rounded-lg flex-col md:flex-row`}>
          <div className="flex items-center gap-4">
            {hasRotatingBackButton && (<IconBox_1.default icon={isHovered
                    ? "heroicons-solid:chevron-left"
                    : "material-symbols-light:app-badging-outline"} color="muted" variant={"pastel"} shape={"rounded"} size={"md"} rotating={!isHovered} onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="cursor-pointer duration-300 hover:bg-black/10 hover:text-black dark:hover:bg-white/20 hover:shadow-inner" onClick={() => router.back()}/>)}
            <h2 className="font-sans text-lg font-light uppercase tracking-wide text-muted-700 dark:text-muted-300">
              {t(postTitle)} {t(title)}
              {hasBreadcrumb && (<Breadcrumb_1.default separator="slash" items={breadcrumbItems}/>)}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {navSlot}
            <NavActions_1.NavActions navActionsSlot={navActionsSlot}/>
            {hasAnalytics && (<Tooltip_1.Tooltip content={t("Analytics")}>
                <link_1.default href={analysisPath}>
                  <IconButton_1.default variant="pastel" aria-label={t("Analytics")} color="primary" size={"lg"} shape={"rounded"}>
                    <react_2.Icon icon="solar:chart-2-bold-duotone" className="h-6 w-6"/>
                  </IconButton_1.default>
                </link_1.default>
              </Tooltip_1.Tooltip>)}
          </div>
        </div>)}

      <div className={`flex w-full flex-col overflow-x-auto lg:overflow-x-visible ltablet:overflow-x-visible ${shape !== "straight" &&
            `border border-muted-200 dark:border-muted-800 ${shape}`}`}>
        <table ref={tableRef} className={`border border-muted-200 bg-white font-sans dark:border-muted-800 dark:bg-muted-900 ${shape !== "straight" && "table-rounded"}`}>
          <thead className="border-b border-fade-grey-2 dark:border-muted-800">
            <Head_1.Head columnConfig={columnConfig} hasActions={hasActions} canDelete={isCrud && canDelete} dynamicColumnWidths={dynamicColumnWidths}/>
          </thead>
          <tbody className={`text-${size}`}>
            {isLoading ? (<LoadingRow_1.LoadingRow columnConfig={columnConfig} canDelete={canDelete} isCrud={isCrud} hasActions={hasActions}/>) : (items === null || items === void 0 ? void 0 : items.length) > 0 ? (items.map((item, index) => (<Row_1.Row key={index} item={item} columnConfig={columnConfig} dropdownActionsSlot={dropdownActionsSlot} canDelete={isCrud && canDelete} isParanoid={isParanoid} hasActions={hasActions} viewPath={viewPath} editPath={editPath} blank={blank}/>))) : (<NoItemsFound_1.NoItemsFound cols={columnConfig.length +
                (canDelete ? 1 : 0) +
                (hasActions ? 1 : 0)}/>)}
          </tbody>
        </table>
      </div>

      <framer_motion_1.AnimatePresence>
        {selectedItems.length === 0 && (<framer_motion_1.motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.3 }} className={paginationLocation === "floating"
                ? "w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] fixed bottom-5 left-[5%] sm:left-[10%] md:left-[15%] lg:left-[20%] flex gap-4 items-start"
                : `${fixedPagination && "absolute bottom-0"} w-full flex gap-4 items-start ${shape !== "straight" && "pt-5"}`}>
            {showDeletedAction && (<div className={`"min-64 w-64 justify-between p-1.5 ${shape !== "straight" && shape} bg-muted-50 dark:bg-muted-950 border border-muted-200 dark:border-muted-800`}>
                <NavActions_1.NavActions navAction={showDeletedAction}/>
              </div>)}
            <div className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-1.5 ${shape !== "straight" &&
                `border border-muted-200 dark:border-muted-800 ${shape}`} bg-muted-50 ${paginationLocation === "floating"
                ? "dark:bg-muted-950"
                : "dark:bg-muted-900"}`}>
              <div className="w-full md:w-auto md:max-w-[164px]">
                <Select_1.default color="contrast" name="pageSize" shape={"rounded-sm"} value={pagination.perPage} aria-label={t("Items per page")} options={[
                {
                    value: "10",
                    label: `10 ${t("per page")}`,
                },
                {
                    value: "25",
                    label: `25 ${t("per page")}`,
                },
                {
                    value: "50",
                    label: `50 ${t("per page")}`,
                },
                {
                    value: "100",
                    label: `100 ${t("per page")}`,
                },
                {
                    value: "250",
                    label: `250 ${t("per page")}`,
                },
            ]} onChange={(e) => setPagination({
                perPage: parseInt(e.target.value),
                currentPage: 1,
            })}/>
              </div>
              <Pagination_1.default currentPage={pagination.currentPage} totalCount={pagination.totalItems} pageSize={pagination.perPage} buttonShape={"rounded-sm"} buttonSize={"md"} onPageChange={(page) => pagination.currentPage !== page &&
                setPagination({ currentPage: page })}/>
            </div>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>

      {isCrud && (modalAction === null || modalAction === void 0 ? void 0 : modalAction.modalType) === "confirmation" && (<ConfirmationModal_1.ConfirmationModal />)}
      {isCrud && activeModal === "FormModal" && <FormModal_1.FormModal />}
      {isCrud && viewItem && <View_1.View title={title}/>}
    </div>);
};
exports.DataTable = DataTableBase;
