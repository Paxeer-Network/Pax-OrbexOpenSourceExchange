import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import $fetch from "@/utils/api";
import Layout from "@/layouts/Nav";
import Input from "@/components/elements/form/input/Input";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Tooltip } from "@/components/elements/base/tooltips/Tooltip";
import PaginationControls from "@/components/pages/nft/collection/elements/PaginationControls";
import AssetTableHeader from "@/components/pages/nft/collection/tabs/asset/table/Header";
import AssetListRow from "@/components/pages/nft/collection/tabs/asset/table/List";
import AssetGridCard from "@/components/pages/nft/collection/tabs/asset/table/Grid";

const AssetPage: React.FC = () => {
  const [assets, setAssets] = useState<NftAsset[]>([]);
  const [search, setSearch] = useState("");
  const [sortState, setSortState] = useState({
    field: "name",
    rule: "asc" as "asc" | "desc",
  });
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
  });

  const fetchAssets = async () => {
    const params: Record<string, string | number | boolean> = {};

    if (search.trim()) params.search = search.trim();
    if (sortState.field) params.sortBy = sortState.field;
    if (sortState.rule) params.order = sortState.rule;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    params.limit = pagination.perPage;
    params.offset = (pagination.currentPage - 1) * pagination.perPage;

    const { data, error } = await $fetch({
      url: `/api/ext/nft/user/asset`,
      params,
      silent: true,
    });

    if (!error) {
      setAssets(data);
      setPagination((prev) => ({ ...prev, totalItems: data.length }));
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [
    search,
    sortState,
    minPrice,
    maxPrice,
    pagination.currentPage,
    pagination.perPage,
  ]);

  return (
    <Layout title="User NFT Assets" horizontal color="muted">
      <div className="p-8">
        {/* Search and Filters Row */}
        <div className="flex items-end justify-between mb-4">
          {/* Search Bar */}
          <div className="w-64">
            <Input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon="mdi:magnify"
            />
          </div>

          <div className="flex items-end gap-4">
            {/* Filters */}
            <div className="flex space-x-4 text-muted-400 items-end">
              <Input
                type="number"
                placeholder="Min. value"
                value={minPrice !== undefined ? minPrice : ""}
                onChange={(e) => setMinPrice(Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Max. value"
                value={maxPrice !== undefined ? maxPrice : ""}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <Tooltip content="Filter">
                <IconButton onClick={fetchAssets}>
                  <Icon icon="mdi:filter" />
                </IconButton>
              </Tooltip>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 border-s ps-4 border-muted-200 dark:border-muted-800">
              <Tooltip content="List View">
                <IconButton
                  onClick={() => setViewMode("list")}
                  color={viewMode === "list" ? "purple" : "muted"}
                >
                  <Icon icon="stash:list-ul" />
                </IconButton>
              </Tooltip>

              <Tooltip content="Grid View">
                <IconButton
                  onClick={() => setViewMode("grid")}
                  color={viewMode === "grid" ? "purple" : "muted"}
                >
                  <Icon icon="bitcoin-icons:grid-filled" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Asset List Table with Sortable Headers */}
        <div className="w-full text-muted-300">
          {viewMode === "list" && (
            <AssetTableHeader
              sortState={sortState}
              setSortState={setSortState}
            />
          )}

          <div className={viewMode === "grid" ? "grid grid-cols-4 gap-6" : ""}>
            {assets.map((asset, index) =>
              viewMode === "list" ? (
                <AssetListRow key={index} asset={asset} chain="ETH" />
              ) : (
                <AssetGridCard key={index} asset={asset} />
              )
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        <PaginationControls
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </Layout>
  );
};

export default AssetPage;
