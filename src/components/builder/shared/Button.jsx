"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@craftjs/core");
const Child_1 = __importDefault(require("./Child"));
const handleClick = (props, e) => {
    var _a;
    if ((props === null || props === void 0 ? void 0 : props.type) === "url") {
        if (props === null || props === void 0 ? void 0 : props.newTab) {
            (_a = window.open(props.url, "_blank")) === null || _a === void 0 ? void 0 : _a.focus();
        }
        else {
            location.href = props.url;
        }
    }
    else if ((props === null || props === void 0 ? void 0 : props.type) === "email") {
        location.href = `mailto:${props.email}`;
    }
    else if ((props === null || props === void 0 ? void 0 : props.type) === "submit") {
        const form = e.target.closest("form");
        if (!(props === null || props === void 0 ? void 0 : props.submitAsync)) {
            form.submit();
            return;
        }
        const formData = new FormData();
        for (const e of form.elements) {
            if (e.type !== "submit") {
                formData.append(e.id, e.type === "radio" ? e.checked : e.value);
            }
        }
        const options = {
            method: props.submitMethod,
            ...(props.submitMethod !== "GET" ? { body: formData } : {}),
        };
        fetch(props.submitUrl, options)
            .then((e) => e.text().then((d) => ({ ok: e.ok, text: d })))
            .then(({ ok, text }) => {
            alert(ok ? text !== null && text !== void 0 ? text : "All good" : "Something went wrong");
        });
    }
};
const Button = ({ r, d, i, propId }) => {
    const { node } = (0, core_1.useNode)((node) => ({ node }));
    const { enabled } = (0, core_1.useEditor)((state) => ({
        enabled: state.options.enabled,
    }));
    const { connectors } = (0, core_1.useNode)((node) => ({ node }));
    const { ["class"]: foo, ...attrsR } = r.attrs;
    const onClick = (e) => {
        e.preventDefault();
        if (!enabled)
            handleClick(node.data.props[propId], e);
    };
    return (<button ref={(ref) => connectors.connect(ref)} {...attrsR} className={r.classNames} onClick={onClick}>
      <Child_1.default root={r} d={d.concat(i)}/>
    </button>);
};
exports.Button = Button;
Button.craft = {
    displayName: "Button",
    props: {},
    rules: {
        canDrag: () => true,
    },
    related: {},
};
