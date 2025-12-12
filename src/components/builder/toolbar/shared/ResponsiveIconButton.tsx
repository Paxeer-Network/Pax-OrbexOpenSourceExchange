import React from "react";
import { Icon } from "@iconify/react";
import { Tooltip } from "@/components/elements/base/tooltips/Tooltip";
import IconButton from "@/components/elements/base/button-icon/IconButton";

const ResponsiveIconButton = ({
  breakpoint,
  isActive,
  hasClasses,
  onClick,
}) => (
  <Tooltip content={breakpoint.toUpperCase()} position="bottom">
    <div className="relative">
      <IconButton
        shape="rounded-xs"
        size="xs"
        color={isActive ? "primary" : "muted"}
        variant="outlined"
        onClick={onClick}
      >
        <Icon
          icon={`mdi:${
            breakpoint === "xs"
              ? "cellphone"
              : breakpoint === "sm"
              ? "tablet"
              : breakpoint === "md"
              ? "laptop"
              : breakpoint === "lg"
              ? "desktop-classic"
              : "monitor"
          }`}
          className="h-4 w-4"
        />
      </IconButton>
      {hasClasses && (
        <span className="absolute top-0 -right-[2px] h-[5px] w-[5px] bg-warning-500 rounded-full" />
      )}
    </div>
  </Tooltip>
);

export default ResponsiveIconButton;
