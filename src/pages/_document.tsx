import { Html, Head, Main, NextScript } from "next/document";
import { THEME_KEY } from "@/stores/dashboard";

const defaultTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME || "system";
const darkmodeInitScript = `(function () {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const setting = localStorage.getItem('${THEME_KEY}') || '${defaultTheme}'
  if (setting === 'dark' || (prefersDark && setting !== 'light')) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})()`;

export default function Document() {
  return (
    <Html suppressHydrationWarning={true}>
      <Head>
        <script
          dangerouslySetInnerHTML={{ __html: darkmodeInitScript }}
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="portal-root"></div>
      </body>
    </Html>
  );
}
