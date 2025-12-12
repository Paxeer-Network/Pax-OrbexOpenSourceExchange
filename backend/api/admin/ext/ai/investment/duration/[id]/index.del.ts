import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a specific AI Investment Duration",
  operationId: "deleteAIInvestmentDuration",
  tags: ["Admin", "AI Investment Duration"],
  parameters: deleteRecordParams("AI Investment Duration"),
  responses: deleteRecordResponses("AI Investment Duration"),
  permission: "Access AI Investment Duration Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "aiInvestmentDuration",
    id: params.id,
    query,
  });
};
