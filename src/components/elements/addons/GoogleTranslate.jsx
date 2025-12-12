"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = require("@/stores/dashboard");
const script_1 = __importDefault(require("next/script"));
const react_1 = require("react");
const GoogleTranslate = () => {
    const { settings } = (0, dashboard_1.useDashboardStore)();
    (0, react_1.useEffect)(() => {
        const initializeTranslation = () => {
            const userLanguage = navigator.language || "en"; // Get the user's browser language
            const sourceLanguage = userLanguage.split("-")[0]; // Detect source language from user's browser
            const targetLanguage = (settings === null || settings === void 0 ? void 0 : settings.googleTargetLanguage) || "en"; // Use settings.googleTargetLanguage or default to "en"
            // If the source and target languages are the same, no need to translate
            if (sourceLanguage === targetLanguage) {
                return;
            }
            // Set the Google Translate cookie to translate from user's language to target
            document.cookie = `googtrans=/${sourceLanguage}/${targetLanguage};path=/;secure;samesite=strict`;
            // Initialize Google Translate after the script has loaded
            window.initializeGoogleTranslateElement = () => {
                var _a;
                if ((_a = window.google) === null || _a === void 0 ? void 0 : _a.translate) {
                    new window.google.translate.TranslateElement({ pageLanguage: sourceLanguage }, "google_translate_element");
                }
            };
        };
        // Initialize translation logic on mount or settings change
        initializeTranslation();
        return () => {
            // Cleanup cookie when unmounting to prevent stale settings
            document.cookie = `googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC`;
        };
    }, [settings === null || settings === void 0 ? void 0 : settings.googleTargetLanguage]);
    return (<>
      <script_1.default src="//translate.google.com/translate_a/element.js?cb=initializeGoogleTranslateElement" strategy="afterInteractive"/>
      <div id="google_translate_element" style={{ display: "none", visibility: "hidden" }}></div>
    </>);
};
exports.default = GoogleTranslate;
