import {
  baseStringSchema,
  baseNumberSchema,
  baseDateTimeSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the P2P Commission");
const tradeId = baseStringSchema("Trade ID associated with the commission");
const amount = baseNumberSchema("Amount of the commission");
const createdAt = baseDateTimeSchema("Creation date of the P2P Commission");
const updatedAt = baseDateTimeSchema(
  "Last update date of the P2P Commission",
  true
);

export const p2pCommissionSchema = {
  id,
  tradeId,
  amount,
  createdAt,
  updatedAt,
};

export const baseP2pCommissionSchema = {
  id,
  tradeId,
  amount,
  createdAt,
  updatedAt,
  deletedAt: baseDateTimeSchema("Deletion date of the P2P Commission, if any"),
};

export const p2pCommissionUpdateSchema = {
  type: "object",
  properties: {
    amount,
  },
  required: ["amount"],
};

export const p2pCommissionStoreSchema = {
  description: `P2P Commission created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: p2pCommissionSchema,
      },
    },
  },
};
