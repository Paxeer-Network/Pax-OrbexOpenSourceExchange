"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentProvider = exports.EditorProvider = void 0;
const react_1 = __importDefault(require("react"));
const Editor_1 = __importDefault(require("./editor/Editor"));
const ContentProviderBase = ({ data }) => {
    return (<div className="h-full">
      <Editor_1.default data={data}/>
    </div>);
};
const EditorProvider = ({}) => (<ContentProviderBase data={null}/>);
exports.EditorProvider = EditorProvider;
const ContentProvider = ({ data }) => (<ContentProviderBase data={data}/>);
exports.ContentProvider = ContentProvider;
