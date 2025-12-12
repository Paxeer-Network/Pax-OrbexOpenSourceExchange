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
const react_2 = require("@iconify/react");
const react_3 = require("@headlessui/react");
const input_variants_1 = require("@/components/elements/variants/input-variants");
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const Loader_1 = __importDefault(require("@/components/elements/base/loader/Loader"));
const next_i18next_1 = require("next-i18next");
const ComboBox = ({ selected, setSelected, label, size = "md", color = "default", shape = "smooth", disabled, loading = false, options = [], classNames, error, onClose, setFirstErrorInputRef, ...props }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const inputRef = (0, react_1.useRef)(null);
    const selectRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const handleOutsideClick = (event) => {
            if (selectRef.current &&
                !selectRef.current.contains(event.target)) {
                if (onClose) {
                    onClose();
                }
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [onClose]);
    (0, react_1.useEffect)(() => {
        if (setFirstErrorInputRef) {
            setFirstErrorInputRef(selectRef.current);
        }
    }, [setFirstErrorInputRef, error]);
    const [query, setQuery] = (0, react_1.useState)("");
    const filteredItems = query === ""
        ? options
        : options.filter((item) => item.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")));
    return (<div className={`relative w-full ${classNames}`}>
      <react_3.Combobox value={selected !== null && selected !== void 0 ? selected : ""} onChange={setSelected} ref={inputRef}>
        <div className="relative mt-1">
          {!!label && (<label className="font-sans text-[0.68rem] text-muted-400">
              {label}
            </label>)}
          <div className="relative w-full font-sans z-20">
            <react_3.Combobox.Input className={(0, input_variants_1.inputVariants)({
            size,
            color,
            shape,
            className: `peer relative text-start
                ${size === "sm" && (selected === null || selected === void 0 ? void 0 : selected.icon) ? "pe-2 ps-8" : ""}
                ${size === "md" && (selected === null || selected === void 0 ? void 0 : selected.icon) ? "pe-3 ps-10" : ""}
                ${size === "lg" && (selected === null || selected === void 0 ? void 0 : selected.icon) ? "pe-4 ps-12" : ""}
                ${size === "sm" && (selected === null || selected === void 0 ? void 0 : selected.image) ? "pe-2 ps-8" : ""}
                ${size === "md" && (selected === null || selected === void 0 ? void 0 : selected.image) ? "pe-3 ps-11" : ""}
                ${size === "lg" && (selected === null || selected === void 0 ? void 0 : selected.image) ? "pe-4 ps-12" : ""}
                ${size === "sm" && !(selected === null || selected === void 0 ? void 0 : selected.icon) ? "px-2" : ""}
                ${size === "md" && !(selected === null || selected === void 0 ? void 0 : selected.icon) ? "px-3" : ""}
                ${size === "lg" && !(selected === null || selected === void 0 ? void 0 : selected.icon) ? "px-4" : ""}
                ${size === "sm" && !(selected === null || selected === void 0 ? void 0 : selected.image) ? "px-2" : ""}
                ${size === "md" && !(selected === null || selected === void 0 ? void 0 : selected.image) ? "px-3" : ""}
                ${size === "lg" && !(selected === null || selected === void 0 ? void 0 : selected.image) ? "px-4" : ""}
                ${error ? "border-danger-500!" : ""}
                ${disabled
                ? "pointer-events-none! cursor-not-allowed! opacity-50!"
                : ""}
                ${loading
                ? "pointer-events-none text-transparent! shadow-none! placeholder:text-transparent! select-none!"
                : ""}
              `,
        })} displayValue={(item) => {
            return item && typeof item === "object" && item.label
                ? item.label
                : item;
        }} onChange={(event) => {
            setQuery(event.target.value);
        }} {...props}/>
            <div className={`absolute left-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 
                ${size === "sm" ? "h-8 w-8" : ""} 
                ${size === "md" ? "h-10 w-10" : ""} 
                ${size === "lg" ? "h-12 w-12" : ""}`}>
              {!!(selected === null || selected === void 0 ? void 0 : selected.icon) && !(selected === null || selected === void 0 ? void 0 : selected.image) ? (<react_2.Icon icon={selected === null || selected === void 0 ? void 0 : selected.icon} className={`
                    ${size === "sm" ? "h-3 w-3" : ""} 
                    ${size === "md" ? "h-4 w-4" : ""} 
                    ${size === "lg" ? "h-5 w-5" : ""}
                    ${error ? "text-danger-500!" : ""}
                  `}/>) : ("")}
              {!!(selected === null || selected === void 0 ? void 0 : selected.image) && !(selected === null || selected === void 0 ? void 0 : selected.icon) ? (<Avatar_1.default src={selected === null || selected === void 0 ? void 0 : selected.image} text={selected === null || selected === void 0 ? void 0 : selected.label.substring(0, 1)} size={size === "lg" ? "xxs" : "xxxs"}/>) : ("")}
            </div>
            {!!loading ? (<div className={`absolute right-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 
                  ${size === "sm" ? "h-8 w-8" : ""} 
                  ${size === "md" ? "h-10 w-10" : ""} 
                  ${size === "lg" ? "h-12 w-12" : ""}`}>
                <Loader_1.default classNames={`dark:text-muted-200
                ${color === "muted" || color === "mutedContrast"
                ? "text-muted-400"
                : "text-muted-300"}
              `} size={20} thickness={4}/>
              </div>) : ("")}
            <react_3.Combobox.Button className={`peer:focus-visible:[&>svg]:rotate-180 absolute right-0 top-0 flex items-center justify-center
                ${size === "sm" ? "h-8 w-8" : ""} 
                ${size === "md" ? "h-10 w-10" : ""} 
                ${size === "lg" ? "h-12 w-12" : ""}
                ${loading
            ? "pointer-events-none! text-transparent! opacity-0! select-none!"
            : ""}
              `}>
              <react_2.Icon icon="lucide:chevrons-up-down" className="h-4 w-4 text-muted-400 transition-transform duration-300" aria-hidden="true"/>
            </react_3.Combobox.Button>
          </div>
          <react_3.Transition as={react_1.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery("")}>
            <react_3.Combobox.Options className={`max-h-[300px] slimscroll absolute z-30 mt-1 w-full overflow-auto border !p-2 text-base shadow-lg shadow-muted-300/30 ring-1 ring-primary-500 ring-opacity-5 focus:outline-hidden dark:shadow-muted-800/20 sm:text-sm
                ${shape === "rounded-sm" ? "rounded-md" : ""}
                ${shape === "smooth" ? "rounded-lg" : ""}
                ${shape === "rounded-sm" ? "rounded-md" : ""}
                ${shape === "curved" ? "rounded-xl" : ""}
                ${shape === "full" ? "rounded-xl" : ""}
                ${color === "default"
            ? "border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800"
            : ""}
                ${color === "contrast"
            ? "border-muted-200 bg-white dark:border-muted-800 dark:bg-muted-950"
            : ""}
                ${color === "muted"
            ? "border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800"
            : ""}
                ${color === "mutedContrast"
            ? "border-muted-200 bg-white dark:border-muted-800 dark:bg-muted-950"
            : ""}
              `} ref={selectRef}>
              {filteredItems.length === 0 && query !== "" ? (<div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  {t("Nothing found.")}
                </div>) : (filteredItems.map((item) => (<react_3.Combobox.Option key={item.value} className={({ active, }) => `relative flex cursor-default select-none items-center gap-2 p-2 transition-colors duration-300 
                      ${active
                ? "bg-primary-500/10 text-primary-700 dark:bg-primary-500/20"
                : "text-muted-600 dark:text-muted-400"}
                      ${shape === "rounded-sm" ? "rounded-md" : ""}
                      ${shape === "smooth" ? "rounded-lg" : ""}
                      ${shape === "rounded-sm" ? "rounded-md" : ""}
                      ${shape === "curved" ? "rounded-xl" : ""}
                      ${shape === "full" ? "rounded-xl" : ""}
                    `} value={item.value}>
                    {({ selected, active }) => (<>
                        {!!(item === null || item === void 0 ? void 0 : item.icon) && !(item === null || item === void 0 ? void 0 : item.image) ? (<span className={`pointer-events-none flex items-center justify-center`}>
                            <react_2.Icon icon={item === null || item === void 0 ? void 0 : item.icon} className="h-5 w-5 text-muted-400 transition-colors duration-300" aria-hidden="true"/>
                          </span>) : ("")}
                        {!!(item === null || item === void 0 ? void 0 : item.image) && !(item === null || item === void 0 ? void 0 : item.icon) ? (<Avatar_1.default src={item === null || item === void 0 ? void 0 : item.image} text={item === null || item === void 0 ? void 0 : item.label.substring(0, 1)} size="xxs"/>) : ("")}
                        <span className={`block truncate
                           ${selected ? "font-medium" : "font-normal"}`}>
                          {item.label}
                        </span>
                        {selected ? (<span className={`relative z-0 ms-auto flex items-center pe-2 text-primary-600 ${active ? "" : ""}`}>
                            <react_2.Icon icon="lucide:check" className="h-4 w-4" aria-hidden="true"/>
                          </span>) : null}
                      </>)}
                  </react_3.Combobox.Option>)))}
            </react_3.Combobox.Options>
          </react_3.Transition>
        </div>
      </react_3.Combobox>
    </div>);
};
exports.default = ComboBox;
