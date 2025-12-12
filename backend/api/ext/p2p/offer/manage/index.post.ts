import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Creates a new P2P offer",
  description: "Allows a user to create a new P2P trading offer.",
  operationId: "createUserOffer",
  tags: ["P2P", "Offers"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            paymentMethodId: {
              type: "string",
              description: "Payment method ID",
            },
            walletType: { type: "string", description: "Type of the wallet" },
            chain: {
              type: "string",
              description: "Blockchain chain if applicable",
              nullable: true,
            },
            currency: { type: "string", description: "Currency of the offer" },
            price: {
              type: "number",
              description: "Price per unit of currency",
            },
            minAmount: {
              type: "number",
              description: "Minimum transaction amount",
            },
            maxAmount: {
              type: "number",
              description: "Maximum transaction amount",
            },
          },
          required: [
            "walletType",
            "currency",
            "price",
            "paymentMethodId",
            "minAmount",
            "maxAmount",
          ],
        },
      },
    },
  },
  responses: {
    201: {
      description: "P2P offer created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "P2P offer created successfully",
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
  const { body, user } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  let currency;
  switch (body.walletType) {
    case "FIAT":
      currency = await models.currency.findOne({
        where: { id: body.currency, status: true },
      });
      if (!currency) {
        throw createError(400, "Currency not found");
      }
      break;
    case "SPOT":
      currency = await models.exchangeCurrency.findOne({
        where: { currency: body.currency, status: true },
      });
      if (!currency) {
        throw createError(400, "Currency not found");
      }
      break;
    case "ECO":
      currency = await models.ecosystemToken.findOne({
        where: { currency: body.currency, status: true },
      });
      if (!currency) {
        throw createError(400, "Currency not found");
      }
      break;
    default:
      throw createError(400, "Invalid wallet type");
  }

  await sequelize.transaction(async (transaction) => {
    const content = {
      userId: user.id,
      walletType: body.walletType,
      ...(body.walletType === "ECO" && body.chain && { chain: body.chain }),
      currency: body.currency,
      amount: 0,
      inOrder: 0,
      price: body.price,
      paymentMethodId: body.paymentMethodId,
      minAmount: body.minAmount,
      maxAmount: body.maxAmount,
    };

    // Create the offer
    return await models.p2pOffer.create(
      {
        ...content,
        status: "PENDING",
      },
      { transaction }
    );
  });

  return {
    message: "P2P offer created successfully",
  };
};
