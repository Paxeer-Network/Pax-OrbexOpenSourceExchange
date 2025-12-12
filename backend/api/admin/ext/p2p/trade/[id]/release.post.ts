import { handleTradeRelease } from "@b/api/ext/p2p/trade/[id]/release.post";
import {
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";

export const metadata = {
  summary: "Release a P2P trade",
  description:
    "Finalizes a specified P2P trade and updates its status to 'COMPLETED'.",
  operationId: "releaseTrade",
  tags: ["Admin","P2P", "Trade"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "number", description: "Trade ID" },
    },
  ],
  responses: {
    200: {
      description: "Trade released successfully",
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
    404: notFoundMetadataResponse("P2P Trade"),
    500: serverErrorResponse,
  },
  permission: "Access P2P Trade Management"
};

export default async (data: Handler) => {
  const { params } = data;
  const { id } = params;

  await handleTradeRelease(id);

  return {
    message: "Trade released successfully",
  };
};
