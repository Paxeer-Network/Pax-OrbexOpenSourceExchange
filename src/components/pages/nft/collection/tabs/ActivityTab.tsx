import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import PaginationControls from "../elements/PaginationControls";
import ActivityFilters from "./activity/Filters";
import ActivityTable from "./activity/Table";

interface Activity {
  type: string;
  createdAt: string;
  [key: string]: any;
}

const ActivityTab: React.FC<{ id: string; type: "collection" | "asset" }> = ({
  id,
  type,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState("");
  const [activityType, setActivityType] = useState("All");
  const [minValue, setMinValue] = useState<number | undefined>(undefined);
  const [maxValue, setMaxValue] = useState<number | undefined>(undefined);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortState, setSortState] = useState({
    field: "createdAt",
    rule: "desc" as "asc" | "desc",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
  });

  // Function to remove undefined or empty string parameters
  const removeUndefinedParams = (params: Record<string, any>) => {
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== "")
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, any>);
  };

  // Fetch activities with the updated filter and sorting parameters
  const fetchActivities = async () => {
    if (id) {
      const queryParams = removeUndefinedParams({
        search,
        type: activityType !== "All" ? activityType.toLowerCase() : undefined,
        minValue: minValue || undefined,
        maxValue: maxValue || undefined,
        from: fromDate || undefined,
        to: toDate || undefined,
        sortBy: sortState.field,
        order: sortState.rule,
        limit: pagination.perPage,
        offset: (pagination.currentPage - 1) * pagination.perPage,
      });

      const { data, error } = await $fetch({
        url: `/api/ext/nft/${type}/${id}/activity`,
        params: queryParams,
        silent: true,
      });

      if (data) {
        setActivities(data.activities || []);
        setPagination((prev) => ({
          ...prev,
          totalItems: data.activities.length,
        }));
      }
    }
  };

  // Reset pagination and fetch activities whenever filters change
  useEffect(() => {
    if (id) {
      setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to page 1
      fetchActivities();
    }
  }, [
    id,
    search,
    activityType,
    minValue,
    maxValue,
    fromDate,
    toDate,
    sortState,
  ]);

  // Fetch activities whenever pagination changes
  useEffect(() => {
    if (id) {
      fetchActivities();
    }
  }, [pagination.currentPage, pagination.perPage]);

  return (
    <div className="w-full py-4">
      {/* Filters Section */}
      {type === "collection" && (
        <ActivityFilters
          search={search}
          setSearch={setSearch}
          activityType={activityType}
          setActivityType={setActivityType}
          minValue={minValue}
          setMinValue={setMinValue}
          maxValue={maxValue}
          setMaxValue={setMaxValue}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          onFilter={() => {
            setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on filter change
            fetchActivities();
          }}
        />
      )}

      {/* Activity Table */}
      <ActivityTable
        type={type}
        activities={activities}
        sortState={sortState}
        setSortState={setSortState}
      />

      {/* Pagination Controls */}
      <PaginationControls
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default ActivityTab;
