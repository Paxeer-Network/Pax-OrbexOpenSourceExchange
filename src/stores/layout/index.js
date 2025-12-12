"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreLayoutFromStorage = exports.useLayoutStore = exports.LAYOUTS = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
exports.LAYOUTS = [
    "sidebar-panel",
    "sidebar-panel-float",
    // "sidebar-collapse",
    // "sideblock",
    "top-navigation",
];
const defaultLayout = process.env.NEXT_PUBLIC_DEFAULT_LAYOUT || "sidebar-panel";
exports.useLayoutStore = (0, zustand_1.create)()((0, immer_1.immer)((set) => ({
    activeLayout: defaultLayout,
    setActiveLayout: (layout) => {
        set((state) => {
            state.activeLayout = layout;
        });
        // Only set in browser context
        if (typeof window !== "undefined") {
            localStorage.setItem("PREFERED_LAYOUT", layout);
        }
    },
})));
// Utility function for client-side initialization
const restoreLayoutFromStorage = () => {
    if (typeof window !== "undefined") {
        const preferredLayout = localStorage.getItem("PREFERED_LAYOUT");
        if (preferredLayout) {
            const { setActiveLayout } = exports.useLayoutStore.getState();
            setActiveLayout(preferredLayout);
        }
    }
};
exports.restoreLayoutFromStorage = restoreLayoutFromStorage;
