import React, { useState } from "react";
import Select from "@/components/elements/form/select/Select";
import Input from "@/components/elements/form/input/Input";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import { Tooltip } from "@/components/elements/base/tooltips/Tooltip";

interface ActivityFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  activityType: string;
  setActivityType: (value: string) => void;
  minValue: number | undefined;
  setMinValue: (value: number | undefined) => void;
  maxValue: number | undefined;
  setMaxValue: (value: number | undefined) => void;
  fromDate: string;
  setFromDate: (value: string) => void;
  toDate: string;
  setToDate: (value: string) => void;
  onFilter: () => void;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  search,
  setSearch,
  activityType,
  setActivityType,
  minValue,
  setMinValue,
  maxValue,
  setMaxValue,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onFilter,
}) => {
  return (
    <div className="flex justify-between space-x-4 text-muted-400 items-end mb-4">
      {/* Search Input */}
      <div className="w-64">
        <Input
          type="text"
          placeholder="Search by name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon="mdi:magnify"
          label="Search"
        />
      </div>

      <div className="flex items-end gap-4">
        {/* Activity Type Select */}
        <Select
          className="bg-muted-800 px-4 py-2 rounded-md"
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          options={["All", "Transaction", "Bid"]}
          label="Activity Type"
        />

        {/* Min and Max Value Inputs */}
        <Input
          type="number"
          placeholder="Min. value"
          value={minValue !== undefined ? minValue : ""}
          onChange={(e) => setMinValue(Number(e.target.value))}
          label="Min. value"
        />
        <Input
          type="number"
          placeholder="Max. value"
          value={maxValue !== undefined ? maxValue : ""}
          onChange={(e) => setMaxValue(Number(e.target.value))}
          label="Max. value"
        />

        {/* From and To Date Inputs */}
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          label="From"
        />
        <Input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          label="To"
        />

        {/* Filter Button */}
        <Tooltip content="Filter">
          <IconButton onClick={onFilter}>
            <Icon icon="mdi:filter" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default ActivityFilters;
