import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { p2pReviewUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific P2P Review",
  operationId: "updateP2pReview",
  tags: ["Admin","P2P Review"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the P2P Review to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the P2P Review",
    content: {
      "application/json": {
        schema: p2pReviewUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("P2P Review"),
  requiresAuth: true,
  permission: "Access P2P Review Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const updatedFields = {
    rating: body.rating,
    comment: body.comment,
  };

  return await updateRecord("p2pReview", id, updatedFields);
};
