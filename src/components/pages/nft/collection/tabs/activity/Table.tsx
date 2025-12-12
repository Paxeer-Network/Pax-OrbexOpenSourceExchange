import React from "react";
import { formatDistanceToNow } from "date-fns";
import { SortableHeader } from "@/components/pages/trade/markets/SortableHeader";
import { useNftStore } from "@/stores/nft";

interface ActivityTableProps {
  type: "collection" | "asset";
  activities: any[];
  sortState: { field: string; rule: "asc" | "desc" };
  setSortState: (sort: { field: string; rule: "asc" | "desc" }) => void;
}

const ActivityTable: React.FC<ActivityTableProps> = ({
  type,
  activities,
  sortState,
  setSortState,
}) => {
  const { collection } = useNftStore();
  if (!collection) return null;

  return (
    <div className="w-full text-muted-300">
      {/* Table Header with Sorting Options */}
      <div
        className={`grid ${
          type === "collection" ? "grid-cols-6" : "grid-cols-5"
        } gap-4 py-3 bg-muted-150 dark:bg-muted-900 rounded-lg text-muted-400 text-sm mb-1`}
      >
        <SortableHeader
          field="type"
          title="Event Type"
          sort={sortState}
          setSort={setSortState}
          size="sm"
          className="ps-4 text-muted-700 dark:text-muted-200"
        />
        {type === "collection" && (
          <SortableHeader
            field="item"
            title="Item"
            sort={sortState}
            setSort={setSortState}
            size="sm"
            className="text-muted-700 dark:text-muted-200"
          />
        )}
        <SortableHeader
          field="price"
          title="Value"
          sort={sortState}
          setSort={setSortState}
          size="sm"
          className="text-muted-700 dark:text-muted-200"
        />
        <SortableHeader
          field="from"
          title="From"
          sort={sortState}
          setSort={setSortState}
          size="sm"
          className="text-muted-700 dark:text-muted-200"
        />
        <SortableHeader
          field="to"
          title="To"
          sort={sortState}
          setSort={setSortState}
          size="sm"
          className="text-muted-700 dark:text-muted-200"
        />
        <SortableHeader
          field="createdAt"
          title="Time"
          sort={sortState}
          setSort={setSortState}
          size="sm"
          className="text-muted-700 dark:text-muted-200"
        />
      </div>

      {/* Activity Rows */}
      {activities.length === 0 ? (
        <div className="text-center py-4">
          No activities found for this collection.
        </div>
      ) : (
        activities.map((activity, index) => (
          <div
            key={index}
            className={`grid ${
              type === "collection" ? "grid-cols-6" : "grid-cols-5"
            } gap-4 items-center py-3 border-b border-muted-200 dark:border-muted-800 hover:bg-muted-100 dark:hover:bg-muted-800 transition cursor-pointer`}
          >
            {/* Type Column */}
            <div className="flex items-center ps-4">
              <span
                className={`font-medium text-xs px-2 py-1 rounded-md ${getBadgeStyle(
                  activity.type
                )}`}
              >
                {activity.type.replace("nft", "")}
              </span>
            </div>

            {/* Item Info */}
            {type === "collection" && (
              <div className="flex items-center">
                <img
                  src={activity.image || "/img/avatars/placeholder.webp"}
                  alt="activity image"
                  className="w-20 h-20 rounded-md mr-4"
                />
                <span className="text-lg font-semibold text-muted-800 dark:text-muted-200">
                  {activity.nftAsset?.name || "N/A"}
                </span>
              </div>
            )}

            {/* Value */}
            <span className="text-muted-700 dark:text-muted-200">
              {activity.price ? `${activity.price} ${collection.chain}` : "-"}
            </span>

            {/* From */}
            <span className="text-purple-500">
              {activity.seller ? `@${activity.seller.firstName}` : "-"}
            </span>

            {/* To */}
            <span className="text-warning-500">
              {activity.buyer ? `@${activity.buyer.firstName}` : "-"}
            </span>

            {/* Time (Relative Time Ago) */}
            <span className="text-muted-500 dark:text-muted-400">
              {formatDistanceToNow(new Date(activity.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

/**
 * Function to determine badge styles for different activity types
 */
const getBadgeStyle = (type: string) => {
  switch (type.toLowerCase()) {
    case "nfttransaction":
      return "bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-200";
    case "nftbid":
      return "bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200";
    default:
      return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200";
  }
};

export default ActivityTable;
