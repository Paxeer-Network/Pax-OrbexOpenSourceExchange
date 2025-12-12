import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a specific FAQ",
  operationId: "deleteFAQ",
  tags: ["Admin", "FAQ"],
  parameters: deleteRecordParams("FAQ"),
  responses: deleteRecordResponses("FAQ"),
  permission: "Access FAQ Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "faq",
    id: params.id,
    query,
  });
};
