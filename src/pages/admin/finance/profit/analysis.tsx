import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";

const path = "/admin/finance/profit"; // Define the API path for profit analytics

const AdminProfitAnalytics = () => {
  const { t } = useTranslation();

  // Define the available filters specific to profit status
  const availableFilters: AvailableFilters = {
    type: [
      {
        value: "DEPOSIT",
        label: t("Deposit"),
        color: "success",
        icon: "ph:arrow-circle-down-light",
        path: `${path}?type=DEPOSIT`,
      },
      {
        value: "WITHDRAW",
        label: t("Withdraw"),
        color: "danger",
        icon: "ph:arrow-circle-up-light",
        path: `${path}?type=WITHDRAW`,
      },
      {
        value: "TRANSFER",
        label: t("Transfer"),
        color: "info",
        icon: "ph:repeat",
        path: `${path}?type=TRANSFER`,
      },
      {
        value: "BINARY_ORDER",
        label: t("Binary Order"),
        color: "primary",
        icon: "ph:chart-line",
        path: `${path}?type=BINARY_ORDER`,
      },
      {
        value: "EXCHANGE_ORDER",
        label: t("Exchange Order"),
        color: "info",
        icon: "bitcoin-icons:exchange-outline",
        path: `${path}?type=EXCHANGE_ORDER`,
      },
      {
        value: "INVESTMENT",
        label: t("Investment"),
        color: "success",
        icon: "ph:trend-up",
        path: `${path}?type=INVESTMENT`,
      },
      {
        value: "AI_INVESTMENT",
        label: t("AI Investment"),
        color: "primary",
        icon: "ph:cpu",
        path: `${path}?type=AI_INVESTMENT`,
      },
      {
        value: "FOREX_DEPOSIT",
        label: t("Forex Deposit"),
        color: "success",
        icon: "ph:currency-circle-dollar",
        path: `${path}?type=FOREX_DEPOSIT`,
      },
      {
        value: "FOREX_WITHDRAW",
        label: t("Forex Withdraw"),
        color: "danger",
        icon: "ph:currency-circle-dollar",
        path: `${path}?type=FOREX_WITHDRAW`,
      },
      {
        value: "FOREX_INVESTMENT",
        label: t("Forex Investment"),
        color: "info",
        icon: "ph:chart-bar",
        path: `${path}?type=FOREX_INVESTMENT`,
      },
      {
        value: "ICO_CONTRIBUTION",
        label: t("ICO Contribution"),
        color: "primary",
        icon: "ph:currency-dollar",
        path: `${path}?type=ICO_CONTRIBUTION`,
      },
      {
        value: "STAKING",
        label: t("Staking"),
        color: "warning",
        icon: "ph:diamond",
        path: `${path}?type=STAKING`,
      },
      {
        value: "P2P_TRADE",
        label: t("P2P Trade"),
        color: "info",
        icon: "ph:arrows-left-right",
        path: `${path}?type=P2P_TRADE`,
      },
    ],
  };

  return (
    <Layout color="muted" title={t("Profit Analytics")}>
      <AnalyticsChart
        model="adminProfit"
        modelName={t("Profits")}
        cardName={t("Admin Profits")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};

export default AdminProfitAnalytics;
export const permission = "Access Admin Profits";
