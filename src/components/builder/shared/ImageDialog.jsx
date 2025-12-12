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
const InputFile_1 = __importDefault(require("@/components/elements/form/input-file/InputFile"));
const upload_1 = require("@/utils/upload");
const next_i18next_1 = require("next-i18next");
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Content = ({ url, text, setText, onChange, setUrl, }) => {
    const inputRef = (0, react_1.useRef)(null);
    const { t } = (0, next_i18next_1.useTranslation)();
    const handleRemoveFile = () => {
        setText("");
        onChange();
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };
    return (<div className="mt-4 mb-4">
      <div ref={inputRef}>
        <InputFile_1.default id="image" acceptedFileTypes={[
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/gif",
            "image/svg+xml",
            "image/webp",
        ]} preview={url && url !== "" ? url : null} previewPlaceholder="/img/placeholder.svg" maxFileSize={16} label={`${t("Max File Size")}: ${16} MB`} bordered color="default" onChange={(files) => {
            if (files.length) {
                (0, upload_1.imageUploader)({
                    file: files[0],
                    dir: "theme",
                    size: {
                        maxWidth: 1980,
                        maxHeight: 1080,
                    },
                }).then((response) => {
                    if (response.success) {
                        setUrl(response.url);
                    }
                });
            }
        }} onRemoveFile={handleRemoveFile}/>
        <div className="flex justify-center my-4">OR</div>
        <div className="flex justify-center mb-4 items-end gap-2">
          <Input_1.default type="text" shape="rounded-sm" label="URL" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Eg. https://www.w3schools.com/html/pic_trulli.jpg" value={text} onChange={(e) => setText(e.target.value)}/>
          <Button_1.default onClick={onChange} variant="solid" color="primary" shape="rounded-sm" disabled={text === ""}>
            Set
          </Button_1.default>
        </div>
      </div>
    </div>);
};
const Dialog = ({ open, setOpen, node, actions }) => {
    var _a, _b, _c;
    const props = node.data.props;
    const propId = props.propId;
    const [url, setUrl] = (0, react_1.useState)((_b = (_a = props[propId]) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : (_c = node.dom) === null || _c === void 0 ? void 0 : _c.src);
    const [text, setText] = (0, react_1.useState)(url);
    const onChange = () => {
        setUrl(text);
    };
    return (<Modal_1.default open={open} size="xl">
      <Card_1.default shape="smooth">
        <div className="flex items-center justify-between p-4 md:p-6">
          <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
            Upload Image
          </p>
          <IconButton_1.default size="sm" shape="full" onClick={() => setOpen(false)}>
            <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
          </IconButton_1.default>
        </div>
        <div className="p-4 md:px-6 md:py-8">
          <Content url={url} text={text} setText={setText} onChange={onChange} setUrl={(e) => {
            setText(e);
            setUrl(e);
        }}/>
        </div>
        <div className="p-4 md:p-6">
          <div className="flex w-full justify-end gap-2">
            <Button_1.default shape="smooth" onClick={() => setOpen(false)}>
              Cancel
            </Button_1.default>
            <Button_1.default variant="solid" color="primary" shape="smooth" onClick={() => {
            actions.setProp(node.id, (prop) => {
                if (!prop[propId])
                    prop[propId] = {};
                prop[propId].url = url;
            });
            setOpen(false);
        }} disabled={!url}>
              Save
            </Button_1.default>
          </div>
        </div>
      </Card_1.default>
    </Modal_1.default>);
};
exports.default = Dialog;
