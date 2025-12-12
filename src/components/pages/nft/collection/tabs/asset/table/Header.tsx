import React from "react";
import { SortableHeader } from "@/components/pages/trade/markets/SortableHeader";

interface AssetTableHeaderProps {
  sortState: { field: string; rule: "asc" | "desc" };
  setSortState: (sort: { field: string; rule: "asc" | "desc" }) => void;
}

const AssetTableHeader: React.FC<AssetTableHeaderProps> = ({
  sortState,
  setSortState,
}) => (
  <div className="grid grid-cols-5 gap-4 py-3 bg-muted-150 dark:bg-muted-900 rounded-lg text-muted-400 text-sm mb-1">
    <SortableHeader
      field="index"
      title="Item"
      sort={sortState}
      setSort={setSortState}
      className="col-span-2 ps-4 text-muted-700 dark:text-muted-200"
      size="sm"
    />
    <SortableHeader
      field="price"
      title="Price"
      sort={sortState}
      setSort={setSortState}
      size="sm"
      className="text-muted-700 dark:text-muted-200"
    />
    <span className="text-muted-700 dark:text-muted-200">Owner</span>
    <SortableHeader
      field="createdAt"
      title="Listed Time"
      sort={sortState}
      setSort={setSortState}
      size="sm"
      className="text-muted-700 dark:text-muted-200"
    />
  </div>
);

export default AssetTableHeader;
