import { memo, useEffect, useRef, useState } from "react";
import { ChartProps } from "./Chart.types";
import useWebSocketStore from "@/stores/trade/ws";
import {
  LanguageCode,
  ResolutionString,
  ThemeName,
  Timezone,
  TradingTerminalFeatureset,
  widget,
} from "@/data/charting_library/charting_library";
import $fetch from "@/utils/api";
import {
  intervalDurations,
  intervals,
  resolutionMap,
  resolutionMap_provider,
  supported_resolutions_provider,
} from "@/utils/chart";
import { useMediaQuery } from "react-responsive";
import { breakpoints } from "@/utils/breakpoints";
import { useDashboardStore } from "@/stores/dashboard";
import useMarketStore from "@/stores/trade/market";

interface Bar {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: string;
}

const ChartBase = ({}: ChartProps) => {
  const [chartReady, setChartReady] = useState(false);
  const { unsubscribe, subscribe, addMessageHandler, removeMessageHandler } =
    useWebSocketStore();
  const [tvWidget, setTvWidget] = useState<any>(null);
  const { market } = useMarketStore();
  const [provider, setProvider] = useState<string>();

  useEffect(() => {
    switch (process.env.NEXT_PUBLIC_EXCHANGE) {
      case "bin":
        setProvider("binance");
        break;
      case "kuc":
        setProvider("kucoin");
        break;
      default:
        setProvider("binance");
        break;
    }
  }, []);

  const disabled_features: TradingTerminalFeatureset[] = [
    "header_compare",
    "symbol_search_hot_key", 
    "header_symbol_search",
    "border_around_the_chart",
    "popup_hints",
    "timezone_menu",
    "header_screenshot",
    "volume_force_overlay"
  ];
  const enabled_features: TradingTerminalFeatureset[] = [
    "save_chart_properties_to_local_storage",
    "use_localstorage_for_settings",
    "dont_show_boolean_study_arguments",
    "hide_last_na_study_output",
    "constraint_dialogs_movement",
    "countdown",
    "shift_visible_range_on_new_bar",
    "hide_image_invalid_symbol",
    "pre_post_market_sessions",
    "use_na_string_for_not_available_values",
    "create_volume_indicator_by_default",
    "determine_first_data_request_size_using_visible_range",
    "end_of_period_timescale_marks",
    "secondary_series_extend_time_scale",
    "left_toolbar",
    "control_bar",
    "timeframes_toolbar",
    "header_widget",
    "header_resolutions",
    "header_chart_type",
    "header_indicators",
    "header_undo_redo",
    "header_settings",
    "context_menus",
    "main_series_scale_menu",
    "scales_context_menu",
    "pane_context_menu",
    "legend_context_menu",
    "chart_crosshair_menu",
    "edit_buttons_in_legend",
    "show_hide_button_in_legend",
    "format_button_in_legend",
    "delete_button_in_legend",
    "legend_widget",
    "show_interval_dialog_on_key_press",
    "property_pages"
  ];
  const isMobile = useMediaQuery({ maxWidth: parseInt(breakpoints.sm) - 1 });
  if (isMobile) {
    // On mobile, simplify the interface for better performance
    disabled_features.push("header_fullscreen_button");
    disabled_features.push("left_toolbar"); // Disable drawing tools on mobile
    disabled_features.push("control_bar"); // Simplify controls
    
    // Remove conflicting features from enabled list
    const mobileEnabledFeatures = enabled_features.filter(feature => 
      feature !== "left_toolbar" && feature !== "control_bar"
    );
    enabled_features.length = 0;
    enabled_features.push(...mobileEnabledFeatures);
    // But keep essential features
  } else {
    // On desktop, enable all toolbar features
    enabled_features.push("side_toolbar_in_fullscreen_mode");
    enabled_features.push("header_fullscreen_button");
  }

  const [interval, setInterval] = useState<string | null>("1h");
  const subscribers = useRef<any>({});

  const DataFeed = function () {
    if (!market) return console.error("Currency and pair are required");

    const { isEco } = market;

    const historyPath = isEco
      ? `/api/ext/ecosystem/chart`
      : `/api/exchange/chart`;

    const pricescale = Math.pow(10, market.precision?.price || 8);
    return {
      async onReady(callback) {
        setTimeout(() => {
          callback({
            exchanges: [],
            symbols_types: [],
            supported_resolutions: isEco
              ? intervals
              : supported_resolutions_provider[provider || "binance"],
          });
        }, 0);
      },

      async resolveSymbol(
        symbolName,
        onSymbolResolvedCallback,
        onResolveErrorCallback
      ) {
        setTimeout(() => {
          onSymbolResolvedCallback({
            data_status: "streaming",
            pricescale,
            name: symbolName,
            full_name: symbolName,
            description: symbolName,
            ticker: symbolName,
            type: "crypto",
            session: "24x7",
            format: "price",
            exchange: process.env.NEXT_PUBLIC_SITE_NAME,
            listed_exchange: process.env.NEXT_PUBLIC_SITE_NAME,
            timezone: "Etc/UTC",
            volume_precision: market?.precision?.amount || 8,
            supported_resolutions: isEco
              ? intervals
              : supported_resolutions_provider[provider || "binance"],
            minmov: 1,
            has_intraday: true,
            visible_plots_set: false,
          });
        }, 0);
      },

      async getBars(
        symbolInfo,
        resolution,
        periodParams,
        onHistoryCallback,
        onErrorCallback
      ) {
        const duration = intervalDurations[resolution] || 0;

        const from = periodParams.from * 1000;
        const to = periodParams.to * 1000;

        try {
          // Fetch historical data from your API
          const response = await $fetch({
            url: historyPath,
            silent: true,
            params: {
              symbol: `${market?.symbol}`,
              interval:
                resolutionMap_provider[provider || "binance"][resolution],
              from: from,
              to: to,
              duration: duration,
            },
          });

          // Parse the data from the response
          const data = await response.data;

          // Check if data was returned
          if (data && data.length) {
            // Convert data to the format required by TradingView
            const bars = data.map((item) => ({
              time: item[0],
              open: item[1],
              high: item[2],
              low: item[3],
              close: item[4],
              volume: item[5],
            }));

            // Sort the bars by time
            bars.sort((a, b) => a.time - b.time);

            onHistoryCallback(bars);
          } else {
            onHistoryCallback([], { noData: true });
          }
        } catch (error) {
          onErrorCallback(new Error("Failed to fetch historical data"));
          return;
        }
      },

      subscribeBars(
        symbolInfo,
        resolution,
        onRealtimeCallback,
        subscribeUID,
        onResetCacheNeededCallback
      ) {
        const { isEco } = market;

        if (interval && interval !== resolutionMap[resolution]) {
          const connectionKey = isEco
            ? "ecoTradesConnection"
            : "tradesConnection";
          unsubscribe(connectionKey, "ohlcv", {
            interval: interval,
            symbol: symbolInfo.ticker,
          });
        }

        // Store the subscriber's callback and symbol information in a global map
        const subscriberInfo = {
          callback: onRealtimeCallback,
          symbolInfo: symbolInfo,
          resolution: resolution,
        };

        subscribers.current[subscribeUID] = subscriberInfo;

        // Subscribe to the trades connection
        const connectionKey = isEco
          ? "ecoTradesConnection"
          : "tradesConnection";
        subscribe(connectionKey, "ohlcv", {
          interval: resolutionMap[resolution],
          symbol: symbolInfo.ticker,
        });

        // Update the current interval
        setInterval(resolution);
      },

      unsubscribeBars(subscriberUID) {
        if (!subscribers.current[subscriberUID]) return;
        // Remove the subscriber from the global map
        const { symbolInfo, resolution } = subscribers.current[subscriberUID];
        delete subscribers.current[subscriberUID];

        const { isEco } = market;
        const connectionKey = isEco
          ? "ecoTradesConnection"
          : "tradesConnection";
        unsubscribe(connectionKey, "ohlcv", {
          interval: resolutionMap[resolution],
          symbol: symbolInfo.ticker,
        });
        removeMessageHandler(connectionKey, handleBarsMessage);

        // Reset the interval if it's the same as the unsubscribed one
        if (interval === resolution) {
          setInterval(null);
        }
      },
    };
  };

  useEffect(() => {
    if (market?.symbol) {
      initTradingView();
    }
  }, [market?.symbol]);

  const handleBarsMessage = (message: any) => {
    const { data } = message;
    if (!data) return;
    // Data processing

    const bar = data[0];

    const newBar: Bar = {
      time: bar[0],
      open: bar[1],
      high: bar[2],
      low: bar[3],
      close: bar[4],
      volume: bar[5],
    };

    // Update the subscriber's chart with the new bar
    Object.keys(subscribers.current).forEach((key) => {
      const subscriber = subscribers.current[key];
      if (subscriber.callback) {
        subscriber.callback(newBar);
      }
    });
  };

  useEffect(() => {
    if (!market || !chartReady) return;

    const { isEco } = market;
    const connectionKey = isEco ? "ecoTradesConnection" : "tradesConnection";
    const messageFilter = (message: any) =>
      message.stream && message.stream.startsWith("ohlcv");

    addMessageHandler(connectionKey, handleBarsMessage, messageFilter);

    return () => {
      removeMessageHandler(connectionKey, handleBarsMessage);
    };
  }, [market, chartReady]);

  const { isDark } = useDashboardStore();

  useEffect(() => {
    if (
      chartReady &&
      tvWidget?._ready &&
      typeof tvWidget.changeTheme === "function"
    ) {
      tvWidget.changeTheme((isDark ? "Dark" : "Light") as ThemeName);
    }
  }, [isDark, chartReady]);

  async function initTradingView() {
    // cleanup
    if (tvWidget) {
      tvWidget.remove();
      setTvWidget(null);
    }

    if (!market) return console.error("Currency and pair are required");
    const datafeed = (await DataFeed()) as any;
    if (!datafeed) return;
    const widgetOptions = {
      fullscreen: false,
      autosize: true,
      symbol: market?.symbol,
      interval: "60" as ResolutionString,
      container: "tv_chart_container",
      datafeed: datafeed,
      library_path: "/lib/chart/charting_library/",
      locale: "en" as LanguageCode,
      theme: (isDark ? "Dark" : "Light") as ThemeName,
      timezone: "Etc/UTC" as Timezone,
      client_id: "chart",
      disabled_features: disabled_features,
      enabled_features: enabled_features,
      toolbar_bg: isDark ? "#09090b" : "#ffffff",
      loading_screen: { backgroundColor: isDark ? "#09090b" : "#ffffff" },
      width: isMobile && typeof window !== 'undefined' ? window.innerWidth : undefined,
      height: isMobile && typeof window !== 'undefined' ? window.innerHeight * 0.7 : undefined,
      overrides: {
        "mainSeriesProperties.showCountdown": false,
        "highLowAvgPrice.highLowPriceLinesVisible": false,
        "mainSeriesProperties.highLowAvgPrice.highLowPriceLabelsVisible": false,
        "mainSeriesProperties.showPriceLine": true,
        "paneProperties.background": isDark ? "#09090b" : "#ffffff",
        "paneProperties.backgroundType": "solid",
        "paneProperties.backgroundGradientStartColor": isDark ? "#09090b" : "#ffffff",
        "paneProperties.backgroundGradientEndColor": isDark ? "#09090b" : "#ffffff",
        "paneProperties.gridProperties.color": isDark ? "#27272a" : "#f4f4f5",
        "paneProperties.gridProperties.style": 2,
        "paneProperties.vertGridProperties.color": isDark ? "#27272a" : "#f4f4f5",
        "paneProperties.vertGridProperties.style": 2,
        "paneProperties.horzGridProperties.color": isDark ? "#27272a" : "#f4f4f5",
        "paneProperties.horzGridProperties.style": 2,
        "paneProperties.crossHairProperties.color": isDark ? "#71717a" : "#a1a1aa",
        "paneProperties.crossHairProperties.width": 1,
        "paneProperties.crossHairProperties.style": 2,
        "scalesProperties.backgroundColor": isDark ? "#09090b" : "#ffffff",
        "scalesProperties.lineColor": isDark ? "#27272a" : "#e4e4e7",
        "scalesProperties.textColor": isDark ? "#a1a1aa" : "#71717a",
        "scalesProperties.fontSize": 12,
        "symbolWatermarkProperties.transparency": 100,
        "mainSeriesProperties.candleStyle.upColor": "#3df57b",
        "mainSeriesProperties.candleStyle.downColor": "#ea435c",
        "mainSeriesProperties.candleStyle.borderUpColor": "#3df57b",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ea435c",
        "mainSeriesProperties.candleStyle.wickUpColor": "#3df57b",
        "mainSeriesProperties.candleStyle.wickDownColor": "#ea435c",
        "mainSeriesProperties.hollowCandleStyle.upColor": "#3df57b",
        "mainSeriesProperties.hollowCandleStyle.downColor": "#ea435c",
        "mainSeriesProperties.hollowCandleStyle.borderUpColor": "#3df57b",
        "mainSeriesProperties.hollowCandleStyle.borderDownColor": "#ea435c",
        "mainSeriesProperties.hollowCandleStyle.wickUpColor": "#3df57b",
        "mainSeriesProperties.hollowCandleStyle.wickDownColor": "#ea435c",
        "mainSeriesProperties.barStyle.upColor": "#3df57b",
        "mainSeriesProperties.barStyle.downColor": "#ea435c",
        "mainSeriesProperties.lineStyle.color": isDark ? "#e4e4e7" : "#18181b",
        "mainSeriesProperties.lineStyle.linewidth": 2,
        "mainSeriesProperties.areaStyle.color1": isDark ? "#3df57b" : "#3df57b",
        "mainSeriesProperties.areaStyle.color2": isDark ? "#3df57b" : "#3df57b",
        "mainSeriesProperties.areaStyle.linecolor": "#3df57b",
        "mainSeriesProperties.areaStyle.linestyle": 0,
        "mainSeriesProperties.areaStyle.linewidth": 2,
        "mainSeriesProperties.areaStyle.transparency": 90,
        "volumePaneSize": "medium",
        "priceAxisProperties.autoScale": true,
        "priceAxisProperties.autoScaleDisabled": false,
        "priceAxisProperties.percentage": false,
        "priceAxisProperties.percentageDisabled": false,
        "priceAxisProperties.log": false,
        "priceAxisProperties.logDisabled": false,
        "priceAxisProperties.alignLabels": true,
        "timeAxisProperties.visible": true,
        "timeAxisProperties.fontSize": 12,
        "paneProperties.topMargin": 10,
        "paneProperties.bottomMargin": 10,
        "paneProperties.leftAxisProperties.autoScale": true,
        "paneProperties.leftAxisProperties.autoScaleDisabled": false,
        "paneProperties.leftAxisProperties.percentage": false,
        "paneProperties.leftAxisProperties.percentageDisabled": false,
        "paneProperties.leftAxisProperties.log": false,
        "paneProperties.leftAxisProperties.logDisabled": false,
        "paneProperties.leftAxisProperties.alignLabels": true,
        "paneProperties.rightAxisProperties.autoScale": true,
        "paneProperties.rightAxisProperties.autoScaleDisabled": false,
        "paneProperties.rightAxisProperties.percentage": false,
        "paneProperties.rightAxisProperties.percentageDisabled": false,
        "paneProperties.rightAxisProperties.log": false,
        "paneProperties.rightAxisProperties.logDisabled": false,
        "paneProperties.rightAxisProperties.alignLabels": true
      },
      custom_css_url: "/lib/chart/themed.css",
    };

    try {
      const tv = new widget(widgetOptions);
      setTvWidget(tv);

      tv.onChartReady(() => {
        console.log('Chart ready on', isMobile ? 'mobile' : 'desktop');
        setChartReady(true);
      });

      // Add mobile-specific handling
      if (isMobile) {
        // Force a resize after a short delay to ensure proper rendering
        setTimeout(() => {
          try {
            if (tv && typeof (tv as any).resize === 'function' && typeof window !== 'undefined') {
              (tv as any).resize(window.innerWidth, window.innerHeight * 0.7);
            }
          } catch (e) {
            console.warn('Chart resize failed:', e);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Chart initialization failed:', error);
    }
  }

  return (
    <div className={`w-full h-full bg-white dark:bg-zinc-950 rounded-lg overflow-hidden ${
      isMobile ? 'min-h-[400px]' : ''
    }`}>
      <div 
        id="tv_chart_container" 
        className="w-full h-full"
        style={{
          minHeight: isMobile ? '400px' : 'auto',
          position: 'relative'
        }}
      ></div>
    </div>
  );
};

export const Chart = memo(ChartBase);
