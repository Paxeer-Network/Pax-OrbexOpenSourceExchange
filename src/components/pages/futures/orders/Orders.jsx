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
exports.Orders = void 0;
const react_1 = __importStar(require("react"));
const tab_1 = require("@/components/elements/base/tab");
const date_fns_1 = require("date-fns");
const market_1 = __importDefault(require("@/stores/futures/market"));
const dashboard_1 = require("@/stores/dashboard");
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const router_1 = require("next/router");
const order_1 = require("@/stores/futures/order");
const object_table_1 = require("@/components/elements/base/object-table");
const lodash_1 = require("lodash");
const statusClass = (status) => {
    switch (status) {
        case "ACTIVE":
            return "text-primary-500";
        case "OPEN":
            return "text-warning-500";
        case "CLOSED":
            return "text-success-500";
        case "CANCELED":
            return "text-danger-500";
        case "EXPIRED":
        case "REJECTED":
        default:
            return "text-muted-500";
    }
};
const OrdersBase = () => {
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const tabs = [
        { value: "OPEN", label: "Open Orders" },
        { value: "HISTORY", label: "Orders History" },
        { value: "OPEN_POSITIONS", label: "Open Positions" },
        { value: "POSITIONS_HISTORY", label: "Positions History" },
    ];
    const { market } = (0, market_1.default)();
    const getPrecision = (type) => { var _a; return Number(((_a = market === null || market === void 0 ? void 0 : market.precision) === null || _a === void 0 ? void 0 : _a[type]) || 8); };
    const { subscribe, unsubscribe, addMessageHandler, removeMessageHandler, futuresOrdersConnection, } = (0, ws_1.default)();
    const { ordersTab, setOrdersTab, positions, openPositions, orders, openOrders, fetchPositions, fetchOrders, setPositions, setOpenPositions, setOrders, setOpenOrders, handleOrderMessage, loading, cancelOrder, closePosition, } = (0, order_1.useFuturesOrderStore)();
    const router = (0, router_1.useRouter)();
    (0, react_1.useEffect)(() => {
        if (router.isReady && (profile === null || profile === void 0 ? void 0 : profile.id) && market) {
            const handleOpen = () => {
                subscribe("futuresOrdersConnection", "orders", { userId: profile.id });
            };
            const handleClose = () => {
                unsubscribe("futuresOrdersConnection", "orders", {
                    userId: profile.id,
                });
            };
            if (futuresOrdersConnection.isConnected) {
                handleOpen();
            }
            else {
                addMessageHandler("futuresOrdersConnection", handleOpen, (msg) => msg.type === "open");
            }
            return () => {
                removeMessageHandler("futuresOrdersConnection", handleOpen);
                handleClose();
            };
        }
    }, [router.isReady, profile === null || profile === void 0 ? void 0 : profile.id, futuresOrdersConnection.isConnected]);
    (0, react_1.useEffect)(() => {
        if (market && router.isReady && (profile === null || profile === void 0 ? void 0 : profile.id)) {
            subscribe("futuresOrdersConnection", "orders", { userId: profile.id });
            return () => {
                unsubscribe("futuresOrdersConnection", "orders", {
                    userId: profile.id,
                });
            };
        }
    }, [market, router.isReady, profile === null || profile === void 0 ? void 0 : profile.id]);
    (0, react_1.useEffect)(() => {
        if (!(futuresOrdersConnection === null || futuresOrdersConnection === void 0 ? void 0 : futuresOrdersConnection.isConnected))
            return;
        addMessageHandler("futuresOrdersConnection", handleOrderMessage, (message) => message.stream === "openOrders");
        return () => {
            removeMessageHandler("futuresOrdersConnection", handleOrderMessage);
            setPositions([]);
            setOpenPositions([]);
            setOrders([]);
            setOpenOrders([]);
        };
    }, [futuresOrdersConnection === null || futuresOrdersConnection === void 0 ? void 0 : futuresOrdersConnection.isConnected]);
    const debouncedFetchPositions = (0, lodash_1.debounce)(fetchPositions, 100);
    const debouncedFetchOrders = (0, lodash_1.debounce)(fetchOrders, 100);
    (0, react_1.useEffect)(() => {
        if (market && router.isReady && ordersTab) {
            if (ordersTab === "OPEN_POSITIONS" || ordersTab === "POSITIONS_HISTORY") {
                debouncedFetchPositions(market.currency, market.pair);
            }
            else {
                debouncedFetchOrders(market.currency, market.pair);
            }
        }
    }, [market, router.isReady, ordersTab]);
    const commonOrdersColumnConfig = [
        {
            field: "createdAt",
            label: "Date",
            type: "date",
            sortable: true,
            filterable: false,
            getValue: (row) => (0, date_fns_1.formatDate)(new Date(row.createdAt), "yyyy-MM-dd HH:mm"),
        },
        {
            field: "type",
            label: "Type",
            type: "text",
            sortable: true,
        },
        {
            field: "side",
            label: "Side",
            type: "text",
            sortable: true,
            getValue: (row) => (<span className={row.side === "BUY" ? "text-success-500" : "text-danger-500"}>
          {row.side}
        </span>),
        },
        {
            field: "price",
            label: "Price",
            type: "number",
            sortable: true,
            getValue: (row) => { var _a; return (_a = row.price) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("price")); },
        },
        {
            field: "amount",
            label: "Amount",
            type: "number",
            sortable: true,
            getValue: (row) => { var _a; return (_a = row.amount) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("amount")); },
        },
        {
            field: "filled",
            label: "Filled",
            type: "number",
            sortable: true,
            getValue: (row) => { var _a; return (_a = row.filled) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("amount")); },
        },
        {
            field: "remaining",
            label: "Remaining",
            type: "number",
            sortable: true,
            getValue: (row) => { var _a; return (_a = row.remaining) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("amount")); },
        },
        {
            field: "cost",
            label: "Cost",
            type: "number",
            sortable: true,
            getValue: (row) => { var _a; return (_a = row.cost) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("price")); },
        },
        {
            field: "status",
            label: "Status",
            type: "text",
            sortable: true,
            getValue: (row) => (<span className={statusClass(row.status)}>{row.status}</span>),
        },
    ];
    const ordersColumnConfig = [
        ...commonOrdersColumnConfig,
        {
            field: "actions",
            label: "Actions",
            type: "actions",
            sortable: false,
            actions: [
                {
                    icon: "mdi:cancel",
                    color: "danger",
                    onClick: async (row) => {
                        await cancelOrder(row.id, market.currency, market.pair, row.createdAt);
                    },
                    size: "sm",
                    loading,
                    disabled: loading,
                    tooltip: "Cancel Order",
                },
            ],
        },
    ];
    const commonPositionsColumnConfig = [
        {
            field: "createdAt",
            label: "Date",
            type: "date",
            sortable: true,
            filterable: false,
            getValue: (row) => (0, date_fns_1.formatDate)(new Date(row.createdAt), "yyyy-MM-dd HH:mm"),
        },
        {
            field: "side",
            label: "Side",
            type: "text",
            sortable: true,
            getValue: (row) => (<span className={row.side === "BUY" ? "text-success-500" : "text-danger-500"}>
          {row.side}
        </span>),
        },
        {
            field: "entryPrice",
            label: "Entry Price",
            type: "number",
            sortable: true,
            getValue: (row) => { var _a; return (_a = row.entryPrice) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("price")); },
        },
        {
            field: "amount",
            label: "Amount",
            type: "number",
            sortable: true,
            getValue: (row) => { var _a; return (_a = row.amount) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("amount")); },
        },
        {
            field: "leverage",
            label: "Leverage",
            type: "number",
            sortable: true,
            getValue: (row) => { var _a; return (_a = row.leverage) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("amount")); },
        },
        {
            field: "unrealizedPnl",
            label: "Unrealized PnL",
            type: "number",
            sortable: true,
            getValue: (row) => { var _a; return (_a = row.unrealizedPnl) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("amount")); },
        },
        {
            field: "stopLossPrice",
            label: "Stop Loss Price",
            type: "number",
            sortable: true,
            getValue: (row) => { var _a; return ((_a = row.stopLossPrice) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("price"))) || "N/A"; },
        },
        {
            field: "takeProfitPrice",
            label: "Take Profit Price",
            type: "number",
            sortable: true,
            getValue: (row) => { var _a; return ((_a = row.takeProfitPrice) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("price"))) || "N/A"; },
        },
        {
            field: "status",
            label: "Status",
            type: "text",
            sortable: true,
            getValue: (row) => (<span className={statusClass(row.status)}>{row.status}</span>),
        },
    ];
    const positionsColumnConfig = [
        ...commonPositionsColumnConfig,
        {
            field: "actions",
            label: "Actions",
            type: "actions",
            sortable: false,
            actions: [
                {
                    icon: "mdi:close",
                    color: "danger",
                    onClick: async (row) => {
                        await closePosition(row.id, market.currency, market.pair, row.side);
                    },
                    size: "sm",
                    loading,
                    disabled: loading,
                    tooltip: "Close Position",
                },
            ],
        },
    ];
    const getColumnConfig = (tab) => {
        if (tab === "OPEN")
            return ordersColumnConfig;
        if (tab === "HISTORY")
            return commonOrdersColumnConfig;
        if (tab === "OPEN_POSITIONS")
            return positionsColumnConfig;
        if (tab === "POSITIONS_HISTORY")
            return commonPositionsColumnConfig;
    };
    return (<div className="w-full h-full flex flex-col">
      <div className="flex gap-2 border-b border-muted-200 dark:border-muted-800 md:overflow-x-auto">
        {tabs.map((tab) => (<tab_1.Tab key={tab.value} value={tab.value} label={tab.label} tab={ordersTab} setTab={setOrdersTab} color="warning"/>))}
      </div>
      {ordersTab === "OPEN" && (market === null || market === void 0 ? void 0 : market.currency) && (market === null || market === void 0 ? void 0 : market.pair) && (<object_table_1.ObjectTable items={openOrders} setItems={setOpenOrders} columnConfig={getColumnConfig("OPEN")} shape="straight" size="xs" border={false}/>)}
      {ordersTab === "HISTORY" && (<object_table_1.ObjectTable items={orders} setItems={setOrders} columnConfig={getColumnConfig("HISTORY")} shape="straight" size="xs" border={false}/>)}
      {ordersTab === "OPEN_POSITIONS" && (market === null || market === void 0 ? void 0 : market.currency) && (market === null || market === void 0 ? void 0 : market.pair) && (<object_table_1.ObjectTable items={openPositions} setItems={setOpenPositions} columnConfig={getColumnConfig("OPEN_POSITIONS")} shape="straight" size="xs" border={false}/>)}
      {ordersTab === "POSITIONS_HISTORY" && (<object_table_1.ObjectTable items={positions} setItems={setPositions} columnConfig={getColumnConfig("POSITIONS_HISTORY")} shape="straight" size="xs" border={false}/>)}
    </div>);
};
exports.Orders = (0, react_1.memo)(OrdersBase);
