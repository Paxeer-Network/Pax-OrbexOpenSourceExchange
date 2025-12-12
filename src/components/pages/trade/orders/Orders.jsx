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
const date_fns_1 = require("date-fns");
const market_1 = __importDefault(require("@/stores/trade/market"));
const dashboard_1 = require("@/stores/dashboard");
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const router_1 = require("next/router");
const order_1 = require("@/stores/trade/order");
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
const resultClass = (result) => {
    switch (result) {
        case "WIN":
            return "text-success-500";
        case "LOSS":
            return "text-danger-500";
        case "DRAW":
            return "text-muted-500";
        default:
            return "text-warning-500";
    }
};
const OrdersBase = () => {
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const tabs = [
        { value: "OPEN", label: "Open Orders" },
        { value: "HISTORY", label: "Order History" },
        { value: "AI", label: "AI Investments" },
    ];
    const { market } = (0, market_1.default)();
    const getPrecision = (type) => { var _a; return Number(((_a = market === null || market === void 0 ? void 0 : market.precision) === null || _a === void 0 ? void 0 : _a[type]) || 8); };
    const { subscribe, unsubscribe, addMessageHandler, removeMessageHandler, ordersConnection, removeConnection, createConnection, } = (0, ws_1.default)();
    const { ordersTab, setOrdersTab, orders, openOrders, fetchOrders, setOrders, setOpenOrders, loading, cancelOrder, aiInvestments, cancelAiInvestmentOrder, fetchAiInvestments, setAiInvestments, } = (0, order_1.useOrderStore)();
    const router = (0, router_1.useRouter)();
    const handleOrderMessage = (message) => {
        if (!message || !message.data)
            return;
        const { data } = message;
        if (!data || !Array.isArray(data))
            return;
        const newItems = [...openOrders];
        for (const orderItem of data) {
            const index = newItems.findIndex((i) => i.id === orderItem.id);
            if (index > -1) {
                if (orderItem.status === "CLOSED" ||
                    orderItem.status === "CANCELED" ||
                    orderItem.status === "EXPIRED" ||
                    orderItem.status === "REJECTED") {
                    // If the order is no longer open, remove it from open orders
                    newItems.splice(index, 1);
                }
                else {
                    newItems[index] = { ...newItems[index], ...orderItem };
                }
            }
            else {
                // Add only if still open/active
                if (orderItem.status === "OPEN" || orderItem.status === "ACTIVE") {
                    newItems.push(orderItem);
                }
            }
        }
        setOpenOrders(newItems);
    };
    (0, react_1.useEffect)(() => {
        if (!router.isReady || !(profile === null || profile === void 0 ? void 0 : profile.id) || !(market === null || market === void 0 ? void 0 : market.currency) || !(market === null || market === void 0 ? void 0 : market.pair))
            return;
        const path = market.isEco
            ? `/api/ext/ecosystem/order?userId=${profile.id}`
            : `/api/exchange/order?userId=${profile.id}`;
        createConnection("ordersConnection", path, {
            onOpen: () => {
                console.log("Trades connection open");
            },
        });
        return () => {
            if (!router.query.symbol) {
                removeConnection("ordersConnection");
            }
        };
    }, [router.isReady, profile === null || profile === void 0 ? void 0 : profile.id, market === null || market === void 0 ? void 0 : market.currency, market === null || market === void 0 ? void 0 : market.pair]);
    (0, react_1.useEffect)(() => {
        if (!(market === null || market === void 0 ? void 0 : market.currency) || !(market === null || market === void 0 ? void 0 : market.pair) || !(profile === null || profile === void 0 ? void 0 : profile.id))
            return;
        const connectionKey = "ordersConnection";
        const isConnected = ordersConnection === null || ordersConnection === void 0 ? void 0 : ordersConnection.isConnected;
        if (!isConnected)
            return; // ensure websocket is open before subscribing
        subscribe(connectionKey, "orders", {
            userId: profile.id,
        });
        // Add message handler after subscription
        const messageFilter = (message) => message.stream === "orders";
        addMessageHandler(connectionKey, handleOrderMessage, messageFilter);
        return () => {
            unsubscribe(connectionKey, "orders", {
                userId: profile.id,
            });
            removeMessageHandler(connectionKey, handleOrderMessage);
            setOpenOrders([]);
        };
    }, [
        market === null || market === void 0 ? void 0 : market.currency,
        market === null || market === void 0 ? void 0 : market.pair,
        profile === null || profile === void 0 ? void 0 : profile.id,
        ordersConnection === null || ordersConnection === void 0 ? void 0 : ordersConnection.isConnected,
    ]);
    const debouncedFetchOrders = (0, lodash_1.debounce)(fetchOrders, 100);
    (0, react_1.useEffect)(() => {
        if (market && router.isReady && ordersTab) {
            if (ordersTab === "AI") {
                fetchAiInvestments();
            }
            else {
                const { isEco } = market;
                debouncedFetchOrders(isEco, market.currency, market.pair);
            }
        }
    }, [market, router.isReady, ordersTab]);
    const columnConfig = [
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
    const openColumnConfig = [
        ...columnConfig,
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
                        await cancelOrder(row.id, market.isEco, market.currency, market.pair, market.isEco ? row.createdAt : undefined);
                    },
                    size: "sm",
                    loading,
                    disabled: loading,
                    tooltip: "Cancel Order",
                },
            ],
        },
    ];
    const aiColumnConfig = [
        {
            field: "plan",
            label: "Plan",
            type: "text",
            sortable: true,
            getValue: (row) => row.plan.title,
        },
        {
            field: "createdAt",
            label: "Start Date",
            type: "date",
            sortable: true,
            filterable: false,
            getValue: (row) => (0, date_fns_1.formatDate)(new Date(row.createdAt), "yyyy-MM-dd HH:mm"),
        },
        {
            field: "duration",
            label: "Ends in",
            type: "text",
            sortable: true,
            getValue: (row) => {
                const { duration, timeframe } = row.duration;
                const startDate = new Date(row.createdAt);
                const endDate = new Date(startDate);
                switch (timeframe) {
                    case "HOUR":
                        endDate.setHours(startDate.getHours() + duration);
                        break;
                    case "DAY":
                        endDate.setDate(startDate.getDate() + duration);
                        break;
                    case "WEEK":
                        endDate.setDate(startDate.getDate() + duration * 7);
                        break;
                    case "MONTH":
                        endDate.setMonth(startDate.getMonth() + duration);
                        break;
                    default:
                        endDate.setDate(startDate.getDate() + duration);
                }
                return (0, date_fns_1.formatDate)(endDate, "yyyy-MM-dd HH:mm");
            },
        },
        {
            field: "amount",
            label: "Amount",
            type: "number",
            sortable: true,
            getValue: (row) => { var _a; return (_a = row.amount) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("amount")); },
        },
        {
            field: "profit",
            label: "Profit",
            type: "number",
            sortable: true,
            getValue: (row) => {
                var _a;
                return (<span className={resultClass(row.result)}>
          {((_a = row.profit) === null || _a === void 0 ? void 0 : _a.toFixed(getPrecision("price"))) || "PENDING"}
        </span>);
            },
        },
        {
            field: "result",
            label: "Result",
            type: "text",
            sortable: true,
            getValue: (row) => (<span className={resultClass(row.result)}>
          {row.result || "PENDING"}
        </span>),
        },
        {
            field: "status",
            label: "Status",
            type: "text",
            sortable: true,
            getValue: (row) => (<span className={statusClass(row.status)}>{row.status}</span>),
        },
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
                        await cancelAiInvestmentOrder(row.id, market.isEco, market.currency, market.pair);
                    },
                    size: "sm",
                    loading,
                    disabled: loading,
                    tooltip: "Cancel Investment",
                    condition: (row) => row.status !== "ACTIVE",
                },
            ],
        },
    ];
    return (<div className="h-full min-h-0 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab, index) => (<button key={index} onClick={() => setOrdersTab(tab.value)} className={`flex-1 px-4 py-3 text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 border-b-2 ${ordersTab === tab.value
                ? 'text-zinc-900 dark:text-zinc-100 border-blue-500 bg-zinc-50 dark:bg-zinc-900'
                : 'text-zinc-600 dark:text-zinc-400 border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}>
            {tab.label}
          </button>))}
      </div>
      <div className="p-2">
        {ordersTab === "OPEN" && (market === null || market === void 0 ? void 0 : market.currency) && (market === null || market === void 0 ? void 0 : market.pair) && (<div className="modern-table-container">
            <object_table_1.ObjectTable items={openOrders} setItems={setOpenOrders} columnConfig={openColumnConfig} shape="straight" size="xs" border={false}/>
          </div>)}
        {ordersTab === "HISTORY" && (<div className="modern-table-container">
            <object_table_1.ObjectTable items={orders} setItems={setOrders} columnConfig={columnConfig} shape="straight" size="xs" border={false}/>
          </div>)}
        {ordersTab === "AI" && (<div className="modern-table-container">
            <object_table_1.ObjectTable items={aiInvestments} setItems={setAiInvestments} columnConfig={aiColumnConfig} shape="straight" size="xs" border={false}/>
          </div>)}
      </div>
    </div>);
};
exports.Orders = (0, react_1.memo)(OrdersBase);
