import { models, sequelize } from "@b/db";
import {
  sendP2PDisputeResolutionEmail,
  sendP2PDisputeResolvingEmail,
} from "../utils";
import {
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { sendMessageToRoute } from "@b/handler/Websocket";

export const metadata = {
  summary: "Resolve a P2P dispute",
  description: "Updates the status and resolution of a specified P2P dispute.",
  operationId: "resolveDispute",
  tags: ["Admin","P2P", "Dispute"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "number", description: "Dispute ID" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resolution: {
              type: "string",
              description: "Resolution details for the dispute",
            },
          },
          required: ["resolution"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Dispute resolved successfully",
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
  const { params, body } = data;
  const { id } = params;
  const { resolution } = body;

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
              attributes: ["id", "email", "lastName", "avatar", "firstName"],
            },
            {
              model: models.user,
              as: "seller",
              attributes: ["id", "email", "lastName", "avatar", "firstName"],
            },
          ],
        },
        {
          model: models.user,
          as: "raisedBy",
          attributes: ["id", "email", "firstName", "lastName", "avatar"],
        },
      ],
      transaction,
    });

    if (!dispute) {
      throw new Error("Dispute not found");
    }

    await dispute.update(
      {
        resolution,
        status: "OPEN",
      },
      {
        transaction,
      }
    );

    try {
      await sendP2PDisputeResolutionEmail(
        dispute.raisedBy,
        dispute.trade,
        resolution
      );
      const otherParty =
        dispute.trade.user.id === dispute.raisedBy.id
          ? dispute.trade.seller
          : dispute.trade.user;
      await sendP2PDisputeResolvingEmail(otherParty, dispute.trade);
    } catch (error) {
      console.error(`Failed to send email: ${error.message}`);
    }

    sendMessageToRoute(
      `/api/ext/p2p/trade`,
      { id },
      {
        data: {
          p2pDisputes: [
            {
              ...dispute.get({ plain: true }),
              resolution,
              status: "OPEN",
            },
          ],
          updatedAt: new Date(),
        },
      }
    );
  });

  return { message: "Dispute resolved successfully" };
};
