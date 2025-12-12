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
exports.Locales = exports.locales = void 0;
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const framer_motion_1 = require("framer-motion");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const next_i18next_1 = require("next-i18next");
const next_i18next_config_js_1 = __importDefault(require("../../../../../next-i18next.config.js"));
const constants_1 = require("@/utils/constants");
const cn_1 = require("@/utils/cn");
exports.locales = next_i18next_config_js_1.default.i18n.locales.map((locale) => {
    const [code] = locale.split("-");
    return {
        code: locale,
        name: new Intl.DisplayNames([locale], { type: "language" }).of(code),
        flag: constants_1.localeFlagMap[code],
    };
});
const LocalesBase = () => {
    const { t, i18n } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    (0, react_1.useEffect)(() => {
        if (typeof window !== "undefined" && i18n.language) {
            const detectedLanguage = i18n.language;
            const savedLocale = localStorage.getItem("NEXT_LOCALE");
            if (savedLocale && savedLocale !== detectedLanguage) {
                i18n.changeLanguage(savedLocale);
            }
            else if (!detectedLanguage) {
                i18n.changeLanguage("en");
            }
        }
    }, [i18n]);
    const onToggleLanguageClick = (newLocale) => {
        localStorage.setItem("NEXT_LOCALE", newLocale);
        i18n.changeLanguage(newLocale).then(() => {
            const { pathname, asPath, query } = router;
            router.push({ pathname, query }, asPath, { locale: newLocale });
        });
    };
    const [search, setSearch] = (0, react_1.useState)("");
    const ref = (0, react_1.useRef)(null);
    const isInView = (0, framer_motion_1.useInView)(ref, { once: true });
    const filteredLocales = exports.locales.filter((locale) => { var _a; return (_a = locale.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search.toLowerCase()); });
    return (<div className="relative w-full flex flex-col overflow-x-hidden slimscroll">
      <Input_1.default label={t("Search")} placeholder={t("Search Languages")} value={search} onChange={(e) => setSearch(e.target.value)} className="p-2 mb-4 border border-muted-300 rounded-md" aria-label={t("Search Languages")}/>
      <div ref={ref} className="flex flex-col gap-2 max-h-[calc(100vh_-_160px)] overflow-y-auto pe-1 slimscroll">
        {isInView &&
            filteredLocales.map((locale) => (<framer_motion_1.motion.div key={locale.code} onClick={() => onToggleLanguageClick(locale.code)} className={(0, cn_1.cn)("flex items-center px-4 py-2 cursor-pointer rounded-md transition-all duration-300 ease-in-out", locale.code === i18n.language
                    ? "bg-primary-500 text-white dark:bg-primary-400 dark:text-white"
                    : "bg-muted-100 hover:bg-muted-200 dark:bg-muted-800 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-200")}>
              <img src={`/img/flag/${locale.flag}.svg`} alt={locale.name} width={24} height={"auto"} className="mr-3"/>
              {locale.name} ({locale.code})
            </framer_motion_1.motion.div>))}
      </div>
    </div>);
};
exports.Locales = (0, react_1.memo)(LocalesBase);
