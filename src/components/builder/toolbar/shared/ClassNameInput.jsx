"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const ClassNameInput = ({ value, onChange, onKeyPress, placeholder }) => (<Input_1.default value={value} onChange={onChange} onKeyPress={onKeyPress} placeholder={placeholder} size="sm" shape={"rounded-xs"}/>);
exports.default = ClassNameInput;
