import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";
import {
  sendP2PTradeSaleConfirmationEmail,
  sendP2POfferAmountDepletionEmail,
} from "./utils";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { handleNotification } from "@b/utils/notifications";

export const metadata: OperationObject = {
  summary: "Initiates a new P2P trade",
  description: "Creates a new trade for a specified offer by a user.",
  operationId: "createUserTrade",
  tags: ["P2P", "Trade"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            offerId: { type: "string", description: "ID of the P2P offer" },
            amount: { type: "number", description: "Amount to trade" },
          },
          required: ["offerId", "amount"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Trade initiated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", description: "Trade ID" },
              status: {
                type: "string",
                description: "Current status of the trade",
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
  const { body, user } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { offerId, amount } = body;

  if (!offerId || !amount) {
    throw createError({
      statusCode: 400,
      message: "Offer ID and amount are required",
    });
  }

  if (amount <= 0) {
    throw createError({
      statusCode: 400,
      message: "Amount must be greater than 0",
    });
  }

  return await sequelize.transaction(async (transaction) => {
    const offer = await models.p2pOffer.findByPk(offerId, { transaction });
    if (!offer)
      throw createError({ statusCode: 404, message: "Offer not found" });

    const remainingAmount = offer.amount - offer.inOrder;
    if (amount > remainingAmount)
      throw createError({
        statusCode: 400,
        message: `Amount exceeds remaining offer amount of ${remainingAmount}`,
      });

    const trade = await models.p2pTrade.create(
      {
        userId: user.id,
        sellerId: offer.userId,
        offerId,
        amount,
        status: "PENDING",
      },
      { transaction }
    );

    let status = offer.status;
    if (offer.amount === offer.inOrder + amount) {
      status = "COMPLETED";
    }

    await offer.update(
      {
        status,
        inOrder: offer.inOrder + amount,
      },
      {
        transaction,
      }
    );

    try {
      const seller = await models.user.findByPk(offer.userId, { transaction });
      if (!seller)
        throw createError({ statusCode: 404, message: "Seller not found" });
      if (status === "COMPLETED") {
        await sendP2POfferAmountDepletionEmail(seller, offer, 0);
        await handleNotification({
          userId: seller.id,
          title: "Offer Completed",
          message: `Offer #${offer.id} has been completed`,
          type: "ACTIVITY",
        });
      }

      const buyer = await models.user.findByPk(user.id, { transaction });

      await sendP2PTradeSaleConfirmationEmail(seller, buyer, trade, offer);
      await handleNotification({
        userId: user.id,
        title: "Trade Initiated",
        message: `Trade with ${seller.firstName} ${seller.lastName} has been initiated`,
        type: "ACTIVITY",
      });
    } catch (error) {
      console.error(error);
    }
    return trade;
  });
};
