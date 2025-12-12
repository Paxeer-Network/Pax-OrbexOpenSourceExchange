import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { p2pPaymentMethodUpdateSchema } from "../utils";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Updates a specific P2P Payment Method",
  operationId: "updateP2pPaymentMethod",
  tags: ["P2P", "Payment Methods"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the P2P Payment Method to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the P2P Payment Method",
    content: {
      "application/json": {
        schema: p2pPaymentMethodUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("P2P Payment Method"),
  requiresAuth: true,
};

export default async (data) => {
  const { user, body, params } = data;
  if (!user?.id) throw createError(401, "Unauthorized");

  const { id } = params;
  const updatedFields = {
    instructions: body.instructions,
    image: body.image,
  };

  return await updateRecord(
    "p2pPaymentMethod",
    id,
    updatedFields,
    undefined,
    undefined,
    { userId: user.id }
  );
};
