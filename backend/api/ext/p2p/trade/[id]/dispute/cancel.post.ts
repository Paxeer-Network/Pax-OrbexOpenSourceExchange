import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";
import { sendP2PDisputeClosingEmail } from "../../utils";
import {
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { sendMessageToRoute } from "@b/handler/Websocket";
import { handleNotification } from "@b/utils/notifications";

export const metadata: OperationObject = {
  summary: "Cancels a P2P trade dispute",
  description: "Cancels an existing dispute on a P2P trade.",
  operationId: "cancelDispute",
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
      description: "Dispute cancelled successfully",
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
    const result = await cancelDisputeTradeQuery(id, user.id);
    return result;
  } catch (error) {
    if (error.statusCode) {
      return { error: error.message };
    }
    return { error: "Failed to cancel dispute" };
  }
};

async function cancelDisputeTradeQuery(id: string, userId: any = null) {
  return await sequelize.transaction(async (transaction) => {
    const trade = await models.p2pTrade.findOne({
      where: { id },
      include: [
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
      transaction,
    });

    if (!trade)
      throw createError({ statusCode: 404, message: "Trade not found" });
    if (trade.status !== "DISPUTE_OPEN")
      throw createError({
        statusCode: 400,
        message: "Trade can only be cancelled if it is in a dispute",
      });

    const dispute = await models.p2pDispute.findOne({
      where: { tradeId: trade.id },
      include: [
        {
          model: models.user,
          as: "raisedBy",
          attributes: ["id", "email", "firstName", "lastName"],
        },
      ],
      transaction,
    });

    if (!dispute)
      throw createError({ statusCode: 404, message: "Dispute not found" });

    if (userId && userId !== trade.userId && userId !== trade.sellerId) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    if (userId && userId === trade.userId && userId !== dispute.raisedById) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    if (userId && userId === trade.sellerId && userId !== dispute.raisedById) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    await dispute.update(
      {
        status: "CANCELLED",
      },
      {
        transaction,
      }
    );

    await trade.update(
      {
        status: "PAID",
      },
      {
        transaction,
      }
    );

    try {
      const user = trade.user;
      const seller = trade.seller;
      await sendP2PDisputeClosingEmail(user, trade);
      await sendP2PDisputeClosingEmail(seller, trade);
      await handleNotification({
        userId: user.id,
        title: "Dispute closed",
        message: `The dispute for trade #${trade.id} has been closed`,
        type: "ACTIVITY",
      });
      await handleNotification({
        userId: seller.id,
        title: "Dispute closed",
        message: `The dispute for trade #${trade.id} has been closed`,
        type: "ACTIVITY",
      });
    } catch (error) {
      console.error("Error sending dispute closing email", error);
    }

    sendMessageToRoute(
      `/api/ext/p2p/trade`,
      { id },
      {
        method: "update",
        data: {
          status: "PAID",
          p2pDisputes: [
            {
              ...dispute.get({ plain: true }),
              status: "CANCELLED",
            },
          ],
          updatedAt: new Date(),
        },
      }
    );

    return { id: trade.id, status: "PAID" };
  });
}
