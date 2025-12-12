"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useWindowSize() {
    const isClient = typeof window === "object";
    const getSize = () => ({
        width: isClient ? window.innerWidth : 0,
        height: isClient ? window.innerHeight : 0,
    });
    const [windowSize, setWindowSize] = (0, react_1.useState)(getSize);
    (0, react_1.useEffect)(() => {
        if (!isClient) {
            return undefined;
        }
        const handleResize = () => setWindowSize(getSize());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isClient]);
    return windowSize;
}
exports.default = useWindowSize;
