import { updateRecordResponses } from "@b/utils/query";
import { roleUpdateSchema } from "../utils";
import { models } from "@b/db";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Updates an existing role",
  operationId: "updateRole",
  tags: ["Admin", "CRM", "Role"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the role to update",
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    required: true,
    description: "Updated data for the role",
    content: {
      "application/json": {
        schema: roleUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("Role"),
  requiresAuth: true,
  permission: "Access Role Management",
};

export default async (data: Handler) => {
  const { body, params, user } = data;
  const { id } = params;
  const { name, permissions } = body;

  // Ensure the request is made by a Super Admin
  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const authenticatedUser = await models.user.findByPk(user.id, {
    include: [{ model: models.role, as: "role" }],
  });

  if (
    !authenticatedUser ||
    !authenticatedUser.role ||
    authenticatedUser.role.name !== "Super Admin"
  ) {
    throw createError({
      statusCode: 403,
      message: "Forbidden - Only Super Admins can update roles",
    });
  }

  try {
    // Fetch the role by id, including current permissions
    const role = await models.role.findByPk(id, {
      include: [{ model: models.permission, as: "permissions" }],
    });
    if (!role) {
      throw new Error("Role not found");
    }

    // Update role name if provided
    if (name && role.name !== name) {
      await role.update({ name });
    }

    // Update permissions if provided
    if (permissions) {
      const permissionIds = permissions.map((permission) => permission.id);
      // Update role's permissions
      await role.setPermissions(permissionIds);
    }

    // Refetch the updated role with its permissions
    const updatedRole = await models.role.findByPk(id, {
      include: [{ model: models.permission, as: "permissions" }],
    });

    return { message: "Role updated successfully", role: updatedRole };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
