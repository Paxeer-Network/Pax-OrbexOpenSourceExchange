import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import Link from "next/link";
import LogoText from "@/components/vector/LogoText";
import { Icon } from "@iconify/react";
import { useDashboardStore } from "@/stores/dashboard";
import { Tooltip } from "@/components/elements/base/tooltips/Tooltip";
import { Menu } from "./Menu";
import { SearchResults } from "../shared/SearchResults";
import AccountControls from "./AccountControls";

const TopNavbar = ({ trading, transparent }) => {
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { t } = useTranslation();

  const {
    profile,
    isSidebarOpenedMobile,
    setIsSidebarOpenedMobile,
    isAdmin,
    activeMenuType,
    toggleMenuType,
    isFetched,
  } = useDashboardStore();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Orbex";

  return (
    <nav
      className={`relative z-11 ${
        !transparent
          ? "border-b border-black bg-black"
          : "fixed border-b border-black bg-black"
      }`}
      role="navigation"
      aria-label="main navigation"
    >
      <div
        className="flex flex-col lg:flex-row min-h-[64px] items-center justify-between w-full px-4 lg:px-6"
      >
        {/* Logo and Menu Section - Left */}
        <div className="flex items-center space-x-8">
          <Link
            className="relative flex shrink-0 grow-0 items-center rounded-[.52rem] py-2 no-underline transition-all duration-300"
            href="/"
          >
            <LogoText
              className="max-w-[120px] w-[120px] text-white"
            />
          </Link>
          
          {/* Navigation Menu - Next to Logo */}
          <div className="hidden lg:flex items-center">
            <Menu />
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          {isSidebarOpenedMobile && isAdmin && isFetched && profile && (
            <Tooltip
              content={activeMenuType === "admin" ? "Admin" : "User"}
              position="bottom"
            >
              <Icon
                icon={"ph:user-switch"}
                onClick={toggleMenuType}
                className={`h-5 w-5 mr-2 ${
                  activeMenuType === "admin"
                    ? "text-primary-500"
                    : "text-white"
                } transition-colors duration-300 cursor-pointer`}
              />
            </Tooltip>
          )}
          <button
            type="button"
            className="relative block h-10 w-10 cursor-pointer appearance-none border-none bg-none text-white"
            aria-label="menu"
            aria-expanded="false"
            onClick={() => {
              setIsSidebarOpenedMobile(!isSidebarOpenedMobile);
              setIsMobileSearchActive(false);
            }}
          >
            <span
              aria-hidden="true"
              className={`absolute left-[calc(50%-8px)] top-[calc(50%-6px)] block h-px w-4 origin-center bg-current transition-all duration-[86ms] ease-out ${
                isSidebarOpenedMobile
                  ? "tranmuted-y-[5px] rotate-45"
                  : "scale-[1.1] "
              }`}
            ></span>
            <span
              aria-hidden="true"
              className={`absolute left-[calc(50%-8px)] top-[calc(50%-1px)] block h-px w-4 origin-center scale-[1.1] bg-current transition-all duration-[86ms] ease-out ${
                isSidebarOpenedMobile ? "opacity-0" : ""
              }`}
            ></span>
            <span
              aria-hidden="true"
              className={`absolute left-[calc(50%-8px)] top-[calc(50%+4px)] block h-px w-4 origin-center scale-[1.1] bg-current transition-all duration-[86ms] ease-out  ${
                isSidebarOpenedMobile
                  ? "-tranmuted-y-[5px] -rotate-45"
                  : "scale-[1.1] "
              }`}
            ></span>
          </button>
        </div>

        {/* Account Controls - Right */}
        <div className="hidden lg:flex items-center">
          <AccountControls
            isMobile={false}
            setIsMobileSearchActive={setIsMobileSearchActive}
          />
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-black border-t border-gray-800 z-50 ${
            isSidebarOpenedMobile ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col p-4 space-y-2">
            <Menu />
            <div className="border-t border-gray-800 pt-4 mt-4">
              <AccountControls
                isMobile={true}
                setIsMobileSearchActive={setIsMobileSearchActive}
              />
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default TopNavbar;
