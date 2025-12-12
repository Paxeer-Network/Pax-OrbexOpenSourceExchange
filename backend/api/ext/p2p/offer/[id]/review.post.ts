import { models } from "@b/db";
import { createError } from "@b/utils/error";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { sendP2PReviewNotificationEmail } from "../../trade/utils";
import { handleNotification } from "@b/utils/notifications";

export const metadata: OperationObject = {
  summary: "Creates a review for a P2P offer",
  description:
    "Allows a user to post a review for a P2P offer they have interacted with.",
  operationId: "createUserReview",
  tags: ["P2P", "Reviews"],
  requiresAuth: true,
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", description: "P2P offer Id" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            rating: {
              type: "number",
              description: "Rating given to the offer",
            },
            comment: { type: "string", description: "Comment about the offer" },
          },
          required: ["rating", "comment"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Review created successfully",
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
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Offer"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { params, body, user } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { id } = params;
  const { comment, rating } = body;

  const offer = await models.p2pOffer.findOne({
    where: { id },
    include: [{ model: models.user, as: "user" }],
  });
  if (!offer) {
    throw createError({
      statusCode: 404,
      message: "Offer not found",
    });
  }
  if (offer.userId === user.id) {
    throw createError({
      statusCode: 403,
      message: "Unauthorized: Cannot review your own offer",
    });
  }

  // First, check if the review already exists
  const review = await models.p2pReview.findOne({
    where: {
      reviewerId: user.id,
      reviewedId: offer.userId,
      offerId: offer.id,
    },
  });

  // Create or update the review
  if (review) {
    await review.update({
      rating,
      comment,
    });
  } else {
    await models.p2pReview.create({
      reviewerId: user.id,
      reviewedId: offer.userId,
      offerId: offer.id,
      rating,
      comment,
    });
  }
  try {
    const reviewer = await models.user.findByPk(user.id);

    if (!reviewer) {
      throw createError({
        statusCode: 404,
        message: "Reviewer not found",
      });
    }
    // Send notification email
    await sendP2PReviewNotificationEmail(
      offer.user,
      reviewer,
      offer,
      rating,
      comment
    );
    await handleNotification({
      userId: offer.userId,
      title: "New review",
      message: `You have received a new review for offer #${offer.id}`,
      type: "ACTIVITY",
    });
  } catch (error) {
    console.error(error);
  }

  return {
    message: "Review created successfully",
  };
};
