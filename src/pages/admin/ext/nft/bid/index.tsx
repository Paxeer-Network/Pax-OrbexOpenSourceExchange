"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";

const api = "/api/admin/ext/nft/bid";

const columnConfig: ColumnConfigType[] = [
  {
    field: "bidder",
    label: "Bidder",
    type: "text",
    getValue: (item) => `${item.bidder?.firstName} ${item.bidder?.lastName}`,
    sublabel: "bidder.email",
    getSubValue: (item) => item.bidder?.email,
    hasImage: true,
    imageKey: "bidder.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
    sortable: true,
    sortName: "bidder.firstName",
  },
  {
    field: "nftAsset.name",
    label: "NFT Asset",
    type: "text",
    sortable: true,
    getValue: (item) => item.nftAsset?.name,
    hasImage: true,
    imageKey: "nftAsset.image",
    placeholder: "/img/placeholder.svg",
  },
  {
    field: "bidAmount",
    label: "Bid Amount",
    type: "number",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "ACCEPTED", label: "Accepted", color: "success" },
      { value: "REJECTED", label: "Rejected", color: "danger" },
      { value: "WITHDRAWN", label: "Withdrawn", color: "muted" },
    ],
  },
];

const NftBids = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("NFT Bids")} color="muted">
      <DataTable
        title={t("NFT Bids")}
        endpoint={api}
        columnConfig={columnConfig}
        viewPath="/admin/ext/nft/bid/[id]"
        canCreate={false}
        hasAnalytics
      />
    </Layout>
  );
};

export default NftBids;
export const permission = "Access NFT Bid Management";
