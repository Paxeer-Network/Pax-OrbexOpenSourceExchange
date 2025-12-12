import { createError } from "@b/utils/error";
import { unlockAddress } from "../../wallet/utils";

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Unlocks a specific deposit address",
  description:
    "Allows administrative unlocking of a custodial wallet deposit address to make it available for reuse.",
  operationId: "unlockDepositAddress",
  tags: ["Wallet", "Deposit"],
  parameters: [
    {
      name: "address",
      in: "query",
      description: "The deposit address to unlock",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "Deposit address unlocked successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description:
                  "Success message indicating the address has been unlocked.",
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Wallet"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { query, user } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { address } = query;

  unlockAddress(address);
  return { message: "Address unlocked successfully" };
};
