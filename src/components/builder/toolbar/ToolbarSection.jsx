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
exports.ToolbarSection = void 0;
const core_1 = require("@craftjs/core");
const react_1 = __importStar(require("react"));
const cn_1 = require("@/utils/cn");
const react_2 = require("@iconify/react");
const framer_motion_1 = require("framer-motion");
const ToolbarSection = ({ title, props, summary, children }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { nodeProps } = (0, core_1.useNode)((node) => ({
        nodeProps: props &&
            props.reduce((res, key) => {
                res[key] = node.data.props[key] || null;
                return res;
            }, {}),
    }));
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };
    return (<div className="text-muted-800 dark:text-muted-200">
      <div className={(0, cn_1.cn)("cursor-pointer flex justify-between items-center py-2 px-2", "border-b border-muted-300 dark:border-muted-700")} onClick={handleToggle}>
        <div className="flex items-center space-x-4">
          <framer_motion_1.motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <react_2.Icon icon={"mdi:chevron-right"} className="w-4 h-4 dark:text-muted-400"/>
          </framer_motion_1.motion.div>
          <h5 className="text-sm font-medium text-muted-800 dark:text-muted-300">
            {title}
          </h5>
        </div>
        {summary && props ? (<h5 className="text-sm text-right text-blue-800 dark:text-muted-300">
            {summary(props.reduce((acc, key) => {
                acc[key] = nodeProps[key];
                return acc;
            }, {}))}
          </h5>) : null}
      </div>
      <framer_motion_1.AnimatePresence initial={false}>
        {isOpen && (<framer_motion_1.motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="p-2 bg-muted-100 dark:bg-muted-900 flex flex-wrap shadow-inner">
              {children}
            </div>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>
    </div>);
};
exports.ToolbarSection = ToolbarSection;
exports.default = exports.ToolbarSection;
