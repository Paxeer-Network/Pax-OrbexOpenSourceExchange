import { models, sequelize } from "@b/db";
import { sendMessageToRoute } from "@b/handler/Websocket";
import { createError } from "@b/utils/error";
import {
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Refunds a P2P trade",
  description:
    "Processes a refund for a trade that is in a dispute or under escrow review.",
  operationId: "refundTrade",
  tags: ["P2P", "Trade"],
  requiresAuth: true,
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", description: "ID of the trade" },
    },
  ],
  responses: {
    200: {
      description: "Trade refunded successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", description: "ID of the trade" },
              status: { type: "string", description: "Status of the trade" },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Trade"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { params, user } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const { id } = params;

  try {
    const result = await handleTradeRefund(id, user.id);
    return result;
  } catch (error) {
    if (error.statusCode) {
      return { error: error.message };
    }
    return { error: "Failed to refund trade" };
  }
};

async function handleTradeRefund(id: string, userId: string) {
  return await sequelize.transaction(async (transaction) => {
    const trade = await models.p2pTrade.findOne({
      where: { id, userId },
      transaction,
    });

    if (!trade) {
      throw createError({ statusCode: 404, message: "Trade not found" });
    }
    if (!["DISPUTE_OPEN", "ESCROW_REVIEW"].includes(trade.status)) {
      throw createError({
        statusCode: 400,
        message:
          "Trade can only be refunded if it is in a dispute or under escrow review",
      });
    }

    await models.p2pTrade.update(
      {
        status: "REFUNDED",
      },
      {
        where: { id: trade.id },
        transaction,
      }
    );

    sendMessageToRoute(
      `/api/ext/p2p/trade`,
      { id },
      {
        method: "update",
        data: {
          status: "REFUNDED",
          updatedAt: new Date(),
        },
      }
    );

    return { id: trade.id, status: "REFUNDED" };
  });
}
