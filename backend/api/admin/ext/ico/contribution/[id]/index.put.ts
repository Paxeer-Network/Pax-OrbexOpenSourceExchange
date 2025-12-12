import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { icoContributionUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific ICO Contribution",
  operationId: "updateIcoContribution",
  tags: ["Admin","ICO Contributions"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "ID of the ICO Contribution to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the ICO Contribution",
    content: {
      "application/json": {
        schema: icoContributionUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("ICO Contribution"),
  requiresAuth: true,
  permission: "Access ICO Contribution Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const { userId, phaseId, amount, status } = body;

  return await updateRecord("icoContribution", id, {
    userId,
    phaseId,
    amount,
    status,
  });
};
