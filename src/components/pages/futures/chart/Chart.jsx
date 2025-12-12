"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chart = void 0;
const react_1 = require("react");
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const charting_library_1 = require("@/data/charting_library/charting_library");
const api_1 = __importDefault(require("@/utils/api"));
const chart_1 = require("@/utils/chart");
const react_responsive_1 = require("react-responsive");
const breakpoints_1 = require("@/utils/breakpoints");
const dashboard_1 = require("@/stores/dashboard");
const market_1 = __importDefault(require("@/stores/futures/market"));
const ChartBase = ({}) => {
    const [chartReady, setChartReady] = (0, react_1.useState)(false);
    const { unsubscribe, subscribe, addMessageHandler, removeMessageHandler } = (0, ws_1.default)();
    const [tvWidget, setTvWidget] = (0, react_1.useState)(null);
    const { market } = (0, market_1.default)();
    const disabled_features = [
        "header_compare",
        "symbol_search_hot_key",
        "header_symbol_search",
        "border_around_the_chart",
        "popup_hints",
        "timezone_menu",
    ];
    const enabled_features = [
        "save_chart_properties_to_local_storage",
        "use_localstorage_for_settings",
        "dont_show_boolean_study_arguments",
        "hide_last_na_study_output",
        "constraint_dialogs_movement",
        "countdown",
        "insert_indicator_dialog_shortcut",
        "shift_visible_range_on_new_bar",
        "hide_image_invalid_symbol",
        "pre_post_market_sessions",
        "use_na_string_for_not_available_values",
        "create_volume_indicator_by_default",
        "determine_first_data_request_size_using_visible_range",
        "end_of_period_timescale_marks",
        "secondary_series_extend_time_scale",
        "shift_visible_range_on_new_bar",
    ];
    const isMobile = (0, react_responsive_1.useMediaQuery)({ maxWidth: parseInt(breakpoints_1.breakpoints.sm) - 1 });
    if (isMobile) {
        disabled_features.push("left_toolbar");
        disabled_features.push("header_fullscreen_button");
        disabled_features.push("timeframes_toolbar");
    }
    else {
        enabled_features.push("chart_style_hilo");
        enabled_features.push("chart_style_hilo_last_price");
        enabled_features.push("side_toolbar_in_fullscreen_mode");
    }
    const [interval, setInterval] = (0, react_1.useState)("1h");
    const subscribers = (0, react_1.useRef)({});
    const DataFeed = function () {
        var _a;
        if (!market)
            return console.error("Currency and pair are required");
        const historyPath = `/api/ext/futures/chart`;
        const pricescale = Math.pow(10, ((_a = market.precision) === null || _a === void 0 ? void 0 : _a.price) || 8);
        return {
            async onReady(callback) {
                setTimeout(() => {
                    callback({
                        exchanges: [],
                        symbols_types: [],
                        supported_resolutions: chart_1.intervals,
                    });
                }, 0);
            },
            async resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
                setTimeout(() => {
                    var _a;
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
                        volume_precision: ((_a = market === null || market === void 0 ? void 0 : market.precision) === null || _a === void 0 ? void 0 : _a.amount) || 8,
                        supported_resolutions: chart_1.intervals,
                        minmov: 1,
                        has_intraday: true,
                        visible_plots_set: false,
                    });
                }, 0);
            },
            async getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
                const duration = chart_1.intervalDurations[resolution] || 0;
                const from = periodParams.from * 1000;
                const to = periodParams.to * 1000;
                try {
                    // Fetch historical data from your API
                    const response = await (0, api_1.default)({
                        url: historyPath,
                        silent: true,
                        params: {
                            symbol: `${market === null || market === void 0 ? void 0 : market.symbol}`,
                            interval: chart_1.resolutionMap_provider["native"][resolution],
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
                    }
                    else {
                        onHistoryCallback([], { noData: true });
                    }
                }
                catch (error) {
                    onErrorCallback(new Error("Failed to fetch historical data"));
                    return;
                }
            },
            subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {
                if (interval && interval !== chart_1.resolutionMap[resolution]) {
                    unsubscribe("futuresTradesConnection", "ohlcv", {
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
                subscribe("futuresTradesConnection", "ohlcv", {
                    interval: chart_1.resolutionMap[resolution],
                    symbol: symbolInfo.ticker,
                });
                // Update the current interval
                setInterval(resolution);
            },
            unsubscribeBars(subscriberUID) {
                if (!subscribers.current[subscriberUID])
                    return;
                // Remove the subscriber from the global map
                const { symbolInfo, resolution } = subscribers.current[subscriberUID];
                delete subscribers.current[subscriberUID];
                unsubscribe("futuresTradesConnection", "ohlcv", {
                    interval: chart_1.resolutionMap[resolution],
                    symbol: symbolInfo.ticker,
                });
                removeMessageHandler("futuresTradesConnection", handleBarsMessage);
                // Reset the interval if it's the same as the unsubscribed one
                if (interval === resolution) {
                    setInterval(null);
                }
            },
        };
    };
    (0, react_1.useEffect)(() => {
        if (market === null || market === void 0 ? void 0 : market.symbol) {
            initTradingView();
        }
    }, [market === null || market === void 0 ? void 0 : market.symbol]);
    const handleBarsMessage = (message) => {
        const { data } = message;
        if (!data)
            return;
        // Data processing
        const bar = data[0];
        const newBar = {
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
    (0, react_1.useEffect)(() => {
        if (!market || !chartReady)
            return;
        const messageFilter = (message) => message.stream && message.stream.startsWith("ohlcv");
        addMessageHandler("futuresTradesConnection", handleBarsMessage, messageFilter);
        return () => {
            removeMessageHandler("futuresTradesConnection", handleBarsMessage);
        };
    }, [market, chartReady]);
    const { isDark } = (0, dashboard_1.useDashboardStore)();
    (0, react_1.useEffect)(() => {
        if (chartReady &&
            (tvWidget === null || tvWidget === void 0 ? void 0 : tvWidget._ready) &&
            typeof tvWidget.changeTheme === "function") {
            tvWidget.changeTheme((isDark ? "Dark" : "Light"));
        }
    }, [isDark, chartReady]);
    async function initTradingView() {
        // cleanup
        if (tvWidget) {
            tvWidget.remove();
            setTvWidget(null);
        }
        if (!market)
            return console.error("Currency and pair are required");
        const datafeed = (await DataFeed());
        if (!datafeed)
            return;
        const widgetOptions = {
            fullscreen: false,
            autosize: true,
            symbol: market === null || market === void 0 ? void 0 : market.symbol,
            interval: "60",
            container: "tv_chart_container",
            datafeed: datafeed,
            library_path: "/lib/chart/charting_library/",
            locale: "en",
            theme: (isDark ? "Dark" : "Light"),
            timezone: "Etc/UTC",
            client_id: "chart",
            disabled_features: disabled_features,
            enabled_features: enabled_features,
            overrides: {
                "mainSeriesProperties.showCountdown": true,
                "highLowAvgPrice.highLowPriceLinesVisible": true,
                "mainSeriesProperties.highLowAvgPrice.highLowPriceLabelsVisible": true,
                "mainSeriesProperties.showPriceLine": true,
                "paneProperties.background": isDark ? "#18181b" : "#ffffff",
                "paneProperties.backgroundType": "solid",
            },
            custom_css_url: "/lib/chart/themed.css",
        };
        const tv = new charting_library_1.widget(widgetOptions);
        setTvWidget(tv);
        tv.onChartReady(() => {
            setChartReady(true);
        });
    }
    return <div id="tv_chart_container" className="w-full h-full"></div>;
};
exports.Chart = (0, react_1.memo)(ChartBase);
