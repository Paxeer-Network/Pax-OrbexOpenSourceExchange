"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Svg = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@craftjs/core");
const Svg = ({ r, propId }) => {
    var _a;
    const { connectors, node } = (0, core_1.useNode)((node) => ({ node }));
    const path = (_a = node.data.props[propId]) === null || _a === void 0 ? void 0 : _a.path;
    const nodes = r.childNodes.filter((c) => c.tagName === "PATH");
    return (<svg ref={(ref) => {
            if (ref)
                connectors.connect(ref);
        }} className={r.classNames} key={propId} height={r.attrs["height"]} width={r.attrs["width"]} fill={r.attrs["fill"]} viewBox={r.attrs["viewbox"]} stroke={r.attrs["stroke"]} xmlns={r.attrs["xmlns"]}>
      {nodes
            .filter((_, i) => i === 0 || !path)
            .map((c, i) => (<path key={propId + i.toString()} d={path !== null && path !== void 0 ? path : c.attrs["d"]} fillRule={c.attrs["fill-rule"]} clipRule={c.attrs["clip-rule"]} strokeLinecap={c.attrs["stroke-linecap"]} strokeLinejoin={c.attrs["stroke-linejoin"]} strokeWidth={c.attrs["stroke-width"]} stroke={c.attrs["stroke"]} fill={c.attrs["fill"]}/>))}
    </svg>);
};
exports.Svg = Svg;
Svg.craft = {
    displayName: "Svg",
    props: {},
    rules: {
        canDrag: () => true,
    },
    related: {},
};
