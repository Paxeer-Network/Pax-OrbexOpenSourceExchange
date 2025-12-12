"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
import { profitTypeOptions, statusOptions } from "@/utils/constants";

// Define the API endpoint for admin profits
const api = "/api/admin/finance/profit";

// Define the column configurations for the DataTable
const columnConfig: ColumnConfigType[] = [
  {
    field: "transaction",
    label: "Transaction ID",
    type: "text",
    getValue: (item) => item.transactionId || "N/A",
    sortable: true,
  },
  {
    field: "type",
    label: "Type",
    type: "select",
    options: profitTypeOptions,
    sortable: true,
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    precision: 8,
    sortable: true,
  },
  {
    field: "currency",
    label: "Currency",
    type: "text",
    sortable: true,
  },
  {
    field: "chain",
    label: "Chain",
    type: "text",
    sortable: true,
  },
  // Created At
  {
    field: "createdAt",
    label: "Date",
    type: "date",
    sortable: true,
    getValue: (item) =>
      item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A",
  },
];

const AdminProfitManagement = () => {
  const { t } = useTranslation();

  return (
    <Layout title={t("Profit Management")} color="muted">
      <DataTable
        title={t("Admin Profits")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        hasAnalytics
        isParanoid={false}
        canEdit={false}
      />
    </Layout>
  );
};

export default AdminProfitManagement;
export const permission = "Access Admin Profits";
