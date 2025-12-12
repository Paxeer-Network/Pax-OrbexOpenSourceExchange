import React, { memo, useEffect, useState, useCallback } from "react";
import { OrderProps } from "./Order.types";
import { useDashboardStore } from "@/stores/dashboard";
import { useBinaryOrderStore } from "@/stores/binary/order";
import useMarketStore from "@/stores/trade/market";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { toast } from "sonner";
import useWebSocketStore from "@/stores/trade/ws";
import { formatTime, useBinaryCountdown } from "@/hooks/useBinaryCountdown";

import OrderAmountAndExpiration from "./OrderAmountAndExpiration";
import BinaryProfitIndicator from "./BinaryProfitIndicator";
import OrderActionButtons from "./OrderActionButtons";
import ExpiryModal from "./ExpiryModal";

const BINARY_PROFIT = parseFloat(process.env.NEXT_PUBLIC_BINARY_PROFIT || "87");
const ORDER_WS_PATH = "/api/exchange/binary/order";
const ORDER_COMPLETED_TYPE = "ORDER_COMPLETED";

const OrderBase = ({}: OrderProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile, getSetting } = useDashboardStore();
  const {
    fetchWallet,
    placeOrder,
    loading,
    setPracticeBalance,
    updatePracticeBalance,
    removeOrder,
    wallet,
    getPracticeBalance,
  } = useBinaryOrderStore();
  const { market } = useMarketStore();
  const {
    orderConnection,
    createConnection,
    removeConnection,
    addMessageHandler,
    removeMessageHandler,
    subscribe,
    unsubscribe,
  } = useWebSocketStore();
  const { expirations, expiry, setExpiry } = useBinaryCountdown();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [orderConnectionReady, setOrderConnectionReady] = useState(false);

  const isPractice = router.query.practice === "true";
  const minAmount = Number(market?.limits?.amount?.min || 0);
  const maxAmount = Number(market?.limits?.amount?.max || 0);
  const balance =
    isPractice && market?.currency && market?.pair
      ? getPracticeBalance(market.currency, market.pair)
      : wallet?.balance || 0;

  // Setup practice balance
  useEffect(() => {
    if (isPractice && market?.currency && market?.pair) {
      setPracticeBalance(
        market.currency,
        market.pair,
        getPracticeBalance(market.currency, market.pair)
      );
    }
  }, [
    isPractice,
    setPracticeBalance,
    getPracticeBalance,
    market?.currency,
    market?.pair,
  ]);

  const handleOrderMessage = useCallback(
    (message: any) => {
      if (!message || message.type !== ORDER_COMPLETED_TYPE) return;
      const { order } = message;
      if (!order) return;

      const orderAmount = order.amount;
      const profitPercentage = order.profit || BINARY_PROFIT;
      const profit = orderAmount * (profitPercentage / 100);

      switch (order.status) {
        case "WIN":
          toast.success(`You won ${profit.toFixed(2)}`);
          break;
        case "LOSS":
          toast.error(`You lost ${orderAmount.toFixed(2)}`);
          break;
        case "DRAW":
          toast.info(`Order ended in a draw`);
          break;
      }

      if (isPractice && market?.currency && market?.pair) {
        if (order.status === "WIN") {
          updatePracticeBalance(
            market.currency,
            market.pair,
            orderAmount + profit,
            "add"
          );
        } else if (order.status === "LOSS") {
          // Consider revisiting this logic if unintended.
          updatePracticeBalance(market.currency, market.pair, 0);
        } else if (order.status === "DRAW") {
          updatePracticeBalance(
            market.currency,
            market.pair,
            orderAmount,
            "add"
          );
        }
      } else {
        const symbolParts = order?.symbol?.split("/") || [];
        if (symbolParts[1]) {
          fetchWallet(symbolParts[1]);
        }
      }

      removeOrder(order.id);
    },
    [
      isPractice,
      market?.currency,
      market?.pair,
      updatePracticeBalance,
      fetchWallet,
      removeOrder,
    ]
  );

  // Setup WS connection
  useEffect(() => {
    if (!router.isReady) return;
    createConnection("orderConnection", ORDER_WS_PATH);
    setOrderConnectionReady(true);

    return () => {
      if (!router.query.symbol) {
        removeConnection("orderConnection");
      }
    };
  }, [router.isReady, router.query.symbol, createConnection, removeConnection]);

  // Subscribe/unsubscribe to order events
  useEffect(() => {
    if (
      !orderConnectionReady ||
      !orderConnection?.isConnected ||
      !profile?.id ||
      !market?.symbol
    )
      return;

    subscribe("orderConnection", "order", {
      symbol: market.symbol,
      userId: profile.id,
    });
    return () => {
      unsubscribe("orderConnection", "order", {
        symbol: market.symbol,
        userId: profile.id,
      });
    };
  }, [
    orderConnectionReady,
    orderConnection?.isConnected,
    profile?.id,
    market?.symbol,
    subscribe,
    unsubscribe,
  ]);

  // Add message handler
  useEffect(() => {
    if (!orderConnectionReady || !orderConnection?.isConnected) return;

    addMessageHandler("orderConnection", handleOrderMessage);
    return () => {
      removeMessageHandler("orderConnection", handleOrderMessage);
    };
  }, [
    orderConnectionReady,
    orderConnection?.isConnected,
    addMessageHandler,
    removeMessageHandler,
    handleOrderMessage,
  ]);

  const canPlaceOrder = useCallback(() => {
    if (!profile?.id) return false;
    if (getSetting("binaryRestrictions") === "true") {
      const kycLevel = parseFloat(profile?.kyc?.level || "0");
      const isKycApproved = profile?.kyc?.status === "APPROVED";
      if (!isKycApproved && kycLevel < 2) return false;
    }
    if (
      amount <= 0 ||
      amount < minAmount ||
      amount > maxAmount ||
      balance <= 0
    ) {
      return false;
    }
    return true;
  }, [profile, getSetting, amount, minAmount, maxAmount, balance]);

  const handlePlaceOrder = async (side: "RISE" | "FALL") => {
    if (!profile?.id) {
      router.push("/login");
      return;
    }

    if (
      getSetting("binaryRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED"))
    ) {
      await router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to trade binary options"));
      return;
    }

    if (!expiry?.expirationTime) {
      toast.error(t("Invalid expiry time"));
      return;
    }

    if (amount <= 0) {
      toast.error(t("Please enter a valid amount"));
      return;
    }

    if (!market?.currency || !market?.pair) {
      toast.error(t("Market is not available"));
      return;
    }

    const closedAt = expiry.expirationTime.toISOString();
    await placeOrder(
      market.currency,
      market.pair,
      side,
      amount,
      closedAt,
      isPractice
    );

    // Reset expiry to the first valid expiration
    const newExpiry =
      expirations.find(
        (exp) =>
          (exp.expirationTime.getTime() - new Date().getTime()) / 1000 > 50
      ) || expirations[0];

    setExpiry(newExpiry);
  };

  return (
    <>
      <div className="flex gap-3 md:overflow-x-auto flex-col justify-between p-4 md:p-2">
        <OrderAmountAndExpiration
          amount={amount}
          setAmount={setAmount}
          balance={balance}
          minAmount={minAmount}
          maxAmount={maxAmount}
          expiry={expiry}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />

        <BinaryProfitIndicator profit={BINARY_PROFIT} />

        <OrderActionButtons
          profile={profile}
          loading={loading}
          canPlaceOrder={canPlaceOrder}
          handlePlaceOrder={handlePlaceOrder}
          t={t}
          router={router}
        />
      </div>

      {isModalOpen && (
        <ExpiryModal
          expirations={expirations}
          expiry={expiry}
          setExpiry={setExpiry}
          setIsModalOpen={setIsModalOpen}
          formatTime={formatTime}
          t={t}
        />
      )}
    </>
  );
};

export const Order = memo(OrderBase);
