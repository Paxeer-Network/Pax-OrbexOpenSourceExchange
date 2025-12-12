import React from "react";
import AssetTableHeader from "./table/Header";
import AssetListRow from "./table/List";
import AssetGridCard from "./table/Grid";
import { useNftStore } from "@/stores/nft";

interface AssetTableProps {
  sortState: { field: string; rule: "asc" | "desc" };
  setSortState: (sort: { field: string; rule: "asc" | "desc" }) => void;
  chain: string | undefined;
  viewMode: "list" | "grid"; // View mode prop
}

const AssetTable: React.FC<AssetTableProps> = ({
  sortState,
  setSortState,
  chain,
  viewMode,
}) => {
  const { assets, openModal } = useNftStore();

  return (
    <div className="w-full text-muted-300">
      {viewMode === "list" && (
        <AssetTableHeader sortState={sortState} setSortState={setSortState} />
      )}

      <div className={viewMode === "grid" ? "grid grid-cols-4 gap-6" : ""}>
        {assets.map((asset, index) =>
          viewMode === "list" ? (
            <div key={index} onClick={() => openModal(index)}>
              <AssetListRow asset={asset} chain={chain} />
            </div>
          ) : (
            <div key={index} onClick={() => openModal(index)}>
              <AssetGridCard asset={asset} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AssetTable;
