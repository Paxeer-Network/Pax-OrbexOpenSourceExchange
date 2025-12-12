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
exports.DEFAULT_TEMPLATE = void 0;
const react_1 = __importStar(require("react"));
const core_1 = require("@craftjs/core");
const EditorElement_1 = __importDefault(require("./EditorElement"));
const Container_1 = require("../shared/Container");
const fetch_1 = require("../utils/fetch");
const ThemeContext_1 = require("@/context/ThemeContext");
const viewport_1 = __importDefault(require("../viewport"));
const lodash_1 = require("lodash");
exports.DEFAULT_TEMPLATE = {
    ROOT: {
        type: { resolvedName: "Container" },
        isCanvas: true,
        props: { width: "100%", height: "800px" },
        displayName: "Container",
        custom: { displayName: "App" },
        parent: null,
        nodes: [],
        linkedNodes: {},
        hidden: false,
    },
};
const FrameEditor = ({ data }) => {
    const { actions } = (0, core_1.useEditor)();
    const [isDeserialized, setIsDeserialized] = (0, react_1.useState)(false);
    const loadData = async () => {
        const result = await (0, fetch_1.loadTemplate)();
        actions.deserialize(result.ROOT ? result : exports.DEFAULT_TEMPLATE);
        setIsDeserialized(true);
    };
    const debounceLoadData = (0, lodash_1.debounce)(loadData, 100);
    (0, react_1.useEffect)(() => {
        if (!data && !isDeserialized) {
            debounceLoadData();
        }
    }, [data, isDeserialized]);
    if (data) {
        let parsedData;
        try {
            parsedData = typeof data === "string" ? JSON.parse(data) : data;
        }
        catch (error) {
            parsedData = exports.DEFAULT_TEMPLATE;
        }
        if (parsedData.ROOT && parsedData.ROOT.type) {
            return <core_1.Frame data={parsedData}/>;
        }
        else {
            return <core_1.Frame data={exports.DEFAULT_TEMPLATE}/>;
        }
    }
    return (<ThemeContext_1.ThemeProvider>
      <viewport_1.default>
        <core_1.Frame>
          <core_1.Element canvas is={Container_1.Container} custom={{ displayName: "App" }}/>
        </core_1.Frame>
      </viewport_1.default>
    </ThemeContext_1.ThemeProvider>);
};
const Editor = ({ data }) => {
    const { resolver } = (0, react_1.useContext)(ThemeContext_1.ThemeContext);
    return (<core_1.Editor resolver={resolver} enabled={!data} onRender={({ render }) => <EditorElement_1.default render={render}/>}>
      <FrameEditor data={data}/>
    </core_1.Editor>);
};
exports.default = Editor;
