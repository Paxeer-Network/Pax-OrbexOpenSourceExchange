import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";
import { sendP2PDisputeOpenedEmail } from "../../utils";
import {
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { sendMessageToRoute } from "@b/handler/Websocket";
import { handleNotification } from "@b/utils/notifications";

export const metadata: OperationObject = {
  summary: "Disputes a P2P trade",
  description: "Initiates a dispute for a specified P2P trade.",
  operationId: "disputeTrade",
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
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            reason: { type: "string", description: "Reason for the dispute" },
          },
          required: ["reason"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Dispute initiated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", description: "ID of the trade" },
              status: { type: "string", description: "Status of the trade" },
              reason: { type: "string", description: "Reason for the dispute" },
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
  const { params, body, user } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const { id } = params;
  const { reason } = body;

  try {
    const result = await disputeTradeQuery(id, reason, user.id);
    return result;
  } catch (error) {
    if (error.statusCode) {
      return { error: error.message };
    }
    return { error: "Failed to initiate dispute" };
  }
};

async function disputeTradeQuery(id: string, reason: string, userId: string) {
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
    if (trade.status !== "PAID")
      throw createError({
        statusCode: 400,
        message: "Trade can only be disputed if it is paid",
      });

    const dispute = await models.p2pDispute.create(
      {
        tradeId: trade.id,
        raisedById: userId,
        reason,
        status: "PENDING",
      },
      { transaction }
    );

    await trade.update(
      {
        status: "DISPUTE_OPEN",
      },
      {
        transaction,
      }
    );

    const disputer = userId === trade.userId ? trade.user : trade.seller;
    const disputed = userId === trade.userId ? trade.seller : trade.user;
    try {
      await sendP2PDisputeOpenedEmail(disputed, disputer, trade, reason);
      await handleNotification({
        userId: disputed.id,
        title: "Dispute raised",
        message: `A dispute has been raised for trade #${trade.id}`,
        type: "ACTIVITY",
      });
    } catch (error) {
      console.error("Error sending dispute email", error);
    }

    sendMessageToRoute(
      `/api/ext/p2p/trade`,
      { id },
      {
        method: "update",
        data: {
          status: "DISPUTE_OPEN",
          p2pDisputes: [
            {
              ...dispute.get({ plain: true }),
              raisedBy: disputer,
            },
          ],
          updatedAt: new Date(),
        },
      }
    );

    return { id: trade.id, status: "DISPUTE_OPEN", reason };
  });
}
