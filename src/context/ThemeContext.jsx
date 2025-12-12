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
exports.ThemeProvider = exports.ThemeContext = void 0;
const react_1 = __importStar(require("react"));
const core_1 = require("@craftjs/core");
const Child_1 = __importDefault(require("../components/builder/shared/Child"));
const Container_1 = require("../components/builder/shared/Container");
const Text_1 = require("../components/builder/shared/Text");
const Link_1 = require("../components/builder/shared/Link");
const Svg_1 = require("../components/builder/shared/Svg");
const Button_1 = require("../components/builder/shared/Button");
const Image_1 = require("../components/builder/shared/Image");
const Child_2 = require("../components/builder/shared/Child");
const fetch_1 = require("../components/builder/utils/fetch");
const lodash_1 = require("lodash");
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const Radio_1 = __importDefault(require("@/components/elements/form/radio/Radio"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Div_1 = __importDefault(require("@/components/builder/shared/Div"));
const Block_1 = __importDefault(require("@/components/builder/shared/Block"));
const themes = [
    { name: "Hyper UI", folder: "hyperui" },
    { name: "Tailblocks", folder: "tailblocks" },
    { name: "Flowrift", folder: "flowrift" },
    { name: "Meraki UI", folder: "meraki-light" },
    { name: "Preline", folder: "preline" },
    { name: "Flowbite", folder: "flowbite" },
];
const _resolver = {
    Container: Container_1.Container,
    Component: Child_2.Component,
    Element: core_1.Element,
    Text: Text_1.Text,
    Child: Child_1.default,
    Link: Link_1.Link,
    Button: Button_1.Button,
    Image: Image_1.Image,
    Svg: Svg_1.Svg,
    Checkbox: Checkbox_1.default,
    Radio: Radio_1.default,
    Input: Input_1.default,
    Div: Div_1.default,
    Block: Block_1.default,
};
const defaultValue = {
    components: [],
    categories: [],
    themeNames: [],
    themeIndex: 0,
    updateIndex: () => { },
    resolver: _resolver,
};
const ThemeContext = (0, react_1.createContext)(defaultValue);
exports.ThemeContext = ThemeContext;
const ThemeProvider = ({ children }) => {
    const [themeIndex, setThemeIndex] = (0, react_1.useState)(defaultValue.themeIndex);
    const [components, setComponents] = (0, react_1.useState)(defaultValue.components);
    const [categories, setCategories] = (0, react_1.useState)(defaultValue.categories);
    const [resolver, _setResolver] = (0, react_1.useState)(defaultValue.resolver);
    const themeNames = themes.map((t) => t.name);
    const updateIndex = async (index) => {
        var _a;
        setThemeIndex(index);
        // set components
        const folder = (_a = themes[index]) === null || _a === void 0 ? void 0 : _a.folder;
        const url = (0, fetch_1.getThemeUrl)(folder);
        const data = await fetch(url).then((r) => r.json());
        const _components = data.map((c) => ({
            displayName: c.folder.replace(/(\d)/, " $1"),
            category: c.folder.replace(/\d/g, ""),
            source: c.source,
            themeFolder: folder,
            blockFolder: c.folder,
        }));
        // sort components
        const _coponentsSorted = _components.sort((a, b) => {
            return a.displayName.localeCompare(b.displayName, undefined, {
                numeric: true,
                sensitivity: "base",
            });
        });
        setComponents(_coponentsSorted);
        // set categories
        const _categories = _components.map((c) => c.category);
        setCategories([...new Set(_categories)]);
    };
    const debounceUpdateIndex = (0, lodash_1.debounce)(updateIndex, 100);
    (0, react_1.useEffect)(() => {
        debounceUpdateIndex(0);
    }, []);
    const value = {
        components,
        categories,
        resolver,
        themeNames,
        themeIndex,
        updateIndex,
    };
    return (<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>);
};
exports.ThemeProvider = ThemeProvider;
