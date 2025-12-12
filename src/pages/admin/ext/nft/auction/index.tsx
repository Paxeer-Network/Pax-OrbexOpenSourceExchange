"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";

const api = "/api/admin/ext/nft/auction";

const columnConfig: ColumnConfigType[] = [
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
    field: "startTime",
    label: "Start Time",
    type: "date",
    sortable: true,
  },
  {
    field: "endTime",
    label: "End Time",
    type: "date",
    sortable: true,
  },
  {
    field: "startingBid",
    label: "Starting Bid",
    type: "number",
    sortable: true,
  },
  {
    field: "reservePrice",
    label: "Reserve Price",
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
      { value: "ACTIVE", label: "Active", color: "success" },
      { value: "ENDED", label: "Ended", color: "muted" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
    ],
  },
];

const NftAuctions = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("NFT Auctions")} color="muted">
      <DataTable
        title={t("NFT Auctions")}
        endpoint={api}
        columnConfig={columnConfig}
        viewPath="/admin/ext/nft/auction/[id]"
      />
    </Layout>
  );
};

export default NftAuctions;
export const permission = "Access NFT Auction Management";
