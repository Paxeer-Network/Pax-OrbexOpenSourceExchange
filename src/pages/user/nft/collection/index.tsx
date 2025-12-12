import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import $fetch from "@/utils/api";
import Layout from "@/layouts/Nav";
import Input from "@/components/elements/form/input/Input";
import Link from "next/link";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Tooltip } from "@/components/elements/base/tooltips/Tooltip";
import PaginationControls from "@/components/pages/nft/collection/elements/PaginationControls";
import { SortableHeader } from "@/components/pages/trade/markets/SortableHeader";

const CollectionPage: React.FC = () => {
  const [collections, setCollections] = useState<NftCollection[]>([]);
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

  const fetchCollections = async () => {
    const params: Record<string, string | number | boolean> = {};

    if (search.trim()) params.search = search.trim();
    if (sortState.field) params.sortBy = sortState.field;
    if (sortState.rule) params.order = sortState.rule;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    params.limit = pagination.perPage;
    params.offset = (pagination.currentPage - 1) * pagination.perPage;

    const { data, error } = await $fetch({
      url: `/api/ext/nft/user/collection`,
      params,
      silent: true,
    });

    if (!error) {
      setCollections(data);
      setPagination((prev) => ({ ...prev, totalItems: data.length }));
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [
    search,
    sortState,
    minPrice,
    maxPrice,
    pagination.currentPage,
    pagination.perPage,
  ]);

  return (
    <Layout title="User NFT Collections" horizontal color="muted">
      <div className="p-8">
        {/* Search and Filters Row */}
        <div className="flex items-end justify-between mb-4">
          {/* Search Bar */}
          <div className="w-64">
            <Input
              type="text"
              placeholder="Search collections..."
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
                <IconButton onClick={fetchCollections}>
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

        {/* Collection List Table with Sortable Headers */}
        <div className="w-full text-muted-300">
          {viewMode === "list" && (
            <div className="grid grid-cols-6 gap-4 py-3 bg-muted-150 dark:bg-muted-900 rounded-lg text-muted-400 text-sm mb-1">
              <SortableHeader
                field="name"
                title="Collection Name"
                sort={sortState}
                setSort={setSortState}
                className="col-span-2 ps-4 text-muted-700 dark:text-muted-200"
                size="sm"
              />
              <SortableHeader
                field="floorPrice"
                title="Floor Price"
                sort={sortState}
                setSort={setSortState}
                className="text-muted-700 dark:text-muted-200"
                size="sm"
              />
              <SortableHeader
                field="totalVolume"
                title="Volume"
                sort={sortState}
                setSort={setSortState}
                className="text-muted-700 dark:text-muted-200"
                size="sm"
              />
              <SortableHeader
                field="nftCount"
                title="NFT Count"
                sort={sortState}
                setSort={setSortState}
                className="text-muted-700 dark:text-muted-200"
                size="sm"
              />
              <SortableHeader
                field="createdAt"
                title="Created At"
                sort={sortState}
                setSort={setSortState}
                className="text-muted-700 dark:text-muted-200"
                size="sm"
              />
            </div>
          )}

          <div className={viewMode === "grid" ? "grid grid-cols-4 gap-6" : ""}>
            {collections.map((collection, index) =>
              viewMode === "list" ? (
                <div
                  key={index}
                  className="grid grid-cols-6 gap-4 items-center py-3 border-b border-muted-200 dark:border-muted-800 hover:bg-muted-100 dark:hover:bg-muted-800 transition hover:border-muted-100 dark:hover:border-muted-800 cursor-pointer"
                >
                  <div className="col-span-2 flex items-center">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-20 h-20 rounded-md mx-4"
                    />
                    <div>
                      <span className="text-lg font-semibold text-muted-800 dark:text-muted-200">
                        {collection.name}
                      </span>
                    </div>
                  </div>
                  <span className=" text-muted-800 dark:text-muted-200">
                    {collection.floorPrice || "N/A"}
                  </span>
                  <span className="text-muted-800 dark:text-muted-200">
                    {collection.totalVolume || "N/A"}
                  </span>
                  <span className="text-muted-800 dark:text-muted-200">
                    {collection.nftCount || 0}
                  </span>
                  <span className="text-muted-800 dark:text-muted-200">
                    {new Date(collection.createdAt).toDateString() || "N/A"}
                  </span>
                </div>
              ) : (
                <Link
                  key={index}
                  href={`/nft/collection/${collection.id}`}
                  className="block bg-muted-100 dark:bg-black rounded-xl overflow-hidden transition group border border-muted-200 dark:border-muted-900 hover:border-purple-500"
                >
                  <div className="relative w-full h-[18rem] overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="relative p-4 group-hover:shadow-lg transition bg-muted-200 dark:bg-muted-800">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-muted-900 dark:text-white">
                          {collection.name}
                        </h3>
                        <p className="text-sm text-muted-600 dark:text-muted-400">
                          Floor Price: {collection.floorPrice || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
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

export default CollectionPage;
