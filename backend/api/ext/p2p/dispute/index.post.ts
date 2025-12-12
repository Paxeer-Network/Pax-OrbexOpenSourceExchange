import { p2pDisputeStoreSchema, sendP2PDisputeOpenedEmail } from "./utils";
import { models } from "@b/db";
import { createError } from "@b/utils/error";
import { handleNotification } from "@b/utils/notifications";
import { storeRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Creates a dispute for a specific trade",
  description: "Allows a user to raise a dispute for an ongoing trade.",
  operationId: "createUserDispute",
  tags: ["P2P", "Disputes"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            tradeId: {
              type: "number",
              description: "ID of the trade involved in the dispute",
            },
            reason: { type: "string", description: "Reason for the dispute" },
          },
          required: ["tradeId", "reason"],
        },
      },
    },
  },
  responses: storeRecordResponses(p2pDisputeStoreSchema, "Dispute"),
};

export default async (data: Handler) => {
  const { body, user } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  try {
    const userPk = await models.user.findByPk(user.id);
    if (!userPk) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    const trade = await models.p2pTrade.findByPk(body.tradeId);
    if (!trade) {
      throw createError({
        statusCode: 404,
        message: "Trade not found",
      });
    }

    const dispute = await models.p2pDispute.create({
      tradeId: body.tradeId,
      raisedById: user.id,
      reason: body.reason,
      status: "PENDING",
    });

    const disputedUser = await models.user.findByPk(
      trade.userId === user.id ? trade.sellerId : trade.userId
    );

    if (disputedUser) {
      await sendP2PDisputeOpenedEmail(disputedUser, userPk, trade, body.reason);
      await handleNotification({
        userId: disputedUser.id,
        title: "Dispute raised",
        message: `A dispute has been raised for trade #${trade.id}`,
        type: "ACTIVITY",
      });
    }

    return {
      message: "Dispute created successfully",
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to create dispute: ${error.message}`,
    });
  }
};
