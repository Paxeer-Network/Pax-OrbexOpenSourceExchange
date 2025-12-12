import { models } from "@b/db";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
  parseFilterParam,
} from "@b/utils/query";
import { crudParameters, paginationSchema } from "@b/utils/constants";

export const metadata: OperationObject = {
  summary: "List all Forex transactions",
  description:
    "Retrieves a paginated list of all Forex transactions processed.",
  operationId: "getForexTransactions",
  tags: ["Admin","Forex"],
  parameters: [
    ...crudParameters, // Includes pagination and filtering parameters
    {
      name: "type",
      in: "query",
      description: "Filter by transaction type",
      schema: {
        type: "string",
        enum: ["FOREX_DEPOSIT", "FOREX_WITHDRAW"],
      },
    },
  ],
  responses: {
    200: {
      description: "Forex transactions retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number", description: "Transaction ID" },
                    type: { type: "string", description: "Transaction type" },
                    amount: {
                      type: "number",
                      description: "Amount transacted",
                    },
                    currency: { type: "string", description: "Currency used" },
                    user: {
                      type: "object",
                      properties: {
                        firstName: {
                          type: "string",
                          description: "User's first name",
                        },
                        lastName: {
                          type: "string",
                          description: "User's last name",
                        },
                        id: { type: "string", description: "User identifier" },
                        avatar: { type: "string", description: "User avatar" },
                      },
                    },
                    wallet: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          description: "Wallet identifier",
                        },
                        currency: {
                          type: "string",
                          description: "Wallet currency",
                        },
                      },
                    },
                  },
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Transactions"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access Forex Signal Management",
};

export default async (data) => {
  const { query } = data;

  return getFiltered({
    model: models.transaction,
    query,
    sortField: query.sortField || "createdAt",
    customFilterHandler: (filters) => {
      // Parse and handle custom filters if necessary
      if (filters.type) {
        filters.type = parseFilterParam(filters.type, [
          "FOREX_DEPOSIT",
          "FOREX_WITHDRAW",
        ]);
      }
      return filters;
    },
    includeModels: [
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
};
