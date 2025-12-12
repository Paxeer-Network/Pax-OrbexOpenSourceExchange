import { models, sequelize } from "@b/db";
import { processRewards } from "@b/utils/affiliate";
import { sendOrderConfirmationEmail } from "@b/utils/emails";
import { createError } from "@b/utils/error";
import { handleNotification } from "@b/utils/notifications";
import { createRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Creates a new order",
  description:
    "Processes a new order for the logged-in user, checking inventory, wallet balance, and applying any available discounts.",
  operationId: "createEcommerceOrder",
  tags: ["Ecommerce", "Orders"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            productId: { type: "string", description: "Product ID to order" },
            discountId: {
              type: "string",
              description: "Discount ID applied to the order",
              nullable: true,
            },
            amount: {
              type: "number",
              description: "Quantity of the product to purchase",
            },
            shippingAddress: {
              type: "object",
              properties: {
                name: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                street: { type: "string" },
                city: { type: "string" },
                state: { type: "string" },
                postalCode: { type: "string" },
                country: { type: "string" },
              },
              required: [
                "name",
                "email",
                "phone",
                "street",
                "city",
                "state",
                "postalCode",
                "country",
              ],
            },
          },
          required: ["productId", "amount"],
        },
      },
    },
  },
  responses: createRecordResponses("Order"),
};

export default async (data: Handler) => {
  const { user, body } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { productId, discountId, amount, shippingAddress } = body;

  const transaction = await sequelize.transaction();

  const userPk = await models.user.findByPk(user.id);
  if (!userPk) {
    throw new Error("User not found");
  }

  const product = await models.ecommerceProduct.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Calculate total cost with discount if applicable
  let cost = product.price * amount;
  let userDiscount: any = null;

  if (discountId && discountId !== "null") {
    userDiscount = await models.ecommerceUserDiscount.findOne({
      where: {
        userId: user.id,
        discountId: discountId,
      },
      include: [
        {
          model: models.ecommerceDiscount,
          as: "discount",
        },
      ],
    });

    if (!userDiscount) {
      throw new Error("Discount not found");
    }

    cost -= cost * (userDiscount.discount.percentage / 100);
  }

  // Check user wallet balance
  const wallet = await models.wallet.findOne({
    where: {
      userId: user.id,
      type: product.walletType,
      currency: product.currency,
    },
  });

  if (!wallet || wallet.balance < cost) {
    throw new Error("Insufficient balance");
  }

  const newBalance = wallet.balance - cost;

  // Create order and order items
  const order = await models.ecommerceOrder.create(
    {
      userId: user.id,
      status: "PENDING",
    },
    { transaction }
  );

  await models.ecommerceOrderItem.create(
    {
      orderId: order.id,
      productId: productId,
      quantity: amount,
    },
    { transaction }
  );

  // Update product inventory and user wallet balance
  await product.update(
    { inventoryQuantity: sequelize.literal(`inventoryQuantity - ${amount}`) },
    { transaction }
  );

  await wallet.update({ balance: newBalance }, { transaction });

  // Create a transaction record
  await models.transaction.create(
    {
      userId: user.id,
      walletId: wallet.id,
      type: "PAYMENT",
      status: "COMPLETED",
      amount: cost,
      description: `Purchase of ${product.name} x${amount} for ${cost} ${product.currency}`,
      referenceId: order.id,
    },
    { transaction }
  );

  // Update discount status if applicable
  if (userDiscount) {
    await userDiscount.update({ status: true }, { transaction });
  }

  // Create shipping address if product is physical
  if (product.type !== "DOWNLOADABLE" && shippingAddress) {
    await models.ecommerceShippingAddress.create(
      {
        userId: user.id,
        orderId: order.id,
        ...shippingAddress,
      },
      { transaction }
    );
  }

  await transaction.commit();

  // Send order confirmation email
  try {
    await sendOrderConfirmationEmail(userPk, order, product);
    await handleNotification({
      userId: user.id,
      title: "Order Confirmation",
      message: `Your order for ${product.name} x${amount} has been confirmed`,
      type: "ACTIVITY",
    });
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }

  // Process rewards if applicable
  if (product.type === "DOWNLOADABLE") {
    try {
      await processRewards(
        user.id,
        cost,
        "ECOMMERCE_PURCHASE",
        wallet.currency
      );
    } catch (error) {
      console.error(`Error processing rewards: ${error.message}`);
    }
  }

  return {
    id: order.id,
    message: "Order created successfully",
  };
};
