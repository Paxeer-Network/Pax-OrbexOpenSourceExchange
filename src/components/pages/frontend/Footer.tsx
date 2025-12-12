import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useDashboardStore } from "@/stores/dashboard";
import { Icon } from "@iconify/react";
import LogoText from "@/components/vector/LogoText";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "OCF Exchange";

const FooterSection: React.FC = () => {
  const { t } = useTranslation();
  const { settings } = useDashboardStore();

  const socialLinks = {
    facebook: settings?.facebookLink || "#",
    twitter: settings?.twitterLink || "#",
    instagram: settings?.instagramLink || "#",
    linkedin: settings?.linkedinLink || "#",
    telegram: settings?.telegramLink || "#",
    youtube: settings?.youtubeLink || "#",
    discord: settings?.discordLink || "#",
    reddit: settings?.redditLink || "#",
  };

  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press & Media", href: "/press" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Products",
      links: [
        { name: "Spot Trading", href: "/market" },
        { name: "Futures Trading", href: "/futures" },
        { name: "P2P Trading", href: "/p2p" },
        { name: "Copy Trading", href: "/login" },
        { name: "Earn", href: "/earn" },
        { name: "NFT Marketplace", href: "/nft" },
        { name: "Launchpad", href: "https://ocfstudio.com" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/login" },
        { name: "Customer Service", href: "/login" },
        { name: "Submit Ticket", href: "/user/support/ticket" },
        { name: "API Documentation", href: "https://syncron-trading-protocol.readme.io/reference/listapikeys" },
        { name: "Trading Fees", href: "/fees" },
        { name: "System Status", href: "/login" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Institutional", href: "/institutional" },
        { name: "VIP Program", href: "/login" },
        { name: "Affiliate Program", href: "/login" },
        { name: "Referral Program", href: "/login" },
        { name: "Bug Bounty", href: "/login" },
        { name: "Listing Application", href: "/login" },
      ],
    },
    {
      title: "Learn",
      links: [
        { name: "Crypto Guide", href: "/login" },
        { name: "Trading Guide", href: "/login" },
        { name: "Security Guide", href: "/login" },
        { name: "Blog", href: "/blog" },
        { name: "Market Analysis", href: "/login" },
        { name: "Research Reports", href: "/login" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Risk Disclosure", href: "/risk-disclosure" },
        { name: "Cookie Policy", href: "/cookie-policy" },
        { name: "AML Policy", href: "/aml-policy" },
        { name: "Compliance", href: "/compliance" },
        { name: "Licenses", href: "/licenses" },
        { name: "Regulatory", href: "/regulatory" },
      ],
    },
  ];

  return (
    <footer className="bg-muted-50 dark:bg-muted-950 border-t border-muted-200 dark:border-muted-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <LogoText className="h-8 w-auto text-muted-900 dark:text-white" />
            </Link>
            <p className="text-sm text-muted-600 dark:text-muted-400 mb-4">
              {siteName} is a leading cryptocurrency exchange providing secure,
              reliable trading services with advanced tools for traders worldwide.
              Trade with confidence on our professional platform.
            </p>
            <div className="flex space-x-4">
              <Link
                href={socialLinks.twitter}
                className="text-muted-500 hover:text-primary-500 dark:text-muted-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <Icon icon="mdi:twitter" className="w-6 h-6" />
              </Link>
              <Link
                href={socialLinks.telegram}
                className="text-muted-500 hover:text-primary-500 dark:text-muted-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Telegram"
              >
                <Icon icon="mdi:telegram" className="w-6 h-6" />
              </Link>
              <Link
                href={socialLinks.discord}
                className="text-muted-500 hover:text-primary-500 dark:text-muted-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Discord"
              >
                <Icon icon="mdi:discord" className="w-6 h-6" />
              </Link>
              <Link
                href={socialLinks.youtube}
                className="text-muted-500 hover:text-primary-500 dark:text-muted-400 dark:hover:text-primary-400 transition-colors"
                aria-label="YouTube"
              >
                <Icon icon="mdi:youtube" className="w-6 h-6" />
              </Link>
              <Link
                href={socialLinks.linkedin}
                className="text-muted-500 hover:text-primary-500 dark:text-muted-400 dark:hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Icon icon="mdi:linkedin" className="w-6 h-6" />
              </Link>
              <Link
                href={socialLinks.reddit}
                className="text-muted-500 hover:text-primary-500 dark:text-muted-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Reddit"
              >
                <Icon icon="mdi:reddit" className="w-6 h-6" />
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="text-sm font-semibold text-muted-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-600 dark:text-muted-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App Download Section */}
        <div className="border-t border-muted-200 dark:border-muted-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-muted-900 dark:text-white mb-2">
                Trade on the go
              </h3>
              <p className="text-sm text-muted-600 dark:text-muted-400">
                Download our mobile apps for iOS and Android
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="flex items-center space-x-2 bg-muted-900 dark:bg-white text-white dark:text-muted-900 px-4 py-2 rounded-lg hover:bg-muted-800 dark:hover:bg-muted-100 transition-colors"
              >
                <Icon icon="mdi:apple" className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Link>
              <Link
                href="#"
                className="flex items-center space-x-2 bg-muted-900 dark:bg-white text-white dark:text-muted-900 px-4 py-2 rounded-lg hover:bg-muted-800 dark:hover:bg-muted-100 transition-colors"
              >
                <Icon icon="mdi:google-play" className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-muted-200 dark:border-muted-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-muted-600 dark:text-muted-400">
                © {new Date().getFullYear()} {siteName}. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm text-muted-600 dark:text-muted-400">
                <span>🇺🇸 English</span>
                <span>USD</span>
              </div>
            </div>
            <div className="text-sm text-muted-600 dark:text-muted-400">
              <p>Licensed and Regulated Financial Service Provider</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
