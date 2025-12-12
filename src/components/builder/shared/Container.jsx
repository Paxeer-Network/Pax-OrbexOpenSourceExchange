"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@craftjs/core");
const Container = ({ children }) => {
    const { connectors } = (0, core_1.useNode)();
    return (<div ref={(ref) => {
            connectors.connect(ref);
        }} style={{ width: "100%", minHeight: "800px" }} className="bg-white">
      {children}
    </div>);
};
exports.Container = Container;
exports.Container.craft = {
    displayName: "Container",
    props: {},
    rules: {
        canDrag: () => true,
    },
    related: {},
};
