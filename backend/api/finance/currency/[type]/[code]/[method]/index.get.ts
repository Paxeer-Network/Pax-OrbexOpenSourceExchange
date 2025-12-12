import ExchangeManager from "@b/utils/exchange";
// /server/api/currencies/show.get.ts

import { baseCurrencySchema, baseResponseSchema } from "../../../utils";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { createError } from "@b/utils/error";
import { sanitizeErrorMessage } from "@b/api/exchange/utils";
import { models } from "@b/db";
import { getSpotWalletByUserIdAndCurrency } from "@b/utils/spot/wallet";

export const metadata: OperationObject = {
  summary: "Retrieves a single currency by its ID",
  description: "This endpoint retrieves a single currency by its ID.",
  operationId: "getCurrencyById",
  tags: ["Finance", "Currency"],
  requiresAuth: true,
  parameters: [
    {
      index: 0,
      name: "type",
      in: "path",
      required: true,
      schema: {
        type: "string",
        enum: ["SPOT"],
      },
    },
    {
      index: 1,
      name: "code",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
    {
      index: 2,
      name: "method",
      in: "path",
      required: false,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "Currency retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              ...baseResponseSchema,
              data: {
                type: "object",
                properties: baseCurrencySchema,
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Currency"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { user, params } = data;
  if (!user?.id) throw createError(401, "Unauthorized");

  const { type, code, method } = params;
  if (!type || !code) throw createError(400, "Invalid type or code");

  if (type !== "SPOT") throw createError(400, "Invalid type");

  // For SPOT deposits, use ECO-style approach - return user's generated wallet address for this network
  // This replaces the exchange.fetchDepositAddress calls that were causing API errors
  
  try {
    // Get or create user's SPOT wallet for this currency (auto-creation like ECO)
    const wallet = await getSpotWalletByUserIdAndCurrency(user.id, code);

    if (!wallet || !wallet.address) {
      throw createError(404, "SPOT wallet not found for this currency");
    }

    const addresses = JSON.parse(wallet.address as any);
    const networkAddress = addresses[method];

    if (!networkAddress) {
      throw createError(404, "Address not found for this network");
    }

    // Return the wallet address in the format expected by the frontend
    return {
      address: networkAddress.address,
      network: method,
      trx: true,
    };
  } catch (error) {
    throw createError(404, error.message || "Address not found");
  }
};

export function handleNetworkMapping(network: string) {
  switch (network) {
    case "TRON":
      return "TRX";
    case "ETH":
      return "ERC20";
    case "BSC":
      return "BEP20";
    case "POLYGON":
      return "MATIC";
    default:
      return network;
  }
}

export function handleNetworkMappingReverse(network: string) {
  switch (network) {
    case "TRX":
      return "TRON";
    case "ERC20":
      return "ETH";
    case "BEP20":
      return "BSC";
    case "MATIC":
      return "POLYGON";
    default:
      return network;
  }
}
