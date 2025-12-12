import React, { useEffect } from "react";
import Layout from "@/layouts/Default";
import Button from "@/components/elements/base/button/Button";
import { useRouter } from "next/router";
import $fetch, { $serverFetch } from "@/utils/api";
import { usePaymentStore } from "@/stores/payment";
import { Icon } from "@iconify/react";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
import { StepProgress } from "@/components/elements/addons/StepProgress";

// Import selection components
import { SelectWalletType } from "@/components/pages/payment/SelectWalletType";
import { SelectCurrency } from "@/components/pages/payment/SelectCurrency";
import { toast } from "sonner";
import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Orbex";

interface Props {
  paymentDetails: {
    id: string;
    amount: number;
    currency: string;
    description: string;
    products: {
      id: string;
      name: string;
      image: string;
      quantity: number;
      price: number;
      currency: string;
    }[];
    createdAt: string;
    discount: number;
    tax: number;
    status: string;
  };
  error: string | null;
}

const PaymentPage: React.FC<Props> = ({ paymentDetails, error }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { paymentIntentId } = router.query;

  const {
    step,
    initializeWalletTypes,
    selectedWalletType,
    setSelectedWalletType,
    fetchCurrencies,
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    fetchWallet,
    selectedWallet,
    exchangeRate,
    fetchExchangeRate,
    setStep,
    loading,
    setLoading,
  } = usePaymentStore();

  const { profile } = useDashboardStore();

  useEffect(() => {
    if (!profile) {
      router.push(`/login?return=${router.asPath}`);
    }
  }, [profile]);

  useEffect(() => {
    initializeWalletTypes();
  }, []);

  useEffect(() => {
    if (step === 3 && paymentDetails && selectedWallet) {
      // Fetch exchange rate between order currency and wallet currency
      fetchExchangeRate(
        selectedWalletType.value,
        selectedWallet.currency,
        "FIAT",
        paymentDetails.currency
      );
    }
  }, [step, paymentDetails, selectedWallet]);

  const handleConfirmPayment = async () => {
    if (!selectedWallet) {
      toast.error("Please select a wallet to proceed.");
      setStep(1);
      return;
    }

    setLoading(true);

    const { data, error } = await $fetch({
      url: "/api/ext/payment/intent/confirm",
      method: "POST",
      body: {
        paymentIntentId,
        walletId: selectedWallet.id,
      },
    });

    if (!error) {
      router.push(data.redirectUrl);
    }
    setLoading(false);
  };

  if (error) {
    // Render error page
    return (
      <Layout title="Payment Error">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <Button
              onClick={() => router.back()}
              className="mt-2"
              color="primary"
              variant="solid"
            >
              {t("Go Back")}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!paymentDetails) {
    return (
      <Layout title="Payment Details Not Found">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">
              {t(
                "Payment details not found. Please check the payment intent ID"
              )}
              .
            </p>
            <Button
              onClick={() => router.back()}
              className="mt-2"
              color="muted"
              variant="solid"
            >
              <Icon icon="akar-icons:arrow-left" className="mr-2" />
              {t("Go Back")}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const renderPaymentStatus = (
    title: string,
    message: string,
    icon: string,
    iconColor: string
  ) => (
    <Layout title={title}>
      <div className="flex items-center justify-center flex-col py-20">
        <div className={`text-lg ${iconColor} mb-5`}>
          <Icon icon={icon} className="mr-2 h-24 w-24" />
        </div>
        <div className="text-center">
          <h1 className={`text-4xl font-bold ${iconColor}`}>{t(title)}</h1>
          <p className="mt-4 text-muted">{t(message)}</p>
          <Button
            onClick={() => router.push("/user")}
            className="mt-6"
            color="primary"
            variant="solid"
          >
            {t("Go to Dashboard")}
          </Button>
        </div>
      </div>
    </Layout>
  );

  if (paymentDetails.status === "COMPLETED") {
    return renderPaymentStatus(
      "Payment Successful",
      "Thank you for your payment. Your transaction is complete.",
      "icon-park-solid:success",
      "text-green-500"
    );
  }

  if (paymentDetails.status === "FAILED") {
    return renderPaymentStatus(
      "Payment Failed",
      "We were unable to process your payment. Please try again or contact support.",
      "icon-park-solid:error",
      "text-red-500"
    );
  }

  if (paymentDetails.status === "EXPIRED") {
    return renderPaymentStatus(
      "Payment Expired",
      "Your payment session has expired. Please try again or contact support.",
      "icon-park-solid:time",
      "text-red-500"
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SelectWalletType
            walletTypes={usePaymentStore.getState().walletTypes}
            selectedWalletType={selectedWalletType}
            setSelectedWalletType={setSelectedWalletType}
            onNext={() => {
              fetchCurrencies();
            }}
          />
        );
      case 2:
        return (
          <SelectCurrency
            currencies={currencies}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            onBack={() => setStep(1)}
            onNext={() => {
              fetchWallet(selectedWalletType.value, selectedCurrency);
            }}
          />
        );
      case 3:
        // Confirmation step

        if (exchangeRate === null) {
          return (
            <div className="flex flex-col items-center justify-center py-20 space-y-5">
              {" "}
              <div className="text-lg text-primary-400">
                <Icon
                  icon="mingcute:loading-3-line"
                  className="animate-spin mr-2 h-12 w-12"
                />
              </div>
              <div className="text-center text-muted">
                <p>{t("Loading Exchange Rate...")}</p>
              </div>
              <Button
                onClick={() => {
                  setStep(2);
                }}
                className="mt-2"
                color="muted"
                variant="solid"
              >
                {t("Go Back")}
              </Button>
            </div>
          );
        }

        const amountInWalletCurrency = paymentDetails.amount * exchangeRate;
        const discountInWalletCurrency = paymentDetails.discount * exchangeRate;
        const taxInWalletCurrency = paymentDetails.tax * exchangeRate;
        const totalPriceInWalletCurrency =
          amountInWalletCurrency +
          taxInWalletCurrency -
          discountInWalletCurrency;
        const remainingBalance =
          selectedWallet?.balance - totalPriceInWalletCurrency;

        const hasEnoughBalance =
          selectedWallet &&
          selectedWallet.balance >= totalPriceInWalletCurrency;
        const precision = selectedWalletType.value === "FIAT" ? 2 : 8;

        return (
          <div>
            <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
              <h2 className="text-2xl">
                <span className="text-primary-500">{t("Order summary")}: </span>
                <span className="text-muted-800 dark:text-muted-200">
                  {paymentDetails.description}
                </span>
              </h2>
              <Button
                onClick={() => router.back()}
                disabled={loading}
                color="danger"
                variant="outlined"
              >
                <Icon
                  icon={
                    loading ? "line-md:loading-twotone-loop" : "line-md:close"
                  }
                  className="me-1"
                />
                {loading ? t("Cancelling") + "..." : t("Cancel Payment")}
              </Button>
            </div>
            <section className="py-8 antialiased">
              <form action="#" className="mx-auto max-w-(--breakpoint-xl) text-lg">
                <div className="lg:flex lg:items-start lg:gap-8">
                  <div className="min-w-0 flex-1 divide-y divide-muted-200 rounded-lg border border-muted-200 bg-white shadow-xs dark:divide-muted-700 dark:border-muted-700 dark:bg-muted-800">
                    {paymentDetails.products.map((product) => (
                      <div
                        key={product.id}
                        className={`grid grid-cols-3 items-center p-4 ${
                          paymentDetails.products.length > 1 &&
                          paymentDetails.products.indexOf(product) !==
                            paymentDetails.products.length - 1
                            ? "border-b border-muted-200 dark:border-muted-700"
                            : ""
                        }`}
                      >
                        {/* Product Image and Details */}
                        <div className="flex items-center col-span-2 gap-4">
                          <a
                            href="#"
                            className="block w-16 h-16 overflow-hidden rounded-sm"
                          >
                            {product.image ? (
                              <img
                                className="h-full w-full object-cover"
                                src={product.image}
                                alt={product.name}
                              />
                            ) : (
                              <img
                                className="h-full w-full object-cover"
                                src="/img/placeholder.svg"
                                alt="Product"
                              />
                            )}
                          </a>
                          <div>
                            <a
                              href="#"
                              className="font-medium text-muted-900 hover:underline dark:text-white"
                            >
                              {product.name}
                            </a>
                          </div>
                        </div>

                        {/* Quantity and Price */}
                        <div className="text-right">
                          <p className="text-sm text-muted-900 dark:text-muted-400">
                            x{product.quantity}
                          </p>
                          <p className="text-base font-bold text-muted-900 dark:text-white">
                            {product.price} {product.currency}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 w-full divide-y divide-muted-200 overflow-hidden rounded-lg border border-muted-200 dark:divide-muted-700 dark:border-muted-700 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
                    <div className="p-6">
                      <h4 className="mb-4 text-xl font-semibold text-muted-900 dark:text-white">
                        {t("Order Details")}
                      </h4>

                      <div className="flow-root">
                        <div className="divide-y divide-muted-200 dark:divide-muted-700">
                          <dl className="pb-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                            <dt className="whitespace-nowrap font-semibold text-muted-900 dark:text-white">
                              {t("Order date")}
                            </dt>
                            <dd className="mt-2 text-muted-500 dark:text-muted-400 sm:mt-0 sm:text-right">
                              {new Date(
                                paymentDetails.createdAt
                              ).toLocaleString()}
                            </dd>
                          </dl>

                          <dl className="py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                            <dt className="whitespace-nowrap font-semibold text-muted-900 dark:text-white">
                              {t("Email")}
                            </dt>
                            <dd className="mt-2 text-muted-500 dark:text-muted-400 sm:mt-0 sm:text-right">
                              {profile?.email}
                            </dd>
                          </dl>

                          <dl className="py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                            <dt className="whitespace-nowrap font-semibold text-muted-900 dark:text-white">
                              {t("Payment method")}
                            </dt>
                            <dd className="mt-2 flex items-center gap-2 sm:mt-0 sm:justify-end">
                              <span className="text-right text-muted-500 dark:text-muted-400">
                                {selectedWalletType.label} {t("Wallet")}
                              </span>
                              <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-primary-500 hover:text-primary-700"
                              >
                                <Icon icon="mdi:pencil" className="h-4 w-4" />
                              </button>
                            </dd>
                          </dl>

                          <dl className="pt-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                            <dt className="whitespace-nowrap font-semibold text-muted-900 dark:text-white">
                              {t("Wallet balance")}
                            </dt>
                            <dd className="mt-2 flex items-center gap-2 sm:mt-0 sm:justify-end">
                              <span className="text-right text-muted-500 dark:text-muted-400">
                                {selectedWallet?.balance}{" "}
                                {selectedWallet?.currency}
                              </span>
                              <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="text-primary-500 hover:text-primary-700"
                              >
                                <Icon icon="mdi:pencil" className="h-4 w-4" />
                              </button>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-6">
                      <h4 className="text-xl font-semibold text-muted-900 dark:text-white">
                        {t("Order amount")}
                      </h4>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          {/* Conversion rate */}
                          <dl className="flex items-center justify-between gap-4">
                            <dt className="text-muted-500 dark:text-muted-400">
                              {t("Rate")}
                            </dt>
                            <dd className="font-medium text-muted-900 dark:text-white">
                              1 {paymentDetails.currency} ={" "}
                              {exchangeRate.toFixed(precision)}{" "}
                              {selectedWallet.currency}
                            </dd>
                          </dl>

                          {/* Amount */}
                          <dl className="flex items-center justify-between gap-4">
                            <dt className="text-muted-500 dark:text-muted-400">
                              {t("Amount")}
                            </dt>
                            <dd className="font-medium text-muted-900 dark:text-white">
                              {paymentDetails.amount} {paymentDetails.currency}
                            </dd>
                          </dl>

                          <dl className="flex items-center justify-between gap-4">
                            <dt className="text-muted-500 dark:text-muted-400">
                              {t("Discount")}
                            </dt>
                            <dd
                              className={`font-medium ${
                                paymentDetails.discount &&
                                paymentDetails.discount > 0
                                  ? "text-green-500"
                                  : "text-muted-900 dark:text-white"
                              }`}
                            >
                              {paymentDetails.discount &&
                              paymentDetails.discount > 0 ? (
                                <>
                                  -{paymentDetails.discount}{" "}
                                  {paymentDetails.currency}
                                </>
                              ) : (
                                "-"
                              )}
                            </dd>
                          </dl>

                          <dl className="flex items-center justify-between gap-4">
                            <dt className="text-muted-500 dark:text-muted-400">
                              {t("Tax")}
                            </dt>
                            <dd className="font-medium text-muted-900 dark:text-white">
                              {paymentDetails.tax && paymentDetails.tax > 0 ? (
                                <>
                                  +{paymentDetails.tax}{" "}
                                  {paymentDetails.currency}
                                </>
                              ) : (
                                "-"
                              )}
                            </dd>
                          </dl>
                        </div>

                        <dl className="flex items-center justify-between gap-4 border-t border-muted-200 pt-2 dark:border-muted-700">
                          <dt className="font-bold text-muted-900 dark:text-white">
                            {t("Total")}
                          </dt>
                          <dd className="font-bold text-muted-900 dark:text-white">
                            {totalPriceInWalletCurrency.toFixed(precision)}{" "}
                            {selectedWallet.currency}
                          </dd>
                        </dl>
                        {/* remaining balance */}
                        <dl className="flex items-center justify-between gap-4 pt-2">
                          <dt className="text-muted-500 dark:text-muted-400">
                            {t("Remaining Balance")}
                          </dt>
                          <dd className="font-medium text-muted-900 dark:text-white">
                            {remainingBalance.toFixed(precision)}{" "}
                            {selectedWallet.currency}
                          </dd>
                        </dl>
                      </div>

                      <button
                        onClick={handleConfirmPayment}
                        disabled={
                          !selectedWallet || loading || !hasEnoughBalance
                        }
                        type="button"
                        className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-hidden focus:ring-4 ${
                          hasEnoughBalance
                            ? "bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            : "bg-muted-200 dark:bg-muted-700 cursor-not-allowed"
                        }`}
                      >
                        {hasEnoughBalance
                          ? loading
                            ? t("Processing") + "..."
                            : t("Confirm Payment")
                          : t("Insufficient Balance")}
                      </button>

                      <p className="max-w-xs text-sm font-normal text-muted-500 dark:text-muted-400">
                        {t("By placing your order, you agree to")} {siteName}{" "}
                        <Link
                          href="/privacy-policy"
                          title=""
                          className="text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                        >
                          {t("privacy note")}
                        </Link>{" "}
                        {t("and")}{" "}
                        <Link
                          href="/terms-and-conditions"
                          title=""
                          className="text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                        >
                          {t("terms of use")}
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout title="Payment Details">
      {/* Render Stepper */}
      <StepProgress
        step={step}
        icons={[
          "solar:wallet-bold-duotone",
          "ph:currency-dollar-simple-duotone",
          "ph:flag-duotone",
        ]}
      />
      {/* Render current step */}
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-stretch pt-28">
        {renderStep()}
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { paymentIntentId } = context.query;

  if (!paymentIntentId) {
    return {
      props: {
        error: "No payment intent ID provided.",
        paymentDetails: null,
      },
    };
  }

  try {
    const paymentResponse = await $serverFetch(context, {
      url: `/api/ext/payment/intent/${paymentIntentId}`,
      silent: true,
    });

    return {
      props: {
        paymentDetails: paymentResponse.data || null,
        error: null,
      },
    };
  } catch (err: any) {
    console.error("Error fetching payment details:", err);
    return {
      props: {
        error: err.message || "Failed to fetch payment details.",
        paymentDetails: null,
      },
    };
  }
}

export default PaymentPage;
