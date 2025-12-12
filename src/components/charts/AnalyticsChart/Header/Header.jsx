"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const Breadcrumb_1 = __importDefault(require("@/components/elements/base/breadcrumb/Breadcrumb"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const link_1 = __importDefault(require("next/link"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_1 = require("@iconify/react");
const router_1 = require("next/router");
const react_2 = require("react");
const lodash_1 = require("lodash");
const next_i18next_1 = require("next-i18next");
const HeaderBase = ({ modelName, postTitle }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [isHovered, setIsHovered] = (0, react_2.useState)(false);
    const router = (0, router_1.useRouter)();
    const breadcrumbItems = router.asPath
        .split("?")[0] // This splits the path at the '?' and takes the first part, excluding the query.
        .split("/")
        .filter((item) => item !== "")
        .map((item, index, arr) => {
        return {
            title: (0, lodash_1.capitalize)(item.replace(/-/g, " ").replace(/#/g, "")),
            href: "/" + arr.slice(0, index + 1).join("/"),
        };
    });
    return (<div className="min-h-16 py-2 gap-5 flex items-start justify-center md:justify-between w-fullrounded-lg flex-col md:flex-row mb-2">
      <div className="flex items-center gap-4">
        <IconBox_1.default icon={isHovered
            ? "heroicons-solid:chevron-left"
            : "material-symbols-light:app-badging-outline"} color="muted" variant={"pastel"} shape={"rounded-sm"} size={"md"} rotating={!isHovered} onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="cursor-pointer duration-300 hover:bg-black/10 hover:text-black dark:hover:bg-white/20 hover:shadow-inner" onClick={() => router.back()}/>
        <h2 className="font-sans text-lg font-light text-muted-700 dark:text-muted-300">
          {modelName} {postTitle || "Analytics"}
          <Breadcrumb_1.default separator="slash" items={breadcrumbItems}/>
        </h2>
      </div>
      <Tooltip_1.Tooltip content={t("Records")}>
        <link_1.default href={router.asPath.replace("analysis", "")} passHref>
          <IconButton_1.default variant="pastel" aria-label="Records" color="primary" size={"lg"}>
            <react_1.Icon icon="solar:database-bold-duotone" className="h-6 w-6"/>
          </IconButton_1.default>
        </link_1.default>
      </Tooltip_1.Tooltip>
    </div>);
};
exports.Header = HeaderBase;
