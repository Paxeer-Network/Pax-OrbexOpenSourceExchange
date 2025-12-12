import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific ICO allocation",
  operationId: "deleteIcoAllocation",
  tags: ["Admin","ICO", "Allocations"],
  parameters: deleteRecordParams("ICO allocation"),
  responses: deleteRecordResponses("ICO allocation"),
  permission: "Access ICO Allocation Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "icoAllocation",
    id: params.id,
    query,
  });
};
