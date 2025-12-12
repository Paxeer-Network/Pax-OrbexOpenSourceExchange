"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarItem = void 0;
const react_1 = __importDefault(require("react"));
const ToolbarTextInput_1 = require("./ToolbarTextInput");
const ToolbarDropdown_1 = require("./ToolbarDropdown");
const core_1 = require("@craftjs/core");
const ToolbarItem = ({ full = false, propKey, type, onChange, index, ...props }) => {
    const { actions: { setProp }, propValue, } = (0, core_1.useNode)((node) => ({
        propValue: node.data.props[propKey],
    }));
    const value = Array.isArray(propValue) ? propValue[index] : propValue;
    return (<div style={{ display: "grid" }}>
      <div className="mb-2">
        {["text", "color", "bg", "number"].includes(type) ? (<ToolbarTextInput_1.ToolbarTextInput {...props} type={type} value={value} onChange={(value) => {
                setProp((props) => {
                    if (Array.isArray(propValue)) {
                        props[propKey][index] = onChange ? onChange(value) : value;
                    }
                    else {
                        props[propKey] = onChange ? onChange(value) : value;
                    }
                }, 500);
            }}/>) : type === "slider" ? (<>
            {props.label ? (<h4 className="text-sm text-gray-400">{props.label}</h4>) : null}
            <div />
          </>) : type === "radio" ? (<>
            {props.label ? (<h4 className="text-sm text-gray-400">{props.label}</h4>) : null}
            <input type="radio" value={value || 0} onChange={(e) => {
                const value = e.target.value;
                setProp((props) => {
                    props[propKey] = onChange ? onChange(value) : value;
                });
            }}>
              {props.children}
            </input>
          </>) : type === "select" ? (<ToolbarDropdown_1.ToolbarDropdown value={value || ""} onChange={(value) => setProp((props) => (props[propKey] = onChange ? onChange(value) : value))} {...props}/>) : null}
      </div>
    </div>);
};
exports.ToolbarItem = ToolbarItem;
