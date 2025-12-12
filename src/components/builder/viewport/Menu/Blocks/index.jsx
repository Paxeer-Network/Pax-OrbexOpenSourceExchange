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
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const Category_1 = __importDefault(require("./Category"));
const ThemeContext_1 = require("@/context/ThemeContext");
const core_1 = require("@craftjs/core");
const Item_1 = __importDefault(require("./Item"));
const react_2 = require("@iconify/react");
const Blocks = () => {
    const { components, categories, updateIndex, themeNames, themeIndex } = (0, react_1.useContext)(ThemeContext_1.ThemeContext);
    const { enabled, connectors } = (0, core_1.useEditor)(({ options }) => ({
        enabled: options.enabled,
    }));
    const [toolbarVisible, setToolbarVisible] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const v = Array.from({ length: categories.length }, (_, i) => i === 0);
        setToolbarVisible(v);
    }, [categories]);
    const toggleToolbar = (index) => {
        setToolbarVisible((t) => t.map((c, i) => (i === index ? !c : c)));
    };
    const onChange = (item) => {
        updateIndex(themeNames.indexOf(item.value));
    };
    return (<div className="w-full flex flex-col shadow-inner h-full">
      <div className="p-3">
        <Listbox_1.default setSelected={(e) => onChange(e)} selected={{
            label: themeNames[themeIndex],
            value: themeNames[themeIndex],
        }} options={themeNames.map((t) => ({ label: t, value: t }))}/>
      </div>
      <div className="scrollbar-hidden overflow-y-auto slimscroll">
        {categories.map((b, j) => (<Category_1.default key={j} title={b} visible={toolbarVisible[j]} setVisible={() => toggleToolbar(j)}>
            <div className="flex flex-col gap-5 p-5 bg-muted-100 dark:bg-muted-900">
              {components === null || components === void 0 ? void 0 : components.filter((c) => c.category === b).map((c, i) => (<div key={i} className="relative w-full group">
                    <Item_1.default move connectors={connectors} c={c}>
                      <img src={`/themes/${c.themeFolder}/${c.blockFolder}/preview.png`} width="600px" height="300px" alt={c.displayName} className="rounded-md"/>
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
                        <react_2.Icon icon="fluent:drag-20-regular" className="text-white text-3xl"/>
                        <span className="absolute bottom-1 left-2 text-white">
                          {c.displayName}
                        </span>
                      </div>
                    </Item_1.default>
                  </div>))}
            </div>
          </Category_1.default>))}
      </div>
    </div>);
};
exports.default = Blocks;
