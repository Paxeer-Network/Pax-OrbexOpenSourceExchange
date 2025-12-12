"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";

const api = "/api/admin/ext/nft/like";

const columnConfig: ColumnConfigType[] = [
  {
    field: "user",
    label: "User",
    type: "text",
    getValue: (item) => `${item.user?.firstName} ${item.user?.lastName}`,
    sublabel: "user.email",
    getSubValue: (item) => item.user?.email,
    hasImage: true,
    imageKey: "user.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
    sortable: true,
    sortName: "user.firstName",
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
];

const NftLikes = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("NFT Likes")} color="muted">
      <DataTable
        title={t("NFT Likes")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        canEdit={false}
        canDelete={true}
        viewPath="/admin/ext/nft/like/[id]"
      />
    </Layout>
  );
};

export default NftLikes;
export const permission = "Access NFT Like Management";
