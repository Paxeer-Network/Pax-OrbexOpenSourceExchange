"use client";
import React, { memo, useEffect } from "react";
import { Orders } from "@/components/pages/binary/orders";
import {
  layoutNotPushedClasses,
  layoutPushedClasses,
} from "@/components/layouts/styles";
import { BinaryNav } from "@/components/pages/binary/nav";
import useMarketStore from "@/stores/trade/market";
import { Chart } from "@/components/pages/trade/chart";
import { Order } from "@/components/pages/binary/order";
import { useRouter } from "next/router";
import Head from "next/head";
import { useDashboardStore } from "@/stores/dashboard";

const binaryStatus = Boolean(process.env.NEXT_PUBLIC_BINARY_STATUS || true);
const siteTitle = process.env.NEXT_PUBLIC_SITE_NAME || "Default Site Title";
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Default Site Description";

const BinaryTradePageBase = () => {
  const router = useRouter();
  const { setWithEco } = useMarketStore();
  const { settings } = useDashboardStore();

  useEffect(() => {
    if (!binaryStatus) {
      router.push("/404");
    } else {
      setWithEco(false);
    }
  }, [router, setWithEco]);

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
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
      <div className="w-full h-full bg-white dark:bg-muted-900 ">
        <div className="sticky top-0 z-50 bg-white dark:bg-muted-900 w-[100%_-_4px]">
          <BinaryNav />
        </div>

        <div
          className={`top-navigation-wrapper relative min-h-screen transition-all duration-300 dark:bg-muted-1000/[0.96] pt-16 lg:pt-4 pb-20 ${
            false
              ? "is-pushed " + layoutPushedClasses["top-navigation"]
              : layoutNotPushedClasses["top-navigation"]
          } bg-muted-50/[0.96] !pb-0 !pe-0 !pt-0`}
        >
          {/* <LayoutSwitcher /> */}
          <div
            className={`"max-w-full flex h-full min-h-screen flex-col [&>div]:h-full [&>div]:min-h-screen`}
          >
            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-1 mt-1">
              <div className="border-thin col-span-1 md:col-span-10 lg:col-span-11 min-h-[55vh] md:min-h-[calc(100vh_-_120px)] bg-white dark:bg-muted-900">
                <Chart />
              </div>
              <div className="border-thin col-span-1 md:col-span-2 lg:col-span-1 h-full bg-white dark:bg-muted-900">
                <Order />
              </div>
              <div className="border-thin col-span-1 md:col-span-12 min-h-[40vh] bg-white dark:bg-muted-900">
                <Orders />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const BinaryTradePage = memo(BinaryTradePageBase);
export default BinaryTradePage;
