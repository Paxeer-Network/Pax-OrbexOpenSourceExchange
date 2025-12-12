// /api/mlm/referrals/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { mlmReferralStoreSchema, mlmReferralUpdateSchema } from "./utils";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Stores a new MLM Referral",
  operationId: "storeMlmReferral",
  tags: ["Admin", "MLM", "Referrals"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: mlmReferralUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(mlmReferralStoreSchema, "MLM Referral"),
  requiresAuth: true,
  permission: "Access MLM Referral Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { status, referrerId, referredId } = body;

  if (referrerId === referredId)
    throw new Error("Referrer and referred user cannot be the same");

  const referrer = await models.user.findOne({ where: { id: referrerId } });
  if (!referrer) throw new Error("Referrer not found");

  const referred = await models.user.findOne({ where: { id: referredId } });
  if (!referred) throw new Error("Referred user not found");

  return await storeRecord({
    model: "mlmReferral",
    data: {
      status,
      referrerId,
      referredId,
    },
  });
};
