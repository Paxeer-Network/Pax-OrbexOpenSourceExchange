import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "@/layouts/Nav";
import { useTranslation } from "next-i18next";

export default function RiskDisclosure() {
  const { t } = useTranslation();

  return (
    <Layout title="Risk Disclosure" color="muted">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-center mb-8">Risk Disclosure</h1>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                  Important Risk Warning
                </h3>
                <p className="text-yellow-700 dark:text-yellow-400">
                  Trading cryptocurrencies involves substantial risk and may result in complete loss of capital. 
                  Only invest what you can afford to lose.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <h2>General Risk Factors</h2>
            <p>
              Cryptocurrency trading carries inherent risks that all users must understand before engaging in trading activities:
            </p>
            <ul>
              <li><strong>Market Volatility:</strong> Cryptocurrency prices can fluctuate dramatically within short periods.</li>
              <li><strong>Liquidity Risk:</strong> Some assets may have limited liquidity, affecting your ability to buy or sell.</li>
              <li><strong>Regulatory Risk:</strong> Changes in regulations may impact trading and asset values.</li>
              <li><strong>Technology Risk:</strong> Blockchain technology, while secure, may face technical challenges.</li>
              <li><strong>Operational Risk:</strong> Trading platforms may experience downtime or technical issues.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Leverage Trading Risks</h2>
            <p>
              Leverage trading amplifies both potential profits and losses:
            </p>
            <ul>
              <li>High leverage can result in significant losses exceeding your initial investment</li>
              <li>Margin calls may force position liquidation at unfavorable prices</li>
              <li>Market gaps can lead to losses beyond your margin requirements</li>
              <li>Funding costs may accumulate over time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>P2P Trading Risks</h2>
            <ul>
              <li>Counterparty risk when trading with other users</li>
              <li>Payment method risks and potential fraud</li>
              <li>Price disputes and resolution delays</li>
              <li>Regulatory compliance in your jurisdiction</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Security Considerations</h2>
            <ul>
              <li>Enable two-factor authentication on your account</li>
              <li>Use strong, unique passwords</li>
              <li>Be aware of phishing attempts and fake websites</li>
              <li>Keep your personal information secure</li>
              <li>Regularly monitor your account activity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Regulatory Compliance</h2>
            <p>
              Users are responsible for compliance with local laws and regulations in their jurisdiction. 
              Some services may not be available in certain countries or regions.
            </p>
          </section>

          <section className="mb-8">
            <h2>No Investment Advice</h2>
            <p>
              Our platform provides trading services only. We do not provide investment advice, 
              recommendations, or guidance. All trading decisions are made at your own discretion and risk.
            </p>
          </section>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
              Acknowledgment Required
            </h3>
            <p className="text-red-700 dark:text-red-400">
              By using our services, you acknowledge that you have read, understood, and accept these risks. 
              You confirm that you are trading with capital you can afford to lose entirely.
            </p>
          </div>
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
