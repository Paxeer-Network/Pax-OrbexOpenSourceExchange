// src/pages/aboutus.tsx
import fs from "fs";
import path from "path";
import React from "react";
import Layout from "@/layouts/Nav";
import { GetStaticProps } from "next";
import FooterSection from "@/components/pages/frontend/Footer";

interface AboutUsPageProps {
  content: string;
}

export const getStaticProps: GetStaticProps<AboutUsPageProps> = async () => {
  const filePath = path.join(process.cwd(), "template", "about-us.html");
  const fileContents = fs.readFileSync(filePath, "utf8");

  return {
    props: {
      content: fileContents,
    },
  };
};

const AboutUsPage: React.FC<AboutUsPageProps> = ({ content }) => {
  return (
    <Layout color="muted" horizontal>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-10 prose prose-lg dark:prose-dark">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <FooterSection />
    </Layout>
  );
};

export default AboutUsPage;
