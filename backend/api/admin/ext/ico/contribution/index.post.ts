// /api/admin/ico/contributions/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import {
  icoContributionStoreSchema,
  icoContributionUpdateSchema,
} from "./utils";

export const metadata = {
  summary: "Stores a new ICO Contribution",
  operationId: "storeIcoContribution",
  tags: ["Admin", "ICO Contributions"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: icoContributionUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(
    icoContributionStoreSchema,
    "ICO Contribution"
  ),
  requiresAuth: true,
  permission: "Access ICO Contribution Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { userId, phaseId, amount, status } = body;

  return await storeRecord({
    model: "icoContribution",
    data: {
      userId,
      phaseId,
      amount,
      status,
    },
  });
};
