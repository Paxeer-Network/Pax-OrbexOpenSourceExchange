import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";
import { sendP2PTradePaymentConfirmationEmail } from "../utils";
import {
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { sendMessageToRoute } from "@b/handler/Websocket";
import { handleNotification } from "@b/utils/notifications";

export const metadata: OperationObject = {
  summary: "Marks a P2P trade as paid",
  description:
    "Updates the status of a P2P trade to paid after payment confirmation.",
  operationId: "markTradeAsPaid",
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
            txHash: {
              type: "string",
              description: "Transaction hash of the payment",
            },
          },
          required: ["txHash"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Trade marked as paid successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", description: "ID of the trade" },
              status: { type: "string", description: "Status of the trade" },
              txHash: {
                type: "string",
                description: "Transaction hash of the payment",
              },
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
  const { txHash } = body;

  try {
    const result = await handleTradePayment(id, user.id, txHash);
    return result;
  } catch (error) {
    if (error.statusCode) {
      return { error: error.message };
    }
    return { error: "Failed to mark trade as paid" };
  }
};

async function handleTradePayment(id: string, userId: string, txHash: string) {
  return await sequelize.transaction(async (transaction) => {
    const trade = await models.p2pTrade.findOne({
      where: { id, userId },
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
    if (trade.status !== "PENDING")
      throw createError({
        statusCode: 400,
        message: "Trade can only be marked as paid if it is pending",
      });

    await trade.update(
      {
        status: "PAID",
        txHash,
      },
      {
        transaction,
      }
    );

    try {
      const buyer = trade.user;
      const seller = trade.seller;
      await sendP2PTradePaymentConfirmationEmail(seller, buyer, trade, txHash);
      await handleNotification({
        userId: seller.id,
        title: "Trade Paid",
        message: `Trade with ${buyer.firstName} ${buyer.lastName} has been paid`,
        type: "ACTIVITY",
      });
    } catch (error) {
      console.error("Error sending email", error);
    }

    sendMessageToRoute(
      `/api/ext/p2p/trade`,
      { id },
      {
        method: "update",
        data: {
          status: "PAID",
          txHash,
          updatedAt: new Date(),
        },
      }
    );

    return { id: trade.id, status: "PAID", txHash };
  });
}
