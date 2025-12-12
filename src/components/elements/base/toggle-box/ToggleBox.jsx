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
const react_1 = __importStar(require("react"));
const react_2 = require("@iconify/react");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const ToggleBox = ({ header, children, title, shape = "smooth", color = "contrast", growOnExpand, spaced, isToggle = false, open = false, }) => {
    var _a;
    const [panelOpened, setPanelOpened] = (0, react_1.useState)(open);
    (0, react_1.useEffect)(() => {
        setPanelOpened(open);
    }, [open]);
    const toggleBoxContentRef = (0, react_1.useRef)(null);
    return (<Card_1.default shape={shape} color={color} shadow={panelOpened ? "flat" : "none"} className={` 
        ${panelOpened && growOnExpand ? "md:p-6" : ""}
        ${spaced ? "p-6" : "p-4"}
      `}>
      <div role="button" className={`flex items-center justify-between ${panelOpened ? "" : ""} ${isToggle ? "cursor-pointer" : ""}`} onClick={() => {
            setPanelOpened(!panelOpened);
        }}>
        {header ? (<div>{header}</div>) : (<div>
            <h5 className="font-sans text-sm font-medium text-muted-800 dark:text-muted-100">
              {title}
            </h5>
          </div>)}
        <div className={`pointer-events-none transition-all duration-300 ${panelOpened ? "rotate-90" : " hover:rotate-90"} ${isToggle
            ? "flex h-8 w-8 items-center justify-center rounded-full text-muted-400 hover:bg-muted-100 dark:hover:bg-muted-800 [&>svg]:h-4"
            : ""}`}>
          <react_2.Icon icon="lucide:chevron-right" className="text-muted-400"/>
        </div>
      </div>
      <div ref={toggleBoxContentRef} style={{
            maxHeight: panelOpened
                ? ((_a = toggleBoxContentRef.current) === null || _a === void 0 ? void 0 : _a.scrollHeight) + "px"
                : "0px",
        }} className={`grid grid-cols-1 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${panelOpened ? "mt-3" : " mt-0"}`}>
        {children}
      </div>
    </Card_1.default>);
};
exports.default = ToggleBox;
