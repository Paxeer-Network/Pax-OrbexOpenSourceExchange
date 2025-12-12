"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResults = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const useSearch_1 = __importDefault(require("@/hooks/useSearch"));
const MashImage_1 = require("@/components/elements/MashImage");
const next_i18next_1 = require("next-i18next");
const SearchResultsBase = ({ searchTerm, id }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { data: searchResults } = (0, useSearch_1.default)(searchTerm);
    const [activeIndex, setActiveIndex] = react_1.default.useState(null);
    const handleMenuClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    const renderResultIcon = (result) => {
        var _a;
        if (result.photoUrl && !result.icon) {
            return (<MashImage_1.MashImage className={result.type === "user" ? "mask mask-blob" : "mask mask-hex"} height={38} width={38} src={result.photoUrl} alt=""/>);
        }
        const iconClass = "mask mask-blob flex h-9 w-9 items-center justify-center bg-primary-500/10 text-xs font-bold text-primary-500 dark:bg-primary-500/20";
        if (result.icon && !result.photoUrl) {
            return (<div className={iconClass}>
          <react_2.Icon icon={result.icon} className="h-4 w-4"/>
        </div>);
        }
        return (<div className={iconClass}>
        <span>{(_a = result.title) === null || _a === void 0 ? void 0 : _a.charAt(0)}</span>
      </div>);
    };
    const renderSubMenu = (result, i) => (<div className="bg-muted-50 dark:bg-muted-900 rounded-b-lg border-b border-x border-muted-200 dark:border-muted-800 ml-4">
      {result.subMenu.map((sub, j) => (<a key={j} href={sub.href} className={`group flex items-center gap-2 p-2 transition-all duration-300 hover:bg-muted-150 dark:hover:bg-muted-850 ${j === result.subMenu.length - 1
                ? "rounded-b-lg"
                : "border-b border-muted-200 dark:border-muted-700"}`}>
          {sub.icon && (<div className="mask mask-blob flex h-9 w-9 items-center justify-center bg-primary-500/10 text-xs font-bold text-primary-500 dark:bg-primary-500/20">
              <react_2.Icon icon={sub.icon} className="h-4 w-4"/>
            </div>)}
          <div className="font-sans">
            <span className="block text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
              {sub.title}
            </span>
          </div>
          <div className="me-2 ms-auto">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <react_2.Icon icon="lucide:arrow-right" className="h-3 w-3 -translate-x-1 text-primary-500 transition-transform duration-300 group-hover:translate-x-0"/>
            </div>
          </div>
        </a>))}
    </div>);
    const renderResults = () => searchResults.map((result, i) => (<div key={i}>
        <a href={result.href} className={`group flex items-center gap-2 p-2 transition-all duration-100 hover:bg-muted-100 dark:hover:bg-muted-850 ${activeIndex === i
            ? "bg-muted-100 dark:bg-muted-950 rounded-t-lg rounded-bl-lg border-t border-x border-muted-200 dark:border-muted-700"
            : "rounded-lg"}`} onClick={(e) => {
            if (result.subMenu) {
                e.preventDefault();
                handleMenuClick(i);
            }
        }}>
          {renderResultIcon(result)}
          <div className="font-sans">
            <span className="block text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
              {result.title}
            </span>
            <span className="block text-xs leading-tight text-muted-400">
              {result.content}
            </span>
          </div>
          <div className="me-2 ms-auto">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-primary-500/10 transition-opacity duration-300 group-hover:opacity-100 ${result.subMenu ? "" : "opacity-0"}`}>
              <react_2.Icon icon={result.subMenu ? "lucide:chevron-down" : "lucide:arrow-right"} className={`h-3 w-3 text-primary-500 transition-transform duration-300 ${activeIndex === i ? "rotate-180" : ""}`}/>
            </div>
          </div>
        </a>
        {result.subMenu && activeIndex === i && renderSubMenu(result, i)}
      </div>));
    return (<div id={`${id}-static-results`} className={`slimscroll absolute left-0 top-12 z-5 max-h-[285px] w-full overflow-y-auto rounded-lg border border-muted-200 bg-white p-2 shadow-lg shadow-muted-300/30 transition-all duration-300 dark:border-muted-800 dark:bg-muted-900 dark:shadow-muted-800/30 ${searchTerm.length > 0
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-[5px] opacity-0"}`}>
      {searchResults.length > 0 ? (renderResults()) : (<div className="flex min-h-[255px] items-center justify-center px-8">
          <div className="text-center font-sans">
            <react_2.Icon icon="ph:robot-duotone" className="mx-auto mb-2 h-12 w-12 text-muted-400"/>
            <h3 className="font-medium text-muted-800 dark:text-muted-100">
              {t("No Matching Results")}
            </h3>
            <p className="mx-auto max-w-[420px] text-sm text-muted-400">
              {t("Sorry, we couldn't find any matching records. Please try different search terms.")}
            </p>
          </div>
        </div>)}
    </div>);
};
exports.SearchResults = SearchResultsBase;
