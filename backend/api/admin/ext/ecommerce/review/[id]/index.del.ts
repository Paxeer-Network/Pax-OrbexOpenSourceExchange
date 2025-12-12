import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a specific e-commerce review",
  operationId: "deleteEcommerceReview",
  tags: ["Admin", "Ecommerce", "Reviews"],
  parameters: deleteRecordParams("E-commerce review"),
  responses: deleteRecordResponses("E-commerce review"),
  permission: "Access Ecommerce Review Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "ecommerceReview",
    id: params.id,
    query,
  });
};
