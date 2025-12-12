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
const MashImage_1 = require("@/components/elements/MashImage");
const ListBox = ({ setSelected, onClose, setFirstErrorInputRef, label, multiple, selected = multiple ? [] : null, size = "md", color = "default", shape = "smooth", disabled, options = [], classNames, loading = false, error, placeholder, ...props }) => {
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
    // set selected options on load
    (0, react_1.useEffect)(() => {
        if (multiple && selected && selected.length > 0) {
            const newSelected = options.filter((option) => selected.some((sel) => sel.value === option.value));
            setSelected(newSelected);
        }
    }, []);
    return (<div className={`relative w-full ${classNames} h-full`}>
      <react_3.Listbox value={selected} onChange={(e) => setSelected(e)} ref={inputRef} multiple={multiple}>
        <div className="relative w-full font-sans h-full">
          {!!label && (<label className="font-sans text-[0.544rem] text-muted-400 dark:text-muted-500">
              {label}
            </label>)}
          <react_3.Listbox.Button className={(0, input_variants_1.inputVariants)({
            size,
            color,
            shape,
            className: `group/listbox-button relative text-start
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
                ? "text-transparent! pointer-events-none! select-none!"
                : ""}
            `,
        })} {...props}>
            <span className="block truncate">
              {multiple && (selected === null || selected === void 0 ? void 0 : selected.length) > 0
            ? selected.length > 2
                ? `${selected.length} items`
                : selected.map((item) => item.label).join(", ")
            : (selected === null || selected === void 0 ? void 0 : selected.label) || placeholder || "Select an option"}
            </span>

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
              {!!(selected === null || selected === void 0 ? void 0 : selected.image) && !(selected === null || selected === void 0 ? void 0 : selected.icon) ? (<MashImage_1.MashImage src={selected === null || selected === void 0 ? void 0 : selected.image} alt={selected === null || selected === void 0 ? void 0 : selected.label} className={`
                    ${size === "sm" ? "h-3 w-3" : ""}
                    ${size === "md" ? "h-4 w-4" : ""}
                    ${size === "lg" ? "h-5 w-5" : ""}
                    ${error ? "text-danger-500!" : ""}
                  `}/>) : ("")}
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
            <span className={`pointer-events-none absolute right-0 top-0 flex items-center justify-center
                ${size === "sm" ? "h-8 w-8" : ""} 
                ${size === "md" ? "h-10 w-10" : ""} 
                ${size === "lg" ? "h-12 w-12" : ""}
                ${loading ? "text-transparent! opacity-0!" : ""}
              `}>
              <react_2.Icon icon="lucide:chevrons-up-down" className="h-4 w-4 text-muted-400 transition-transform duration-300 group-focus/listbox-button:rotate-180" aria-hidden="true"/>
            </span>
          </react_3.Listbox.Button>
          <react_3.Transition as={react_1.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <react_3.Listbox.Options ref={selectRef} className={`z-9999 max-h-[300px] slimscroll absolute mt-1 w-full overflow-auto border !p-2 text-base shadow-lg shadow-muted-300/30 ring-1 ring-primary-500 ring-opacity-5 focus:outline-hidden dark:shadow-muted-800/20 sm:text-sm
                ${(selected === null || selected === void 0 ? void 0 : selected.image) ? "max-h-[201.2px]" : "max-h-60"}
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
              `}>
              {options.map((item) => (<react_3.Listbox.Option key={item.value} className={({ active }) => `relative flex cursor-pointer select-none items-center gap-2 p-2 transition-colors duration-300
                  ${active
                ? "bg-primary-500/10 text-primary-700 dark:bg-primary-500/20"
                : "text-muted-600 dark:text-muted-400"}
                  ${shape === "rounded-sm" ? "rounded-md" : ""}
                  ${shape === "smooth" ? "rounded-lg" : ""}
                  ${shape === "rounded-sm" ? "rounded-md" : ""}
                  ${shape === "curved" ? "rounded-xl" : ""}
                  ${shape === "full" ? "rounded-xl" : ""}
                  `} value={item}>
                  {({ selected: isSelected }) => (<>
                      {multiple && (<input type="checkbox" className="form-checkbox h-4 w-4" checked={selected.some((s) => s.value === item.value)} onChange={() => {
                        if (selected.some((s) => s.value === item.value)) {
                            setSelected(selected.filter((s) => s.value !== item.value));
                        }
                        else {
                            setSelected([...selected, item]);
                        }
                    }}/>)}
                      {!!(item === null || item === void 0 ? void 0 : item.icon) && !(item === null || item === void 0 ? void 0 : item.image) ? (<span className={`pointer-events-none flex items-center justify-center`}>
                          <react_2.Icon icon={item === null || item === void 0 ? void 0 : item.icon} className="h-5 w-5 text-muted-400 transition-colors duration-300" aria-hidden="true"/>
                        </span>) : ("")}
                      {!!(item === null || item === void 0 ? void 0 : item.image) && !(item === null || item === void 0 ? void 0 : item.icon) ? (<Avatar_1.default src={item === null || item === void 0 ? void 0 : item.image} text={item === null || item === void 0 ? void 0 : item.label.substring(0, 1)} size="xxs"/>) : ("")}
                      <span className={`block truncate ${isSelected ? "font-medium" : "font-normal"}`}>
                        {item.label}
                      </span>
                      {isSelected ? (<span className="relative z-0 ms-auto flex items-center pe-2 text-primary-600">
                          <react_2.Icon icon="lucide:check" className="h-4 w-4" aria-hidden="true"/>
                        </span>) : null}
                    </>)}
                </react_3.Listbox.Option>))}
            </react_3.Listbox.Options>
          </react_3.Transition>
        </div>
      </react_3.Listbox>
    </div>);
};
exports.default = ListBox;
