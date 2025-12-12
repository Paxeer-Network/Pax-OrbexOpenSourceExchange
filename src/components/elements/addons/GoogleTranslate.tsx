import { useDashboardStore } from "@/stores/dashboard";
import Script from "next/script";
import { useEffect } from "react";

// Extend the global window interface to declare the custom property
declare global {
  interface Window {
    initializeGoogleTranslateElement: () => void;
    google: any; // Declare google as any since TypeScript does not know about it
  }
}

const GoogleTranslate = () => {
  const { settings } = useDashboardStore();

  useEffect(() => {
    const initializeTranslation = () => {
      const userLanguage = navigator.language || "en"; // Get the user's browser language
      const sourceLanguage = userLanguage.split("-")[0]; // Detect source language from user's browser
      const targetLanguage = settings?.googleTargetLanguage || "en"; // Use settings.googleTargetLanguage or default to "en"

      // If the source and target languages are the same, no need to translate
      if (sourceLanguage === targetLanguage) {
        return;
      }

      // Set the Google Translate cookie to translate from user's language to target
      document.cookie = `googtrans=/${sourceLanguage}/${targetLanguage};path=/;secure;samesite=strict`;

      // Initialize Google Translate after the script has loaded
      window.initializeGoogleTranslateElement = () => {
        if (window.google?.translate) {
          new window.google.translate.TranslateElement(
            { pageLanguage: sourceLanguage },
            "google_translate_element"
          );
        }
      };
    };

    // Initialize translation logic on mount or settings change
    initializeTranslation();

    return () => {
      // Cleanup cookie when unmounting to prevent stale settings
      document.cookie = `googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    };
  }, [settings?.googleTargetLanguage]);

  return (
    <>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=initializeGoogleTranslateElement"
        strategy="afterInteractive"
      />
      <div
        id="google_translate_element"
        style={{ display: "none", visibility: "hidden" }}
      ></div>
    </>
  );
};

export default GoogleTranslate;
