import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "@/layouts/Nav";
import { useTranslation } from "next-i18next";

export default function CookiePolicy() {
  const { t } = useTranslation();

  return (
    <Layout title="Cookie Policy" color="muted">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-center mb-8">Cookie Policy</h1>
          
          <section className="mb-8">
            <h2>What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and enabling essential 
              website functions.
            </p>
          </section>

          <section className="mb-8">
            <h2>How We Use Cookies</h2>
            <p>We use cookies for several purposes:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors use our website</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Targeting Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Types of Cookies We Use</h2>
            
            <h3>Essential Cookies</h3>
            <p>These cookies are necessary for the website to function properly:</p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <ul className="mb-0">
                <li>Authentication cookies (login sessions)</li>
                <li>Security cookies (CSRF protection)</li>
                <li>Load balancing cookies</li>
                <li>Language preference cookies</li>
              </ul>
            </div>

            <h3>Analytics Cookies</h3>
            <p>Help us understand website usage and improve our services:</p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <ul className="mb-0">
                <li>Google Analytics cookies</li>
                <li>Page view tracking</li>
                <li>User behavior analysis</li>
                <li>Performance monitoring</li>
              </ul>
            </div>

            <h3>Functional Cookies</h3>
            <p>Enhance your experience by remembering your choices:</p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <ul className="mb-0">
                <li>Theme preferences (dark/light mode)</li>
                <li>Currency display preferences</li>
                <li>Trading pair favorites</li>
                <li>Dashboard customizations</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2>Third-Party Cookies</h2>
            <p>We may use third-party services that set cookies:</p>
            <ul>
              <li><strong>Google Analytics:</strong> Website analytics and user behavior tracking</li>
              <li><strong>reCAPTCHA:</strong> Bot protection and security</li>
              <li><strong>Payment Processors:</strong> Secure payment processing</li>
              <li><strong>Support Services:</strong> Customer support chat functionality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Managing Cookies</h2>
            <p>You can control cookies through your browser settings:</p>
            
            <h3>Browser Settings</h3>
            <ul>
              <li>Block all cookies</li>
              <li>Accept only first-party cookies</li>
              <li>Delete existing cookies</li>
              <li>Receive notifications when cookies are set</li>
            </ul>

            <h3>Browser-Specific Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Chrome</h4>
                <p className="text-sm">Settings → Privacy and Security → Cookies and other site data</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Firefox</h4>
                <p className="text-sm">Options → Privacy & Security → Cookies and Site Data</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Safari</h4>
                <p className="text-sm">Preferences → Privacy → Manage Website Data</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Edge</h4>
                <p className="text-sm">Settings → Cookies and site permissions → Cookies and site data</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2>Cookie Duration</h2>
            <p>Cookies may be:</p>
            <ul>
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
            </ul>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
              <p className="mb-0 text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Some essential cookies are required for security and cannot be disabled 
                without affecting website functionality.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2>Updates to Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted on this page 
              with an updated effective date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2>Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="mb-2"><strong>Email:</strong> privacy@paxeer.app</p>
              <p className="mb-0"><strong>Address:</strong> [Your Company Address]</p>
            </div>
          </section>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
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
