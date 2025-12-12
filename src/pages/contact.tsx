import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "@/layouts/Nav";
import { useTranslation } from "next-i18next";
import { Icon } from "@iconify/react";

export default function Contact() {
  const { t } = useTranslation();

  const contactMethods = [
    {
      icon: "mdi:email",
      title: "Email Support",
      description: "Get help from our support team",
      contact: "support@paxeer.app",
      responseTime: "24 hours"
    },
    {
      icon: "mdi:phone",
      title: "Phone Support",
      description: "Speak with our representatives",
      contact: "+1 (555) 123-4567",
      responseTime: "Business hours"
    },
    {
      icon: "mdi:chat",
      title: "Live Chat",
      description: "Chat with us in real-time",
      contact: "Available 24/7",
      responseTime: "Instant"
    },
    {
      icon: "mdi:telegram",
      title: "Telegram",
      description: "Join our community",
      contact: "@ocfexchange",
      responseTime: "Community support"
    }
  ];

  const offices = [
    {
      city: "New York",
      address: "123 Wall Street, Suite 456",
      zipCode: "New York, NY 10005",
      country: "United States",
      phone: "+1 (212) 555-0123"
    },
    {
      city: "London",
      address: "45 Canary Wharf",
      zipCode: "London E14 5AB",
      country: "United Kingdom", 
      phone: "+44 20 7946 0958"
    },
    {
      city: "Singapore",
      address: "1 Marina Bay Sands",
      zipCode: "Singapore 018956",
      country: "Singapore",
      phone: "+65 6688 8888"
    }
  ];

  return (
    <Layout title="Contact Us" color="muted">
      <div className="min-h-screen bg-muted-50 dark:bg-muted-950">
        {/* Hero Section */}
        <div className="bg-white dark:bg-muted-900 border-b border-muted-200 dark:border-muted-800">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-muted-900 dark:text-white mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-muted-600 dark:text-muted-400 max-w-2xl mx-auto">
                Have questions? We&apos;re here to help. Reach out to our team for support, 
                partnership inquiries, or general questions.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Contact Methods */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-muted-900 dark:text-white mb-12">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white dark:bg-muted-900 rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon icon={method.icon} className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-muted-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-muted-600 dark:text-muted-400 mb-3">
                    {method.description}
                  </p>
                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-1">
                    {method.contact}
                  </p>
                  <p className="text-xs text-muted-500 dark:text-muted-500">
                    {method.responseTime}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Form */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-bold text-muted-900 dark:text-white mb-6">
                  Send us a Message
                </h2>
                <p className="text-muted-600 dark:text-muted-400 mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon as possible. 
                  For urgent issues, please use our live chat or phone support.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Icon icon="mdi:clock-outline" className="w-5 h-5 text-primary-500 mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold text-muted-900 dark:text-white">Support Hours</h4>
                      <p className="text-sm text-muted-600 dark:text-muted-400">
                        24/7 for live chat and email<br />
                        Monday - Friday, 9 AM - 6 PM EST for phone
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Icon icon="mdi:shield-check" className="w-5 h-5 text-primary-500 mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold text-muted-900 dark:text-white">Security Notice</h4>
                      <p className="text-sm text-muted-600 dark:text-muted-400">
                        Never share your password, API keys, or sensitive account information via email or chat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-muted-900 rounded-xl p-8 shadow-lg">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                        First Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 border border-muted-300 dark:border-muted-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-muted-800 dark:text-white"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                        Last Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 border border-muted-300 dark:border-muted-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-muted-800 dark:text-white"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-4 py-3 border border-muted-300 dark:border-muted-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-muted-800 dark:text-white"
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                      Subject *
                    </label>
                    <select 
                      required
                      className="w-full px-4 py-3 border border-muted-300 dark:border-muted-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-muted-800 dark:text-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="trading">Trading Issues</option>
                      <option value="account">Account Issues</option>
                      <option value="partnership">Partnership</option>
                      <option value="institutional">Institutional Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                      Message *
                    </label>
                    <textarea 
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-muted-300 dark:border-muted-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-muted-800 dark:text-white resize-none"
                      placeholder="Please describe your inquiry in detail..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    Send Message
                    <Icon icon="mdi:send" className="ml-2 w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Office Locations */}
          <section>
            <h2 className="text-3xl font-bold text-center text-muted-900 dark:text-white mb-12">
              Our Offices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offices.map((office, index) => (
                <div key={index} className="bg-white dark:bg-muted-900 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-muted-900 dark:text-white mb-4 flex items-center">
                    <Icon icon="mdi:map-marker" className="w-5 h-5 text-primary-500 mr-2" />
                    {office.city}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-600 dark:text-muted-400">
                    <p>{office.address}</p>
                    <p>{office.zipCode}</p>
                    <p>{office.country}</p>
                    <p className="flex items-center">
                      <Icon icon="mdi:phone" className="w-4 h-4 mr-2" />
                      {office.phone}
                    </p>
                  </div>
                </div>
              ))}
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
