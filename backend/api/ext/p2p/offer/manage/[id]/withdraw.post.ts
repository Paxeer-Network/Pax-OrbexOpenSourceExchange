import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Withdraws an amount from an existing P2P offer",
  description:
    "Allows a user to withdraw a specified amount from an active P2P trading offer.",
  operationId: "withdrawFromUserOffer",
  tags: ["P2P", "Offers"],
  requiresAuth: true,
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the offer to withdraw from",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            amount: {
              type: "number",
              description: "Amount to withdraw",
            },
          },
          required: ["amount"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Amount withdrawn from P2P offer successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "number", description: "ID of the offer" },
              status: { type: "string", description: "Status of the offer" },
              // Additional properties as needed
            },
          },
        },
      },
    },
    401: {
      description: "Unauthorized, user must be authenticated",
    },
    500: {
      description: "Internal server error",
    },
  },
};

export default async (data: Handler) => {
  const { body, user, params } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const { id } = params;

  await sequelize.transaction(async (transaction) => {
    const offer = await models.p2pOffer.findByPk(id, { transaction });

    if (!offer) {
      throw createError({ statusCode: 404, message: "Offer not found" });
    }

    if (offer.status === "CANCELLED") {
      throw createError({ statusCode: 400, message: "Offer is cancelled" });
    }

    if (offer.amount < body.amount) {
      throw createError({
        statusCode: 400,
        message: "Insufficient offer amount",
      });
    }

    const wallet = await models.wallet.findOne({
      where: {
        userId: user.id,
        type: offer.walletType,
        currency: offer.currency,
      },
      transaction,
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const balance = wallet.balance + body.amount;
    await wallet.update(
      {
        balance,
      },
      {
        transaction,
      }
    );

    const amount = offer.amount - body.amount;
    const status = amount === 0 ? "COMPLETED" : "ACTIVE";
    await offer.update(
      {
        amount,
        status,
      },
      {
        transaction,
      }
    );

    // Log the transaction
    await models.transaction.create(
      {
        userId: user.id,
        walletId: wallet.id,
        type: "P2P_OFFER_TRANSFER",
        status: "COMPLETED",
        amount: body.amount,
        description: `P2P offer withdrawn: ${offer.id}`,
      },
      { transaction }
    );
  });

  return {
    status: "Amount withdrawn successfully",
  };
};
