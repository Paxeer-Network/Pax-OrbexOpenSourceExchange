import { models } from "@b/db";
import { createError } from "@b/utils/error";

// Helper function to get user by ID
export async function getUserById(userId: string) {
  const user = await models.user.findByPk(userId);
  if (!user) {
    throw createError({ statusCode: 400, message: "User not found" });
  }
  return user;
}

export async function getUserWith2FA(userId: string) {
  const user = await models.user.findOne({
    where: { id: userId },
    include: {
      model: models.twoFactor,
      as: "twoFactor",
    },
  });

  if (!user || !user.twoFactor?.secret) {
    throw createError({
      statusCode: 400,
      message: "User not found or 2FA not enabled",
    });
  }

  return user;
}
