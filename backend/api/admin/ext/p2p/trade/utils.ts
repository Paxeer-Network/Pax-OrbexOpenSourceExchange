import {
  baseStringSchema,
  baseNumberSchema,
  baseDateTimeSchema,
  baseEnumSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the P2P Trade");
const userId = baseStringSchema("ID of the Buyer User");
const sellerId = baseStringSchema("ID of the Seller User");
const offerId = baseStringSchema(
  "ID of the P2P Offer associated with the trade"
);
const amount = baseNumberSchema("Amount involved in the trade");
const status = baseEnumSchema("Current status of the trade", [
  "PENDING",
  "PAID",
  "DISPUTE_OPEN",
  "ESCROW_REVIEW",
  "CANCELLED",
  "COMPLETED",
  "REFUNDED",
]);
const messages = baseStringSchema(
  "Messages related to the trade",
  255,
  0,
  true
);
const txHash = baseStringSchema("Transaction hash if applicable", 255, 0, true);
const createdAt = baseDateTimeSchema("Creation date of the trade");
const updatedAt = baseDateTimeSchema("Last update date of the trade");

export const p2pTradeSchema = {
  id,
  userId,
  sellerId,
  offerId,
  amount,
  status,
  messages,
  txHash,
  createdAt,
  updatedAt,
};

export const baseP2pTradeSchema = {
  id,
  userId,
  sellerId,
  offerId,
  amount,
  status,
  messages,
  txHash,
  createdAt,
  updatedAt,
  deletedAt: baseDateTimeSchema("Deletion date of the trade, if any"),
};

export const p2pTradeUpdateSchema = {
  type: "object",
  properties: {
    status,
    messages,
    txHash,
  },
  required: ["status"], // Adjust according to business logic if necessary
};

export const p2pTradeStoreSchema = {
  description: `P2P Trade created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseP2pTradeSchema,
      },
    },
  },
};
