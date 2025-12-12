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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const react_1 = __importStar(require("react"));
const api_1 = __importDefault(require("@/utils/api"));
const ToggleSwitch_1 = __importDefault(require("@/components/elements/form/toggle-switch/ToggleSwitch"));
const SwitchBase = ({ initialState, endpoint, active = true, disabled = false, onUpdate, }) => {
    const [isEnabled, setIsEnabled] = (0, react_1.useState)(initialState);
    (0, react_1.useEffect)(() => {
        setIsEnabled(initialState);
    }, [initialState]);
    const handleChange = (0, react_1.useCallback)(async () => {
        const newValue = !isEnabled;
        const { error } = await (0, api_1.default)({
            url: endpoint,
            method: "PUT",
            body: { status: newValue ? active : disabled },
        });
        if (!error) {
            setIsEnabled(newValue);
            if (onUpdate)
                onUpdate(newValue);
        }
    }, [isEnabled, active, disabled, endpoint, onUpdate]);
    return (<ToggleSwitch_1.default id={endpoint} color={isEnabled ? "success" : "danger"} checked={isEnabled} onChange={handleChange}/>);
};
exports.Switch = SwitchBase;
