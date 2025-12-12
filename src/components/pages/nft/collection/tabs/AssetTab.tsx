import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useNftStore } from "@/stores/nft";
import SearchBar from "./asset/SearchBar";
import Filters from "./asset/Filters";
import AssetTable from "./asset/Table";
import PaginationControls from "../elements/PaginationControls";
import ViewToggle from "./asset/ViewToggle";

const AssetTab: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Get `collectionId` from the URL
  const { assets, fetchAssets } = useNftStore();

  // State for search, filters, view mode, and pagination
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("All");
  const [sortState, setSortState] = useState({
    field: "name", // Default sorted field
    rule: "asc" as "asc" | "desc", // Default sorting rule
  });
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [chain, setChain] = useState<string | undefined>(""); // Dynamic chain value
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
  });
  const [viewMode, setViewMode] = useState<"list" | "grid">("list"); // View mode state

  // Effect to fetch assets when component mounts or filters change
  useEffect(() => {
    if (!router.isReady || !id) return;

    // Prepare query parameters for fetching assets
    const fetchParams: any = {
      collectionId: id as string,
      search: search.trim() ? search : undefined, // Set search to `undefined` if empty
      sortBy: sortState.field ? sortState.field.toLowerCase() : undefined,
      order: sortState.rule || undefined,
      listingType: listingType !== "All" ? listingType : undefined,
      minPrice: minPrice !== undefined ? minPrice.toString() : undefined, // Convert to string
      maxPrice: maxPrice !== undefined ? maxPrice.toString() : undefined, // Convert to string
      limit: pagination.perPage,
      offset: (pagination.currentPage - 1) * pagination.perPage,
    };

    // Remove undefined values from params
    const validParams: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(fetchParams)) {
      if (value !== undefined) {
        validParams[key] =
          typeof value === "number" || typeof value === "boolean"
            ? value
            : String(value);
      }
    }

    // Make API call
    fetchAssets(validParams);
  }, [
    router.isReady,
    id,
    search, // Trigger fetch on `search` change
    sortState,
    listingType,
    minPrice,
    maxPrice,
    pagination.currentPage,
    pagination.perPage,
  ]);

  // Effect to calculate price range, set chain, and total items based on assets
  useEffect(() => {
    if (assets.length > 0) {
      const prices = assets.map((asset) => asset.price);
      setMinPrice(Math.min(...prices));
      setMaxPrice(Math.max(...prices));
      if (assets[0].collection.chain) {
        setChain(assets[0].collection.chain);
      }
    }

    setPagination((prev) => ({
      ...prev,
      totalItems: assets.length, // Update total items based on fetched assets
    }));
  }, [assets]);

  return (
    <div className="w-full py-4">
      {/* Search and Filters Row */}
      <div className="flex items-end justify-between mb-4">
        {/* Search Bar */}
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={`Search by name or index`}
        />
        <div className="flex items-end gap-4">
          {/* Sorting and Filters */}
          <Filters
            listingType={listingType}
            setListingType={setListingType}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onFilter={() =>
              fetchAssets({
                minPrice: minPrice !== undefined ? minPrice.toString() : "",
                maxPrice: maxPrice !== undefined ? maxPrice.toString() : "",
              })
            }
          />

          {/* View Toggle */}
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      {/* Asset List Table or Grid */}
      <AssetTable
        sortState={sortState}
        setSortState={setSortState}
        chain={chain}
        viewMode={viewMode}
      />

      {/* Pagination Controls */}
      <PaginationControls
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default AssetTab;
