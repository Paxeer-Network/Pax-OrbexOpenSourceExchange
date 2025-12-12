import React, { memo, useEffect, useState } from "react";
import { Tab } from "@/components/elements/base/tab";
import { formatDate } from "date-fns";
import useMarketStore from "@/stores/trade/market";
import { useDashboardStore } from "@/stores/dashboard";
import useWebSocketStore from "@/stores/trade/ws";
import { useRouter } from "next/router";
import { useOrderStore } from "@/stores/trade/order";
import { ObjectTable } from "@/components/elements/base/object-table";
import { debounce } from "lodash";

const statusClass = (status: string) => {
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

const resultClass = (result: string) => {
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
  const { profile } = useDashboardStore();
  const tabs = [
    { value: "OPEN", label: "Open Orders" },
    { value: "HISTORY", label: "Order History" },
    { value: "AI", label: "AI Investments" },
  ];
  const { market } = useMarketStore();
  const getPrecision = (type: string) => Number(market?.precision?.[type] || 8);

  const {
    subscribe,
    unsubscribe,
    addMessageHandler,
    removeMessageHandler,
    ordersConnection,
    removeConnection,
    createConnection,
  } = useWebSocketStore();

  const {
    ordersTab,
    setOrdersTab,
    orders,
    openOrders,
    fetchOrders,
    setOrders,
    setOpenOrders,
    loading,
    cancelOrder,
    aiInvestments,
    cancelAiInvestmentOrder,
    fetchAiInvestments,
    setAiInvestments,
  } = useOrderStore();
  const router = useRouter();

  const handleOrderMessage = (message: any) => {
    if (!message || !message.data) return;
    const { data } = message;
    if (!data || !Array.isArray(data)) return;

    const newItems = [...openOrders];
    for (const orderItem of data) {
      const index = newItems.findIndex((i) => i.id === orderItem.id);
      if (index > -1) {
        if (
          orderItem.status === "CLOSED" ||
          orderItem.status === "CANCELED" ||
          orderItem.status === "EXPIRED" ||
          orderItem.status === "REJECTED"
        ) {
          // If the order is no longer open, remove it from open orders
          newItems.splice(index, 1);
        } else {
          newItems[index] = { ...newItems[index], ...orderItem };
        }
      } else {
        // Add only if still open/active
        if (orderItem.status === "OPEN" || orderItem.status === "ACTIVE") {
          newItems.push(orderItem);
        }
      }
    }
    setOpenOrders(newItems);
  };

  useEffect(() => {
    if (!router.isReady || !profile?.id || !market?.currency || !market?.pair)
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
  }, [router.isReady, profile?.id, market?.currency, market?.pair]);

  useEffect(() => {
    if (!market?.currency || !market?.pair || !profile?.id) return;

    const connectionKey = "ordersConnection";

    const isConnected = ordersConnection?.isConnected;
    if (!isConnected) return; // ensure websocket is open before subscribing

    subscribe(connectionKey, "orders", {
      userId: profile.id,
    });
    // Add message handler after subscription
    const messageFilter = (message: any) => message.stream === "orders";
    addMessageHandler(connectionKey, handleOrderMessage, messageFilter);

    return () => {
      unsubscribe(connectionKey, "orders", {
        userId: profile.id,
      });
      removeMessageHandler(connectionKey, handleOrderMessage);
      setOpenOrders([]);
    };
  }, [
    market?.currency,
    market?.pair,
    profile?.id,
    ordersConnection?.isConnected,
  ]);

  const debouncedFetchOrders = debounce(fetchOrders, 100);

  useEffect(() => {
    if (market && router.isReady && ordersTab) {
      if (ordersTab === "AI") {
        fetchAiInvestments();
      } else {
        const { isEco } = market;
        debouncedFetchOrders(isEco, market.currency, market.pair);
      }
    }
  }, [market, router.isReady, ordersTab]);

  const columnConfig: ColumnConfigType[] = [
    {
      field: "createdAt",
      label: "Date",
      type: "date",
      sortable: true,
      filterable: false,
      getValue: (row) =>
        formatDate(new Date(row.createdAt), "yyyy-MM-dd HH:mm"),
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
      getValue: (row) => (
        <span
          className={
            row.side === "BUY" ? "text-success-500" : "text-danger-500"
          }
        >
          {row.side}
        </span>
      ),
    },
    {
      field: "price",
      label: "Price",
      type: "number",
      sortable: true,
      getValue: (row) => row.price?.toFixed(getPrecision("price")),
    },
    {
      field: "amount",
      label: "Amount",
      type: "number",
      sortable: true,
      getValue: (row) => row.amount?.toFixed(getPrecision("amount")),
    },
    {
      field: "filled",
      label: "Filled",
      type: "number",
      sortable: true,
      getValue: (row) => row.filled?.toFixed(getPrecision("amount")),
    },
    {
      field: "remaining",
      label: "Remaining",
      type: "number",
      sortable: true,
      getValue: (row) => row.remaining?.toFixed(getPrecision("amount")),
    },
    {
      field: "cost",
      label: "Cost",
      type: "number",
      sortable: true,
      getValue: (row) => row.cost?.toFixed(getPrecision("price")),
    },
    {
      field: "status",
      label: "Status",
      type: "text",
      sortable: true,
      getValue: (row) => (
        <span className={statusClass(row.status)}>{row.status}</span>
      ),
    },
  ];

  const openColumnConfig: ColumnConfigType[] = [
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
            await cancelOrder(
              row.id,
              market.isEco,
              market.currency,
              market.pair,
              market.isEco ? row.createdAt : undefined
            );
          },
          size: "sm",
          loading,
          disabled: loading,
          tooltip: "Cancel Order",
        },
      ],
    },
  ];

  const aiColumnConfig: ColumnConfigType[] = [
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
      getValue: (row) =>
        formatDate(new Date(row.createdAt), "yyyy-MM-dd HH:mm"),
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

        return formatDate(endDate, "yyyy-MM-dd HH:mm");
      },
    },
    {
      field: "amount",
      label: "Amount",
      type: "number",
      sortable: true,
      getValue: (row) => row.amount?.toFixed(getPrecision("amount")),
    },
    {
      field: "profit",
      label: "Profit",
      type: "number",
      sortable: true,
      getValue: (row) => (
        <span className={resultClass(row.result)}>
          {row.profit?.toFixed(getPrecision("price")) || "PENDING"}
        </span>
      ),
    },
    {
      field: "result",
      label: "Result",
      type: "text",
      sortable: true,
      getValue: (row) => (
        <span className={resultClass(row.result)}>
          {row.result || "PENDING"}
        </span>
      ),
    },
    {
      field: "status",
      label: "Status",
      type: "text",
      sortable: true,
      getValue: (row) => (
        <span className={statusClass(row.status)}>{row.status}</span>
      ),
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
            await cancelAiInvestmentOrder(
              row.id,
              market.isEco,
              market.currency,
              market.pair
            );
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

  return (
    <div className="h-full min-h-0 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setOrdersTab(tab.value as "OPEN" | "HISTORY" | "AI")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 border-b-2 ${
              ordersTab === tab.value
                ? 'text-zinc-900 dark:text-zinc-100 border-blue-500 bg-zinc-50 dark:bg-zinc-900'
                : 'text-zinc-600 dark:text-zinc-400 border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-2">
        {ordersTab === "OPEN" && market?.currency && market?.pair && (
          <div className="modern-table-container">
            <ObjectTable
              items={openOrders}
              setItems={setOpenOrders}
              columnConfig={openColumnConfig}
              shape="straight"
              size="xs"
              border={false}
            />
          </div>
        )}
        {ordersTab === "HISTORY" && (
          <div className="modern-table-container">
            <ObjectTable
              items={orders}
              setItems={setOrders}
              columnConfig={columnConfig}
              shape="straight"
              size="xs"
              border={false}
            />
          </div>
        )}
        {ordersTab === "AI" && (
          <div className="modern-table-container">
            <ObjectTable
              items={aiInvestments}
              setItems={setAiInvestments}
              columnConfig={aiColumnConfig}
              shape="straight"
              size="xs"
              border={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const Orders = memo(OrdersBase);
