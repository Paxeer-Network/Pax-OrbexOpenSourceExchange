"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const builder_1 = __importDefault(require("@/stores/admin/builder"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const BuilderSidebarIcon = ({ icon, name }) => {
    const { sidebar, setSidebar } = (0, builder_1.default)();
    return (<li className={`side-icon group/side-icon relative flex h-[52px] w-full cursor-pointer items-center justify-center ${sidebar === name ? "is-active" : ""}`} onClick={() => (sidebar === name ? setSidebar("") : setSidebar(name))}>
      <Tooltip_1.Tooltip content={name} position="end">
        <div className={`side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 ${sidebar === name
            ? "bg-primary-500/10 dark:bg-primary-500/20"
            : "bg-muted-200 dark:bg-muted-800"}`}>
          <react_2.Icon icon={icon} className={`relative h-7 w-7 text-muted-600 dark:text-muted-400 transition-colors duration-300 ${sidebar === name
            ? "text-primary-500"
            : "group-hover/side-icon:text-muted-500 dark:group-hover/side-icon:text-muted-300"}`}/>
        </div>
      </Tooltip_1.Tooltip>
    </li>);
};
exports.default = BuilderSidebarIcon;
