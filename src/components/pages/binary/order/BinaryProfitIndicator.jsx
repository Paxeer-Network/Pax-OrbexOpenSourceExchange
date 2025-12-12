"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const BinaryProfitIndicator = ({ profit, }) => {
    return (<div className="text-lg font-bold text-center text-success-500">
      <span className="text-4xl">{profit}</span>%
    </div>);
};
exports.default = BinaryProfitIndicator;
