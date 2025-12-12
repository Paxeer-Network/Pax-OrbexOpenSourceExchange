import React from "react";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import { NextRouter } from "next/router";

interface OrderActionButtonsProps {
  profile: any; // adjust type as needed
  loading: boolean;
  canPlaceOrder: () => boolean;
  handlePlaceOrder: (side: "RISE" | "FALL") => Promise<void>;
  t: (key: string) => string;
  router: NextRouter;
}

const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({
  profile,
  loading,
  canPlaceOrder,
  handlePlaceOrder,
  t,
  router,
}) => {
  const isLoggedIn = !!profile?.id;

  return (
    <div className="flex md:flex-col gap-2 items-center justify-center">
      <div className="w-full">
        <Button
          type="button"
          color={isLoggedIn ? "success" : "muted"}
          animated={false}
          shape={"rounded-sm"}
          className="h-20 w-full"
          onClick={() =>
            isLoggedIn ? handlePlaceOrder("RISE") : router.push("/login")
          }
          loading={loading}
          disabled={!canPlaceOrder()}
        >
          {isLoggedIn ? (
            <span className="text-md flex md:flex-col items-center gap-2 md:gap-0">
              {t("Rise")}
              <Icon icon="ant-design:rise-outlined" className="h-8 w-8" />
            </span>
          ) : (
            <div className="flex gap-2 flex-col">
              <span className="text-warning-500">{t("Log In")}</span>
              <span>{t("or")}</span>
              <span className="text-warning-500">{t("Register Now")}</span>
            </div>
          )}
        </Button>
      </div>

      <div className="w-full">
        <Button
          type="button"
          color={isLoggedIn ? "danger" : "muted"}
          animated={false}
          shape={"rounded-sm"}
          className="h-20 w-full"
          onClick={() =>
            isLoggedIn ? handlePlaceOrder("FALL") : router.push("/login")
          }
          loading={loading}
          disabled={!canPlaceOrder()}
        >
          {isLoggedIn ? (
            <span className="text-md flex md:flex-col items-center gap-2">
              {t("Fall")}
              <Icon icon="ant-design:fall-outlined" className="h-8 w-8" />
            </span>
          ) : (
            <div className="flex gap-2 flex-col">
              <span className="text-warning-500">{t("Log In")}</span>
              <span>{t("or")}</span>
              <span className="text-warning-500">{t("Register Now")}</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OrderActionButtons;
