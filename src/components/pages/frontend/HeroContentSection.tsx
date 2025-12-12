"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Input from "@/components/elements/form/input/Input";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useDashboardStore } from "@/stores/dashboard";
import Button from "@/components/elements/base/button/Button";
import { useWalletStore } from "@/stores/user/wallet";
import { debounce } from "@/utils/throttle";
import Skeleton from "react-loading-skeleton";
import { formatFiatBalance, formatPercentage } from "@/utils/format";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME;

const HeroContentSection = () => {
  const { t } = useTranslation();
  const { isDark, profile } = useDashboardStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { pnl, fetchPnl } = useWalletStore();
  const debounceFetchPnl = debounce(fetchPnl, 100);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile && profile.firstName) {
      setLoading(true);
      setIsLoggedIn(true);
      debounceFetchPnl();
      setLoading(false);
    }
  }, [profile]);

  return (
    <section className="w-full py-20 bg-gradient-to-br from-black via-slate-950 to-blue-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#B33F40]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-[#B33F40]/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#B33F40]/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]"></div>
      
      {/* Hero Content */}
      <div className="max-w-7xl relative px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center flex flex-col justify-center space-y-8 relative z-10">
          {/* Decorative element */}
          <motion.div
            className="hidden md:block absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 border border-blue-500/20 rounded-full"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          
          <motion.div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#B33F40]/10 to-red-500/10 text-[#B33F40] border border-[#B33F40]/20 mb-6 mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
            Global Cryptocurrency Exchange
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-white block mb-2">{t("We're Building")} </span>
            <span className="bg-gradient-to-r from-[#B33F40] via-red-400 to-[#B33F40] bg-clip-text text-transparent block mb-2">
              {t("the Future of Crypto")}
            </span>
            <span className="text-gray-300 text-2xl md:text-3xl lg:text-4xl font-normal block">
              {t("with")} <span className="text-white font-semibold">{siteName}</span>
            </span>
          </motion.h1>
          
          <motion.p
            className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {t(
              "Constructing the next generation of decentralized finance with innovative technology, secure infrastructure, and powerful trading tools that empower the global crypto community."
            )}
          </motion.p>
          
          {/* Feature highlights */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">{t("Advanced Trading")}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">{t("Bank-Grade Security")}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">{t("Lightning Fast")}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">{t("24/7 Support")}</span>
            </div>
          </motion.div>

          {/* Balance and CTA based on login status */}
          <div className="flex justify-center pt-8">
            {isLoggedIn ? (
              <motion.div
                className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm max-w-md w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <div className="space-y-4">
                  <div className="text-sm text-gray-400 uppercase tracking-wider text-center">
                    {t("Portfolio Balance")}
                  </div>
                  <div className="text-3xl font-bold text-white text-center">
                    {pnl && pnl.today !== undefined ? (
                      `$${formatFiatBalance(pnl.today, "USD")}`
                    ) : loading ? (
                      <Skeleton
                        width={120}
                        height={32}
                        baseColor="#374151"
                        highlightColor="#4b5563"
                      />
                    ) : (
                      "$0.00"
                    )}
                  </div>
                  <div className="text-sm text-center">
                    <span className="text-gray-400 mr-2">{t("24h Change:")}</span>
                    {pnl && pnl.today !== undefined && pnl.yesterday !== undefined ? (
                      <>
                        {pnl.today > pnl.yesterday && pnl.yesterday !== 0 ? (
                          <span className="inline-flex items-center gap-2 text-green-400">
                            <span className="text-sm">▲</span>
                            <span>
                              +{formatFiatBalance(pnl.today - pnl.yesterday, "USD")}
                            </span>
                            <span className="text-sm opacity-75">
                              (+{formatPercentage(
                                pnl.yesterday !== 0
                                  ? ((pnl.today - pnl.yesterday) / pnl.yesterday) * 100
                                  : 0
                              )})
                            </span>
                          </span>
                        ) : pnl.today < pnl.yesterday ? (
                          <span className="inline-flex items-center gap-2 text-red-400">
                            <span className="text-sm">▼</span>
                            <span>
                              -{formatFiatBalance(pnl.yesterday - pnl.today, "USD")}
                            </span>
                            <span className="text-sm opacity-75">
                              (-{formatPercentage(
                                pnl.yesterday !== 0
                                  ? ((pnl.yesterday - pnl.today) / pnl.yesterday) * 100
                                  : 0
                              )})
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-gray-400">
                            <span>$0.00</span>
                            <span className="text-sm">(0.00%)</span>
                          </span>
                        )}
                      </>
                    ) : loading ? (
                      <Skeleton
                        width={80}
                        height={16}
                        baseColor="#374151"
                        highlightColor="#4b5563"
                      />
                    ) : (
                      <span className="text-gray-400">$0.00</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Link href="/user/wallet/deposit" className="flex-1">
                    <Button
                      color="primary"
                      shape={"rounded"}
                      variant={"solid"}
                      className="w-full bg-gradient-to-r from-[#B33F40] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium"
                    >
                      {t("Deposit")}
                    </Button>
                  </Link>
                  <Link href="/market" className="flex-1">
                    <Button
                      color="muted"
                      shape={"rounded"}
                      variant={"outlined"}
                      className="w-full border-slate-600 text-white hover:bg-slate-700"
                    >
                      {t("Trade Now")}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-6 max-w-md w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder={t("Enter your email")}
                      size={"lg"}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <Link href="/register">
                    <Button
                      size="lg"
                      shape={"rounded"}
                      className="bg-gradient-to-r from-[#B33F40] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-8 py-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
                    >
                      {t("Start Trading")}
                    </Button>
                  </Link>
                </div>
                
                <div className="flex justify-center">
                  <Link 
                    href="/login" 
                    className="text-[#B33F40] hover:text-red-300 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>{t("Already have an account?")}</span>
                    <span className="font-medium">{t("Sign In")}</span>
                  </Link>
                </div>
                
                {/* Trust indicators */}
                <div className="flex justify-center items-center space-x-8 pt-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>256-bit SSL</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>SAFU Insured</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>KYC Verified</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroContentSection;
