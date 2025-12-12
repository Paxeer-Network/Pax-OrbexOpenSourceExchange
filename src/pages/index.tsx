// src/pages/index.jsx
import React from "react";
import HeroSection from "@/components/pages/frontend/HeroSection";
import HeroContentSection from "@/components/pages/frontend/HeroContentSection";
import FeaturesSection from "@/components/pages/frontend/FeaturesSection";
import Footer from "@/components/pages/frontend/Footer";
import Layout from "@/layouts/Nav";
import BuilderComponent from "@/components/pages/frontend/BuilderComponent";
import StatusSection from "@/components/pages/frontend/StatusSection";
import CookieBanner from "@/components/pages/frontend/Cookie";
import BannerSection from "@/components/pages/frontend/BannerSection";
import MarketsSection from "@/components/pages/frontend/MarketsSection";
import PhoneSection from "@/components/pages/frontend/PhoneSection";
import { useDashboardStore } from "@/stores/dashboard";

const Home = () => {
  const { settings } = useDashboardStore();
  if (settings?.frontendType === "builder") return <BuilderComponent />;

  return (
    <Layout horizontal>
      <HeroSection />
      <HeroContentSection />
      <MarketsSection />
      <PhoneSection />
      <StatusSection />
      <FeaturesSection />
      <BannerSection />
      <Footer />
      <CookieBanner />
    </Layout>
  );
};

export default Home;
