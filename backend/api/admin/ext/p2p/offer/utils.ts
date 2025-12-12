import {
  baseStringSchema,
  baseDateTimeSchema,
  baseNumberSchema,
  baseEnumSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the P2P Offer");
const userId = baseStringSchema("ID of the User who created the offer");
const walletType = baseEnumSchema("Type of wallet used in the offer", [
  "FIAT",
  "SPOT",
  "ECO",
]);
const currency = baseStringSchema("Currency of the offer");
const chain = baseStringSchema("Blockchain chain used, if any", 191, 0, true);
const amount = baseNumberSchema("Total amount of the offer");
const minAmount = baseNumberSchema("Minimum amount acceptable");
const maxAmount = baseNumberSchema("Maximum amount acceptable", true);
const inOrder = baseNumberSchema("Amount currently in order");
const price = baseNumberSchema("Price per unit of currency");
const paymentMethodId = baseStringSchema("ID of the payment method used");
const status = baseEnumSchema("Current status of the offer", [
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
]);
const createdAt = baseDateTimeSchema("Creation date of the offer");
const updatedAt = baseDateTimeSchema("Last update date of the offer", true);

export const p2pOfferSchema = {
  id,
  userId,
  walletType,
  currency,
  chain,
  amount,
  minAmount,
  maxAmount,
  inOrder,
  price,
  paymentMethodId,
  status,
  createdAt,
  updatedAt,
};

export const baseP2pOfferSchema = {
  id,
  userId,
  walletType,
  currency,
  chain,
  amount,
  minAmount,
  maxAmount,
  inOrder,
  price,
  paymentMethodId,
  status,
  createdAt,
  updatedAt,
  deletedAt: baseDateTimeSchema("Deletion date of the offer, if any"),
};

export const p2pOfferUpdateSchema = {
  type: "object",
  properties: {
    amount,
    minAmount,
    maxAmount,
    price,
    status,
  },
  required: ["status", "amount", "minAmount", "price"],
};

export const p2pOfferStoreSchema = {
  description: `P2P Offer created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseP2pOfferSchema,
      },
    },
  },
};
