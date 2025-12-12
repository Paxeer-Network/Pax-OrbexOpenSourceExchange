import React, { type FC } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Icon, type IconifyIcon } from "@iconify/react";
import { useTranslation } from "next-i18next";

export const navItemBaseStyles =
  "hover:bg-gray-800 hover:text-blue-400 leading-6 text-white relative flex cursor-pointer items-center gap-2 rounded-lg py-3 px-4 font-medium transition-all duration-200";

interface NavbarItemProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  icon: IconifyIcon | string;
  title: string;
  href?: string;
  description?: string;
}
const NavbarItem: FC<NavbarItemProps> = ({
  icon,
  title,
  href = "",
  description,
  ...props
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 transition-colors duration-300 ${navItemBaseStyles} ${
        isActive
          ? "bg-gray-800 text-blue-400 lg:bg-transparent "
          : ""
      }`}
      {...props}
    >
      <Icon icon={icon} className="h-5 w-5" />
      <div className="flex flex-col">
        <span className="text-sm">{t(title)}</span>
        {description && (
          <span className="text-xs text-gray-400 leading-none">
            {t(description)}
          </span>
        )}
      </div>
    </Link>
  );
};

export default NavbarItem;
