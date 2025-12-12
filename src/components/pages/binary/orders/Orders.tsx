import React, { memo, useEffect } from "react";
import { Tab } from "@/components/elements/base/tab";
import { format as formatDate } from "date-fns";
import useMarketStore from "@/stores/trade/market";
import { useRouter } from "next/router";
import { useBinaryOrderStore } from "@/stores/binary/order";
import { ObjectTable } from "@/components/elements/base/object-table";
import { debounce } from "lodash";
import { useTranslation } from "next-i18next";
import { OrderDetails } from "./OrderDetails";
import { DynamicProfitCell } from "./cells/ProfitCell";
import { DynamicClosePriceCell } from "./cells/ClosePriceCell";
import { shallow } from "zustand/shallow";

const statusClass = (status: string) => {
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
  const { t } = useTranslation();
  const tabs = [
    { value: "OPEN", label: "Open Orders" },
    { value: "HISTORY", label: "Order History" },
  ];
  const market = useMarketStore((state) => state.market, shallow);
  const getPrecision = (type: string) => Number(market?.precision?.[type] || 8);
  const {
    ordersTab,
    setOrdersTab,
    orders,
    openOrders,
    fetchOrders,
    setOrders,
    setOpenOrders,
  } = useBinaryOrderStore();
  const router = useRouter();
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
            row.side === "RISE" ? "text-success-500" : "text-danger-500"
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
      field: "closePrice",
      label: "Close Price",
      type: "number",
      sortable: true,
      renderCell: (row) => (
        <DynamicClosePriceCell
          order={row}
          getPrecision={getPrecision}
          t={t}
          statusClass={statusClass}
        />
      ),
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
      renderCell: (row) => (
        <DynamicProfitCell order={row} getPrecision={getPrecision} />
      ),
    },
  ];
  const openColumnConfig: ColumnConfigType[] = [
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

  const debouncedFetchOrders = debounce(fetchOrders, 100);
  useEffect(() => {
    if (market && router.isReady && ordersTab) {
      if (["OPEN", "HISTORY"].includes(ordersTab)) {
        debouncedFetchOrders(market.currency, market.pair);
      }
    }
  }, [router.isReady, market, ordersTab]);

  const renderExpandedContent = (item: any) => {
    return <OrderDetails order={item} />;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex gap-2 border-b border-muted-200 dark:border-muted-800 md:overflow-x-auto">
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            tab={ordersTab}
            setTab={setOrdersTab}
            color="warning"
          />
        ))}
      </div>
      {ordersTab === "OPEN" && market?.currency && market?.pair && (
        <ObjectTable
          items={openOrders}
          setItems={setOpenOrders}
          columnConfig={openColumnConfig}
          shape="straight"
          size="xs"
          border={false}
          expandable={true} // Enable expandable rows
          renderExpandedContent={renderExpandedContent}
          expansionMode="modal"
        />
      )}
      {ordersTab === "HISTORY" && (
        <ObjectTable
          items={orders}
          setItems={setOrders}
          columnConfig={columnConfig}
          shape="straight"
          size="xs"
          border={false}
          expandable={true} // Enable expandable rows
          renderExpandedContent={renderExpandedContent}
          expansionMode="modal"
        />
      )}
    </div>
  );
};
export const Orders = memo(OrdersBase);
