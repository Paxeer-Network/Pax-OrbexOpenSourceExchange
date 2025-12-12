"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.navItemBaseStyles = void 0;
const react_1 = __importDefault(require("react"));
const router_1 = require("next/router");
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
exports.navItemBaseStyles = "hover:bg-muted-100 hover:text-primary-500 dark:hover:bg-muted-800 leading-6 text-muted-600 dark:text-muted-300 relative flex cursor-pointer items-center gap-2 rounded-lg py-3 px-4 font-medium transition-all duration-200";
const NavbarItem = ({ icon, title, href = "", description, ...props }) => {
    const router = (0, router_1.useRouter)();
    const { t } = (0, next_i18next_1.useTranslation)();
    const isActive = router.pathname === href;
    return (<link_1.default href={href} className={`flex items-center gap-3 transition-colors duration-300 ${exports.navItemBaseStyles} ${isActive
            ? "bg-muted-100 text-primary-500 dark:bg-muted-800 lg:bg-transparent "
            : ""}`} {...props}>
      <react_2.Icon icon={icon} className="h-5 w-5"/>
      <div className="flex flex-col">
        <span className="text-sm">{t(title)}</span>
        {description && (<span className="text-xs text-muted-400 dark:text-muted-500 leading-none">
            {t(description)}
          </span>)}
      </div>
    </link_1.default>);
};
exports.default = NavbarItem;
