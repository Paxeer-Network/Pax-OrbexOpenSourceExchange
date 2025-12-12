import React, { useState } from "react";
import AssetList from "./tabs/AssetTab";
import ActivityTab from "./tabs/ActivityTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import { useNftStore } from "@/stores/nft";

const tabs = ["Collection", "Activity", "Offers", "Analytics"];

const CollectionTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Collection");
  const { collection } = useNftStore();

  return (
    <div className="w-full px-12 pb-12">
      <div className="flex border-b border-muted-200 dark:border-muted-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-lg px-6 py-3 font-medium ${
              activeTab === tab
                ? "text-muted-800 dark:text-muted-200 border-b-2 border-purple-500"
                : "text-muted-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Collection" && <AssetList />}
      {activeTab === "Activity" && collection && (
        <ActivityTab id={collection.id} type="collection" />
      )}
      {activeTab === "Offers" && <div>Offers Content</div>}
      {activeTab === "Analytics" && <AnalyticsTab />}
    </div>
  );
};

export default CollectionTabs;
