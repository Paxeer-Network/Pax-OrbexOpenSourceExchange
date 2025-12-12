import { createError } from "@b/utils/error";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Get user's NFT offers",
  description: "Retrieves the current user's NFT offers (both made and received)",
  operationId: "getUserNftOffers",
  tags: ["User", "NFT", "Offers"],
  requiresAuth: true,
  parameters: [
    {
      name: "type",
      in: "query",
      description: "Type of offers to retrieve (made, received, all)",
      required: false,
      schema: {
        type: "string",
        enum: ["made", "received", "all"],
        default: "all"
      }
    }
  ],
  responses: {
    200: {
      description: "NFT offers retrieved successfully",
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
                  made: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        nft_id: { type: "string" },
                        offer_amount: { type: "number" },
                        currency: { type: "string" },
                        status: { type: "string" },
                        expires_at: { type: "string" },
                        created_at: { type: "string" }
                      }
                    }
                  },
                  received: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        nft_id: { type: "string" },
                        offer_amount: { type: "number" },
                        currency: { type: "string" },
                        status: { type: "string" },
                        expires_at: { type: "string" },
                        created_at: { type: "string" }
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
  const { user, query } = data;
  
  if (!user?.id) {
    throw createError(401, "Unauthorized");
  }

  const { type = "all" } = query;

  try {
    // Check if NFT offers table exists
    const offersExists = await models.sequelize.query(
      "SHOW TABLES LIKE 'nft_offers'",
      { type: models.sequelize.QueryTypes.SELECT }
    );

    if (!offersExists.length) {
      // Return empty offers if table doesn't exist yet
      return {
        status: true,
        statusCode: 200,
        data: {
          made: [],
          received: []
        }
      };
    }

    const result: any = {
      made: [],
      received: []
    };

    // Get offers made by user
    if (type === "made" || type === "all") {
      const madeOffers = await models.sequelize.query(
        `SELECT o.*, n.name as nft_name, n.image as nft_image, n.collection
         FROM nft_offers o 
         LEFT JOIN nfts n ON o.nft_id = n.id 
         WHERE o.user_id = :userId 
         ORDER BY o.created_at DESC`,
        {
          replacements: { userId: user.id },
          type: models.sequelize.QueryTypes.SELECT
        }
      );
      result.made = madeOffers || [];
    }

    // Get offers received by user (on their NFTs)
    if (type === "received" || type === "all") {
      const receivedOffers = await models.sequelize.query(
        `SELECT o.*, n.name as nft_name, n.image as nft_image, n.collection, u.username as offerer_username
         FROM nft_offers o 
         LEFT JOIN nfts n ON o.nft_id = n.id 
         LEFT JOIN users u ON o.user_id = u.id
         WHERE n.owner_id = :userId AND o.user_id != :userId
         ORDER BY o.created_at DESC`,
        {
          replacements: { userId: user.id },
          type: models.sequelize.QueryTypes.SELECT
        }
      );
      result.received = receivedOffers || [];
    }

    return {
      status: true,
      statusCode: 200,
      data: result
    };
  } catch (error) {
    console.error("NFT offers error:", error);
    
    // Return empty arrays if there's any database error
    return {
      status: true,
      statusCode: 200,
      data: {
        made: [],
        received: []
      }
    };
  }
};
