import React, { useState } from "react";
import ActivityTab from "../../collection/tabs/ActivityTab";

interface AssetDetailsTabsProps {
  collection: any;
  asset: any;
}

const tabs = ["Description", "Details", "Activity"];

const AssetDetailsTabs: React.FC<AssetDetailsTabsProps> = ({
  collection,
  asset,
}) => {
  const [activeTab, setActiveTab] = useState("Description");

  return (
    <div className="bg-muted-100 dark:bg-muted-800 p-4 rounded-lg shadow-md">
      <div className="flex space-x-4 border-b border-muted-200 dark:border-muted-700 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "border-b-2 border-purple-500 text-muted-900 dark:text-white"
                : "text-muted-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Description" && (
        <div>
          <p className="text-muted-700 dark:text-muted-300">
            {collection.description}
          </p>
        </div>
      )}

      {activeTab === "Details" && (
        <div className="space-y-4">
          <ul className="space-y-2 text-muted-700 dark:text-muted-300">
            <li>
              <strong>Index:</strong> #{asset.index}
            </li>
            <li>
              <strong>Token ID:</strong> {asset.id}
            </li>
            <li>
              <strong>Royalties:</strong> {asset.royalty}%
            </li>
          </ul>
        </div>
      )}

      {activeTab === "Activity" && <ActivityTab id={asset.id} type="asset" />}
    </div>
  );
};

export default AssetDetailsTabs;
