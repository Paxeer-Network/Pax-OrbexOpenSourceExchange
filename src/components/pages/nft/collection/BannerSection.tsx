import React from "react";
import ProfileImage from "./elements/ProfileImage";
import { useNftStore } from "@/stores/nft";

const BannerSection: React.FC = () => {
  // Retrieve the collection state from the Zustand store
  const collection = useNftStore((state) => state.collection);

  return (
    <div
      className="relative w-full h-[250px] md:h-[280px] bg-cover bg-center flex flex-col justify-end"
      style={{
        backgroundImage: `url(${collection?.image || "/default-banner.png"})`,
      }}
    >
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 to-transparent"></div>

      {/* Creator's Profile Image */}
      <ProfileImage avatar={collection?.creator?.avatar} />
    </div>
  );
};

export default BannerSection;
