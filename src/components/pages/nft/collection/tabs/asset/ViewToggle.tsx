import React from "react";
import { Icon } from "@iconify/react";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Tooltip } from "@/components/elements/base/tooltips/Tooltip";

interface ViewToggleProps {
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  return (
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
  );
};

export default ViewToggle;
