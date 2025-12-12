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
const react_1 = __importStar(require("react"));
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const Dialog = ({ open, setOpen, node, actions }) => {
    var _a, _b, _c, _d;
    const props = node.data.props;
    const key = props.propId;
    const [link, setLink] = (0, react_1.useState)((_b = (_a = node.data.props[key]) === null || _a === void 0 ? void 0 : _a.link) !== null && _b !== void 0 ? _b : (_c = node.dom) === null || _c === void 0 ? void 0 : _c.href);
    const [newTab, setNewTab] = (0, react_1.useState)((_d = node.data.props[key]) === null || _d === void 0 ? void 0 : _d.newTab);
    return (<Modal_1.default open={open} size="md">
      <Card_1.default shape="smooth">
        <div className="flex items-center justify-between p-4 md:p-6">
          <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
            Update Link
          </p>
          <IconButton_1.default size="sm" shape="full" onClick={() => setOpen(false)}>
            <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
          </IconButton_1.default>
        </div>
        <div className="p-4 md:px-6">
          <Input_1.default type="text" shape="rounded-sm" label="URL" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-4" placeholder="Eg. https://paxeer.app/user" defaultValue={link} onChange={(e) => setLink(e.target.value)}/>
        </div>
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <Checkbox_1.default label="Open in new tab" type="checkbox" color={"primary"} onChange={(e) => setNewTab(e.target.checked)}/>
            </div>
            <div className="flex w-full justify-end gap-2">
              <Button_1.default shape="smooth" onClick={() => setOpen(false)}>
                Cancel
              </Button_1.default>
              <Button_1.default variant="solid" color="primary" shape="smooth" onClick={() => {
            actions.setProp(node.id, (prop) => {
                if (!prop[key])
                    prop[key] = {};
                prop[key].link = link;
                prop[key].newTab = newTab;
            });
            setOpen(false);
        }}>
                Save
              </Button_1.default>
            </div>
          </div>
        </div>
      </Card_1.default>
    </Modal_1.default>);
};
exports.default = Dialog;
