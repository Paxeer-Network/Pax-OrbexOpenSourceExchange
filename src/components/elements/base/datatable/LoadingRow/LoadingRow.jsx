"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingRow = void 0;
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const react_loading_skeleton_1 = __importDefault(require("react-loading-skeleton"));
require("react-loading-skeleton/dist/skeleton.css");
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const dashboard_1 = require("@/stores/dashboard");
const LoadingRowBase = ({ columnConfig, canDelete, isCrud, hasActions, }) => {
    const { isDark } = (0, dashboard_1.useDashboardStore)();
    const [skeletonProps, setSkeletonProps] = (0, react_1.useState)({
        baseColor: "#f7fafc",
        highlightColor: "#edf2f7",
    });
    (0, react_1.useEffect)(() => {
        setSkeletonProps({
            baseColor: isDark ? "#27272a" : "#f7fafc",
            highlightColor: isDark ? "#3a3a3e" : "#edf2f7",
        });
    }, [isDark]);
    const renderSkeleton = (type, hasImage) => {
        if (hasImage) {
            return (<div className="flex items-center gap-2 pl-4">
          <react_loading_skeleton_1.default width={25.6} height={25.6} circle {...skeletonProps}/>
          <react_loading_skeleton_1.default width={48} height={9.6} {...skeletonProps}/>
        </div>);
        }
        switch (type) {
            case "switch":
                return (<react_loading_skeleton_1.default width={36.8} height={20.8} borderRadius={40} {...skeletonProps}/>);
            case "select":
                return (<react_loading_skeleton_1.default width={64} height={22.4} borderRadius={6.4} {...skeletonProps}/>);
            default:
                return (<span className="line-clamp-1 text-sm">
            <react_loading_skeleton_1.default width="100%" height={12} {...skeletonProps}/>
          </span>);
        }
    };
    return (<>
      {Array.from({ length: 3 }).map((_, index) => (<framer_motion_1.motion.tr key={index} initial={{ opacity: 0, x: -2 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 2 }} transition={{ duration: 0.2 }} className="border-b border-muted-200 transition-colors duration-300 last:border-none hover:bg-muted-200/40 dark:border-muted-800 dark:hover:bg-muted-900/60 h-16">
          {canDelete && isCrud && (<td className="px-4 pt-2">
              <Checkbox_1.default className="cursor-pointer" color="primary"/>
            </td>)}
          {columnConfig.map(({ field, type, hasImage }) => (<td key={field} className="px-4 py-3 align-middle">
              {renderSkeleton(type, hasImage)}
            </td>))}
          {hasActions && (<td className="px-4 py-3 align-middle">
              <div className="flex w-full justify-end">
                <react_loading_skeleton_1.default width={32} height={32} circle {...skeletonProps}/>
              </div>
            </td>)}
        </framer_motion_1.motion.tr>))}
    </>);
};
exports.LoadingRow = LoadingRowBase;
