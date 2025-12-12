import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { AppWebSocketProvider } from "@/context/WebSocketContext";
import { restoreLayoutFromStorage } from "@/stores/layout";
import { appWithTranslation } from "next-i18next";
import "../i18n";
import { useDashboardStore } from "@/stores/dashboard";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

const GoogleAnalytics = dynamic(
  () => import("@/components/elements/addons/GoogleAnalytics"),
  { ssr: false }
);
const FacebookPixel = dynamic(
  () => import("@/components/elements/addons/FacebookPixel"),
  { ssr: false }
);

const GoogleTranslate = dynamic(
  () => import("@/components/elements/addons/GoogleTranslate"),
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  const { fetchProfile, settings } = useDashboardStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    restoreLayoutFromStorage();
    setMounted(true);
  }, []);

  useEffect(() => {
    restoreLayoutFromStorage();
  }, []);

  useEffect(() => {
    if (router.isReady && !settings) {
      fetchProfile();
    }
  }, [router.isReady, settings, fetchProfile]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_STATUS === "true") {
        const { gtag } = window as any;
        gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
          page_path: url,
        });
      }
      if (process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_STATUS === "true") {
        const { fbq } = window as any;
        fbq("track", "PageView");
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  if (!mounted) {
    // Ensures server and client render the same content
    return null;
  }

  if (!settings) {
    // This will now run only after the component has mounted
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">
          <Icon
            icon="mingcute:loading-3-line"
            className="animate-spin mr-2 h-12 w-12"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-muted-950/[0.96]">
      <Toaster
        closeButton
        richColors
        theme="system"
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />
      <GoogleAnalytics />
      <FacebookPixel />
      {settings?.googleTranslateStatus === "true" && <GoogleTranslate />}
      <Component {...pageProps} />
    </div>
  );
}

const AppWithProviders = appWithTranslation(MyApp);

function WrappedApp(props: AppProps) {
  return (
    <AppWebSocketProvider>
      <AppWithProviders {...props} />
    </AppWebSocketProvider>
  );
}

export default WrappedApp;
