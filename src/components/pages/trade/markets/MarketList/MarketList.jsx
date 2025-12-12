"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketList = void 0;
const react_1 = require("react");
const SortableHeader_1 = require("../SortableHeader");
const react_2 = require("@iconify/react");
const market_1 = __importDefault(require("@/stores/trade/market"));
const link_1 = __importDefault(require("next/link"));
const router_1 = require("next/router");
const MarketListBase = ({ type = "trade" }) => {
    const { searchQuery, marketData, watchlistData, selectedPair, toggleWatchlist, priceChangeData, withEco, market, } = (0, market_1.default)();
    const router = (0, router_1.useRouter)();
    const { practice } = router.query;
    const [sort, setSort] = (0, react_1.useState)({ field: "symbol", rule: "asc" });
    const filteredData = selectedPair === "WATCHLIST"
        ? watchlistData.filter((w) => (withEco ? true : !w.isEco))
        : marketData.filter((item) => {
            const matchesSearch = item.symbol
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesPair = searchQuery
                ? true
                : selectedPair === "" || item.pair === selectedPair;
            return matchesSearch && matchesPair;
        });
    // Apply sorting
    const sortedData = [...filteredData].sort((a, b) => {
        var _a, _b, _c, _d;
        let comparison = 0;
        if (sort.field === "price" || sort.field === "change") {
            // Compare as numbers
            const numA = parseFloat(((_b = (_a = priceChangeData[a.symbol]) === null || _a === void 0 ? void 0 : _a[sort.field]) !== null && _b !== void 0 ? _b : 0).toString());
            const numB = parseFloat(((_d = (_c = priceChangeData[b.symbol]) === null || _c === void 0 ? void 0 : _c[sort.field]) !== null && _d !== void 0 ? _d : 0).toString());
            comparison = numA - numB;
        }
        else {
            // Compare as strings
            comparison = a[sort.field].localeCompare(b[sort.field]);
        }
        return sort.rule === "asc" ? comparison : -comparison;
    });
    return (<div className="text-sm text-muted-500 dark:text-muted-400 w-full">
      <div className="flex font-semibold p-2">
        <SortableHeader_1.SortableHeader field="symbol" setSort={setSort} sort={sort} className="w-[40%]"/>
        <SortableHeader_1.SortableHeader field="price" setSort={setSort} sort={sort} className="w-[40%]"/>
        <SortableHeader_1.SortableHeader field="change" setSort={setSort} sort={sort} className="w-[20%] text-end"/>
      </div>
      <div className={`w-full h-full space-y-1 px-1 overflow-y-auto slimscroll ${type === "trade"
            ? "max-h-[calc(50vh_-_64px)]"
            : "max-h-[calc(40vh_-_64px)]"}`}>
        {sortedData.map((item) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const linkHref = `/${type}/${item.symbol.replace("/", "_")}${type === "binary" && practice ? "?practice=true" : ""}`;
            return (<link_1.default key={item.id} href={linkHref} className=" w-full">
              <div className={`flex text-xs cursor-pointer hover:bg-muted-100 dark:hover:bg-muted-800 py-[2px] px-1 w-full rounded-sm ${item.symbol === `${market === null || market === void 0 ? void 0 : market.symbol}`
                    ? "bg-muted-100 dark:bg-muted-800"
                    : ""}`}>
                <span className="w-[40%] flex items-center gap-1">
                  <react_2.Icon onClick={() => toggleWatchlist(item.symbol)} className={`h-3 w-3 mb-[1px] me-1 cursor-pointer
          ${watchlistData && watchlistData.find((w) => w.symbol === item.symbol)
                    ? "text-warning-500 hover:text-muted-500"
                    : "text-muted-400 hover:text-warning-500"}`} icon={"uim:favorite"}/>
                  <span>
                    {item.currency}/
                    <span className="text-muted-400 dark:text-muted-500">
                      {item.pair}
                    </span>
                  </span>
                </span>
                <span className="w-[40%]">
                  {(_b = (_a = priceChangeData[item.symbol]) === null || _a === void 0 ? void 0 : _a.price) !== null && _b !== void 0 ? _b : item.price}
                </span>
                <span className={`w-[20%] text-end ${Number((_d = (_c = priceChangeData[item.symbol]) === null || _c === void 0 ? void 0 : _c.change) !== null && _d !== void 0 ? _d : 0) >= 0
                    ? Number((_f = (_e = priceChangeData[item.symbol]) === null || _e === void 0 ? void 0 : _e.change) !== null && _f !== void 0 ? _f : 0) === 0
                        ? ""
                        : "text-success-500"
                    : "text-danger-500"}`}>
                  {(_h = (_g = priceChangeData[item.symbol]) === null || _g === void 0 ? void 0 : _g.change) !== null && _h !== void 0 ? _h : 0}%
                </span>
              </div>
            </link_1.default>);
        })}
      </div>
    </div>);
};
exports.MarketList = (0, react_1.memo)(MarketListBase);
