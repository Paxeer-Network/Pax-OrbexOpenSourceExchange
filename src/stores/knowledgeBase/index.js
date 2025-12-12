"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKnowledgeBaseStore = void 0;
// store.js
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const api_1 = __importDefault(require("@/utils/api"));
exports.useKnowledgeBaseStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    faq: null,
    faqs: [],
    category: null,
    categories: [],
    fetchCategories: async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/ext/faq",
            silent: true,
        });
        if (!error) {
            const categories = data.map((category) => ({
                ...category,
                faqs: category.faqs || [],
            }));
            set((state) => {
                state.categories = categories;
            });
        }
    },
    setCategory: async (id) => {
        if (!get().categories || get().categories.length === 0) {
            await get().fetchCategories();
        }
        if (get().categories && get().categories.length > 0 && id) {
            const selectedCategory = get().categories.find((category) => category.id === id);
            set((state) => {
                state.category = selectedCategory || null;
                state.faqs = (selectedCategory === null || selectedCategory === void 0 ? void 0 : selectedCategory.faqs) || [];
            });
        }
        else {
            set((state) => {
                state.category = null;
                state.faqs = [];
            });
        }
    },
})));
