import Layout from "@/layouts/Default";
import React from "react";
import Markets from "@/components/pages/user/markets/Markets";
import { useTranslation } from "next-i18next";
import { News } from "@/components/pages/user/News";
import { useDashboardStore } from "@/stores/dashboard";

const MarketsPage = () => {
  const { t } = useTranslation();
  const { settings } = useDashboardStore();
  return (
    <Layout title={t("Markets")} color="muted">
      <Markets />
      {settings?.newsStatus && <News />}
    </Layout>
  );
};
export default MarketsPage;
