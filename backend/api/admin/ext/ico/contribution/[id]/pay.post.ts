import { models } from "@b/db";
import { createError } from "@b/utils/error";
import { sendIcoContributionEmail } from "../utils";

export const metadata = {
  summary: "Pay an ICO contribution",
  description: "Processes the payment for a specific ICO contribution.",
  operationId: "payContribution",
  tags: ["Admin","ICO"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "number", description: "Contribution ID" },
    },
  ],
  responses: {
    200: {
      description: "ICO contribution paid successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
          },
        },
      },
    },
    404: {
      description: "ICO contribution not found",
    },
    500: {
      description: "Internal server error",
    },
  },
  permission: "Access ICO Contribution Management"
};

export default async (data: Handler) => {
  const { params } = data;
  const { id } = params;

  const contribution = await models.icoContribution.findByPk(id, {
    include: [
      {
        model: models.icoPhase,
        include: [{ model: models.icoToken, as: "token" }],
      },
    ],
  });

  if (!contribution) {
    throw createError({
      statusCode: 404,
      message: "ICO contribution not found",
    });
  }

  if (contribution.status !== "PENDING") {
    throw new Error("Contribution is not in a payable state");
  }

  const user = await models.user.findByPk(contribution.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const transaction = await models.transaction.findOne({
    where: {
      referenceId: contribution.id,
    },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  contribution.status = "COMPLETED";
  await contribution.save();

  try {
    await sendIcoContributionEmail(
      user,
      contribution,
      contribution.phase.token,
      contribution.phase,
      "IcoContributionPaid",
      transaction.id
    );
  } catch (error) {
    console.error("Failed to send email", error);
  }

  return {
    message: "ICO contribution paid successfully",
  };
};
