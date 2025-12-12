import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { icoProjectUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific ICO Project",
  operationId: "updateIcoProject",
  tags: ["Admin","ICO Projects"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the ICO Project to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the ICO Project",
    content: {
      "application/json": {
        schema: icoProjectUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("ICO Project"),
  requiresAuth: true,
  permission: "Access ICO Project Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const { name, description, website, whitepaper, image, status } = body;

  return await updateRecord("icoProject", id, {
    name,
    description,
    website,
    whitepaper,
    image,
    status,
  });
};
