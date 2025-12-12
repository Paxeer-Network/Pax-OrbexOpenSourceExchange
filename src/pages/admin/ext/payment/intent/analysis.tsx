import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";

const path = "/admin/payment/intent";

const PaymentIntentAnalytics = () => {
  const { t } = useTranslation();

  const availableFilters: AvailableFilters = {
    status: [
      {
        value: "PENDING",
        label: "Pending",
        color: "warning",
        icon: "mdi:progress-clock",
        path: `${path}?status=PENDING`,
      },
      {
        value: "COMPLETED",
        label: "Completed",
        color: "success",
        icon: "mdi:check-circle",
        path: `${path}?status=COMPLETED`,
      },
      {
        value: "FAILED",
        label: "Failed",
        color: "danger",
        icon: "mdi:close-circle",
        path: `${path}?status=FAILED`,
      },
      {
        value: "EXPIRED",
        label: "Expired",
        color: "muted",
        icon: "mdi:timer-off",
        path: `${path}?status=EXPIRED`,
      },
    ],
  };

  return (
    <Layout color="muted" title={t("Payment Intent Analytics")}>
      <AnalyticsChart
        model="paymentIntent"
        modelName={t("Payment Intents")}
        cardName={t("Payment Analytics")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};

export default PaymentIntentAnalytics;

export const permission = "Access Payment Gateway Management";
