"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BentoGridItem = exports.BentoGrid = void 0;
const cn_1 = require("@/utils/cn");
const link_1 = __importDefault(require("next/link"));
const BentoGrid = ({ className, children, }) => {
    return (<div className={(0, cn_1.cn)("grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto", className)}>
      {children}
    </div>);
};
exports.BentoGrid = BentoGrid;
const BentoGridItem = ({ className, title, description, header, icon, href, }) => {
    return (<div className={(0, cn_1.cn)("row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-3 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col", className)}>
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {href ? <link_1.default href={href}>{title}</link_1.default> : title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>);
};
exports.BentoGridItem = BentoGridItem;
