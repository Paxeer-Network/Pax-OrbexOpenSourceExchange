"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@craftjs/core");
const Image = ({ d: _d, i: _i, classNames, attrs, propId, }) => {
    var _a, _b;
    const { connectors } = (0, core_1.useNode)((node) => ({ node }));
    const { node } = (0, core_1.useNode)((node) => ({ node }));
    // Ensure attrs is defined and provide a default value if it's undefined
    const url = (_b = (_a = node.data.props[propId]) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : (attrs ? attrs.src : "");
    // Ensure attrs is defined and destructure it safely
    const { ["class"]: foo, ...attrsR } = attrs || {};
    return (<img ref={(ref) => connectors.connect(ref)} className={classNames} {...attrsR} src={url} alt={attrs === null || attrs === void 0 ? void 0 : attrs.alt}/>);
};
exports.Image = Image;
exports.Image.craft = {
    displayName: "Image",
    props: {},
    rules: {
        canDrag: () => true,
    },
    related: {},
};
