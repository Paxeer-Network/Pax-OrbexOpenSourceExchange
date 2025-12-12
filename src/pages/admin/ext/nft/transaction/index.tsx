"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";

const api = "/api/admin/ext/nft/transaction";

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
    field: "seller",
    label: "Seller",
    type: "text",
    getValue: (item) => `${item.seller?.firstName} ${item.seller?.lastName}`,
    sublabel: "seller.email",
    getSubValue: (item) => item.seller?.email,
    hasImage: true,
    imageKey: "seller.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
    sortable: true,
    sortName: "seller.firstName",
  },
  {
    field: "buyer",
    label: "Buyer",
    type: "text",
    getValue: (item) => `${item.buyer?.firstName} ${item.buyer?.lastName}`,
    sublabel: "buyer.email",
    getSubValue: (item) => item.buyer?.email,
    hasImage: true,
    imageKey: "buyer.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
    sortable: true,
    sortName: "buyer.firstName",
  },
  {
    field: "amount",
    label: "Amount",
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
      { value: "COMPLETED", label: "Completed", color: "success" },
      { value: "FAILED", label: "Failed", color: "danger" },
    ],
  },
];

const NftTransactions = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("NFT Transactions")} color="muted">
      <DataTable
        title={t("NFT Transactions")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        viewPath="/admin/ext/nft/transaction/[id]"
        hasAnalytics
      />
    </Layout>
  );
};

export default NftTransactions;
export const permission = "Access NFT Transaction Management";
