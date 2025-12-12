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
const market_1 = __importDefault(require("@/stores/trade/market"));
const router_1 = require("next/router");
const order_1 = require("@/stores/binary/order");
const object_table_1 = require("@/components/elements/base/object-table");
const lodash_1 = require("lodash");
const next_i18next_1 = require("next-i18next");
const OrderDetails_1 = require("./OrderDetails");
const ProfitCell_1 = require("./cells/ProfitCell");
const ClosePriceCell_1 = require("./cells/ClosePriceCell");
const shallow_1 = require("zustand/shallow");
const statusClass = (status) => {
    switch (status) {
        case "WIN":
            return "text-success-500";
        case "LOSS":
            return "text-danger-500";
        case "DRAW":
            return "text-muted-500";
        default:
            return "text-muted-500";
    }
};
const OrdersBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const tabs = [
        { value: "OPEN", label: "Open Orders" },
        { value: "HISTORY", label: "Order History" },
    ];
    const market = (0, market_1.default)((state) => state.market, shallow_1.shallow);
    const getPrecision = (type) => { var _a; return Number(((_a = market === null || market === void 0 ? void 0 : market.precision) === null || _a === void 0 ? void 0 : _a[type]) || 8); };
    const { ordersTab, setOrdersTab, orders, openOrders, fetchOrders, setOrders, setOpenOrders, } = (0, order_1.useBinaryOrderStore)();
    const router = (0, router_1.useRouter)();
    const columnConfig = [
        {
            field: "createdAt",
            label: "Date",
            type: "date",
            sortable: true,
            filterable: false,
            getValue: (row) => (0, date_fns_1.format)(new Date(row.createdAt), "yyyy-MM-dd HH:mm"),
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
            getValue: (row) => (<span className={row.side === "RISE" ? "text-success-500" : "text-danger-500"}>
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
            field: "closePrice",
            label: "Close Price",
            type: "number",
            sortable: true,
            renderCell: (row) => (<ClosePriceCell_1.DynamicClosePriceCell order={row} getPrecision={getPrecision} t={t} statusClass={statusClass}/>),
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
            renderCell: (row) => (<ProfitCell_1.DynamicProfitCell order={row} getPrecision={getPrecision}/>),
        },
    ];
    const openColumnConfig = [
        ...columnConfig,
        // Uncomment if you want actions
        // {
        //   field: "actions",
        //   label: "",
        //   type: "actions",
        //   sortable: false,
        //   actions: [
        //     {
        //       icon: "mdi:cancel",
        //       color: "danger",
        //       onClick: async (row) => {
        //         await cancelOrder(row.id, market.currency, market.pair);
        //       },
        //       size: "sm",
        //       loading,
        //       disabled: loading,
        //       tooltip: "Cancel Order",
        //     },
        //   ],
        // },
    ];
    const debouncedFetchOrders = (0, lodash_1.debounce)(fetchOrders, 100);
    (0, react_1.useEffect)(() => {
        if (market && router.isReady && ordersTab) {
            if (["OPEN", "HISTORY"].includes(ordersTab)) {
                debouncedFetchOrders(market.currency, market.pair);
            }
        }
    }, [router.isReady, market, ordersTab]);
    const renderExpandedContent = (item) => {
        return <OrderDetails_1.OrderDetails order={item}/>;
    };
    return (<div className="w-full h-full flex flex-col">
      <div className="flex gap-2 border-b border-muted-200 dark:border-muted-800 md:overflow-x-auto">
        {tabs.map((tab) => (<tab_1.Tab key={tab.value} value={tab.value} label={tab.label} tab={ordersTab} setTab={setOrdersTab} color="warning"/>))}
      </div>
      {ordersTab === "OPEN" && (market === null || market === void 0 ? void 0 : market.currency) && (market === null || market === void 0 ? void 0 : market.pair) && (<object_table_1.ObjectTable items={openOrders} setItems={setOpenOrders} columnConfig={openColumnConfig} shape="straight" size="xs" border={false} expandable={true} // Enable expandable rows
         renderExpandedContent={renderExpandedContent} expansionMode="modal"/>)}
      {ordersTab === "HISTORY" && (<object_table_1.ObjectTable items={orders} setItems={setOrders} columnConfig={columnConfig} shape="straight" size="xs" border={false} expandable={true} // Enable expandable rows
         renderExpandedContent={renderExpandedContent} expansionMode="modal"/>)}
    </div>);
};
exports.Orders = (0, react_1.memo)(OrdersBase);
