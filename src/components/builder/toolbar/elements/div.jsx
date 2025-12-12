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
const core_1 = require("@craftjs/core");
const ToolbarSection_1 = __importDefault(require("../ToolbarSection"));
const ClassSection_1 = __importDefault(require("../shared/ClassSection"));
const builder_1 = require("@/utils/builder");
const ClassNameTag_1 = __importDefault(require("../shared/ClassNameTag"));
const ClassNameInput_1 = __importDefault(require("../shared/ClassNameInput"));
const DivToolbar = () => {
    var _a;
    const { actions, props } = (0, core_1.useNode)((node) => ({
        props: node.data.props,
    }));
    const [customClassInput, setCustomClassInput] = (0, react_1.useState)("");
    const [activeBreakpoints, setActiveBreakpoints] = (0, react_1.useState)({});
    const [error, setError] = (0, react_1.useState)("");
    const classNames = ((_a = props.className) === null || _a === void 0 ? void 0 : _a.split(" ").filter(Boolean)) || [];
    // Filter custom classes (non-sectioned)
    const sectionedClasses = Object.values(builder_1.classSectionsConfig).flatMap(({ regex }) => (0, builder_1.filterClasses)(classNames, regex));
    const customClasses = classNames.filter((name) => !sectionedClasses.includes(name));
    const handleBreakpointChange = (section, bp) => {
        setActiveBreakpoints((prev) => ({
            ...prev,
            [section]: prev[section] === bp ? "" : bp,
        }));
    };
    const handleEditClassName = (name, setInputValue) => {
        (0, builder_1.removeClassName)(classNames, name, actions.setProp);
        setInputValue(name);
    };
    const getClassSectionSummary = (section) => {
        const sectionClasses = (0, builder_1.filterClasses)(classNames, builder_1.classSectionsConfig[section].regex);
        return sectionClasses.length;
    };
    return (<>
      <ToolbarSection_1.default title="Custom Classes" open props={["className"]} summary={(props) => {
            const count = customClasses.length;
            return (<>
              <span className={`text-sm text-right ${count > 0
                    ? "text-muted-800 dark:text-muted-100"
                    : "text-muted-400 dark:text-muted-600"}`}>
                {count}
              </span>
            </>);
        }}>
        <div>
          <h3 className="font-semibold text-md">Custom Classes</h3>
          <div className="flex flex-wrap gap-2 py-2">
            {customClasses.map((name, index) => (<ClassNameTag_1.default key={index} name={name} onEdit={() => handleEditClassName(name, setCustomClassInput)} onRemove={() => (0, builder_1.removeClassName)(classNames, name, actions.setProp)}/>))}
          </div>
          <div className="mt-2">
            <ClassNameInput_1.default value={customClassInput} onChange={(e) => setCustomClassInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" &&
            (0, builder_1.addClassName)(classNames, customClassInput, actions.setProp, setCustomClassInput, setError // Added setError parameter
            )} placeholder="Add class"/>
          </div>
          {error && <div className="text-red-500 text-xs">{error}</div>}
        </div>
      </ToolbarSection_1.default>
      {Object.keys(builder_1.classSectionsConfig).map((section) => (0, builder_1.shouldShowSection)(section, classNames) && (<ClassSection_1.default key={section} title={section} regex={builder_1.classSectionsConfig[section].regex} showModes={builder_1.classSectionsConfig[section].showModes} activeBreakpoint={activeBreakpoints[section.toLowerCase()]} setActiveBreakpoint={(bp) => handleBreakpointChange(section.toLowerCase(), bp)} classNames={classNames} summary={(props) => {
                const count = getClassSectionSummary(section);
                return (<>
                    <span className={`text-sm text-right ${count > 0
                        ? "text-muted-800 dark:text-muted-100"
                        : "text-muted-400 dark:text-muted-600"}`}>
                      {count}
                    </span>
                  </>);
            }}/>))}
    </>);
};
exports.default = DivToolbar;
