import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { icoTokenUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific ICO Token",
  operationId: "updateIcoToken",
  tags: ["Admin", "ICO Tokens"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the ICO Token to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the ICO Token",
    content: {
      "application/json": {
        schema: icoTokenUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("ICO Token"),
  requiresAuth: true,
  permission: "Access ICO Token Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const {
    name,
    chain,
    currency,
    purchaseCurrency,
    purchaseWalletType,
    address,
    totalSupply,
    description,
    image,
    status,
    projectId,
  } = body;

  return await updateRecord("icoToken", id, {
    name,
    chain: chain.toUpperCase(),
    currency: currency.toUpperCase(),
    purchaseCurrency: purchaseCurrency.toUpperCase(),
    purchaseWalletType,
    address,
    totalSupply,
    description,
    image,
    status,
    projectId,
  });
};
