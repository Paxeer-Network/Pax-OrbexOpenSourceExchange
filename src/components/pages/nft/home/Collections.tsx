import React from "react";
import { useNftStore } from "@/stores/nft";
import Link from "next/link";
import { Icon } from "@iconify/react";
const TopCollections: React.FC = () => {
  const { topCollections } = useNftStore();

  return (
    <div className="w-full px-16 py-12 relative">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-4xl font-bold text-muted-800 dark:text-muted-200 z-10">
          Today&apos;s Top Collections
        </h2>
        <Link href="/nft/collections" passHref className="z-10">
          <button className="flex items-center space-x-1 bg-muted-100/50 dark:bg-muted-500/50 text-muted-800 dark:text-muted-100 rounded-md px-4 py-2 text-sm font-medium transition hover:bg-muted-200/50 dark:hover:bg-muted-600/50">
            <span>Analytics</span>
            <Icon icon="akar-icons:arrow-up-right" className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Collections List - Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {topCollections.length > 0 ? (
          topCollections.map((collection, index) => (
            <Link
              key={collection.id}
              href={`/nft/collection/${collection.id}`}
              className="flex items-center justify-between py-4 px-4 border-b border-muted-300 dark:border-muted-700 hover:bg-muted-100 dark:hover:bg-muted-700 transition rounded-xs"
            >
              {/* Left Section with Rank, Image, and Name */}
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <span className="z-10 text-xl font-bold text-muted-600 dark:text-muted-400">
                  {index + 1}
                </span>

                {/* Collection Image */}
                <img
                  src={collection.image || "/default-placeholder.png"}
                  alt={collection.name}
                  className="z-10 w-10 h-10 rounded-full border border-muted-300 dark:border-muted-600"
                />

                {/* Collection Details */}
                <div className="flex flex-col">
                  <h3 className="z-10 text-lg font-semibold text-muted-900 dark:text-white">
                    {collection.name || "Unnamed Collection"}
                  </h3>
                  <p className="z-10 text-muted-500 dark:text-muted-400 text-sm">
                    Starts from:{" "}
                    <span className="font-medium text-muted-900 dark:text-white">
                      {collection.startingPrice
                        ? `${collection.startingPrice.toFixed(2)} ETH`
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Section with Volume */}
              <div className="text-right z-10">
                <p className="z-10 text-sm font-medium text-muted-600 dark:text-muted-400">
                  Volume
                </p>
                <span className="z-10 text-lg font-semibold text-black dark:text-white">
                  {collection.volume
                    ? `${collection.volume.toFixed(2)} ETH`
                    : "N/A"}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-muted-600 dark:text-muted-400 text-center w-full col-span-2">
            No top collections available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default TopCollections;
