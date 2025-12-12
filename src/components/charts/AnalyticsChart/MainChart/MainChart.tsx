import Card from "@/components/elements/base/card/Card";
import { MainChartProps } from "./MainChart.types";
import ListBox from "@/components/elements/form/listbox/Listbox";
import Button from "@/components/elements/base/button/Button";
import { ApexOptions } from "apexcharts";
import { themeColors } from "@/components/charts/chart-colors";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import React from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function safeNumber(val: any): number {
  return typeof val === "number" && !isNaN(val) ? val : 0;
}

export const MainChart = ({
  availableFilters,
  filters,
  handleFilterChange,
  data,
  color,
  timeframe,
  setTimeframe,
  timeframes,
}: MainChartProps) => {
  const { t } = useTranslation();
  const safeData = Array.isArray(data) ? data : [];

  // If no data, show a fallback and do NOT render the chart
  if (safeData.length === 0) return null;

  const seriesData = safeData.map((item) => safeNumber(item.count));
  const categories = safeData.map((_, idx) => idx + 1);

  const selectedFilterColor =
    availableFilters["status"]?.find((item) => item.value === filters["status"])
      ?.color || color;

  const chartColor = themeColors[selectedFilterColor] || themeColors.primary;

  const chartOptions: ApexOptions = {
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
          if (
            typeof dataPointIndex !== "number" ||
            dataPointIndex < 0 ||
            dataPointIndex >= safeData.length
          ) {
            return "";
          }
          const point = safeData[dataPointIndex];
          return point?.date || "";
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

  return (
    <Card shape="smooth" color="contrast" className="p-4">
      <div className="px-4 flex justify-between items-center flex-col md:flex-row gap-5">
        <div className="flex gap-2 flex-col sm:flex-row w-full">
          {Object.keys(availableFilters).map((key) => (
            <ListBox
              key={key}
              selected={
                filters[key]
                  ? availableFilters[key].find(
                      (item) => item.value === filters[key]
                    )
                  : { value: "", label: "All" }
              }
              setSelected={(selection) => handleFilterChange(key, selection)}
              options={[{ value: "", label: "All" }, ...availableFilters[key]]}
              label={`Select ${key.toUpperCase()}`}
              classNames="max-w-full md:max-w-[200px]"
            />
          ))}
        </div>
        <div className="flex gap-1 flex-col pt-2">
          <span className="font-sans text-xs font-medium text-muted-500 dark:text-muted-400">
            {t("Timeframe")}
          </span>
          <div className="flex gap-2">
            {timeframes.map(({ value, label }) => (
              <Button
                key={value}
                variant="outlined"
                shape={"rounded-sm"}
                color={timeframe.value === value ? "primary" : "muted"}
                onClick={() => setTimeframe({ value, label })}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Chart
        type="area"
        series={series}
        options={options}
        height={options.chart?.height}
      />
    </Card>
  );
};
