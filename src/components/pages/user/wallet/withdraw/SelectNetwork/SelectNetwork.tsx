import { memo, useEffect, useState } from "react";
import { useWithdrawStore } from "@/stores/user/wallet/withdraw";
import { useWalletStore } from "@/stores/user/wallet"; // Adjust the import path as needed
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";
import { formatNumber } from "@/utils/strings";
import { useDashboardStore } from "@/stores/dashboard";

const SelectNetworkBase = () => {
  const { t } = useTranslation();
  const {
    selectedCurrency,
    setSelectedCurrency,
    selectedWithdrawMethod,
    setSelectedWithdrawMethod,
    setStep,
    withdrawMethods,
    selectedWalletType,
  } = useWithdrawStore();

  const { wallet, fetchWallet } = useWalletStore();

  const [balances, setBalances] = useState({}); // To store balances per chain
  const { settings } = useDashboardStore();

  useEffect(() => {
    if (selectedWalletType.value === "ECO") {
      // Fetch the wallet for the selected currency and type
      fetchWallet(selectedWalletType.value, selectedCurrency);
    }
  }, [selectedWalletType.value, selectedCurrency]);

  useEffect(() => {
    if (selectedWalletType.value === "ECO" && wallet) {
      // Process the addresses to get balances per chain
      const addresses =
        typeof wallet.address === "string"
          ? JSON.parse(wallet.address)
          : wallet.address;
      // addresses is an object with keys as chains and values as objects with address and balance
      const chainBalances = {};
      for (const [chain, data] of Object.entries(addresses)) {
        chainBalances[chain] = (data as any).balance;
      }
      setBalances(chainBalances);
    }
  }, [selectedWalletType.value, wallet]);

  if (!withdrawMethods || withdrawMethods.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Icon
            icon="mdi:loading"
            className="h-12 w-12 animate-spin text-primary-500"
          />
          <p className="text-xl text-primary-500">
            {t("Loading")} {selectedCurrency} {t("networks...")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select a Network")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Pick one of the following currency networks to continue")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-4xl space-y-10 rounded-sm px-8 pb-8">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <h3 className="mb-1 font-sans font-medium text-muted-800 dark:text-muted-100">
              {selectedCurrency} {t("Networks")}
            </h3>
            <p className="font-sans text-sm text-muted-500 dark:text-muted-400 md:max-w-[190px]">
              {t("Select a network to continue")}
            </p>
          </div>
          <div className="md:col-span-8">
            <div className="mx-auto mb-4 w-full max-w-xl space-y-5 rounded-sm px-8 pb-8">
              {withdrawMethods.map((item, index) => {
                const chain = item.chain;
                const balance = balances[chain] || 0;
                const isDisabled =
                  selectedWalletType.value === "ECO" && balance <= 0;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (!isDisabled) {
                        setSelectedWithdrawMethod(item);
                      }
                    }}
                    className={`cursor-pointer transition-colors duration-300 border rounded ${
                      selectedWithdrawMethod?.chain === item.chain
                        ? "border border-primary-600 dark:border-primary-400 bg-white dark:bg-muted-950"
                        : "group relative border rounded-sm transition-colors duration-300 border-muted-200 dark:border-muted-800 hover:border-primary-600 dark:hover:border-primary-400 bg-muted-100 dark:bg-muted-800 hover:bg-white dark:hover:bg-muted-900"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-5 px-4 py-3 font-sans text-sm text-muted-600 transition-colors duration-300">
                      <div className="flex flex-col w-full">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-800 dark:text-muted-200 text-md font-semibold">
                              {item.chain}
                            </span>
                          </div>
                          {selectedWalletType.value === "ECO" && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-800 dark:text-muted-200 text-md font-semibold">
                                {t("Balance")}: {balance}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Existing fee and limit information */}
                        <div className="flex flex-col mt-2 text-sm">
                          <div className="flex gap-1">
                            <span className="text-muted-500 dark:text-muted-400">
                              {t("Minimum Withdraw")}
                            </span>
                            <span className="text-muted-800 dark:text-muted-200">
                              {formatNumber(
                                item.limits?.withdraw?.min ||
                                  item.limits?.amount?.min ||
                                  0
                              )}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-muted-500 dark:text-muted-400">
                              {t("Maximum Withdraw")}
                            </span>
                            <span className="text-muted-800 dark:text-muted-200">
                              {formatNumber(
                                item.limits?.withdraw?.max ||
                                  item.limits?.amount?.max ||
                                  "Unlimited"
                              )}
                            </span>
                          </div>
                          {typeof item.fee?.min === "number" && (
                            <div className="flex gap-1">
                              <span className="text-muted-500 dark:text-muted-400">
                                {t("Minimum Fee")}
                              </span>
                              <span className="text-muted-800 dark:text-muted-200">
                                {formatNumber(item.fee.min)} {selectedCurrency}
                              </span>
                            </div>
                          )}
                          {typeof item.fee?.percentage === "number" && (
                            <div className="flex gap-1">
                              <span className="text-muted-500 dark:text-muted-400">
                                {t("Percentage Fee")}
                              </span>
                              <span className="text-muted-800 dark:text-muted-200">
                                {selectedWalletType.value === "SPOT"
                                  ? `${
                                      item.fee.percentage +
                                      parseFloat(
                                        settings.walletTransferFee || "0"
                                      )
                                    }%`
                                  : `${item.fee.percentage}%`}
                              </span>
                            </div>
                          )}

                          {typeof item.fixedFee === "number" && (
                            <div className="flex gap-1">
                              <span className="text-muted-500 dark:text-muted-400">
                                {t("Fixed Withdraw Fee")}
                              </span>
                              <span className="text-muted-800 dark:text-muted-200">
                                {formatNumber(item.fixedFee)}
                              </span>
                            </div>
                          )}
                          {typeof item.percentageFee === "number" && (
                            <div className="flex gap-1">
                              <span className="text-muted-500 dark:text-muted-400">
                                {t("Percentage Withdraw Fee")}
                              </span>
                              <span className="text-muted-800 dark:text-muted-200">
                                {selectedWalletType.value === "SPOT"
                                  ? `${
                                      item.percentageFee +
                                      parseFloat(
                                        settings.walletTransferFee || "0"
                                      )
                                    }%`
                                  : `${item.percentageFee}%`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16! max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={() => {
                setSelectedCurrency("Select a currency");
                setStep(2);
              }}
            >
              <Icon icon="mdi:chevron-left" className="h-5 w-5" />
              {t("Go Back")}
            </Button>
            <Button
              type="button"
              color="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                setStep(4);
              }}
              disabled={!selectedWithdrawMethod}
            >
              {t("Continue")}
              <Icon icon="mdi:chevron-right" className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SelectNetwork = memo(SelectNetworkBase);
