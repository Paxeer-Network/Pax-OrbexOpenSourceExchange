import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { locales } from "./Locales";
import { Icon } from "@iconify/react";

// Define the type for a locale item
interface Locale {
  code: string;
  name: string;
  flag: string;
}

const LocaleLogoBase = () => {
  const { i18n } = useTranslation();
  const [currentLocale, setCurrentLocale] = useState<Locale | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state after hydration to avoid SSR mismatch
    setIsMounted(true);
    const locale =
      locales.find((locale) => locale.code === i18n.language) || null;

    // Provide a fallback name if it's undefined
    if (locale) {
      setCurrentLocale({
        ...locale,
        name: locale.name || "Unknown", // Fallback to "Unknown" if name is undefined
      });
    } else {
      setCurrentLocale(null);
    }
  }, [i18n.language]);

  if (!isMounted) {
    return null; // Avoid rendering until after the component has mounted
  }

  return currentLocale ? (
    <img
      src={`/img/flag/${currentLocale.flag}.svg`}
      alt={currentLocale.name}
      width={16}
      height={"auto"}
    />
  ) : (
    <Icon
      icon="iconoir:language"
      className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"
    />
  );
};

export const LocaleLogo = memo(LocaleLogoBase);
