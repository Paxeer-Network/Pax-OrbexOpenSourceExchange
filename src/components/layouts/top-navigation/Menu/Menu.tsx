import React, { useEffect, useState } from "react";
import NavDropdown from "../navbar/NavDropdown";
import NavbarItem from "../navbar/NavbarItem";
import { useRouter } from "next/router";
import { useDashboardStore } from "@/stores/dashboard";

const MenuBase = () => {
  const { isSidebarOpenedMobile, filteredMenu } = useDashboardStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isMenuItemActive = (item) => {
    return item.href === router.pathname;
  };

  // Helper function to render a single link
  const renderLink = (item, key, hasDescription = false) => (
    <NavbarItem
      key={key}
      icon={
        item.icon || (isMenuItemActive(item) ? "ph:dot-fill" : "ph:dot-duotone")
      }
      title={item.title}
      href={item.href}
      description={hasDescription && item.description}
    />
  );

  // Helper function to render a dropdown or link based on the item type
  const renderDropdownOrLink = (
    item,
    idx,
    nested = false,
    hasDescription = false
  ) => {
    const subMenu = Array.isArray(item.subMenu) ? item.subMenu : item.menu;
    if (Array.isArray(subMenu)) {
      return (
        <NavDropdown
          key={idx}
          title={item.title}
          icon={
            item.icon ||
            (isMenuItemActive(item) ? "ph:dot-fill" : "ph:dot-duotone")
          }
          nested={nested}
          description={hasDescription && item.description}
        >
          {subMenu.map((subItem, subIdx) =>
            subItem.subMenu || subItem.menu
              ? renderDropdownOrLink(
                  subItem,
                  `subdropdown-${subIdx}`,
                  true,
                  true
                )
              : renderLink(subItem, `sublink-${subIdx}`, true)
          )}
        </NavDropdown>
      );
    }
    // Otherwise, it's a direct link
    return renderLink(item, `link-${idx}`);
  };

  const renderMenus = () => {
    return filteredMenu.map((item, idx) => renderDropdownOrLink(item, idx));
  };

  if (!isMounted) {
    return null; // Prevent rendering on the server side
  }

  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center space-x-1">
        {renderMenus()}
      </div>
      
      {/* Mobile Menu */}
      <div
        className={`lg:hidden w-full ${
          isSidebarOpenedMobile ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col space-y-1">
          {renderMenus()}
        </div>
      </div>
    </>
  );
};

export const Menu = MenuBase;
