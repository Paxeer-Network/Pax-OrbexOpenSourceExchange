import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "@/layouts/Nav";
import { useTranslation } from "next-i18next";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Institutional() {
  const { t } = useTranslation();

  const services = [
    {
      icon: "mdi:bank",
      title: "Prime Brokerage",
      description: "Comprehensive trading solutions with multi-venue access, smart order routing, and institutional-grade execution."
    },
    {
      icon: "mdi:shield-check",
      title: "Custody Services",
      description: "Secure digital asset custody with multi-signature wallets, cold storage, and insurance coverage."
    },
    {
      icon: "mdi:chart-line",
      title: "Market Making",
      description: "Deep liquidity provision and market making services for enhanced trading experience."
    },
    {
      icon: "mdi:api",
      title: "API Integration",
      description: "Robust REST and WebSocket APIs for seamless integration with your trading infrastructure."
    },
    {
      icon: "mdi:account-group",
      title: "White Label",
      description: "Complete white-label exchange solutions with customizable features and branding."
    },
    {
      icon: "mdi:finance",
      title: "OTC Trading",
      description: "Over-the-counter trading services for large volume transactions with competitive pricing."
    }
  ];

  const features = [
    "24/7 dedicated institutional support",
    "Competitive fee structures",
    "Advanced risk management tools",
    "Regulatory compliance assistance",
    "Custom reporting and analytics",
    "Multi-currency settlement",
    "Cross-margining capabilities",
    "High-frequency trading support"
  ];

  return (
    <Layout title="Institutional Services" color="muted">
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">Institutional Services</h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Professional-grade cryptocurrency trading solutions designed for institutions, 
                funds, and high-volume traders.
              </p>
              <div className="mt-8">
                <Link 
                  href="/contact"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                >
                  Contact Sales Team
                  <Icon icon="mdi:arrow-right" className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-muted-900 dark:text-white mb-4">
              Comprehensive Institutional Solutions
            </h2>
            <p className="text-lg text-muted-600 dark:text-muted-400 max-w-2xl mx-auto">
              Everything you need to trade, custody, and manage digital assets at institutional scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white dark:bg-muted-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-6">
                  <Icon icon={service.icon} className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-muted-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-600 dark:text-muted-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-muted-50 dark:bg-muted-950">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-muted-900 dark:text-white mb-6">
                  Why Choose Our Institutional Platform?
                </h2>
                <p className="text-lg text-muted-600 dark:text-muted-400 mb-8">
                  Built for the unique needs of institutional clients with enterprise-grade 
                  security, compliance, and performance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-muted-700 dark:text-muted-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-muted-900 rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-semibold text-muted-900 dark:text-white mb-6">
                  Get Started Today
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                      Company Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-muted-300 dark:border-muted-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-muted-800 dark:text-white"
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-muted-300 dark:border-muted-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-muted-800 dark:text-white"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                      Monthly Trading Volume (USD)
                    </label>
                    <select className="w-full px-4 py-3 border border-muted-300 dark:border-muted-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-muted-800 dark:text-white">
                      <option>$1M - $10M</option>
                      <option>$10M - $100M</option>
                      <option>$100M - $1B</option>
                      <option>$1B+</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Request Information
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-muted-900 dark:text-white mb-6">
            Ready to Scale Your Trading Operations?
          </h2>
          <p className="text-lg text-muted-600 dark:text-muted-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of institutions already trading on our platform. 
            Contact our sales team to discuss your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
            >
              Contact Sales
              <Icon icon="mdi:arrow-right" className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/api-docs"
              className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors inline-flex items-center justify-center"
            >
              View API Docs
              <Icon icon="mdi:api" className="ml-2 w-5 h-5" />
            </Link>
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
