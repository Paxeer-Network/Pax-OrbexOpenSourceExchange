"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/components/Block.tsx
const react_1 = __importDefault(require("react"));
const core_1 = require("@craftjs/core");
const Child_1 = __importDefault(require("./Child")); // Your existing Child component
const Block = ({ root }) => {
    const { connectors } = (0, core_1.useNode)();
    return (<div ref={(ref) => {
            if (ref)
                connectors.connect(ref);
        }}>
      <Child_1.default root={root}/>
    </div>);
};
Block.craft = {
    displayName: "Block",
    props: {},
    isCanvas: true,
    rules: {
        canDrag: () => true,
        canMoveIn: () => true,
        canMoveOut: () => true,
    },
};
exports.default = Block;
