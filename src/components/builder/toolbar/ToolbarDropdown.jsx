"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarDropdown = void 0;
const react_1 = __importDefault(require("react"));
const ToolbarDropdown = ({ title, value, onChange, children }) => {
    return (<div>
      <label>{title}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </div>);
};
exports.ToolbarDropdown = ToolbarDropdown;
