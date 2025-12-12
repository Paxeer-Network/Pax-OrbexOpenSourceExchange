// /server/api/admin/crm/users/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { userSchema } from "./utils";
import { Op } from "sequelize";

export const metadata: OperationObject = {
  summary: "Lists users with pagination and optional filtering",
  operationId: "listUsers",
  tags: ["Admin", "CRM", "User"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of users with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: userSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Users"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access User Management",
};

export default async (data: Handler) => {
  const { query } = data;

  if (query.all === "true") {
    const users = await models.user.findAll({
      attributes: {
        exclude: [
          "password",
          "failedLoginAttempts",
          "metadata",
          "lastFailedLogin",
          "walletAddress",
          "walletProvider",
          "updatedAt",
        ],
      },
      include: [
        {
          model: models.role,
          as: "role",
          attributes: ["id", "name"],
        },
      ],
      where: {
        "$role.name$": { [Op.ne]: "Super Admin" },
      },
    });

    return {
      data: users,
      pagination: null, // No pagination for `all=true`
    };
  }

  // Default behavior: fetch with pagination
  return getFiltered({
    model: models.user,
    query,
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.role,
        as: "role",
        attributes: ["id", "name"],
      },
    ],
    excludeFields: [
      "password",
      "failedLoginAttempts",
      "metadata",
      "lastFailedLogin",
      "walletAddress",
      "walletProvider",
      "updatedAt",
    ],
    excludeRecords: [
      {
        model: models.role,
        key: "name",
        value: "Super Admin",
      },
    ],
  });
};
