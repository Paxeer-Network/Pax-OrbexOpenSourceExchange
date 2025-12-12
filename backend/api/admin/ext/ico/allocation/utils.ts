import { models } from "@b/db";
import {
  baseStringSchema,
  baseDateTimeSchema,
  baseEnumSchema,
  baseNumberSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the ICO Allocation");
const name = baseStringSchema("Name of the ICO Allocation", 191);
const percentage = baseNumberSchema("Percentage allocated");
const tokenId = baseStringSchema("ID of the associated ICO Token", 36);
const status = baseEnumSchema("Status of the ICO Allocation", [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
]);
const createdAt = baseDateTimeSchema("Creation Date of the ICO Allocation");
const updatedAt = baseDateTimeSchema(
  "Last Update Date of the ICO Allocation",
  true
);
const deletedAt = baseDateTimeSchema(
  "Deletion Date of the ICO Allocation",
  true
);

export const icoAllocationSchema = {
  id,
  name,
  percentage,
  tokenId,
  status,
  createdAt,
  updatedAt,
  deletedAt,
};

export const baseIcoAllocationSchema = {
  id,
  name,
  percentage,
  tokenId,
  status,
  createdAt,
  updatedAt,
  deletedAt,
};

export const icoAllocationUpdateSchema = {
  type: "object",
  properties: {
    name,
    percentage,
    tokenId,
    status,
  },
  required: ["name", "percentage", "tokenId", "status"],
};

export const icoAllocationStoreSchema = {
  description: `ICO Allocation created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseIcoAllocationSchema,
      },
    },
  },
};

export async function calculateCurrentAllocation(
  tokenId: string,
  t: any
): Promise<number> {
  const allocations = await models.icoAllocation.findAll({
    where: { tokenId },
    attributes: ["percentage"],
    transaction: t,
  });
  return allocations.reduce(
    (total, allocation) => total + allocation.percentage,
    0
  );
}
