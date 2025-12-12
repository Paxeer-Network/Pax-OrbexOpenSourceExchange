import { createError } from "@b/utils/error";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Get user's NFT watchlist",
  description: "Retrieves the current user's NFT watchlist",
  operationId: "getUserNftWatchlist",
  tags: ["User", "NFT", "Watchlist"],
  requiresAuth: true,
  responses: {
    200: {
      description: "NFT watchlist retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "boolean" },
              statusCode: { type: "number" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    nft_id: { type: "string" },
                    user_id: { type: "string" },
                    created_at: { type: "string" },
                    updated_at: { type: "string" },
                    nft: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                        image: { type: "string" },
                        collection: { type: "string" },
                        price: { type: "number" },
                        currency: { type: "string" },
                        status: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: { message: { type: "string" } }
          }
        }
      }
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: { message: { type: "string" } }
          }
        }
      }
    }
  }
};

export default async (data) => {
  const { user } = data;
  
  if (!user?.id) {
    throw createError(401, "Unauthorized");
  }

  try {
    // Check if NFT watchlist table exists, if not return empty array
    const watchlistExists = await models.sequelize.query(
      "SHOW TABLES LIKE 'nft_watchlist'",
      { type: models.sequelize.QueryTypes.SELECT }
    );

    if (!watchlistExists.length) {
      // Return empty watchlist if table doesn't exist yet
      return {
        status: true,
        statusCode: 200,
        data: []
      };
    }

    // If table exists, try to fetch watchlist
    const watchlist = await models.sequelize.query(
      `SELECT w.*, n.name, n.description, n.image, n.collection, n.price, n.currency, n.status
       FROM nft_watchlist w 
       LEFT JOIN nfts n ON w.nft_id = n.id 
       WHERE w.user_id = :userId 
       ORDER BY w.created_at DESC`,
      {
        replacements: { userId: user.id },
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    return {
      status: true,
      statusCode: 200,
      data: watchlist || []
    };
  } catch (error) {
    console.error("NFT watchlist error:", error);
    
    // Return empty array if there's any database error
    return {
      status: true,
      statusCode: 200,
      data: []
    };
  }
};
