"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const react_1 = __importStar(require("react"));
const core_1 = require("@craftjs/core");
const Text = (props) => {
    var _a, _b;
    const { node, connectors, actions } = (0, core_1.useNode)((node) => ({ node }));
    const { enabled } = (0, core_1.useEditor)((state) => ({
        enabled: state.options.enabled,
    }));
    const [textEdit, setTextEdit] = (0, react_1.useState)((_b = (_a = node.data.props[props.id]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : props.text);
    const [textPreview, setTextPreview] = (0, react_1.useState)(textEdit);
    const onChange = (e) => {
        actions.setProp((prop) => {
            if (!prop[props.id])
                prop[props.id] = {};
            prop[props.id].text = e.target.innerText;
            setTextPreview(e.target.innerText);
        }, 500);
    };
    const onClick = (e) => {
        if (enabled) {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    (0, react_1.useEffect)(() => {
        var _a, _b;
        setTextEdit((_b = (_a = node.data.props[props.id]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : props.text);
    }, [enabled]);
    return enabled ? (<span ref={(ref) => {
            if (ref)
                connectors.connect(ref);
        }} contentEditable suppressContentEditableWarning={true} className={props.className} onClick={onClick} onInput={onChange}>
      {textEdit}
    </span>) : (<span className={props.className}>{textPreview}</span>);
};
exports.Text = Text;
Text.craft = {
    displayName: "Text",
    props: {
        text: "",
    },
    related: {},
};
