import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";
import { sendP2PTradeCancellationEmail } from "../utils";
import {
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { sendMessageToRoute } from "@b/handler/Websocket";
import { handleNotification } from "@b/utils/notifications";

export const metadata: OperationObject = {
  summary: "Cancels a P2P trade",
  description: "Allows a user to cancel a pending P2P trade.",
  operationId: "cancelTrade",
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
      description: "Trade cancelled successfully",
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
    const result = await handleTradeCancellation(id);
    return result;
  } catch (error) {
    if (error.message === "Trade not found") {
      return { error: "Trade not found" };
    } else if (
      error.message === "Trade can only be cancelled if it is pending"
    ) {
      return { error: "Trade can only be cancelled if it is pending" };
    } else {
      return { error: "Failed to cancel trade" };
    }
  }
};

export async function handleTradeCancellation(id: string, isAdmin = false) {
  const trade = await models.p2pTrade.findOne({
    where: { id },
    include: [
      { model: models.p2pOffer, as: "offer" },
      {
        model: models.user,
        as: "user",
        attributes: ["id", "email", "firstName", "lastName"],
      },
      {
        model: models.user,
        as: "seller",
        attributes: ["id", "email", "firstName", "lastName"],
      },
    ],
  });
  if (!trade) throw new Error("Trade not found");

  await sequelize.transaction(async (transaction) => {
    if (trade.status !== "PENDING" && !isAdmin)
      throw new Error("Trade can only be cancelled if it is pending");

    await models.p2pOffer.update(
      {
        inOrder: sequelize.literal(`inOrder - ${trade.amount}`),
      },
      {
        where: { id: trade.offerId },
        transaction,
      }
    );

    await trade.update(
      {
        status: "CANCELLED",
      },
      {
        transaction,
      }
    );

    await models.p2pDispute.destroy({
      where: { tradeId: trade.id },
      transaction,
    });

    await models.p2pCommission.destroy({
      where: { tradeId: trade.id },
      transaction,
    });

    await models.p2pEscrow.destroy({
      where: { tradeId: trade.id },
      transaction,
    });
  });

  try {
    const user = trade.user;
    const seller = trade.seller;
    await sendP2PTradeCancellationEmail(user, trade);
    await sendP2PTradeCancellationEmail(seller, trade);
    await handleNotification({
      userId: trade.userId,
      title: "Trade Cancelled",
      message: `Trade #${trade.id} has been cancelled`,
      type: "ACTIVITY",
    });
    await handleNotification({
      userId: trade.sellerId,
      title: "Trade Cancelled",
      message: `Trade #${trade.id} has been cancelled`,
      type: "ACTIVITY",
    });
  } catch (error) {
    throw new Error("Failed to send email");
  }

  sendMessageToRoute(
    `/api/ext/p2p/trade`,
    { id },
    {
      method: "update",
      data: {
        status: trade.status,
        updatedAt: new Date(),
      },
    }
  );

  return { id: trade.id, status: trade.status };
}
