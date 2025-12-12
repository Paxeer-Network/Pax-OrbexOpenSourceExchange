"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const ChartWrapper = ({ children, label, className: classes = "", }) => (<div className={`w-full ${classes}`}>
    <Card_1.default shape="smooth" color="contrast" className="p-4">
      <div className="p-4">
        <h3 className="font-sans text-base font-medium leading-tight text-muted-800 dark:text-muted-100">
          {label}
        </h3>
      </div>
      {children}
    </Card_1.default>
  </div>);
exports.default = ChartWrapper;
