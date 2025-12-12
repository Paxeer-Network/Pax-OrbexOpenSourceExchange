import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Deposits funds to a P2P offer",
  description: "Deposits funds to a specified P2P offer.",
  operationId: "depositToOffer",
  tags: ["P2P", "Offers"],
  requiresAuth: true,
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "ID of the offer to deposit",
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
              description: "Amount to deposit",
            },
          },
          required: ["amount"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Funds deposited successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
              },
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

    if (wallet.balance < body.amount) {
      throw new Error("Insufficient funds");
    }

    const balance = wallet.balance - body.amount;
    await wallet.update(
      {
        balance,
      },
      {
        transaction,
      }
    );

    await offer.update(
      {
        amount: offer.amount + body.amount,
        status: "ACTIVE",
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
        description: `P2P offer created: ${offer.id}`,
      },
      { transaction }
    );
  });

  return {
    message: "Funds deposited successfully",
  };
};
