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
exports.ToolbarTextInput = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("react");
const react_color_1 = require("react-color");
const ToolbarTextInput = ({ onChange, value, prefix, label, type, ...props }) => {
    const [internalValue, setInternalValue] = (0, react_2.useState)(value);
    const [active, setActive] = (0, react_2.useState)(false);
    (0, react_1.useEffect)(() => {
        setInternalValue(value);
    }, [value, type]);
    return (<div style={{ width: "100%", position: "relative" }} onClick={() => {
            setActive(true);
        }}>
      {(type === "color" || type === "bg") && active ? (<div className="absolute" style={{
                zIndex: 99999,
                top: "calc(100% + 10px)",
                left: "-5%",
            }}>
          <div className="fixed top-0 left-0 w-full h-full cursor-pointer" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActive(false);
            }}></div>
          <react_color_1.ChromePicker color={value} onChange={(color) => {
                onChange(color.rgb);
            }}/>
        </div>) : null}
      <input style={{ margin: 0, width: "100%" }} value={internalValue || ""} onKeyDown={(e) => {
            if (e.key === "Enter") {
                onChange(e.target.value);
            }
        }} onChange={(e) => {
            setInternalValue(e.target.value);
        }} {...props}/>
    </div>);
};
exports.ToolbarTextInput = ToolbarTextInput;
