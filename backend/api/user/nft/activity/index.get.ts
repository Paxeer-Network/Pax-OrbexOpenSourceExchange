import { createError } from "@b/utils/error";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Get user's NFT activity",
  description: "Retrieves the current user's NFT activity history (purchases, sales, transfers, etc.)",
  operationId: "getUserNftActivity",
  tags: ["User", "NFT", "Activity"],
  requiresAuth: true,
  parameters: [
    {
      name: "limit",
      in: "query",
      description: "Number of activities to retrieve",
      required: false,
      schema: {
        type: "integer"
      }
    },
    {
      name: "offset",
      in: "query",
      description: "Number of activities to skip",
      required: false,
      schema: {
        type: "integer"
      }
    },
    {
      name: "type",
      in: "query",
      description: "Type of activity to filter by",
      required: false,
      schema: {
        type: "string",
        enum: ["purchase", "sale", "transfer", "listing", "offer", "all"],
        default: "all"
      }
    }
  ],
  responses: {
    200: {
      description: "NFT activity retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "boolean" },
              statusCode: { type: "number" },
              data: {
                type: "object",
                properties: {
                  activities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        nft_id: { type: "string" },
                        type: { type: "string" },
                        amount: { type: "number" },
                        currency: { type: "string" },
                        from_user: { type: "string" },
                        to_user: { type: "string" },
                        transaction_hash: { type: "string" },
                        created_at: { type: "string" },
                        nft: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            image: { type: "string" },
                            collection: { type: "string" }
                          }
                        }
                      }
                    }
                  },
                  total: { type: "number" },
                  hasMore: { type: "boolean" }
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
  const { user, query } = data;
  
  if (!user?.id) {
    throw createError(401, "Unauthorized");
  }

  const { 
    limit = "20", 
    offset = "0", 
    type = "all" 
  } = query;

  try {
    // Check if NFT activity table exists
    const activityExists = await models.sequelize.query(
      "SHOW TABLES LIKE 'nft_activities'",
      { type: models.sequelize.QueryTypes.SELECT }
    );

    if (!activityExists.length) {
      // Return empty activity if table doesn't exist yet
      return {
        status: true,
        statusCode: 200,
        data: {
          activities: [],
          total: 0,
          hasMore: false
        }
      };
    }

    // Build WHERE clause based on type filter
    let typeFilter = "";
    if (type !== "all") {
      typeFilter = `AND a.type = '${type}'`;
    }

    // Get total count
    const countResult = await models.sequelize.query(
      `SELECT COUNT(*) as total 
       FROM nft_activities a 
       LEFT JOIN nfts n ON a.nft_id = n.id 
       WHERE (a.from_user = :userId OR a.to_user = :userId OR n.owner_id = :userId) 
       ${typeFilter}`,
      {
        replacements: { userId: user.id },
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    const total = countResult[0]?.total || 0;

    // Get activities
    const activities = await models.sequelize.query(
      `SELECT a.*, 
              n.name as nft_name, 
              n.image as nft_image, 
              n.collection,
              u1.username as from_username,
              u2.username as to_username
       FROM nft_activities a 
       LEFT JOIN nfts n ON a.nft_id = n.id 
       LEFT JOIN users u1 ON a.from_user = u1.id
       LEFT JOIN users u2 ON a.to_user = u2.id
       WHERE (a.from_user = :userId OR a.to_user = :userId OR n.owner_id = :userId)
       ${typeFilter}
       ORDER BY a.created_at DESC 
       LIMIT :limit OFFSET :offset`,
      {
        replacements: { 
          userId: user.id, 
          limit: parseInt(limit), 
          offset: parseInt(offset) 
        },
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    const hasMore = (parseInt(offset) + parseInt(limit)) < total;

    return {
      status: true,
      statusCode: 200,
      data: {
        activities: activities || [],
        total,
        hasMore
      }
    };
  } catch (error) {
    console.error("NFT activity error:", error);
    
    // Return empty activity if there's any database error
    return {
      status: true,
      statusCode: 200,
      data: {
        activities: [],
        total: 0,
        hasMore: false
      }
    };
  }
};
