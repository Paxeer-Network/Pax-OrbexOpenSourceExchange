"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elements = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@craftjs/core");
const react_2 = require("@iconify/react");
const Elements = ({}) => {
    const { connectors: { create }, } = (0, core_1.useEditor)();
    const elements = [];
    return (<div className="grid grid-cols-3 gap-3 w-full p-3">
      {elements.map(({ component, icon, label }, index) => (<div key={index} className="w-full" ref={(ref) => {
                if (ref)
                    create(ref, component);
            }}>
          <Item move>
            <react_2.Icon icon={icon} className="h-6 w-6"/>
            <span>{label}</span>
          </Item>
        </div>))}
    </div>);
};
exports.Elements = Elements;
const Item = ({ move, children }) => (<span style={{ cursor: move ? "move" : "pointer" }} className="w-full cursor-pointer flex flex-col items-center justify-start border px-1 py-3 rounded-md bg-muted-100 dark:bg-muted-900 text-muted-900 dark:text-muted-100 transition-all gap-2 text-sm hover:bg-muted-200 dark:hover:bg-muted-800 border-muted-300 dark:border-muted-700">
    {children}
  </span>);
exports.default = exports.Elements;
