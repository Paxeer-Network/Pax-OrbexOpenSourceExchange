"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsChart = void 0;
const react_1 = __importStar(require("react"));
const api_1 = __importDefault(require("@/utils/api"));
const FilterCharts_1 = require("./FilterCharts");
const MainChart_1 = require("./MainChart");
const Header_1 = require("./Header");
const router_1 = require("next/router");
const timeframes = [
    { value: "d", label: "D", text: "Today" },
    { value: "w", label: "W", text: "This Week" },
    { value: "m", label: "M", text: "This Month" },
    { value: "6m", label: "6M", text: "These 6 Months" },
    { value: "y", label: "Y", text: "This Year" },
];
const removeEmptyFilters = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        if (typeof value === "object" && value !== null) {
            const nested = removeEmptyFilters(value);
            if (Object.keys(nested).length > 0) {
                acc[key] = nested;
            }
        }
        else if (value !== "" && value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {});
};
const AnalyticsChartBase = ({ model, modelName, postTitle, cardName = modelName, availableFilters = {}, color = "primary", params, path, pathModel, }) => {
    const [data, setData] = (0, react_1.useState)([]);
    const [filterResults, setFilterResults] = (0, react_1.useState)({});
    const [timeframe, setTimeframe] = (0, react_1.useState)({ value: "m", label: "Month" });
    const [filters, setFilters] = (0, react_1.useState)({});
    const router = (0, router_1.useRouter)();
    const isMountedRef = (0, react_1.useRef)(true);
    const [chartVisible, setChartVisible] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        isMountedRef.current = true;
        return () => {
            // On unmount, prevent state updates
            isMountedRef.current = false;
        };
    }, []);
    // Hide chart when route is changing to avoid apexcharts computations mid-transition
    (0, react_1.useEffect)(() => {
        const handleRouteChange = () => {
            setChartVisible(false);
        };
        router.events.on("routeChangeStart", handleRouteChange);
        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, [router.events]);
    (0, react_1.useEffect)(() => {
        let didCancel = false;
        const fetchData = async () => {
            const effectiveFilters = removeEmptyFilters(filters);
            const { data: responseData, error } = await (0, api_1.default)({
                url: path || "/api/admin/analysis",
                method: "POST",
                params: {
                    ...params,
                    ...(path ? (pathModel ? { model } : {}) : { model }),
                    timeframe: timeframe.value,
                    ...(Object.keys(effectiveFilters).length
                        ? { filter: JSON.stringify(effectiveFilters) }
                        : {}),
                },
                body: {
                    availableFilters,
                },
                silent: true,
            });
            // If component is unmounted or route changed before fetch completes, stop
            if (didCancel || !isMountedRef.current)
                return;
            if (!error && responseData) {
                const chartData = Array.isArray(responseData.chartData)
                    ? responseData.chartData
                    : [];
                const cleanedData = chartData.map((item) => ({
                    ...item,
                    count: typeof item.count === "number" && !isNaN(item.count)
                        ? item.count
                        : 0,
                }));
                setData(cleanedData);
                setFilterResults(responseData.filterResults || {});
            }
            else {
                setData([]);
                setFilterResults({});
            }
            // After successful data load, ensure chart is visible if still on same page
            if (isMountedRef.current) {
                setChartVisible(true);
            }
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, [timeframe, filters, model, path, params, availableFilters, pathModel]);
    const handleFilterChange = (key, selection) => {
        setFilters((prev) => {
            const updated = {
                ...prev,
                [key]: selection.value || undefined,
            };
            return removeEmptyFilters(updated);
        });
    };
    return (<>
      <Header_1.Header modelName={modelName} postTitle={postTitle}/>

      <FilterCharts_1.FilterCharts availableFilters={availableFilters} filterResults={filterResults} timeframe={timeframe} cardName={cardName} modelName={modelName} timeframes={timeframes}/>

      {chartVisible && (<MainChart_1.MainChart filters={filters} handleFilterChange={handleFilterChange} data={data} color={color} timeframe={timeframe} setTimeframe={setTimeframe} timeframes={timeframes} availableFilters={availableFilters}/>)}
    </>);
};
exports.AnalyticsChart = AnalyticsChartBase;
