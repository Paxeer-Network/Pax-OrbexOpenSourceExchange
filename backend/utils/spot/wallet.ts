import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";
import { getActiveTokensByCurrency, generateAndAddAddresses, storeWallet } from "@b/utils/eco/wallet";

// SPOT wallet auto-creation function (similar to ECO but with type: "SPOT")
export async function getSpotWalletByUserIdAndCurrency(userId: string, currency: string) {
  let generated = false;

  // Step 1: Fetch the wallet for the specified user and currency.
  let wallet = await models.wallet.findOne({
    where: {
      userId,
      currency,
      type: "SPOT", // Use SPOT type instead of ECO
    },
    attributes: ["id", "type", "currency", "balance", "address"],
  });

  // Step 2: If no wallet is found, generate a new wallet.
  if (!wallet) {
    wallet = await storeSpotWallet({ id: userId }, currency);
    generated = true;
  }

  // Step 3: If wallet is still not found after attempting creation, throw an error.
  if (!wallet) {
    throw createError(404, "Wallet not found");
  }

  // Step 4: Retrieve active tokens for the currency.
  const tokens = await getActiveTokensByCurrency(currency);
  
  // Step 5: Check if the wallet's address is empty or if it has incomplete addresses.
  let addresses = wallet.address
    ? typeof wallet.address === "string"
      ? JSON.parse(wallet.address)
      : wallet.address
    : {};

  if (typeof addresses === "string") {
    addresses = JSON.parse(addresses);
  }

  if (
    !addresses ||
    (addresses && Object.keys(addresses).length < tokens.length)
  ) {
    const tokensWithoutAddress = tokens.filter(
      (token) => !addresses || !addresses.hasOwnProperty(token.chain)
    );
    // Generate and add missing addresses to the wallet.
    if (tokensWithoutAddress.length > 0) {
      await sequelize.transaction(async (transaction) => {
        await generateAndAddAddresses(
          wallet,
          tokensWithoutAddress,
          transaction
        );
      });
    }

    // Fetch and return the updated wallet after generating missing addresses.
    const updatedWallet = await models.wallet.findOne({
      where: { id: wallet.id },
      attributes: ["id", "type", "currency", "balance", "address"],
    });

    if (!updatedWallet) {
      throw createError(500, "Failed to update wallet with new addresses");
    }

    return updatedWallet;
  }

  return wallet;
}

// SPOT version of storeWallet function
async function storeSpotWallet(user: { id: string }, currency: string) {
  return await sequelize.transaction(async (transaction) => {
    // Create the wallet with type: "SPOT"
    const newWallet = await models.wallet.create(
      {
        userId: user.id,
        type: "SPOT",
        currency,
        balance: 0,
        status: true,
      },
      { transaction }
    );

    return newWallet;
  });
}
