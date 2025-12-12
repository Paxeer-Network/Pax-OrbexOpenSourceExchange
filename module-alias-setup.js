"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const path_1 = __importDefault(require("path"));
const isProduction = process.env.NODE_ENV === "production";
const aliases = isProduction
    ? {
        "@b": path_1.default.resolve(process.cwd(), "dist/backend"),
        "@db": path_1.default.resolve(process.cwd(), "dist/models"),
    }
    : {
        "@b": path_1.default.resolve(process.cwd(), "backend"),
        "@db": path_1.default.resolve(process.cwd(), "models"),
    };
for (const alias in aliases) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("module-alias").addAlias(alias, aliases[alias]);
}
