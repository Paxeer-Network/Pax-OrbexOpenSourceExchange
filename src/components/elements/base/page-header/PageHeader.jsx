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
exports.PageHeader = void 0;
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const lodash_1 = require("lodash");
const pluralize_1 = __importDefault(require("pluralize"));
const IconBox_1 = __importDefault(require("../iconbox/IconBox"));
const Breadcrumb_1 = __importDefault(require("../breadcrumb/Breadcrumb"));
const BackButton_1 = require("../button/BackButton");
const PageHeaderBase = ({ title, BackPath, children }) => {
    const router = (0, router_1.useRouter)();
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const breadcrumbItems = router.asPath
        .split("?")[0]
        .split("/")
        .filter((item) => item !== "")
        .map((item, index, arr) => {
        const title = arr.length - 1 === index
            ? (0, pluralize_1.default)((0, lodash_1.capitalize)(item.replace(/-/g, " ").replace(/#/g, "")))
            : (0, lodash_1.capitalize)(item.replace(/-/g, " ").replace(/#/g, ""));
        const href = arr.slice(0, index + 1).join("/");
        return {
            title,
            href: `/${href}`,
        };
    });
    return (<div className="min-h-16 py-2 gap-5 flex items-start justify-center md:justify-between w-full rounded-lg flex-col md:flex-row">
      <div className="flex items-center gap-4">
        <IconBox_1.default icon={isHovered
            ? "heroicons-solid:chevron-left"
            : "material-symbols-light:app-badging-outline"} color="muted" variant="pastel" shape="rounded-sm" size="md" rotating={!isHovered} onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="cursor-pointer duration-300 hover:bg-black/10 hover:text-black dark:hover:bg-white/20 hover:shadow-inner" onClick={() => router.back()}/>
        <h2 className="font-sans text-lg font-light text-muted-700 dark:text-muted-300">
          {title}
          {breadcrumbItems.length > 0 && (<Breadcrumb_1.default separator="slash" items={breadcrumbItems}/>)}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        {BackPath && <BackButton_1.BackButton href={BackPath}/>}
        {children}
      </div>
    </div>);
};
exports.PageHeader = (0, react_1.memo)(PageHeaderBase);
