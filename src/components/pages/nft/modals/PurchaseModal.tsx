/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect } from "react";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import { useWalletStore } from "@/stores/user/wallet"; // Import the wallet store
import Button from "@/components/elements/base/button/Button";
import ButtonLink from "@/components/elements/base/button-link/ButtonLink";

interface PurchaseModalProps {
  isVisible: boolean;
  onClose: () => void;
  asset: NftAsset;
  chain: string;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isVisible,
  onClose,
  asset,
  chain,
}) => {
  const { wallet, fetchWallet } = useWalletStore(); // Access wallet state and actions

  // Fetch wallet information based on the asset's wallet type and currency
  useEffect(() => {
    if (isVisible && !wallet) {
      fetchWallet("ECO", chain);
    }
  }, [isVisible, wallet, fetchWallet]);

  // Handle background blur effect when the modal is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-xs transition-all duration-300 ease-in-out">
      {/* Modal Container */}
      <div className="bg-white dark:bg-muted-800 rounded-xl p-8 w-[500px] shadow-2xl relative border border-gray-100 dark:border-muted-700 transition-all duration-300 ease-in-out">
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <IconButton onClick={onClose} color="muted">
            <Icon
              icon="mdi:close"
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition duration-300"
            />
          </IconButton>
        </div>

        {/* Modal Content */}
        <h3 className="text-2xl font-bold text-center text-muted-900 dark:text-white mb-2">
          Pay with Crypto
        </h3>
        <p className="text-center text-sm text-muted-600 dark:text-muted-400 mb-6">
          Complete your purchase of <strong>{asset.name}</strong>.
        </p>

        {/* Payment Amount */}
        <div className="flex justify-center items-center mb-6">
          <IconBox
            variant="pastel"
            size="xl"
            shape="straight"
            color="primary"
            mask="hexed"
            icon="solar:wallet-bold-duotone"
          />
        </div>

        <div className="text-center">
          <div className="text-sm text-muted-600 dark:text-muted-400 mb-2">
            Payment Amount
          </div>
          <div className="text-3xl font-bold text-muted-900 dark:text-white mb-2">
            {asset.price} {chain}
          </div>
        </div>

        <div className="text-center my-6 p-6 bg-muted-100 dark:bg-muted-900 rounded-lg">
          {/* Wallet Balance */}
          {wallet ? (
            <div className="text-sm font-medium text-muted-600 dark:text-muted-400">
              Wallet Balance: {wallet.balance} {wallet.currency}
            </div>
          ) : (
            <div className="text-sm font-medium text-muted-600 dark:text-muted-400">
              Wallet Balance: 0 {chain}
            </div>
          )}

          {/* Warning Message */}
          {(wallet && wallet.balance < asset.price) ||
            (!wallet && (
              <p className="text-sm text-red-500 font-medium mt-2">
                You don't have enough crypto in your wallet.
              </p>
            ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6 gap-4">
          <div className="w-1/2">
            <Button onClick={onClose} className="w-full" color={"muted"}>
              Back
            </Button>
          </div>
          <div className="w-1/2">
            {wallet && wallet.balance >= asset.price ? (
              <Button
                disabled={!wallet || wallet.balance < asset.price}
                className="w-full"
                color={"primary"}
              >
                Buy Now
              </Button>
            ) : (
              <ButtonLink
                className="w-full"
                color={"primary"}
                href="/user/wallet/deposit"
              >
                Deposit Now
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
