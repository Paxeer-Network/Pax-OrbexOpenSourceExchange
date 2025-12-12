import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Avatar from "@/components/elements/base/avatar/Avatar";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import Skeleton from "react-loading-skeleton";

interface MarketRowProps {
  item: any;
  isDark: boolean;
  handleNavigation: (symbol: string) => void;
}

const MarketRow: React.FC<MarketRowProps> = ({
  item,
  isDark,
  handleNavigation,
}) => {
  return (
    <tr
      className={`border-b border-muted-200 transition-colors duration-300 last:border-none 
      hover:bg-muted-200/40 dark:border-muted-800 dark:hover:bg-muted-900/60 cursor-pointer`}
      onClick={() => handleNavigation(item.symbol)}
    >
      <td className="px-4 py-3 align-middle">
        <div className="flex items-center gap-2">
          <Avatar
            size="xxs"
            src={item.icon || `/img/crypto/${item.currency.toLowerCase()}.webp`}
          />
          <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
            {item.symbol}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 align-middle">
        <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
          {item.price || (
            <Skeleton
              width={40}
              height={10}
              baseColor={isDark ? "#27272a" : "#f7fafc"}
              highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}
            />
          )}
        </span>
      </td>
      <td className="px-4 py-3 align-middle">
        <span
          className={`line-clamp-1 text-md text-${
            item.change >= 0
              ? item.change === 0
                ? "muted"
                : "success"
              : "danger"
          }-500`}
        >
          {item.change ? (
            `${item.change}%`
          ) : (
            <Skeleton
              width={40}
              height={10}
              baseColor={isDark ? "#27272a" : "#f7fafc"}
              highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}
            />
          )}
        </span>
      </td>
      <td className="px-4 py-3 align-middle">
        <div>
          <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
            {item.baseVolume || (
              <Skeleton
                width={40}
                height={10}
                baseColor={isDark ? "#27272a" : "#f7fafc"}
                highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}
              />
            )}{" "}
            <span className="text-muted-400 text-xs">({item.currency})</span>
          </span>
          <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
            {item.quoteVolume || (
              <Skeleton
                width={40}
                height={10}
                baseColor={isDark ? "#27272a" : "#f7fafc"}
                highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}
              />
            )}{" "}
            <span className="text-muted-400 text-xs">({item.pair})</span>
          </span>
        </div>
      </td>
      <td className="px-4 py-3 align-middle text-end">
        <Link href={`/trade/${item.symbol.replace("/", "_")}`}>
          <IconButton color="contrast" variant="pastel" size="sm">
            <Icon icon="akar-icons:arrow-right" width={16} />
          </IconButton>
        </Link>
      </td>
    </tr>
  );
};

export default React.memo(MarketRow);
