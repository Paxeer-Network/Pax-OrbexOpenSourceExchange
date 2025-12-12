"use client";
import React from "react";

const HeroSection = () => {
  return (
    <section className="w-full min-h-screen bg-black relative overflow-hidden items-center justify-center hidden lg:flex">
      {/* Left Side Text */}
      <div className="absolute left-6 xl:left-16 top-1/2 transform -translate-y-1/2 text-white z-10">
        <div className="space-y-6 max-w-xs">
          <div className="text-sm font-light tracking-wider uppercase opacity-75">
            Advanced Trading
          </div>
          <h3 className="text-2xl xl:text-3xl font-bold leading-tight">
            By Traders,
            <br />
            <span className="text-[#B33F40]">For Traders</span>
          </h3>
          <p className="text-sm opacity-75 leading-relaxed">
            Institutional-grade infrastructure with
            lightning-fast execution and deep liquidity.
          </p>
        </div>
      </div>

      {/* Right Side Text */}
      <div className="absolute right-6 xl:right-16 top-1/2 transform -translate-y-1/2 text-white z-10">
        <div className="space-y-6 max-w-xs text-right">
          <div className="text-sm font-light tracking-wider uppercase opacity-75">
            Secure & Reliable
          </div>
          <h3 className="text-2xl xl:text-3xl font-bold leading-tight">
            <span className="text-[#B33F40]">Bank-Grade</span>
            <br />
            Security
          </h3>
          <p className="text-sm opacity-75 leading-relaxed">
            Multi-layered security protocols with
            cold storage and 24/7 monitoring.
          </p>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex items-center justify-center w-full h-full">
        <video
          className="max-w-4xl max-h-[70vh] w-auto h-auto object-contain"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/hero.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center z-10">
        <div className="space-y-2">
          <div className="text-xs font-light tracking-widest uppercase opacity-50">
            Trusted by Traders Worldwide
          </div>
          <div className="flex items-center space-x-8 text-xs opacity-75">
            <span>✓ 256-bit SSL Encryption</span>
            <span>✓ Regulated & Compliant</span>
            <span>✓ 24/7 Customer Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
