"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/components/Sidebar/Category.tsx
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const framer_motion_1 = require("framer-motion");
const Category = ({ title, height, children, visible, setVisible, }) => {
    return (<div className="flex flex-col text-muted-800 dark:text-muted-200">
      <div className="flex items-center cursor-pointer p-2 px-4 border-b border-muted-300 dark:border-muted-600" onClick={setVisible}>
        <h2 className="text-xs uppercase">{title}</h2>
        <react_2.Icon icon="akar-icons:chevron-down" className={`w-4 h-4 ml-auto transition-transform ${visible ? "rotate-180" : "rotate-0"}`}/>
      </div>
      {visible && (<framer_motion_1.motion.div initial={{ height: 0 }} animate={{ height: height || "auto" }} className="overflow-auto">
          {children}
        </framer_motion_1.motion.div>)}
    </div>);
};
exports.default = Category;
