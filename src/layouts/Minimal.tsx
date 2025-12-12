import React, { type FC } from "react";
import Head from "next/head";
import { useDashboardStore } from "@/stores/dashboard";

type LayoutColors = "default" | "muted";
interface LayoutProps {
  children: React.ReactNode;
  color?: LayoutColors;
  title?: string;
  description?: string;
}

const siteTitle = process.env.NEXT_PUBLIC_SITE_NAME;
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION;

const Layout: FC<LayoutProps> = ({
  children,
  title = siteTitle,
  description = siteDescription,
  color = "default",
}) => {
  const { settings } = useDashboardStore();

  return (
    <main>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="locale" content="en US" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta name="twitter:card" content="summary large image" />
        <meta property="og:height" content="630" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:type" content="website" />

        {[
          {
            size: "57x57",
            src: settings?.appleIcon57,
          },
          {
            size: "60x60",
            src: settings?.appleIcon60,
          },
          {
            size: "72x72",
            src: settings?.appleIcon72,
          },
          {
            size: "76x76",
            src: settings?.appleIcon76,
          },
          {
            size: "114x114",
            src: settings?.appleIcon114,
          },
          {
            size: "120x120",
            src: settings?.appleIcon120,
          },
          {
            size: "144x144",
            src: settings?.appleIcon144,
          },
          {
            size: "152x152",
            src: settings?.appleIcon152,
          },
          {
            size: "180x180",
            src: settings?.appleIcon180,
          },
          {
            size: "192x192",
            src: settings?.androidIcon192,
          },
          {
            size: "256x256",
            src: settings?.androidIcon256,
          },
          {
            size: "384x384",
            src: settings?.androidIcon384,
          },
          {
            size: "512x512",
            src: settings?.androidIcon512,
          },
          {
            size: "32x32",
            src: settings?.favicon32,
          },
          {
            size: "96x96",
            src: settings?.favicon96,
          },
          {
            size: "16x16",
            src: settings?.favicon16,
          },
        ]
          .filter((icon) => icon.src) // Only include icons that have a src
          .map((icon) => (
            <link
              key={icon.size}
              rel="icon"
              type="image/png"
              sizes={icon.size}
              href={icon.src}
            />
          ))}
        {settings?.msIcon144 && (
          <meta name="msapplication-TileImage" content={settings.msIcon144} />
        )}
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div
        className={`min-h-screen transition-all duration-300 ${
          color === "muted" ? "bg-muted-50" : "bg-white"
        } dark:bg-muted-900`}
      >
        {children}
      </div>
    </main>
  );
};

export default Layout;
