import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDashboardStore } from "@/stores/dashboard";

const NEXT_PUBLIC_SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const CreatorBanner: React.FC = () => {
  const { isDark } = useDashboardStore();
  const bannerImage = isDark
    ? "/img/nft/creator.webp"
    : "/img/nft/creator_light.webp";

  return (
    <div className="w-full px-16 py-12 relative z-0 mb-32">
      {/* Right Glow Gradient */}
      <div className="absolute z-[-1] h-[400px] w-[700px] rounded-full opacity-50 blur-[60px] [transform:translate3d(0,0,0)] dark:opacity-100 right-[-400px] top-[-100px] hidden md:block">
        <div className="h-full w-full bg-linear-to-l from-green-400 via-green-400/[0.5] to-transparent rotate-[-30deg]"></div>
      </div>

      {/* Left Glow Gradient (Positioned Below) */}
      <div className="absolute z-[-1] h-[400px] w-[800px] rounded-full opacity-50 blur-[60px] [transform:translate3d(0,0,0)] dark:opacity-100 left-[-400px] top-[150px]">
        <div className="h-full w-full bg-linear-to-r from-teal-400 via-teal-400/[0.5] to-transparent rotate-[30deg]"></div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 p-4 bg-purple-200 dark:bg-black rounded-xl z-9">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 bg-purple-300 dark:bg-transparent rounded-2xl overflow-hidden">
          <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-2xl">
            <Image
              src={bannerImage}
              alt="Create Unique Collection"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-2xl"
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white">
            Create your unique Collection
          </h2>
          <p className="text-lg md:text-xl text-muted-700 dark:text-muted-300">
            Create your unique NFT collection on {NEXT_PUBLIC_SITE_NAME}:
            unleash your creativity now
          </p>
          <Link
            href="/create"
            passHref
            className="inline-flex items-center px-6 py-3 bg-lime-500 hover:bg-lime-600 text-lg font-semibold text-white rounded-md transition ease-in-out duration-300 dark:text-black"
          >
            Create Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatorBanner;
