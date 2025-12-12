import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a specific Forex investment",
  operationId: "deleteForexInvestment",
  tags: ["Admin", "Forex", "Investments"],
  parameters: deleteRecordParams("Forex investment"),
  responses: deleteRecordResponses("Forex investment"),
  permission: "Access Forex Investment Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "forexInvestment",
    id: params.id,
    query,
  });
};
