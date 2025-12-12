"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTemplateDebounce = exports.saveTemplate = exports.loadTemplate = exports.uploadFile = exports.getThemeUrl = void 0;
const lzutf8_1 = __importDefault(require("lzutf8"));
const api_1 = __importDefault(require("@/utils/api"));
const lodash_1 = require("lodash");
const Editor_1 = require("../editor/Editor");
const getThemeUrl = (themeFolder) => {
    return `/api/admin/content/editor?type=theme&name=${themeFolder}`;
};
exports.getThemeUrl = getThemeUrl;
const uploadFile = async (file) => {
    const { data, error } = await (0, api_1.default)({
        url: `/api/upload`,
        method: "POST",
        body: [],
    });
    return data;
};
exports.uploadFile = uploadFile;
const loadTemplate = async () => {
    const { data, error } = await (0, api_1.default)({
        silent: true,
        url: `/api/admin/content/editor?type=data&path=/&ext=json`,
    });
    if (data && !error) {
        if (typeof data === "string" && data !== "") {
            try {
                const content = lzutf8_1.default.decompress(lzutf8_1.default.decodeBase64(data));
                const parsed = JSON.parse(content);
                return parsed;
            }
            catch (error) {
                return Editor_1.DEFAULT_TEMPLATE;
            }
        }
        else {
            return Editor_1.DEFAULT_TEMPLATE;
        }
    }
};
exports.loadTemplate = loadTemplate;
const saveTemplate = async (state) => {
    await (0, api_1.default)({
        method: "POST",
        silent: true,
        url: `/api/admin/content/editor`,
        body: {
            content: state.serialize(),
            path: "/",
        },
    });
};
exports.saveTemplate = saveTemplate;
exports.saveTemplateDebounce = (0, lodash_1.debounce)(exports.saveTemplate, 100);
