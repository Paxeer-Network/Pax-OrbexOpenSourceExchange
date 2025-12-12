"use strict";
const { v4: uuidv4 } = require("uuid");

/** Define Deposit Gateways */
const DepositGateways = [
  {
    name: "Stripe",
    title: "Stripe",
    description: "Payment gateway for credit cards",
    alias: "stripe",
    type: "FIAT",
    image: "/img/gateways/stripe.png",
    currencies: [
      "USD",
      "AUD",
      "BRL",
      "CAD",
      "CHF",
      "DKK",
      "EUR",
      "GBP",
      "HKD",
      "INR",
      "JPY",
      "MXN",
      "MYR",
      "NOK",
      "NZD",
      "PLN",
      "SEK",
      "SGD",
    ],
    status: true,
    version: "0.0.1",
    fixedFee: 0,
    percentageFee: 0,
    minAmount: 0,
    maxAmount: null,
    productId: null,
  },
  {
    name: "PayPal",
    title: "PayPal",
    description: "Payment gateway for PayPal",
    alias: "paypal",
    type: "FIAT",
    image: "/img/gateways/paypal.png",
    currencies: [
      "AUD",
      "BRL",
      "CAD",
      "CZK",
      "DKK",
      "EUR",
      "HKD",
      "HUF",
      "INR",
      "ILS",
      "JPY",
      "MYR",
      "MXN",
      "TWD",
      "NZD",
      "NOK",
      "PHP",
      "PLN",
      "GBP",
      "RUB",
      "SGD",
      "SEK",
      "CHF",
      "THB",
      "USD",
    ],
    status: false,
    version: "0.0.1",
    fixedFee: 0,
    percentageFee: 0,
    minAmount: 0,
    maxAmount: null,
    productId: null,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Fetch existing deposit gateway names & aliases
      const existingGateways = await queryInterface.sequelize.query(
        "SELECT name, alias FROM deposit_gateway",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      const existingNames = new Set(existingGateways.map((g) => g.name));
      const existingAliases = new Set(existingGateways.map((g) => g.alias));

      // Filter out deposit gateways that already exist (by name or alias)
      const newGateways = DepositGateways.filter(
        (gateway) =>
          !existingNames.has(gateway.name) &&
          !existingAliases.has(gateway.alias)
      ).map((gateway) => ({
        id: uuidv4(),
        name: gateway.name,
        title: gateway.title,
        description: gateway.description,
        alias: gateway.alias,
        type: gateway.type,
        image: gateway.image,
        currencies: JSON.stringify(gateway.currencies),
        status: gateway.status ? 1 : 0, // Convert boolean to 0/1
        version: gateway.version,
        fixedFee: gateway.fixedFee || 0,
        percentageFee: gateway.percentageFee || 0,
        minAmount: gateway.minAmount || 0,
        maxAmount: gateway.maxAmount || null,
        productId: gateway.productId || null,
      }));

      // Insert only if there are new records
      if (newGateways.length > 0) {
        await queryInterface.bulkInsert("deposit_gateway", newGateways, {});
        console.log(
          `✅ Successfully inserted ${newGateways.length} new deposit gateways.`
        );
      } else {
        console.log("⚠️ No new deposit gateways to insert.");
      }
    } catch (error) {
      console.error("❌ Migration failed:", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete("deposit_gateway", null, {});
      console.log("✅ Successfully rolled back deposit gateways.");
    } catch (error) {
      console.error("❌ Rollback failed:", error);
      throw error;
    }
  },
};
