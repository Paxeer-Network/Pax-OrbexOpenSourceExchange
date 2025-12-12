import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useNftStore } from "@/stores/nft";
import { themeColors } from "@/components/charts/chart-colors"; // Import theme colors for chart styling
import { useDashboardStore } from "@/stores/dashboard";

// Use dynamic import for react-apexcharts
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AnalyticsTab: React.FC = () => {
  const { collection } = useNftStore();
  const { isDark } = useDashboardStore();
  if (!collection) return null;

  const { analytics, nftAssets } = collection;
  if (!analytics) return null;

  // Ensure data safety and handle undefined values gracefully
  const volumePerDayData = analytics.volumePerDay || [];
  const tradesPerDayData = analytics.tradesPerDay || [];
  const averageSalePricePerDayData = analytics.averageSalePricePerDay || [];
  const ownerDistributionData = analytics.ownerDistribution || {};

  // Prepare data for each chart
  const volumeSeries = [
    {
      name: "Volume",
      data: volumePerDayData.map((item) => item.volume ?? 0),
    },
  ];

  const tradesSeries = [
    {
      name: "Trades",
      data: tradesPerDayData.map((item) => item.trades ?? 0),
    },
  ];

  const averagePriceSeries = [
    {
      name: "Average Sale Price",
      data: averageSalePricePerDayData.map((item) => item.averagePrice ?? 0),
    },
  ];

  // Create a map of owner IDs to their names based on `nftAssets`
  const ownerNameMap: Record<string, string> = {};
  nftAssets.forEach((asset) => {
    if (asset.owner && asset.owner.id) {
      const ownerIdSegment = asset.owner.id.substring(0, 4);
      ownerNameMap[
        asset.owner.id
      ] = `${asset.owner.firstName} ${asset.owner.lastName} (${ownerIdSegment})`;
    }
  });

  // Convert ownerDistribution object to ApexCharts-compatible format with full owner names
  const ownerDistributionSeries = Object.values(
    ownerDistributionData
  ) as number[];
  const ownerDistributionLabels = Object.keys(ownerDistributionData).map(
    (ownerId) => ownerNameMap[ownerId] || ownerId // Use the mapped name or fall back to ID
  );

  // Define chart options with consistent theme and styling
  const chartOptions = (
    title: string,
    categories: string[],
    color: string
  ): ApexOptions => ({
    chart: {
      height: 300,
      type: "line",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    title: {
      text: title,
      align: "left",
      style: {
        color: isDark ? "#cfcfd3" : "#3f3f46",
      },
    },
    colors: [color],
    xaxis: {
      categories,
      labels: {
        rotate: -45,
        style: {
          colors: isDark ? "#cfcfd3" : "#3f3f46",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => (val !== null ? `${val.toFixed(2)}` : ""),
        style: {
          colors: isDark ? "#cfcfd3" : "#3f3f46",
        },
      },
    },
    tooltip: { enabled: true },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.3,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    grid: {
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
    dataLabels: { enabled: false },
  });

  // Owner distribution options
  const ownerDistributionOptions: ApexOptions = {
    labels: ownerDistributionLabels,
    colors: [
      themeColors.blue,
      themeColors.green,
      themeColors.orange,
      themeColors.danger,
    ],
    title: {
      text: "Owner Distribution",
      style: {
        color: isDark ? "#cfcfd3" : "#3f3f46", // Match title color with theme
      },
    },
    legend: { show: false },
    plotOptions: {
      pie: {
        expandOnClick: true,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} NFTs`,
      },
    },
  };

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Volume Per Day Chart */}
        <div className="bg-white dark:bg-muted-900 shadow-md rounded-lg p-4">
          <Chart
            options={chartOptions(
              "Volume Per Day",
              volumePerDayData.map((item) => item.date ?? ""),
              themeColors.blue // Apply blue color for Volume chart
            )}
            series={volumeSeries}
            type="area"
            height={300}
          />
        </div>

        {/* Trades Per Day Chart */}
        <div className="bg-white dark:bg-muted-900 shadow-md rounded-lg p-4">
          <Chart
            options={chartOptions(
              "Trades Per Day",
              tradesPerDayData.map((item) => item.date ?? ""),
              themeColors.green // Apply green color for Trades chart
            )}
            series={tradesSeries}
            type="bar"
            height={300}
          />
        </div>

        {/* Average Sale Price Per Day Chart */}
        <div className="bg-white dark:bg-muted-900 shadow-md rounded-lg p-4">
          <Chart
            options={chartOptions(
              "Average Sale Price Per Day",
              averageSalePricePerDayData.map((item) => item.date ?? ""),
              themeColors.orange // Apply orange color for Average Sale Price chart
            )}
            series={averagePriceSeries}
            type="area"
            height={300}
          />
        </div>

        {/* Owner Distribution Donut Chart */}
        <div className="bg-white dark:bg-muted-900 shadow-md rounded-lg p-4">
          <Chart
            options={ownerDistributionOptions}
            series={ownerDistributionSeries}
            type="donut"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
