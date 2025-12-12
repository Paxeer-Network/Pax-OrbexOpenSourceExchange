import { models, sequelize } from "@b/db";
import { sendP2PDisputeClosingEmail } from "../utils";
import {
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { sendMessageToRoute } from "@b/handler/Websocket";

export const metadata = {
  summary: "Close a P2P dispute",
  description:
    "Updates the status of a specified P2P dispute to RESOLVED and closes the dispute.",
  operationId: "closeDispute",
  tags: ["Admin","P2P", "Dispute"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "number", description: "Dispute ID" },
    },
  ],
  responses: {
    200: {
      description: "Dispute closed successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Dispute"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access P2P Dispute Management",
};

export default async (data: Handler) => {
  const { params } = data;
  const { id } = params;

  await sequelize.transaction(async (transaction) => {
    const dispute = await models.p2pDispute.findByPk(id, {
      include: [
        {
          model: models.p2pTrade,
          as: "trade",
          include: [
            {
              model: models.user,
              as: "user",
              attributes: ["id", "firstName", "lastName", "avatar", "email"],
            },
            {
              model: models.user,
              as: "seller",
              attributes: ["id", "firstName", "lastName", "avatar", "email"],
            },
          ],
        },
        {
          model: models.user,
          as: "raisedBy",
          attributes: ["id", "email", "firstName", "lastName"],
        },
      ],
      transaction,
    });

    if (!dispute) throw new Error("Dispute not found");

    if (dispute.trade.status === "DISPUTE_OPEN") {
      await models.p2pTrade.update(
        {
          status: "PAID",
        },
        {
          where: { id: dispute.trade.id },
          transaction,
        }
      );
    }

    await dispute.update(
      {
        status: "RESOLVED",
      },
      {
        transaction,
      }
    );

    try {
      const user = dispute.trade.user;
      const seller = dispute.trade.seller;

      await sendP2PDisputeClosingEmail(user, dispute.trade);
      await sendP2PDisputeClosingEmail(seller, dispute.trade);
    } catch (error) {
      console.error(`Failed to send P2PDisputeClosing email:`, error);
    }

    sendMessageToRoute(
      `/api/ext/p2p/trade`,
      { id },
      {
        data: {
          status: "PAID",
          p2pDisputes: [
            {
              ...dispute.get({ plain: true }),
              status: "RESOLVED",
            },
          ],
          updatedAt: new Date(),
        },
      }
    );
  });

  return {
    message: "Dispute closed successfully",
  };
};
