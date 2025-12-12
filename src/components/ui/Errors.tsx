import React from "react";
import Layout from "@/layouts/Default";
import { useTranslation } from "next-i18next";

interface ErrorProps {
  title: string;
  description?: string;
  link?: string;
  linkTitle?: string;
}

export const NotFound = ({
  title,
  description,
  link,
  linkTitle,
}: ErrorProps) => {
  const { t } = useTranslation();

  return (
    <Layout title={t("Not Found")} color="muted">
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-muted-800 dark:text-muted-200">
          {t(`${title} Not Found`)}
        </h2>
        {description && (
          <p className="text-muted-600 dark:text-muted-400 mt-4">
            {t(description)}
          </p>
        )}
        <a
          href={link || "/"}
          className="text-primary-500 hover:underline mt-6 inline-block"
        >
          {t(linkTitle || "Go Back")}
        </a>
      </div>
    </Layout>
  );
};

export const ErrorPage = ({
  title,
  description,
  link,
  linkTitle,
}: ErrorProps) => {
  const { t } = useTranslation();

  return (
    <Layout title={t("Error")} color="muted">
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-danger-500">
          {t(title || "Error")}
        </h2>
        {description && (
          <p className="text-muted-600 dark:text-muted-400 mt-4">
            {t(description)}
          </p>
        )}
        <a
          href={link || "/"}
          className="text-primary-500 hover:underline mt-6 inline-block"
        >
          {t(linkTitle || "Go Back")}
        </a>
      </div>
    </Layout>
  );
};
