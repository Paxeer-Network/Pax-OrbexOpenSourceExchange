import React from "react";
import Select from "@/components/elements/form/select/Select";
import Input from "@/components/elements/form/input/Input";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import { Tooltip } from "@/components/elements/base/tooltips/Tooltip";

interface FiltersProps {
  listingType: string;
  setListingType: (value: string) => void;
  minPrice: number | undefined;
  setMinPrice: (value: number | undefined) => void;
  maxPrice: number | undefined;
  setMaxPrice: (value: number | undefined) => void;
  onFilter: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  listingType,
  setListingType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onFilter,
}) => {
  return (
    <div className="flex space-x-4 text-muted-400 items-end">
      <Select
        className="bg-muted-800 px-4 py-2 rounded-md"
        value={listingType}
        onChange={(e) => setListingType(e.target.value)}
        options={["All", "Buy Now", "Auction"]}
        label="Listing Type"
      />
      <Input
        type="number"
        placeholder="Min. value"
        value={minPrice !== undefined ? minPrice : ""}
        onChange={(e) => setMinPrice(Number(e.target.value))}
        label="Min. value"
      />
      <Input
        type="number"
        placeholder="Max. value"
        value={maxPrice !== undefined ? maxPrice : ""}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        label="Max. value"
      />

      <Tooltip content="Filter">
        <IconButton onClick={onFilter}>
          <Icon icon="mdi:filter" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default Filters;
