"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { capitalize } from "lodash";
import { useTranslation } from "next-i18next";

const api = "/api/admin/ext/nft/asset";

const columnConfig: ColumnConfigType[] = [
  {
    field: "name",
    label: "Name",
    type: "text",
    sortable: true,
    hasImage: true,
    imageKey: "image",
    placeholder: "/img/placeholder.svg",
    getValue: (item) => capitalize(item.name),
  },
  {
    field: "creator",
    label: "Creator",
    type: "text",
    getValue: (item) => `${item.creator?.firstName} ${item.creator?.lastName}`,
    sublabel: "creator.email",
    getSubValue: (item) => item.creator?.email,
    hasImage: true,
    imageKey: "creator.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
    sortable: true,
    sortName: "creator.firstName",
  },
  {
    field: "owner",
    label: "Owner",
    type: "text",
    getValue: (item) => `${item.owner?.firstName} ${item.owner?.lastName}`,
    sublabel: "owner.email",
    getSubValue: (item) => item.owner?.email,
    hasImage: true,
    imageKey: "owner.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
    sortable: true,
    sortName: "owner.firstName",
  },
  {
    field: "price",
    label: "Price",
    type: "number",
    sortable: true,
    getValue: (item) => `${item.price} ${item.currency || "USD"}`,
  },
  {
    field: "network",
    label: "Network",
    type: "text",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: false,
    api: `${api}/:id/status`,
  },
];

const NftAssets = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("NFT Assets")} color="muted">
      <DataTable
        title={t("NFT Assets")}
        endpoint={api}
        columnConfig={columnConfig}
        viewPath="/admin/ext/nft/asset/[id]"
        // hasAnalytics
      />
    </Layout>
  );
};

export default NftAssets;
export const permission = "Access NFT Asset Management";
