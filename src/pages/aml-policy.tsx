import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "@/layouts/Nav";
import { useTranslation } from "next-i18next";

export default function AMLPolicy() {
  const { t } = useTranslation();

  return (
    <Layout title="Anti-Money Laundering Policy" color="muted">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-center mb-8">Anti-Money Laundering (AML) Policy</h1>
          
          <section className="mb-8">
            <h2>Policy Overview</h2>
            <p>
              OCF Exchange is committed to maintaining the highest standards of anti-money laundering (AML) 
              and counter-terrorism financing (CTF) compliance. We have implemented robust procedures to 
              detect, prevent, and report suspicious activities.
            </p>
          </section>

          <section className="mb-8">
            <h2>Know Your Customer (KYC) Requirements</h2>
            <p>We implement comprehensive KYC procedures including:</p>
            <ul>
              <li>Identity verification for all users</li>
              <li>Address verification</li>
              <li>Source of funds documentation</li>
              <li>Enhanced due diligence for high-risk customers</li>
              <li>Ongoing monitoring of customer activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Customer Due Diligence (CDD)</h2>
            <h3>Standard CDD Measures:</h3>
            <ul>
              <li>Identification and verification of customer identity</li>
              <li>Understanding the purpose and nature of business relationship</li>
              <li>Ongoing monitoring of transactions and activities</li>
              <li>Record keeping of customer information and transactions</li>
            </ul>
            
            <h3>Enhanced Due Diligence (EDD):</h3>
            <p>Applied to higher-risk customers, including:</p>
            <ul>
              <li>Politically Exposed Persons (PEPs)</li>
              <li>Customers from high-risk jurisdictions</li>
              <li>High-value transaction customers</li>
              <li>Unusual transaction patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Transaction Monitoring</h2>
            <p>We employ automated systems and manual reviews to monitor:</p>
            <ul>
              <li>Large or unusual transactions</li>
              <li>Rapid movement of funds</li>
              <li>Transactions involving high-risk jurisdictions</li>
              <li>Structured transactions designed to avoid reporting thresholds</li>
              <li>Transactions inconsistent with customer profile</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Suspicious Activity Reporting</h2>
            <p>
              We file Suspicious Activity Reports (SARs) with relevant authorities when we detect 
              transactions or activities that may indicate:
            </p>
            <ul>
              <li>Money laundering</li>
              <li>Terrorist financing</li>
              <li>Tax evasion</li>
              <li>Fraud</li>
              <li>Other illegal activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Sanctions Screening</h2>
            <p>
              We screen all customers and transactions against:
            </p>
            <ul>
              <li>OFAC Sanctions Lists</li>
              <li>UN Security Council Sanctions Lists</li>
              <li>EU Sanctions Lists</li>
              <li>Other relevant sanctions and watch lists</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Record Keeping</h2>
            <p>We maintain comprehensive records including:</p>
            <ul>
              <li>Customer identification documents</li>
              <li>Transaction records</li>
              <li>Correspondence with customers</li>
              <li>Risk assessments</li>
              <li>Training records</li>
            </ul>
            <p>Records are retained for a minimum of 5 years as required by applicable laws.</p>
          </section>

          <section className="mb-8">
            <h2>Training and Awareness</h2>
            <p>
              All employees receive regular AML training covering:
            </p>
            <ul>
              <li>Recognition of suspicious activities</li>
              <li>Reporting procedures</li>
              <li>Regulatory requirements</li>
              <li>Customer due diligence procedures</li>
              <li>Sanctions compliance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Compliance Officer</h2>
            <p>
              Our designated AML Compliance Officer is responsible for:
            </p>
            <ul>
              <li>Overseeing AML compliance program</li>
              <li>Filing required reports</li>
              <li>Ensuring staff training</li>
              <li>Maintaining relationships with regulatory authorities</li>
              <li>Regular program reviews and updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Customer Responsibilities</h2>
            <p>Customers are required to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Update information when circumstances change</li>
              <li>Comply with verification requests</li>
              <li>Report any unauthorized account activity</li>
              <li>Ensure compliance with applicable laws in their jurisdiction</li>
            </ul>
          </section>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-medium text-orange-800 dark:text-orange-300 mb-2">
              Contact Information
            </h3>
            <p className="text-orange-700 dark:text-orange-400">
              For AML-related inquiries, please contact our Compliance Team at compliance@paxeer.app
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
