import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific ICO project",
  operationId: "deleteIcoProject",
  tags: ["Admin","ICO", "Projects"],
  parameters: deleteRecordParams("ICO project"),
  responses: deleteRecordResponses("ICO project"),
  permission: "Access ICO Project Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "icoProject",
    id: params.id,
    query,
  });
};
