"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@craftjs/core");
const Child_1 = __importDefault(require("./Child"));
const link_1 = __importDefault(require("next/link"));
const handleClick = (props) => {
    var _a;
    const link = (props === null || props === void 0 ? void 0 : props.link) || "#";
    if (props === null || props === void 0 ? void 0 : props.newTab) {
        (_a = window.open(link, "_blank")) === null || _a === void 0 ? void 0 : _a.focus();
    }
    else {
        location.href = link;
    }
};
const Link = ({ r, d, i, propId }) => {
    var _a, _b;
    const { node } = (0, core_1.useNode)((node) => ({ node }));
    const { enabled } = (0, core_1.useEditor)((state) => ({
        enabled: state.options.enabled,
    }));
    const { connectors } = (0, core_1.useNode)((node) => ({ node }));
    const { ["class"]: foo, ...attrsR } = r.attrs;
    const onClick = (e) => {
        e.preventDefault();
        if (!enabled)
            handleClick(node.data.props[propId]);
    };
    const link = ((_a = node.data.props[propId]) === null || _a === void 0 ? void 0 : _a.link) || "#";
    const linkContent = <Child_1.default root={r} d={d.concat(i)}/>;
    return enabled ? (<a ref={(ref) => connectors.connect(ref)} {...attrsR} href={link} className={r.classNames} onClick={onClick}>
      {linkContent}
    </a>) : (<link_1.default href={link} className={r.classNames} passHref target={((_b = node.data.props[propId]) === null || _b === void 0 ? void 0 : _b.newTab) ? "_blank" : ""}>
      {linkContent}
    </link_1.default>);
};
exports.Link = Link;
Link.craft = {
    displayName: "Link",
    props: {},
    rules: {
        canDrag: () => true,
    },
    related: {},
};
