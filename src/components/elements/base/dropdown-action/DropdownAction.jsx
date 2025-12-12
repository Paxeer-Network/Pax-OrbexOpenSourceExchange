"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const Dropdown_1 = __importDefault(require("@/components/elements/base/dropdown/Dropdown"));
const DropdownAction = ({ title, orientation, showAll, toggleIcon = "lucide:more-horizontal", toggleImage, children, className: classes = "", canRotate = false, width = 240, }) => {
    return (<Dropdown_1.default title={title !== null && title !== void 0 ? title : ""} indicator={false} showAll={showAll !== null && showAll !== void 0 ? showAll : ""} orientation={orientation} canRotate={canRotate} toggleIcon={toggleIcon} toggleClassNames="border-muted-200 dark:border-transparent shadow-lg shadow-muted-300/30 dark:shadow-muted-800/30 dark:hover:bg-muted-900 border dark:hover:border-muted-800 rounded-full" toggleImage={toggleImage ? (<>{toggleImage}</>) : (<react_2.Icon icon={toggleIcon} className="h-5 w-5 text-muted-400 transition-colors duration-300 group-hover:text-primary-500"/>)} className={`${classes}`} width={width}>
      {children}
    </Dropdown_1.default>);
};
exports.default = DropdownAction;
