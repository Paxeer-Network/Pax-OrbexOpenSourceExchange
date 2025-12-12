// /api/p2pTrades/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";
import {
  userAvatarSchema,
  userFullNameSchema,
} from "@b/utils/schema/structure";

export const metadata = {
  summary: "Get form structure for P2P Trades",
  operationId: "getP2pTradeStructure",
  tags: ["Admin","P2P Trades"],
  responses: {
    200: {
      description: "Form structure for managing P2P Trades",
      content: structureSchema,
    },
  },
  permission: "Access P2P Trade Management"
};

export const p2pTradeStructure = async () => {
  const offers = await models.p2pOffer.findAll();
  const userId = {
    type: "input",
    label: "User",
    name: "userId",
    placeholder: "Enter the user ID",
    icon: "lets-icons:user-duotone",
  };

  const sellerId = {
    type: "input",
    label: "Seller ID",
    name: "sellerId",
    placeholder: "Enter the ID of the seller",
  };

  const offerId = {
    type: "select",
    label: "Offer ID",
    name: "offerId",
    options: offers.map((offer) => ({
      value: offer.id,
      label: offer.id,
    })),
    placeholder: "Select the offer ID",
  };

  const amount = {
    type: "input",
    label: "Amount",
    name: "amount",
    placeholder: "Enter the amount for the trade",
    ts: "number",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "PAID", label: "Paid" },
      { value: "DISPUTE_OPEN", label: "Dispute Open" },
      { value: "ESCROW_REVIEW", label: "Escrow Review" },
      { value: "CANCELLED", label: "Cancelled" },
      { value: "COMPLETED", label: "Completed" },
      { value: "REFUNDED", label: "Refunded" },
    ],
    placeholder: "Select the trade status",
  };

  const messages = {
    type: "textarea",
    label: "Messages",
    name: "messages",
    placeholder: "Any relevant communication or notes",
  };

  const txHash = {
    type: "input",
    label: "Transaction Hash",
    name: "txHash",
    placeholder: "Blockchain transaction hash if applicable",
  };

  return {
    userId,
    sellerId,
    offerId,
    amount,
    status,
    messages,
    txHash,
  };
};

export default async () => {
  const { userId, sellerId, offerId, amount, status, messages, txHash } =
    await p2pTradeStructure();

  return {
    get: [
      {
        fields: [
          userAvatarSchema,
          {
            fields: [userFullNameSchema],
            grid: "column",
          },
        ],
        className: "card-dashed mb-5 items-center",
      },
      {
        fields: [
          {
            type: "file",
            label: "Avatar",
            name: "seller.avatar",
            fileType: "image",
            width: 64,
            height: 64,
            maxSize: 1,
            className: "rounded-full",
            placeholder: "/img/avatars/placeholder.webp",
          },
          {
            fields: [
              {
                type: "input",
                component: "InfoBlock",
                label: "Seller",
                name: "seller.firstName,' ',seller.lastName",
                icon: "ph:user-circle-light",
              },
            ],
            grid: "column",
          },
        ],
        className: "card-dashed mb-5 items-center",
      },
      {
        type: "input",
        label: "Offer",
        name: "offerId",
        icon: "ph:wallet-light",
      },
      [txHash, amount],
      messages,
      status,
    ],
    set: [[userId, sellerId], [offerId, amount], txHash, status],
  };
};
