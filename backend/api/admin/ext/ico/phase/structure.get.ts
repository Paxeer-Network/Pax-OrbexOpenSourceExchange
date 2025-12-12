// /api/icoPhases/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for ICO Phases",
  operationId: "getIcoPhaseStructure",
  tags: ["Admin","ICO Phases"],
  responses: {
    200: {
      description: "Form structure for managing ICO Phases",
      content: structureSchema,
    },
  },
  permission: "Access ICO Phase Management"
};

export const icoPhaseStructure = async () => {
  const tokens = await models.icoToken.findAll();

  const name = {
    type: "input",
    label: "Name",
    name: "name",
    placeholder: "Enter the phase name",
  };

  const startDate = {
    type: "datetime",
    label: "Start Date",
    name: "startDate",
    placeholder: "Select start date",
  };

  const endDate = {
    type: "datetime",
    label: "End Date",
    name: "endDate",
    placeholder: "Select end date",
  };

  const price = {
    type: "input",
    label: "Price",
    name: "price",
    placeholder: "Enter price per token",
    ts: "number",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "ACTIVE", label: "Active" },
      { value: "COMPLETED", label: "Completed" },
      { value: "REJECTED", label: "Rejected" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
    placeholder: "Select the phase status",
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

  const minPurchase = {
    type: "input",
    label: "Minimum Purchase",
    name: "minPurchase",
    placeholder: "Minimum purchase amount",
    ts: "number",
  };

  const maxPurchase = {
    type: "input",
    label: "Maximum Purchase",
    name: "maxPurchase",
    placeholder: "Maximum purchase amount",
    ts: "number",
  };

  return {
    name,
    startDate,
    endDate,
    price,
    status,
    tokenId,
    minPurchase,
    maxPurchase,
  };
};

export default async (): Promise<object> => {
  const {
    name,
    startDate,
    endDate,
    price,
    status,
    tokenId,
    minPurchase,
    maxPurchase,
  } = await icoPhaseStructure();

  return {
    get: [
      name,
      {
        type: "input",
        label: "Token",
        name: "token.currency, ' (', token.chain,')'",
        icon: "ph:wallet-light",
      },
      price,
      [minPurchase, maxPurchase],
      [startDate, endDate],
      status,
    ],
    set: [
      name,
      [tokenId, price],
      [minPurchase, maxPurchase],
      [startDate, endDate],
      status,
    ],
  };
};
