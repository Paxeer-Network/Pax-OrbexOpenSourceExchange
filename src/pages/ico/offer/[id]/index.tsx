import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDashboardStore } from "@/stores/dashboard";
import $fetch, { $serverFetch } from "@/utils/api";
import Input from "@/components/elements/form/input/Input";
import Card from "@/components/elements/base/card/Card";
import { Icon } from "@iconify/react";
import Progress from "@/components/elements/base/progress/Progress";
import Avatar from "@/components/elements/base/avatar/Avatar";
import { format, parseISO } from "date-fns";
import Button from "@/components/elements/base/button/Button";
import { MashImage } from "@/components/elements/MashImage";
import { formatLargeNumber } from "@/utils/market";
import Link from "next/link";
import { BackButton } from "@/components/elements/base/button/BackButton";
import { useWalletStore } from "@/stores/user/wallet";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";
import { ErrorPage, NotFound } from "@/components/ui/Errors";
import Countdown from "@/components/elements/addons/Countdown/Default";

type Token = {
  id: string;
  projectId: string;
  saleAmount: number;
  name: string;
  chain: string;
  currency: string;
  purchaseCurrency: string;
  purchaseWalletType: string;
  address: string;
  totalSupply: number;
  description: string;
  image: string;
  status: string;
  phases: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    price: number;
    status: string;
    contributions: number;
    contributionPercentage: number;
    minPurchase: number;
    maxPurchase: number;
  }[];
  icoAllocation: {
    id: string;
    name: string;
    percentage: number;
  };
  project: {
    id: string;
    name: string;
    description: string;
    website: string;
    whitepaper: string;
  };
};

interface Props {
  token?: Token;
  error?: string;
}

const OfferDetails: React.FC<Props> = ({ token: initialToken, error }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [token, setToken] = useState<Token | null>(initialToken || null);
  const { profile, getSetting } = useDashboardStore();
  const { wallet, fetchWallet } = useWalletStore();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (
      token &&
      (!wallet ||
        (wallet &&
          wallet.type !== token.purchaseWalletType &&
          wallet.currency !== token.purchaseCurrency))
    ) {
      fetchWallet(token.purchaseWalletType, token.purchaseCurrency);
    }
  }, [token, wallet]);

  if (!token) {
    return (
      <NotFound
        title={t("Token Not Found")}
        description={t("We couldn't find the token details.")}
        link="/ico"
        linkTitle={t("Back to ICO Dashboard")}
      />
    );
  }

  if (error) {
    return (
      <ErrorPage
        title={t("Error")}
        description={t(error)}
        link="/ico"
        linkTitle={t("Back to ICO Dashboard")}
      />
    );
  }

  const activePhase = token.phases.find((phase) => phase.status === "ACTIVE");

  const fetchToken = async () => {
    const { data, error } = await $fetch({
      url: `/api/ext/ico/offer/${id}`,
      silent: true,
    });

    if (!error) {
      setToken(data);
    } else {
      toast.error(t("Failed to fetch token details."));
    }
  };

  const purchase = async () => {
    if (!activePhase) return;

    if (
      getSetting("icoRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED"))
    ) {
      await router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to participate in ICO"));
      return;
    }

    const { error } = await $fetch({
      url: `/api/ext/ico/contribution`,
      method: "POST",
      body: { amount, phaseId: activePhase.id },
    });

    if (!error) {
      fetchWallet(token.purchaseWalletType, token.purchaseCurrency);
      await fetchToken(); // Refetch token details to update UI
      setAmount(0);
    }
  };

  return (
    <Layout title={`${token?.name} Details`} color="muted">
      <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
        <h2 className="text-2xl">
          <span className="text-primary-500">{token?.name} </span>
          <span className="text-muted-800 dark:text-muted-200">
            {t("Details")}
          </span>
        </h2>

        <BackButton href={`/ico/project/${token?.projectId}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
        <div className="col-span-1 md:col-span-2 xl:col-span-3 space-y-5">
          <Card
            className="text-muted-800 dark:text-muted-200 flex flex-col items-center p-6 sm:flex-row"
            color="contrast"
          >
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <div className="relative">
                <Avatar src={token?.image} text={token?.currency} size="xl" />
                {token?.chain && (
                  <MashImage
                    src={`/img/crypto/${token.chain?.toLowerCase()}.webp`}
                    width={24}
                    height={24}
                    alt="chain"
                    className="absolute right-0 bottom-0"
                  />
                )}
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-sans text-base font-medium">
                  {token?.currency} ({token?.name})
                </h4>
                <p className="text-muted-400 font-sans text-sm">
                  {token?.description}
                </p>
              </div>
            </div>
          </Card>
          <Card
            color="contrast"
            className="text-muted-800 dark:text-muted-200 p-4 text-sm"
          >
            <h3 className="text-start font-bold mb-2">{t("Token Details")}</h3>
            <ul className="flex flex-col gap-2">
              <li className="border-b border-muted-200 dark:border-muted-800 flex justify-between">
                <strong>{t("Name")}</strong> {token?.name}
              </li>
              <li className="border-b border-muted-200 dark:border-muted-800 flex justify-between">
                <strong>{t("Address")}</strong> {token?.address}
              </li>
              <li className="border-b border-muted-200 dark:border-muted-800 flex justify-between">
                <strong>{t("Project Name")}</strong> {token?.project.name}
              </li>
              <li className="border-b border-muted-200 dark:border-muted-800 flex justify-between">
                <strong>{t("Project Description")}</strong>{" "}
                {token?.project.description}
              </li>
              <li className="border-b border-muted-200 dark:border-muted-800 flex justify-between">
                <strong>{t("Project Website")}</strong>
                <a
                  href={token?.project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500"
                >
                  {token?.project.website}
                </a>
              </li>
              <li className="border-b border-muted-200 dark:border-muted-800 flex justify-between">
                <strong>{t("Project Whitepaper")}</strong>
                <p>{token?.project.whitepaper}</p>
              </li>
              <li className="flex justify-between">
                <strong>{t("Total Supply")}</strong> {token?.totalSupply}{" "}
                {token?.currency}
              </li>
            </ul>
          </Card>
          {activePhase && (
            <Card
              color="contrast"
              className="text-muted-800 dark:text-muted-200 p-4 flex flex-col sm:flex-row justify-between text-sm"
            >
              <div className="w-full">
                <h3 className="text-start font-bold mb-2">
                  {t("Active Phase Details")}
                </h3>
                <ul className="flex flex-col gap-2">
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-800">
                    <strong>{t("Price")}</strong>
                    <span>
                      {activePhase.price} {token?.purchaseCurrency}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-800">
                    <strong>{t("Min Purchase Amount")}</strong>
                    <span>
                      {activePhase.minPurchase} {token?.purchaseCurrency}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-800">
                    <strong>{t("Max Purchase Amount")}</strong>
                    <span>
                      {activePhase.maxPurchase} {token?.purchaseCurrency}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-800">
                    <strong>{t("Start Date")}</strong>
                    <span>
                      {format(parseISO(activePhase.startDate), "PPpp")}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <strong>{t("End Date")}</strong>
                    <span>{format(parseISO(activePhase.endDate), "PPpp")}</span>
                  </li>
                </ul>
              </div>
            </Card>
          )}
        </div>
        <div className="space-y-5">
          <Card
            color="contrast"
            className="text-muted-800 dark:text-muted-200 space-y-5"
          >
            <div className="w-full p-4 border-b text-center border-gray-200 dark:border-gray-700">
              <div className="w-full">
                {activePhase && (
                  <Countdown
                    startDate={activePhase.startDate}
                    endDate={activePhase.endDate}
                    onExpire={() => fetchToken()} // Optional: Refetch token or trigger an action when countdown ends
                  />
                )}
              </div>
            </div>
            <div className="w-full grow space-y-1 px-4 pb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-muted-700 dark:text-muted-100 font-sans text-sm font-medium">
                  {t("Progress")}
                </h4>
                <div>
                  <span className="text-muted-400 font-sans text-sm">
                    {activePhase?.contributionPercentage?.toFixed(6) ?? 0}%
                  </span>
                </div>
              </div>
              <Progress
                size="xs"
                color="primary"
                value={activePhase?.contributionPercentage ?? 0}
              />
            </div>
            {activePhase && (
              <>
                <div className="border-t border-muted-200 dark:border-muted-800 pt-4 px-4">
                  <Input
                    type="number"
                    label={t("Amount")}
                    placeholder={t("Enter amount")}
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    min={activePhase.minPurchase}
                    max={
                      wallet
                        ? wallet.balance > activePhase.maxPurchase
                          ? activePhase.maxPurchase
                          : wallet?.balance
                        : activePhase.maxPurchase
                    }
                  />
                </div>
                <div className="flex justify-between items-center text-xs pt-0 px-4">
                  <span className="text-muted-800 dark:text-muted-200">
                    {t("Balance")}
                  </span>
                  <span className="flex gap-1 justify-center items-center">
                    {wallet?.balance ?? 0} {token?.purchaseCurrency}
                    <Link href={`/user/wallet/deposit`}>
                      <Icon
                        icon="ei:plus"
                        className="h-5 w-5 text-success-500"
                      />
                    </Link>
                  </span>
                </div>
                <div className="px-4 pb-4">
                  <Button
                    type="button"
                    shape="rounded-sm"
                    color="primary"
                    className="w-full"
                    onClick={() => purchase()}
                    disabled={
                      !amount ||
                      amount < activePhase.minPurchase ||
                      amount > activePhase.maxPurchase ||
                      (wallet ? amount > wallet.balance : false)
                    }
                  >
                    {t("Purchase")}
                  </Button>
                </div>
              </>
            )}
          </Card>

          <Card
            color="contrast"
            className="text-muted-800 dark:text-muted-200 "
          >
            <div className="w-full">
              <div className="flex flex-col gap-1 text-center border-b border-muted-200 dark:border-muted-800 p-4">
                <h3 className="font-sans text-md font-semibold">
                  {activePhase?.name}
                </h3>
                <p className="text-muted-400 font-sans text-xs uppercase">
                  {t("Phase")}
                </p>
              </div>
              <div className="flex flex-col gap-1 border-b border-muted-200 dark:border-muted-800 p-4 text-center">
                <h3 className="font-sans text-md font-semibold">
                  {formatLargeNumber(token?.saleAmount || 0)}
                </h3>
                <p className="text-muted-400 font-sans text-xs uppercase">
                  {t("Sale Amount")}
                </p>
              </div>
              <div className="flex flex-col gap-1 border-b border-muted-200 dark:border-muted-800 p-4 text-center">
                <h3 className="font-sans text-md font-semibold">
                  {activePhase?.contributions ?? 0}
                </h3>
                <p className="text-muted-400 font-sans text-xs uppercase">
                  {t("Contributions")}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;

  try {
    const { data, error } = await $serverFetch(context, {
      url: `/api/ext/ico/offer/${id}`,
    });

    if (error || !data) {
      return {
        props: {
          error: error || "Unable to fetch token details.",
        },
      };
    }

    return {
      props: {
        token: data,
      },
    };
  } catch (error) {
    console.error("Error fetching token details:", error);
    return {
      props: {
        error: `An unexpected error occurred: ${error.message}`,
      },
    };
  }
}

export default OfferDetails;
