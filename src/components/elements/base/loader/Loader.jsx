"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Loader = ({ thickness = 5, classNames, size = 50 }) => {
    return (<span className={classNames}>
      <svg className={`loader`} viewBox="0 0 50 50" height={size} width={size}>
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth={thickness}></circle>
      </svg>
    </span>);
};
exports.default = Loader;
