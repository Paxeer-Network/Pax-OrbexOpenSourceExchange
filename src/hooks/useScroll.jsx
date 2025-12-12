"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useScroll(HEIGHT) {
    const [scrolled, setScrolled] = (0, react_1.useState)(false);
    const scrollMonitor = (0, react_1.useCallback)(() => {
        setScrolled(window.scrollY >= HEIGHT);
    }, [HEIGHT]);
    (0, react_1.useEffect)(() => {
        window.addEventListener("scroll", scrollMonitor);
        return () => {
            window.removeEventListener("scroll", scrollMonitor);
        };
    }, [scrollMonitor]);
    return scrolled;
}
exports.default = useScroll;
