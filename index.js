"use strict";
// File: index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
require("dotenv").config();
require("./module-alias-setup");
const index_1 = require("@b/index");
const logger_1 = __importDefault(require("@b/utils/logger"));
const port = process.env.NEXT_PUBLIC_BACKEND_PORT || 4000;
const startApp = async () => {
    try {
        const app = new index_1.MashServer();
        app.listen(Number(port), () => {
            console.log(`\x1b[36mMain Thread: Server running on port ${port}...\x1b[0m`);
        });
    }
    catch (error) {
        (0, logger_1.default)("error", "app", __filename, `Failed to initialize app: ${error.message}`);
        process.exit(1);
    }
};
startApp();
