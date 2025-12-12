"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/components/Div.tsx
const react_1 = __importDefault(require("react"));
const core_1 = require("@craftjs/core");
const Resizer_1 = __importDefault(require("./Resizer"));
const Div = ({ children, className }) => {
    const { connectors } = (0, core_1.useNode)();
    return (<Resizer_1.default ref={(ref) => {
            if (ref)
                connectors.connect(ref);
        }} propKey={{ width: "width", height: "height" }}>
      <div className={className}>{children}</div>
    </Resizer_1.default>);
};
Div.craft = {
    displayName: "Div",
    props: {},
    isCanvas: true,
    rules: {
        canDrag: () => true,
        canDrop: () => true,
        canMoveIn: () => true,
        canMoveOut: () => true,
    },
};
exports.default = Div;
