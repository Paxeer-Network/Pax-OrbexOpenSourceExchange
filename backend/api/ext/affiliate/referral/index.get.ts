// /server/api/mlm/referrals/index.get.ts

import { mlmReferralSchema } from "@b/api/admin/ext/affiliate/referral/utils";
import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import { createError } from "@b/utils/error";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Lists all MLM Referrals with pagination and optional filtering",
  operationId: "listMlmReferrals",
  tags: ["MLM", "Referrals"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of MLM Referrals with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: mlmReferralSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("MLM Referrals"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { user, query } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  // Call the generic fetch function
  return getFiltered({
    model: models.mlmReferral,
    query,
    where: { referrerId: user.id },
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.user,
        as: "referred",
        attributes: ["firstName", "lastName", "email", "avatar"],
      },
    ],
  });
};
