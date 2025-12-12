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
const ToolbarSection_1 = __importDefault(require("../ToolbarSection"));
const ClassNameTag_1 = __importDefault(require("../shared/ClassNameTag"));
const ClassNameInput_1 = __importDefault(require("../shared/ClassNameInput"));
const ResponsiveIconButton_1 = __importDefault(require("../shared/ResponsiveIconButton"));
const builder_1 = require("@/utils/builder");
const core_1 = require("@craftjs/core");
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const lodash_1 = require("lodash");
const ClassSection = ({ title, regex, showModes, activeBreakpoint, setActiveBreakpoint, classNames, summary, }) => {
    const { actions, props } = (0, core_1.useNode)((node) => ({
        props: node.data.props,
    }));
    const [inputValue, setInputValue] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        if (builder_1.classSectionsConfig[title].inputType === "select") {
            const currentClass = classNames.find((cls) => cls.startsWith(activeBreakpoint ? `${activeBreakpoint}:` : ""));
            if (currentClass) {
                const selectedValue = currentClass.split(":").pop();
                setInputValue(selectedValue);
            }
            else {
                setInputValue("");
            }
        }
    }, [classNames, activeBreakpoint, title]);
    const sectionClasses = (0, builder_1.filterClasses)(classNames, regex);
    const lightModeClasses = showModes
        ? sectionClasses.filter((name) => !name.startsWith("dark:"))
        : sectionClasses;
    const darkModeClasses = showModes
        ? sectionClasses.filter((name) => name.startsWith("dark:"))
        : [];
    const handleAddClassName = (newClass) => {
        const prefix = activeBreakpoint ? `${activeBreakpoint}:` : "";
        const classNameToAdd = `${prefix}${newClass}`;
        if (!/^(justify-|items-|self-)$/.test(classNameToAdd)) {
            (0, builder_1.addClassName)(classNames, classNameToAdd, actions.setProp, setInputValue, setError);
        }
        else {
            setError("Invalid class name");
        }
    };
    const handleRemoveClassName = (name) => {
        (0, builder_1.removeClassName)(classNames, name, actions.setProp);
    };
    const handleEditClassName = (name) => {
        handleRemoveClassName(name);
        const strippedName = activeBreakpoint
            ? name.replace(`${activeBreakpoint}:`, "")
            : name;
        setInputValue(strippedName);
    };
    const handleBreakpointChange = (bp) => {
        setActiveBreakpoint(bp === activeBreakpoint ? "" : bp);
    };
    return (<ToolbarSection_1.default title={title} summary={summary} props={[...classNames]} open>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-2 items-center justify-between">
          <h4 className="text-xs text-muted-600 dark:text-muted-400">
            {title}
          </h4>
          <div className="flex gap-1">
            {builder_1.breakpoints.map((bp) => (<ResponsiveIconButton_1.default key={bp} breakpoint={bp} isActive={activeBreakpoint === bp} hasClasses={sectionClasses.some((name) => name.includes(`${bp}:`))} onClick={() => handleBreakpointChange(bp)}/>))}
          </div>
        </div>
        <div className="mt-2">
          {builder_1.classSectionsConfig[title].inputType === "select" ? (<Select_1.default value={inputValue || ""} onChange={(e) => handleAddClassName(e.target.value)} options={[
                { value: "", label: "Select an option" },
                ...builder_1.classSectionsConfig[title].options.map((option) => ({
                    value: option,
                    label: (0, lodash_1.capitalize)(option),
                })),
            ]}/>) : (<ClassNameInput_1.default value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleAddClassName(e.currentTarget.value)} placeholder={`${title} (${activeBreakpoint ? activeBreakpoint.toUpperCase() : "Base"})`}/>)}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {lightModeClasses
            .filter((name) => activeBreakpoint
            ? name.includes(`${activeBreakpoint}:`)
            : !builder_1.breakpoints.some((bp) => name.includes(`${bp}:`)))
            .filter((name) => !/^(justify-|items-|self-)$/.test(name))
            .map((name, index) => (<ClassNameTag_1.default key={index} name={name} onEdit={() => handleEditClassName(name)} onRemove={() => handleRemoveClassName(name)}/>))}
          {showModes && darkModeClasses.length > 0 && (<div className="w-full mt-2">
              <h4 className="text-xs text-muted-600 dark:text-muted-400">
                Dark Mode Classes
              </h4>
              <div>
                {darkModeClasses
                .filter((name) => activeBreakpoint
                ? name.includes(`${activeBreakpoint}:`)
                : !builder_1.breakpoints.some((bp) => name.includes(`${bp}:`)))
                .filter((name) => !/^(justify-|items-|self-)$/.test(name))
                .map((name, index) => (<ClassNameTag_1.default key={index} name={name} onEdit={() => handleEditClassName(name)} onRemove={() => handleRemoveClassName(name)}/>))}
              </div>
            </div>)}
        </div>
        {error && <div className="text-red-500 text-xs">{error}</div>}
      </div>
    </ToolbarSection_1.default>);
};
exports.default = ClassSection;
