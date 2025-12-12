import React, { Dispatch, SetStateAction } from "react";
import Input from "@/components/elements/form/input/Input";
import { ClientTime } from "./ClientTime";

interface OrderAmountAndExpirationProps {
  amount: number;
  setAmount: Dispatch<SetStateAction<number>>;
  balance: number;
  minAmount: number;
  maxAmount: number;
  expiry: any; // Adjust with proper type if available
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  t?: (key: string) => string; // from useTranslation
}

const OrderAmountAndExpiration: React.FC<OrderAmountAndExpirationProps> = ({
  amount,
  setAmount,
  balance,
  minAmount,
  maxAmount,
  expiry,
  isModalOpen,
  setIsModalOpen,
  t = (key) => key,
}) => {
  return (
    <div className="flex md:flex-col gap-3 items-end">
      <div className="w-full">
        <Input
          type="number"
          label={t("Amount")}
          value={amount}
          shape={"rounded-sm"}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={minAmount}
          max={maxAmount}
          step={minAmount}
          disabled={balance <= 0}
        />
      </div>

      <div className="relative w-full">
        <label className="font-sans text-[.68rem] text-muted-400">
          {t("Expiration")}
        </label>
        <button
          type="button"
          className="w-full text-left p-2 border text-sm rounded-md bg-white dark:bg-muted-800 border-muted-200 dark:border-muted-700 text-muted-700 dark:text-muted-200"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <ClientTime expiry={expiry} />
        </button>
      </div>
    </div>
  );
};

export default OrderAmountAndExpiration;
