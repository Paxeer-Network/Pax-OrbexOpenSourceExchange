// /api/admin/ico/projects/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { icoProjectStoreSchema, icoProjectUpdateSchema } from "./utils";

export const metadata = {
  summary: "Stores a new ICO Project",
  operationId: "storeIcoProject",
  tags: ["Admin", "ICO Projects"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: icoProjectUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(icoProjectStoreSchema, "ICO Project"),
  requiresAuth: true,
  permission: "Access ICO Project Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { name, description, website, whitepaper, image, status } = body;

  return await storeRecord({
    model: "icoProject",
    data: {
      name,
      description,
      website,
      whitepaper,
      image,
      status,
    },
  });
};
