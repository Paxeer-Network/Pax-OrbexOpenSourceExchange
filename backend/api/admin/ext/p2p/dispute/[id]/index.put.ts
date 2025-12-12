import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { p2pDisputeUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific P2P Dispute",
  operationId: "updateP2pDispute",
  tags: ["Admin","P2P Disputes"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the P2P Dispute to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the P2P Dispute",
    content: {
      "application/json": {
        schema: p2pDisputeUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("P2P Dispute"),
  requiresAuth: true,
  permission: "Access P2P Dispute Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const updatedFields = {
    status: body.status,
    resolution: body.resolution,
  };

  return await updateRecord("p2pDispute", id, updatedFields);
};
