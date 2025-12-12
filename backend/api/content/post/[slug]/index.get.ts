// /server/api/blog/posts/show.get.ts
import { models } from "@b/db";
// import { redis } from '@b/utils/redis';

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { basePostSchema } from "../utils";
import { Op } from "sequelize";

export const metadata: OperationObject = {
  summary: "Retrieves a single blog post by ID",
  description: "This endpoint retrieves a single blog post by its ID.",
  operationId: "getPostById",
  tags: ["Blog"],
  requiresAuth: false,
  parameters: [
    {
      index: 0,
      name: "slug",
      in: "path",
      description: "The ID of the blog post to retrieve",
      required: true,
      schema: {
        type: "string",
        description: "Post ID",
      },
    },
  ],
  responses: {
    200: {
      description: "Blog post retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: basePostSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Post"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { params } = data;
  const { slug } = params;
  return await getPost(slug);
};

export async function getPost(slug: string): Promise<any | null> {
  const post = await models.post.findOne({
    where: { slug },
    include: [
      {
        model: models.author,
        as: "author",
        include: [
          {
            model: models.user,
            as: "user",
            attributes: ["firstName", "lastName", "email", "avatar"],
            include: [
              {
                model: models.role,
                as: "role",
                attributes: ["name"],
              },
            ],
          },
        ],
      },
      {
        model: models.category,
        as: "category",
      },
      {
        model: models.tag,
        as: "tags",
        through: {
          attributes: [],
        },
      },
      {
        model: models.comment,
        as: "comments",
        attributes: ["id", "content", "createdAt"],
        include: [
          {
            model: models.user,
            as: "user",
            attributes: ["firstName", "lastName", "email", "avatar"],
          },
        ],
      },
    ],
  });

  if (!post) {
    return null; // If the post is not found, return null
  }

  // Fetch related articles (e.g., articles in the same category or with the same tags)
  const relatedArticles = await models.post.findAll({
    where: {
      id: {
        [Op.ne]: post.id, // Exclude the current post
      },
      categoryId: post.categoryId, // Match the category
    },
    limit: 5, // Limit to 5 related articles
    order: [["createdAt", "DESC"]], // Order by recent articles
    attributes: ["id", "title", "slug", "image", "createdAt"],
    include: [
      {
        model: models.author,
        as: "author",
        include: [
          {
            model: models.user,
            as: "user",
            attributes: ["firstName", "lastName"],
          },
        ],
      },
    ],
  });

  return {
    ...post.toJSON(),
    relatedArticles,
  };
}
