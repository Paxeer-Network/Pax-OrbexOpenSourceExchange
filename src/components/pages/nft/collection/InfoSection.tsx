import React, { useState } from "react";
import Stats from "./elements/Stats";
import { useNftStore } from "@/stores/nft";

const CollectionInfoSection: React.FC = () => {
  // Retrieve the collection state from the Zustand store
  const { collection } = useNftStore();
  const [showMore, setShowMore] = useState(false);

  if (!collection) return null;

  return (
    <div className="px-6 md:px-12 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="space-y-4">
        {/* Collection Name */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {collection.name}
        </h1>

        {/* Collection Description */}
        <p
          className={`text-gray-700 dark:text-gray-300 ${
            !showMore ? "line-clamp-2" : ""
          }`}
        >
          {collection.description}
        </p>

        {/* Show More / Show Less Button */}
        {collection.description.length > 150 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="mt-2 text-sm text-green-500 hover:text-green-700"
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Collection Stats Section */}
      <div className="w-full flex flex-col items-end">
        <Stats />
      </div>
    </div>
  );
};

export default CollectionInfoSection;
``;
