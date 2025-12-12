"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";
import $fetch from "@/utils/api";
import { Tooltip } from "@/components/elements/base/tooltips/Tooltip";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";

const api = "/api/admin/crm/user";
const exportEndpoint = "/api/admin/crm/user/export";

const columnConfig: ColumnConfigType[] = [
  {
    field: "fullName",
    label: "Full Name",
    type: "text",
    sortable: true,
    sortName: "firstName",
    getValue: (item) => `${item.firstName} ${item.lastName}`,
    hasImage: true,
    imageKey: "avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
  {
    field: "id",
    label: "ID",
    type: "text",
    sortable: true,
  },
  { field: "email", label: "Email", type: "text", sortable: true },
  {
    field: "status",
    label: "Status",
    type: "select",
    active: "ACTIVE",
    disabled: "INACTIVE",
    sortable: false,
    api: `${api}/:id/status`,
    options: [
      { value: "ACTIVE", label: "Active", color: "success" },
      { value: "INACTIVE", label: "Inactive", color: "warning" },
      { value: "BANNED", label: "Banned", color: "danger" },
      { value: "SUSPENDED", label: "Suspended", color: "info" },
    ],
  },
  {
    field: "createdAt",
    label: "Registered",
    type: "date",
    sortable: true,
    filterable: false,
    getValue: (item) =>
      item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A",
  },
  {
    field: "lastLogin",
    label: "Last Login",
    type: "date",
    sortable: true,
    filterable: false,
    getValue: (item) =>
      item.lastLogin ? new Date(item.lastLogin).toLocaleString() : "N/A",
  },
];

const Users = () => {
  const { t } = useTranslation();

  // Handle export button click
  const handleExport = async () => {
    try {
      await $fetch({
        url: exportEndpoint,
      });
    } catch (error) {
      toast.error("An unexpected error occurred while exporting users.");
    }
  };

  return (
    <Layout title={t("Users Management")} color="muted">
      <DataTable
        title={t("Users")}
        endpoint={api}
        columnConfig={columnConfig}
        hasAnalytics
        navSlot={
          <>
            <Tooltip content={t("Export Users to Excel")}>
              <IconButton
                variant="pastel"
                aria-label={t("Export Users")}
                onClick={() => handleExport()}
                color={"info"}
                size="lg"
              >
                <Icon className="h-6 w-6" icon="mdi:file-excel" />
              </IconButton>
            </Tooltip>
          </>
        }
      />
    </Layout>
  );
};

export default Users;
export const permission = "Access User Management";
