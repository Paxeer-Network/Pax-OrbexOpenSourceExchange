"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBar = void 0;
const react_1 = require("react");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const market_1 = __importDefault(require("@/stores/futures/market"));
const next_i18next_1 = require("next-i18next");
const SearchBarBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { setSearchQuery } = (0, market_1.default)();
    return (<Input_1.default size={"sm"} icon={"bx:bx-search"} type="text" placeholder={t("Search pairs...")} onChange={(e) => setSearchQuery(e.target.value)} warning shape={"rounded-xs"}/>);
};
exports.SearchBar = (0, react_1.memo)(SearchBarBase);
