import ThemeSwitcher from "@/components/widgets/ThemeSwitcher";
import { NotificationsDropdown } from "../shared/NotificationsDropdown";
import { AccountDropdown } from "../shared/AccountDropdown";
import { LocaleLogo } from "../shared/Locales/LocaleLogo";
import { useDashboardStore } from "@/stores/dashboard";
import { FC } from "react";
import { Tooltip } from "@/components/elements/base/tooltips/Tooltip";
import { Icon } from "@iconify/react";

const AccountControls: FC<{
  isMobile: boolean;
  setIsMobileSearchActive: (active: boolean) => void;
}> = ({ isMobile, setIsMobileSearchActive }) => {
  const {
    profile,
    isAdmin,
    activeMenuType,
    toggleMenuType,
    isFetched,
    announcements,
    setPanelOpen,
    isSidebarOpenedMobile,
  } = useDashboardStore();
  return (
    <div
      className={
        isMobile
          ? `w-full flex items-center justify-between sm:justify-end px-7 pb-3 gap-2 ${isSidebarOpenedMobile ? "lg:hidden" : "hidden"}`
          : `hidden lg:flex items-center gap-2 ms-auto me-3`
      }
    >
      {isFetched && profile && isAdmin && (
        <Tooltip
          content={activeMenuType === "admin" ? "Admin" : "User"}
          position="bottom"
        >
          <Icon
            icon={"ph:user-switch"}
            onClick={toggleMenuType}
            className={`h-5 w-5 ${
              activeMenuType === "admin" ? "text-primary-500" : "text-muted-400"
            } transition-colors duration-300 cursor-pointer`}
          />
        </Tooltip>
      )}
      {!isMobile && (
        <button
          onClick={() => setIsMobileSearchActive(true)}
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300  md:hidden"
        >
          <Icon
            icon="lucide:search"
            className="h-5 w-5 text-muted-400 transition-colors duration-300"
          />
        </button>
      )}

      <div className="group relative text-start">
        <button
          className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 rotate-0"
          onClick={() => setPanelOpen("locales", true)}
        >
          <LocaleLogo />
        </button>
      </div>

      {isFetched && profile && (
        <>
          <div className="group relative text-start">
            {announcements && announcements.length > 0 && (
              <span className="absolute right-0.5 top-0.5 z-2 block h-2 w-2 rounded-full bg-primary-500 "></span>
            )}
            <button
              className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 rotate-0"
              onClick={() => setPanelOpen("announcements", true)}
            >
              <Icon
                icon="ph:megaphone"
                className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"
              />
            </button>
          </div>

          <NotificationsDropdown />
        </>
      )}

      <ThemeSwitcher />

      <AccountDropdown />
    </div>
  );
};

export default AccountControls;
