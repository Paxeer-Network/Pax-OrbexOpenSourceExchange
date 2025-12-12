import { models } from "@b/db";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Fetch a single Forex transaction",
  description:
    "Retrieves detailed information about a specific Forex transaction.",
  operationId: "getForexTransaction",
  tags: ["Admin", "Forex"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "number", description: "Transaction ID" },
    },
  ],
  responses: {
    200: {
      description: "Forex transaction retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "number", description: "Transaction ID" },
              type: { type: "string", description: "Transaction type" },
              amount: { type: "number", description: "Amount transacted" },
              currency: { type: "string", description: "Currency used" },
              user: {
                type: "object",
                properties: {
                  firstName: {
                    type: "string",
                    description: "User's first name",
                  },
                  lastName: { type: "string", description: "User's last name" },
                  id: { type: "string", description: "User identifier" },
                  avatar: { type: "string", description: "User avatar" },
                },
              },
              wallet: {
                type: "object",
                properties: {
                  id: { type: "string", description: "Wallet identifier" },
                  currency: { type: "string", description: "Wallet currency" },
                },
              },
            },
          },
        },
      },
    },
    404: {
      description: "Forex transaction not found",
    },
    500: {
      description: "Internal server error",
    },
  },
  permission: "Access Forex Signal Management",
};

export default async (data: Handler) => {
  const { params } = data;
  const { id } = params;

  const transaction = await models.transaction.findByPk(id, {
    include: [
      {
        model: models.user,
        as: "user",
        attributes: ["firstName", "lastName", "id", "avatar"],
      },
      {
        model: models.wallet,
        as: "wallet",
        attributes: ["id", "currency"],
      },
    ],
  });
  if (!transaction) {
    throw createError({ statusCode: 404, message: "Transaction not found" });
  }
  return transaction;
};
