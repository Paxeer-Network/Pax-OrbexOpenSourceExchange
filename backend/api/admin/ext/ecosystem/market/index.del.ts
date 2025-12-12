// /server/api/ecosystem/markets/delete.del.ts

import { models } from "@b/db";
import { deleteAllMarketData } from "@b/utils/eco/scylla/queries";
import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Bulk deletes ecosystem markets by IDs",
  operationId: "bulkDeleteEcosystemMarkets",
  tags: ["Admin", "Ecosystem", "Market"],
  parameters: commonBulkDeleteParams("Ecosystem Markets"),
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              items: { type: "string" },
              description: "Array of ecosystem market IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("Ecosystem Markets"),
  requiresAuth: true,
  permission: "Access Ecosystem Market Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;

  const markets = await models.ecosystemMarket.findAll({
    where: { id: ids },
    attributes: ["currency"],
  });

  if (!markets.length) {
    throw new Error("Markets not found");
  }

  const postDelete = async () => {
    for (const market of markets) {
      await deleteAllMarketData(market.currency);
    }
  };

  return handleBulkDelete({
    model: "ecosystemMarket",
    ids: ids,
    query: { ...query, force: true as any },
    postDelete,
  });
};
