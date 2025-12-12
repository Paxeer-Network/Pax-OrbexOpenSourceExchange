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
exports.MainChart = void 0;
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const chart_colors_1 = require("@/components/charts/chart-colors");
const dynamic_1 = __importDefault(require("next/dynamic"));
const next_i18next_1 = require("next-i18next");
const react_1 = __importDefault(require("react"));
const Chart = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("react-apexcharts"))), { ssr: false });
function safeNumber(val) {
    return typeof val === "number" && !isNaN(val) ? val : 0;
}
const MainChart = ({ availableFilters, filters, handleFilterChange, data, color, timeframe, setTimeframe, timeframes, }) => {
    var _a, _b, _c;
    const { t } = (0, next_i18next_1.useTranslation)();
    const safeData = Array.isArray(data) ? data : [];
    // If no data, show a fallback and do NOT render the chart
    if (safeData.length === 0)
        return null;
    const seriesData = safeData.map((item) => safeNumber(item.count));
    const categories = safeData.map((_, idx) => idx + 1);
    const selectedFilterColor = ((_b = (_a = availableFilters["status"]) === null || _a === void 0 ? void 0 : _a.find((item) => item.value === filters["status"])) === null || _b === void 0 ? void 0 : _b.color) || color;
    const chartColor = chart_colors_1.themeColors[selectedFilterColor] || chart_colors_1.themeColors.primary;
    const chartOptions = {
        series: [
            {
                name: "Count",
                data: seriesData,
            },
        ],
        chart: {
            height: 300,
            type: "area",
            zoom: { enabled: false },
            toolbar: { show: false },
        },
        colors: [chartColor],
        dataLabels: { enabled: false },
        stroke: { width: 2, curve: "smooth" },
        fill: { type: "gradient" },
        grid: {
            row: { colors: ["transparent", "transparent"], opacity: 0.5 },
        },
        tooltip: {
            x: {
                formatter: (val, { dataPointIndex }) => {
                    if (typeof dataPointIndex !== "number" ||
                        dataPointIndex < 0 ||
                        dataPointIndex >= safeData.length) {
                        return "";
                    }
                    const point = safeData[dataPointIndex];
                    return (point === null || point === void 0 ? void 0 : point.date) || "";
                },
            },
        },
        xaxis: {
            categories,
        },
        yaxis: {
            labels: {
                formatter: (val) => (isNaN(Number(val)) ? "0" : String(val)),
            },
        },
    };
    const { series, ...options } = chartOptions;
    return (<Card_1.default shape="smooth" color="contrast" className="p-4">
      <div className="px-4 flex justify-between items-center flex-col md:flex-row gap-5">
        <div className="flex gap-2 flex-col sm:flex-row w-full">
          {Object.keys(availableFilters).map((key) => (<Listbox_1.default key={key} selected={filters[key]
                ? availableFilters[key].find((item) => item.value === filters[key])
                : { value: "", label: "All" }} setSelected={(selection) => handleFilterChange(key, selection)} options={[{ value: "", label: "All" }, ...availableFilters[key]]} label={`Select ${key.toUpperCase()}`} classNames="max-w-full md:max-w-[200px]"/>))}
        </div>
        <div className="flex gap-1 flex-col pt-2">
          <span className="font-sans text-xs font-medium text-muted-500 dark:text-muted-400">
            {t("Timeframe")}
          </span>
          <div className="flex gap-2">
            {timeframes.map(({ value, label }) => (<Button_1.default key={value} variant="outlined" shape={"rounded-sm"} color={timeframe.value === value ? "primary" : "muted"} onClick={() => setTimeframe({ value, label })}>
                {label}
              </Button_1.default>))}
          </div>
        </div>
      </div>
      <Chart type="area" series={series} options={options} height={(_c = options.chart) === null || _c === void 0 ? void 0 : _c.height}/>
    </Card_1.default>);
};
exports.MainChart = MainChart;
