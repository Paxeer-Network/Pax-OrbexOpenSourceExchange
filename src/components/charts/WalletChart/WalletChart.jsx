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
exports.WalletChart = void 0;
const react_1 = require("react");
const dynamic_1 = __importDefault(require("next/dynamic"));
const chart_colors_1 = require("@/components/charts/chart-colors");
const date_fns_1 = require("date-fns");
const dashboard_1 = require("@/stores/dashboard");
const Chart = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("react-apexcharts"))), { ssr: false });
// Helper function to ensure numeric values
const numOrZero = (val) => {
    if (typeof val === "number" && !isNaN(val)) {
        return val;
    }
    // If it's not a valid number, return 0
    return 0;
};
const WalletChartBase = ({ data }) => {
    const { hasExtension } = (0, dashboard_1.useDashboardStore)();
    if (!data)
        return null;
    // Validate and prepare chart data
    const validData = data.filter((item) => {
        const date = (0, date_fns_1.parseISO)(item.date);
        // Ensure FIAT and SPOT are not null and date is valid
        return item.FIAT != null && item.SPOT != null && (0, date_fns_1.isValid)(date);
    });
    // If no valid data, show a fallback instead of rendering an invalid chart
    if (validData.length === 0) {
        return <div className="p-4 text-center">No data available</div>;
    }
    // Construct the series with guaranteed numeric data
    const series = [
        {
            name: "Fiat",
            data: validData.map((item) => numOrZero(item.FIAT)),
        },
        {
            name: "Spot",
            data: validData.map((item) => numOrZero(item.SPOT)),
        },
    ];
    if (hasExtension("ecosystem")) {
        series.push({
            name: "Funding",
            data: validData.map((item) => numOrZero(item.FUNDING)),
        });
    }
    const categories = validData.map((item) => {
        const date = (0, date_fns_1.parseISO)(item.date);
        return (0, date_fns_1.isValid)(date) ? (0, date_fns_1.format)(date, "MM-dd") : "Invalid date";
    });
    const chartOptions = {
        series: series,
        chart: {
            height: 300,
            type: "area",
            zoom: { enabled: false },
            toolbar: { show: false },
        },
        colors: [chart_colors_1.themeColors.blue, chart_colors_1.themeColors.green, chart_colors_1.themeColors.orange],
        dataLabels: { enabled: false },
        stroke: {
            width: 2,
            curve: "smooth",
        },
        fill: { type: "gradient" },
        grid: {
            row: { colors: ["transparent", "transparent"], opacity: 0.5 },
        },
        yaxis: {
            opposite: true,
            labels: {
                formatter: function (val) {
                    return `$${val}`;
                },
            },
        },
        xaxis: {
            categories: categories,
        },
    };
    return (<div className="w-full overflow-hidden">
      <Chart options={chartOptions} series={series} type="area" height={300}/>
    </div>);
};
exports.WalletChart = (0, react_1.memo)(WalletChartBase);
