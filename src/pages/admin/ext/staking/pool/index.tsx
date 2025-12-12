"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
const api = "/api/admin/ext/staking/pool";
const columnConfig: ColumnConfigType[] = [
  {
    field: "name",
    label: "Name",
    type: "text",
    sortable: true,
    hasImage: true,
    imageKey: "icon",
    placeholder: "/img/placeholder.svg",
    className: "rounded-full",
  },
  {
    field: "currency",
    label: "Currency",
    sublabel: "type",
    type: "text",
    sortable: true,
    getValue: (row) => `${row.currency} ${row.chain ? `(${row.chain})` : ""}`,
  },
  {
    field: "minStake",
    label: "Limit",
    sublabel: "maxStake",
    type: "number",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "ACTIVE", label: "Active", color: "success" },
      { value: "INACTIVE", label: "Inactive", color: "danger" },
      { value: "COMPLETED", label: "Completed", color: "info" },
    ],
  },
];
const StakingPools = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Staking Pools")} color="muted">
      <DataTable
        title={t("Staking Pools")}
        endpoint={api}
        columnConfig={columnConfig}
        hasAnalytics
        canCreate={false}
        editPath="/admin/ext/staking/pool/[id]"
        navSlot={
          <>
            <Link color="success" href="/admin/ext/staking/pool/create">
              <IconButton
                variant="pastel"
                aria-label="Create Staking Pool"
                color="success"
                size="lg"
              >
                <Icon icon={"mdi-plus"} className="h-6 w-6" />
              </IconButton>
            </Link>
          </>
        }
      />
    </Layout>
  );
};
export default StakingPools;
export const permission = "Access Staking Pool Management";
