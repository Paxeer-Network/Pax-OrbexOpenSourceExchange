import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific ICO phase",
  operationId: "deleteIcoPhase",
  tags: ["Admin","ICO", "Phases"],
  parameters: deleteRecordParams("ICO phase"),
  responses: deleteRecordResponses("ICO phase"),
  permission: "Access ICO Phase Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "icoPhase",
    id: params.id,
    query,
  });
};
