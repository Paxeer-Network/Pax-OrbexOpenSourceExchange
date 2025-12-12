import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific ICO token",
  operationId: "deleteIcoToken",
  tags: ["Admin","ICO", "Tokens"],
  parameters: deleteRecordParams("ICO token"),
  responses: deleteRecordResponses("ICO token"),
  permission: "Access ICO Token Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "icoToken",
    id: params.id,
    query,
  });
};
