"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
const useBuilderStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    loading: true,
    sidebar: "",
    setSidebar: (sidebar) => set((state) => {
        state.sidebar = sidebar;
    }),
    saveEditorState: async (content) => {
        await (0, api_1.default)({
            url: "/api/admin/content/editor",
            method: "POST",
            body: { content, path: "/" },
        });
    },
})));
exports.default = useBuilderStore;
