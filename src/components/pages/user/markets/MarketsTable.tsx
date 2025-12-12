import React, { memo } from "react";
import HeadCell from "./HeadCell";
import MarketRow from "./MarketRow";
import { Icon } from "@iconify/react";

interface MarketsTableProps {
  t: (key: string) => string;
  items: any[];
  pagination: {
    total: number;
    lastPage: number;
    currentPage: number;
    from: number;
    to: number;
  };
  perPage: number;
  sorted: { field: string; rule: "asc" | "desc" };
  sort: (field: string, rule: "asc" | "desc") => void;
  isDark: boolean;
  handleNavigation: (symbol: string) => void;
}

const MarketsTable: React.FC<MarketsTableProps> = ({
  t,
  items,
  pagination,
  perPage,
  sorted,
  sort,
  isDark,
  handleNavigation,
}) => {
  const slicedItems = items.slice(
    (pagination.currentPage - 1) * perPage,
    pagination.currentPage * perPage
  );

  return (
    <div className="flex w-full flex-col overflow-x-auto lg:overflow-x-visible ltablet:overflow-x-visible">
      <table className="border border-muted-200 bg-white font-sans dark:border-muted-800 dark:bg-muted-950">
        <thead className="border-b border-fade-grey-2 dark:border-muted-800">
          <tr className="divide-x divide-muted-200 dark:divide-muted-800">
            <th className="w-[30%] p-4">
              <HeadCell
                label={t("Name")}
                sortFn={sort}
                sortField="symbol"
                sorted={sorted}
              />
            </th>
            <th className="w-[20%] p-4">
              <HeadCell
                label={t("Price")}
                sortFn={sort}
                sortField="price"
                sorted={sorted}
              />
            </th>
            <th className="w-[20%] p-4">
              <HeadCell
                label={t("Change")}
                sortFn={sort}
                sortField="change"
                sorted={sorted}
              />
            </th>
            <th className="w-[25%] p-4">
              <HeadCell
                label={t("24h Volume")}
                sortFn={sort}
                sortField="baseVolume"
                sorted={sorted}
              />
            </th>
            <th className="w-[5%] text-end"></th>
          </tr>
        </thead>

        <tbody>
          {slicedItems.map((item, i) => (
            <MarketRow
              key={item.symbol || i}
              item={item}
              isDark={isDark}
              handleNavigation={handleNavigation}
            />
          ))}
          {pagination.total === 0 && (
            <tr>
              <td colSpan={5} className="py-3 text-center">
                <div className="py-32">
                  <Icon
                    icon="arcticons:samsung-finder"
                    className="mx-auto h-20 w-20 text-muted-400"
                  />
                  <h3 className="mb-2 font-sans text-xl text-muted-700 dark:text-muted-200">
                    {t("Nothing found")}
                  </h3>
                  <p className="mx-auto max-w-[280px] font-sans text-md text-muted-400">
                    {t(
                      "Sorry, looks like we couldn't find any matching records. Try different search terms."
                    )}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default memo(MarketsTable);
