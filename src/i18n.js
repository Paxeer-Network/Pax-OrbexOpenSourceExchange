"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const i18next_http_backend_1 = __importDefault(require("i18next-http-backend"));
const i18next_browser_languagedetector_1 = __importDefault(require("i18next-browser-languagedetector"));
const react_i18next_1 = require("react-i18next");
const next_i18next_config_1 = require("../next-i18next.config");
class I18nSingleton {
    constructor() { }
    static getInstance() {
        if (!I18nSingleton.instance) {
            i18next_1.default
                .use(i18next_http_backend_1.default)
                .use(i18next_browser_languagedetector_1.default)
                .use(react_i18next_1.initReactI18next)
                .init({
                ...next_i18next_config_1.i18n,
                ns: ["common"],
                defaultNS: "common",
                fallbackLng: "en",
                backend: {
                    loadPath: "/locales/{{lng}}/{{ns}}.json",
                },
                react: {
                    useSuspense: true,
                },
                detection: {
                    order: ["navigator", "cookie", "localStorage"],
                    caches: ["cookie", "localStorage"],
                    lookupLocalStorage: "i18nextLng",
                },
                interpolation: {
                    escapeValue: false,
                },
                lng: "en",
            });
            I18nSingleton.instance = i18next_1.default;
        }
        return I18nSingleton.instance;
    }
}
exports.default = I18nSingleton.getInstance();
