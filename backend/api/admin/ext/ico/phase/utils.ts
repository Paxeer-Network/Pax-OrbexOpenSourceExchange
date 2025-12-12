import {
  baseStringSchema,
  baseDateTimeSchema,
  baseNumberSchema,
  baseEnumSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the ICO Phase");
const name = baseStringSchema("Name of the ICO Phase");
const startDate = baseDateTimeSchema("Start Date of the ICO Phase");
const endDate = baseDateTimeSchema("End Date of the ICO Phase");
const price = baseNumberSchema("Price per token during this phase");
const status = baseEnumSchema("Current status of the phase", [
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
]);
const tokenId = baseStringSchema("Associated Token ID");
const minPurchase = baseNumberSchema("Minimum purchase amount");
const maxPurchase = baseNumberSchema("Maximum purchase amount");
const createdAt = baseDateTimeSchema("Creation Date of the Phase");
const updatedAt = baseDateTimeSchema("Last Update Date of the Phase", true);
const deletedAt = baseDateTimeSchema("Deletion Date of the Phase", true);

export const icoPhaseSchema = {
  id,
  name,
  startDate,
  endDate,
  price,
  status,
  tokenId,
  minPurchase,
  maxPurchase,
  createdAt,
  updatedAt,
  deletedAt,
};

export const baseIcoPhaseSchema = {
  id,
  name,
  startDate,
  endDate,
  price,
  status,
  tokenId,
  minPurchase,
  maxPurchase,
  createdAt,
  updatedAt,
  deletedAt,
};

export const icoPhaseUpdateSchema = {
  type: "object",
  properties: {
    name,
    startDate,
    endDate,
    price,
    status,
    tokenId,
    minPurchase,
    maxPurchase,
  },
  required: [
    "name",
    "startDate",
    "endDate",
    "price",
    "status",
    "tokenId",
    "minPurchase",
    "maxPurchase",
  ],
};

export const icoPhaseStoreSchema = {
  description: `ICO Phase created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseIcoPhaseSchema,
      },
    },
  },
};
