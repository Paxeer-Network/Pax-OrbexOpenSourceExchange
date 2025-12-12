"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const usePagination_1 = require("@/hooks/usePagination");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const next_i18next_1 = require("next-i18next");
const Pagination = ({ onPageChange, totalCount, siblingCount = 0, currentPage, pageSize, buttonSize = "md", buttonShape = "smooth", }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const paginationRange = (0, usePagination_1.usePagination)({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
    });
    // If there are less than 2 times in pagination range we shall not render the component
    if (currentPage === 0 ||
        (paginationRange !== undefined && paginationRange.length < 2)) {
        return (<div className="flex justify-center gap-1 text-sm font-medium px-4 text-gray-500 dark:text-gray-400">
        <span>
          {t("Showing all records")} ({totalCount})
        </span>
      </div>);
    }
    const onNext = () => {
        onPageChange(currentPage + 1);
    };
    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };
    const lastPage = paginationRange !== undefined
        ? paginationRange[paginationRange.length - 1]
        : 0;
    return (<ul className="flex justify-center gap-1 text-sm font-medium">
      {/* Left navigation arrow */}
      <li>
        <IconButton_1.default type="button" className="rtl:rotate-180" size={buttonSize} shape={buttonShape} disabled={currentPage === 1} onClick={onPrevious}>
          <span className="sr-only">{t("Prev Page")}</span>
          <react_2.Icon icon="lucide:arrow-left" className="h-4 w-4 scale-95"/>
        </IconButton_1.default>
      </li>
      {paginationRange === null || paginationRange === void 0 ? void 0 : paginationRange.map((pageNumber, index) => {
            // If the pageItem is a DOT, render the DOTS unicode character
            if (pageNumber === usePagination_1.DOTS) {
                return (<li key={index} className="pagination-item dots">
              <IconButton_1.default type="button" size={buttonSize} shape={buttonShape}>
                <react_2.Icon icon="lucide:more-horizontal" className="h-4 w-4"/>
              </IconButton_1.default>
            </li>);
            }
            // Render our Page Pills
            return (<li key={index}>
            <IconButton_1.default type="button" size={buttonSize} shape={buttonShape} color={pageNumber === currentPage ? "primary" : "default"} onClick={() => onPageChange(pageNumber)}>
              <span>{pageNumber}</span>
            </IconButton_1.default>
          </li>);
        })}
      {/*  Right Navigation arrow */}
      <li>
        <IconButton_1.default type="button" className="rtl:rotate-180" size={buttonSize} shape={buttonShape} disabled={currentPage === lastPage} onClick={onNext}>
          <span className="sr-only">{t("Prev Page")}</span>
          <react_2.Icon icon="lucide:arrow-right" className="h-4 w-4 scale-95"/>
        </IconButton_1.default>
      </li>
    </ul>);
};
exports.default = Pagination;
