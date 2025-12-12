"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketTab = void 0;
const react_1 = require("react");
const react_2 = require("@iconify/react");
const market_1 = __importDefault(require("@/stores/futures/market"));
const react_3 = require("react");
const MarketTabBase = () => {
    const { selectedPair, pairs, setSelectedPair } = (0, market_1.default)();
    const uniquePairs = Array.from(new Set(pairs));
    const containerRef = (0, react_3.useRef)(null);
    const [canScrollLeft, setCanScrollLeft] = (0, react_3.useState)(false);
    const [canScrollRight, setCanScrollRight] = (0, react_3.useState)(false);
    const checkForOverflow = () => {
        const container = containerRef.current;
        if (!container)
            return;
        setCanScrollLeft(container.scrollLeft > 1);
        setCanScrollRight(Math.ceil(container.scrollLeft + container.clientWidth) <
            container.scrollWidth - 1);
    };
    const scrollRight = () => {
        var _a;
        (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.scrollBy({ left: 100, behavior: "smooth" });
    };
    const scrollLeft = () => {
        var _a;
        (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.scrollBy({ left: -100, behavior: "smooth" });
    };
    (0, react_1.useEffect)(() => {
        const handleResize = () => {
            checkForOverflow();
        };
        window.addEventListener("resize", handleResize);
        checkForOverflow();
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [uniquePairs]);
    (0, react_1.useEffect)(() => {
        const container = containerRef.current;
        if (!container)
            return;
        const handleScroll = () => {
            setCanScrollLeft(container.scrollLeft > 1);
            setCanScrollRight(Math.ceil(container.scrollLeft + container.clientWidth) <
                container.scrollWidth - 1);
        };
        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (<div className="relative p-2">
      {canScrollLeft && (<react_2.Icon icon="heroicons-outline:chevron-left" className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer text-muted-400 dark:text-muted-500 pb-[2px]" onClick={scrollLeft}/>)}
      <div ref={containerRef} className={`flex items-center overflow-auto scrollbar-hidden text-sm ${canScrollLeft ? "ms-4" : ""} ${canScrollRight ? "me-4" : ""}`}>
        <span className="cursor-pointer z-1">
          <react_2.Icon onClick={() => setSelectedPair("WATCHLIST")} className={`h-4 w-4 mb-[2.5px] me-1 ${selectedPair === "WATCHLIST"
            ? "text-warning-500"
            : "text-muted-400"}`} icon={"uim:favorite"}/>
        </span>
        {uniquePairs.map((pair) => (<span key={pair} onClick={() => setSelectedPair(pair)} className={`px-2 py-1 ${pair === selectedPair
                ? "text-warning-500 dark:text-warning-400 bg-muted-100 dark:bg-muted-900 rounded-md"
                : "text-muted-400 dark:text-muted-500 hover:text-muted-500 dark:hover:text-muted-500"} cursor-pointer`}>
            {pair}
          </span>))}
      </div>
      {canScrollRight && (<react_2.Icon icon="heroicons-outline:chevron-right" className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-muted-400 dark:text-muted-500 pb-[2px]" onClick={scrollRight}/>)}
    </div>);
};
exports.MarketTab = (0, react_3.memo)(MarketTabBase);
