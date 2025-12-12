// /server/api/ico/projects/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes ICO projects by IDs",
  operationId: "bulkDeleteIcoProjects",
  tags: ["Admin","ICO", "Projects"],
  parameters: commonBulkDeleteParams("ICO Projects"),
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              items: { type: "string" },
              description: "Array of ICO project IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("ICO Projects"),
  requiresAuth: true,
  permission: "Access ICO Project Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "icoProject",
    ids,
    query,
  });
};
