import React, { type FC, useMemo } from "react";
import Head from "next/head";
import {
  layoutWrapperClasses,
  layoutNotPushedClasses,
  layoutPushedClasses,
} from "@/components/layouts/styles";
import TopNavigationProvider from "@/components/layouts/top-navigation/TopNavigationProvider";
import SidebarPanelProvider from "@/components/layouts/sidebar-panel/SidebarPanelProvider";
import SidebarPanelFloatProvider from "@/components/layouts/sidebar-panel-float/SidebarPanelFloatProvider";
import { useDashboardStore } from "@/stores/dashboard";
import { useLayoutStore } from "@/stores/layout";
import LayoutSwitcher from "@/components/layouts/LayoutSwitcher";
import FloatingLiveChat from "@/components/layouts/floating-live-chat/FloatingLiveChat";
import { useRouter } from "next/router";

type LayoutColors = "default" | "muted";
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  color?: LayoutColors;
  fullwidth?: boolean;
  horizontal?: boolean;
  nopush?: boolean;
}

const siteTitle = process.env.NEXT_PUBLIC_SITE_NAME;
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION;

const Layout: FC<LayoutProps> = ({
  children,
  title = siteTitle,
  description = siteDescription,
  color = "default",
  fullwidth = false,
  horizontal = false,
  nopush = false,
}) => {
  const { sidebarOpened, settings } = useDashboardStore();
  const { activeLayout } = useLayoutStore();

  const router = useRouter();
  const floatingLiveChatEnabled = settings?.floatingLiveChat === true;
  const isExcludedPath = [
    "/admin",
    "/user/support",
    "/trade",
    "/user/binary",
    "/futures",
    "/user/forex/",
  ].some((excluded) => router.pathname.startsWith(excluded));

  const wrapperClass = useMemo(
    () => `${activeLayout.toLowerCase()}-wrapper`,
    [activeLayout]
  );

  const layoutProvider = useMemo(() => {
    switch (activeLayout) {
      case "sidebar-panel":
        return (
          <SidebarPanelProvider
            fullwidth={fullwidth}
            horizontal={horizontal}
            nopush={nopush}
          />
        );
      case "sidebar-panel-float":
        return (
          <SidebarPanelFloatProvider
            fullwidth={fullwidth}
            horizontal={horizontal}
            nopush={nopush}
          />
        );
      case "top-navigation":
        return (
          <TopNavigationProvider
            fullwidth={fullwidth}
            horizontal={horizontal}
          />
        );
      default:
        return null;
    }
  }, [activeLayout, fullwidth, horizontal, nopush]);

  return (
    <>
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

        <link rel="manifest" href="/manifest.json" />

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
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div
        className={`min-h-screen overflow-hidden transition-all duration-300 dark:bg-muted-950/[0.96] ${
          color === "muted" ? "bg-muted-50" : "bg-white"
        }`}
      >
        {layoutProvider}

        <div
          className={`${wrapperClass} relative min-h-screen transition-all duration-300 dark:bg-muted-950/[0.96] ${
            layoutWrapperClasses[activeLayout]
          } ${
            sidebarOpened && !nopush
              ? "is-pushed " + layoutPushedClasses[activeLayout]
              : layoutNotPushedClasses[activeLayout]
          } ${color === "muted" ? "bg-muted-50/[0.96]" : "bg-white/[0.96]"}
    ${horizontal ? "pb-0! pe-0! pt-0!" : ""}`}
        >
          <LayoutSwitcher />
          {floatingLiveChatEnabled && !isExcludedPath && <FloatingLiveChat />}
          <div
            className={`${fullwidth ? "max-w-full" : "mx-auto max-w-7xl"} ${
              horizontal
                ? "flex h-full min-h-screen flex-col [&>div]:h-full [&>div]:min-h-screen"
                : ""
            }`}
          >
            <div className={`${horizontal ? "" : "pb-20 pt-4"}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
