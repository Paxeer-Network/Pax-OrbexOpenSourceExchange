import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "@/layouts/Nav";
import { useTranslation } from "next-i18next";
import { Icon } from "@iconify/react";

export default function Fees() {
  const { t } = useTranslation();

  const spotTradingFees = [
    { tier: "VIP 0", maker: "0.075%", taker: "0.075%", volume: "< $50,000" },
    { tier: "VIP 1", maker: "0.065%", taker: "0.075%", volume: "≥ $50,000" },
    { tier: "VIP 2", maker: "0.055%", taker: "0.065%", volume: "≥ $200,000" },
    { tier: "VIP 3", maker: "0.045%", taker: "0.055%", volume: "≥ $500,000" },
    { tier: "VIP 4", maker: "0.035%", taker: "0.045%", volume: "≥ $1,000,000" },
    { tier: "VIP 5", maker: "0.025%", taker: "0.035%", volume: "≥ $2,500,000" },
    { tier: "VIP 6", maker: "0.015%", taker: "0.025%", volume: "≥ $5,000,000" },
    { tier: "VIP 7", maker: "0.010%", taker: "0.020%", volume: "≥ $10,000,000" },
  ];

  const futuresTradingFees = [
    { tier: "Regular", maker: "0.020%", taker: "0.050%" },
    { tier: "VIP 1", maker: "0.018%", taker: "0.045%" },
    { tier: "VIP 2", maker: "0.016%", taker: "0.040%" },
    { tier: "VIP 3", maker: "0.014%", taker: "0.035%" },
    { tier: "VIP 4", maker: "0.012%", taker: "0.030%" },
    { tier: "VIP 5", maker: "0.010%", taker: "0.025%" },
  ];

  const withdrawalFees = [
    { coin: "BTC", network: "Bitcoin", fee: "0.0005 BTC", min: "0.001 BTC" },
    { coin: "ETH", network: "Ethereum", fee: "0.005 ETH", min: "0.01 ETH" },
    { coin: "USDT", network: "Ethereum (ERC20)", fee: "15 USDT", min: "20 USDT" },
    { coin: "USDT", network: "TRON (TRC20)", fee: "1 USDT", min: "10 USDT" },
    { coin: "USDT", network: "BSC (BEP20)", fee: "1 USDT", min: "10 USDT" },
    { coin: "USDC", network: "Ethereum (ERC20)", fee: "15 USDC", min: "20 USDC" },
    { coin: "BNB", network: "BSC (BEP20)", fee: "0.001 BNB", min: "0.01 BNB" },
    { coin: "ADA", network: "Cardano", fee: "1 ADA", min: "2 ADA" },
  ];

  return (
    <Layout title="Trading Fees" color="muted">
      <div className="min-h-screen bg-muted-50 dark:bg-muted-950">
        {/* Hero Section */}
        <div className="bg-white dark:bg-muted-900 border-b border-muted-200 dark:border-muted-800">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-muted-900 dark:text-white mb-4">
                Trading Fees & Limits
              </h1>
              <p className="text-lg text-muted-600 dark:text-muted-400 max-w-2xl mx-auto">
                Transparent and competitive fee structure with volume-based discounts. 
                The more you trade, the less you pay.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Spot Trading Fees */}
          <section className="mb-16">
            <div className="bg-white dark:bg-muted-900 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-muted-200 dark:border-muted-800">
                <h2 className="text-2xl font-bold text-muted-900 dark:text-white flex items-center">
                  <Icon icon="mdi:chart-line" className="w-6 h-6 mr-3 text-primary-500" />
                  Spot Trading Fees
                </h2>
                <p className="text-muted-600 dark:text-muted-400 mt-2">
                  Fees based on your 30-day trading volume (USD equivalent)
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted-50 dark:bg-muted-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-900 dark:text-white">
                        Tier
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-900 dark:text-white">
                        30-Day Volume
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-900 dark:text-white">
                        Maker Fee
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-900 dark:text-white">
                        Taker Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {spotTradingFees.map((tier, index) => (
                      <tr key={index} className="border-t border-muted-200 dark:border-muted-800">
                        <td className="px-6 py-4 text-sm font-medium text-muted-900 dark:text-white">
                          {tier.tier}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-600 dark:text-muted-400">
                          {tier.volume}
                        </td>
                        <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400 font-medium">
                          {tier.maker}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-600 dark:text-muted-400">
                          {tier.taker}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Futures Trading Fees */}
          <section className="mb-16">
            <div className="bg-white dark:bg-muted-900 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-muted-200 dark:border-muted-800">
                <h2 className="text-2xl font-bold text-muted-900 dark:text-white flex items-center">
                  <Icon icon="mdi:chart-areaspline" className="w-6 h-6 mr-3 text-primary-500" />
                  Futures Trading Fees
                </h2>
                <p className="text-muted-600 dark:text-muted-400 mt-2">
                  Competitive futures trading fees with leverage up to 125x
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted-50 dark:bg-muted-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-900 dark:text-white">
                        Tier
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-900 dark:text-white">
                        Maker Fee
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-900 dark:text-white">
                        Taker Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {futuresTradingFees.map((tier, index) => (
                      <tr key={index} className="border-t border-muted-200 dark:border-muted-800">
                        <td className="px-6 py-4 text-sm font-medium text-muted-900 dark:text-white">
                          {tier.tier}
                        </td>
                        <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400 font-medium">
                          {tier.maker}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-600 dark:text-muted-400">
                          {tier.taker}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Withdrawal Fees */}
          <section className="mb-16">
            <div className="bg-white dark:bg-muted-900 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-muted-200 dark:border-muted-800">
                <h2 className="text-2xl font-bold text-muted-900 dark:text-white flex items-center">
                  <Icon icon="mdi:wallet-outline" className="w-6 h-6 mr-3 text-primary-500" />
                  Withdrawal Fees
                </h2>
                <p className="text-muted-600 dark:text-muted-400 mt-2">
                  Network fees for cryptocurrency withdrawals (deposits are free)
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted-50 dark:bg-muted-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-900 dark:text-white">
                        Coin
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-900 dark:text-white">
                        Network
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-900 dark:text-white">
                        Withdrawal Fee
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-900 dark:text-white">
                        Minimum Withdrawal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawalFees.map((item, index) => (
                      <tr key={index} className="border-t border-muted-200 dark:border-muted-800">
                        <td className="px-6 py-4 text-sm font-medium text-muted-900 dark:text-white">
                          {item.coin}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-600 dark:text-muted-400">
                          {item.network}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-600 dark:text-muted-400">
                          {item.fee}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-600 dark:text-muted-400">
                          {item.min}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Additional Information */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-muted-900 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-muted-900 dark:text-white mb-4 flex items-center">
                  <Icon icon="mdi:information" className="w-5 h-5 mr-2 text-primary-500" />
                  Fee Calculation
                </h3>
                <ul className="space-y-2 text-sm text-muted-600 dark:text-muted-400">
                  <li>• Maker fees apply when you add liquidity to the order book</li>
                  <li>• Taker fees apply when you remove liquidity from the order book</li>
                  <li>• VIP tiers are calculated based on 30-day trading volume</li>
                  <li>• Fees are automatically applied to your trades</li>
                  <li>• Volume includes both buy and sell orders</li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-muted-900 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-muted-900 dark:text-white mb-4 flex items-center">
                  <Icon icon="mdi:star" className="w-5 h-5 mr-2 text-yellow-500" />
                  VIP Benefits
                </h3>
                <ul className="space-y-2 text-sm text-muted-600 dark:text-muted-400">
                  <li>• Reduced trading fees</li>
                  <li>• Priority customer support</li>
                  <li>• Exclusive market insights</li>
                  <li>• Higher withdrawal limits</li>
                  <li>• Early access to new features</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};
