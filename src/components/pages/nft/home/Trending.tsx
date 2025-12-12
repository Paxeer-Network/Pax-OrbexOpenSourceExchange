import React from "react";
import { useNftStore } from "@/stores/nft";
import AutoplaySlider from "@/components/elements/base/slider/AutoplaySlider";

const TrendingCollectionsCarousel: React.FC = () => {
  const { trendingCollections } = useNftStore();

  return (
    <AutoplaySlider containerStyles="w-full h-[300px] lg:h-[400px] px-16 mt-16 z-10">
      {trendingCollections?.map((collection, index) => (
        <div
          key={index}
          className="relative w-full h-full flex items-center justify-center"
        >
          <div
            className={`relative z-9 rounded-lg shadow-xl overflow-hidden w-full flex items-center justify-between px-8 md:px-20 lg:px-32 xl:px-48 py-12 h-[300px] lg:h-[400px]`}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.0)), url(${collection.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {collection.name}
              </h2>
              <p className="text-white mb-4">{collection.description}</p>
            </div>
          </div>
        </div>
      ))}
    </AutoplaySlider>
  );
};

export default TrendingCollectionsCarousel;
