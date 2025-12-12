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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@iconify/react");
const NavbarItem_1 = require("./NavbarItem");
const next_i18next_1 = require("next-i18next");
const NavDropdown = ({ icon, title, children, className: classes = "", isActive = false, nested = false, // Defaults to false if not specified
description, }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { t } = (0, next_i18next_1.useTranslation)();
    const dropdownRef = (0, react_1.useRef)(null);
    // Listen for clicks outside of the dropdown to close it
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);
    return (<div className={`relative shrink-0 grow-0 items-stretch gap-1 lg:flex ${nested && isOpen ? "lg:relative" : ""}`} ref={dropdownRef}>
      <a className={`${NavbarItem_1.navItemBaseStyles} relative flex w-full cursor-pointer items-center justify-between ${isOpen ? "bg-muted-100 text-primary-500 dark:bg-muted-800" : ""} ${isActive ? "rounded-none lg:rounded-lg" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-3">
          <react_2.Icon icon={icon} className={`h-5 w-5`}/>
          <div className="flex flex-col">
            <span className="text-sm">{t(title)}</span>
            {description && (<span className="text-xs text-muted-400 dark:text-muted-500 leading-none">
                {t(description)}
              </span>)}
          </div>
        </div>
        <react_2.Icon icon="mdi:chevron-down" className={`h-5 w-5 transition-transform ${isOpen
            ? nested
                ? "lg:rotate-[-90deg] rotate-180"
                : "rotate-180"
            : nested
                ? "lg:rotate-90 rotate-0"
                : "rotate-0"}`}/>
      </a>
      <div className={`z-20 ${isOpen ? "block" : "hidden"} min-w-[220px] rounded-xl py-2 text-md shadow-lg transition-[opacity,transform] duration-100 lg:absolute ${nested ? "lg:left-full lg:top-0" : "lg:left-0 lg:top-full"} lg:border lg:border-muted-200 lg:bg-white lg:dark:border-muted-800 lg:dark:bg-muted-950 px-2 ${classes}`}>
        {children}
      </div>
    </div>);
};
exports.default = NavDropdown;
