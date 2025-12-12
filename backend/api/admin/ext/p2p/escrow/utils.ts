import {
  baseStringSchema,
  baseDateTimeSchema,
  baseNumberSchema,
  baseEnumSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the P2P Escrow");
const tradeId = baseStringSchema("Associated Trade ID");
const amount = baseNumberSchema("Amount held in escrow");
const status = baseEnumSchema("Current status of the escrow", [
  "PENDING",
  "HELD",
  "RELEASED",
  "CANCELLED",
]);
const createdAt = baseDateTimeSchema("Creation date of the P2P Escrow");
const updatedAt = baseDateTimeSchema(
  "Last update date of the P2P Escrow",
  true
);

export const p2pEscrowSchema = {
  id,
  tradeId,
  amount,
  status,
  createdAt,
  updatedAt,
};

export const baseP2pEscrowSchema = {
  id,
  tradeId,
  amount,
  status,
  createdAt,
  updatedAt,
  deletedAt: baseDateTimeSchema("Deletion date of the P2P Escrow, if any"),
};

export const p2pEscrowUpdateSchema = {
  type: "object",
  properties: {
    status,
    amount,
  },
  required: ["status", "amount"],
};

export const p2pEscrowStoreSchema = {
  description: `P2P Escrow created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseP2pEscrowSchema,
      },
    },
  },
};
