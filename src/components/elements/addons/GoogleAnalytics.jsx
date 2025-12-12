"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// components/elements/addons/GoogleAnalytics.tsx
const script_1 = __importDefault(require("next/script"));
const GoogleAnalytics = () => {
    if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS !== "true") {
        return null;
    }
    return (<>
      <script_1.default src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`} strategy="afterInteractive"/>
      <script_1.default id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </script_1.default>
    </>);
};
exports.default = GoogleAnalytics;
