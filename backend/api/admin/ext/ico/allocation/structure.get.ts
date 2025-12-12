// /api/icoAllocations/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for ICO Allocations",
  operationId: "getIcoAllocationStructure",
  tags: ["Admin", "ICO Allocations"],
  responses: {
    200: {
      description: "Form structure for managing ICO Allocations",
      content: structureSchema,
    },
  },
  permission: "Access ICO Allocation Management",
};

export const icoAllocationStructure = async () => {
  const tokens = await models.icoToken.findAll();
  const name = {
    type: "input",
    label: "Name",
    name: "name",
    placeholder: "Enter the allocation name",
  };

  const percentage = {
    type: "input",
    label: "Percentage",
    name: "percentage",
    placeholder: "Enter the percentage of the allocation",
    ts: "number",
  };

  const tokenId = {
    type: "select",
    label: "Token ID",
    name: "tokenId",
    options: tokens.map((token) => ({
      value: token.id,
      label: `${token.currency} (${token.chain})`,
    })),
    placeholder: "Select the token",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CANCELLED", label: "Cancelled" },
      { value: "REJECTED", label: "Rejected" },
    ],
    placeholder: "Select the status of the allocation",
  };

  return {
    name,
    percentage,
    tokenId,
    status,
  };
};

export default async (): Promise<object> => {
  const { name, percentage, tokenId, status } = await icoAllocationStructure();

  return {
    get: [
      [name, percentage],
      {
        type: "input",
        label: "Token",
        name: "token.currency, ' (', token.chain,')'",
        icon: "ph:wallet-light",
      },
      status,
    ],
    set: [[name, tokenId], percentage, status],
  };
};
