"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Table = ({ className: classes = "", children, ...props }) => {
    return (<table className={`w-full overflow-auto ${classes}`} {...props}>
      {children}
    </table>);
};
exports.default = Table;
