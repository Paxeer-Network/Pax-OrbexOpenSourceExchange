import React from "react";
import { Icon } from "@iconify/react";
import Select from "@/components/elements/form/select/Select";

interface MarketsPaginationProps {
  t: (key: string) => string;
  pagination: {
    total: number;
    lastPage: number;
    currentPage: number;
    from: number;
    to: number;
  };
  pages: number[];
  currentPage: number;
  perPage: number;
  changePage: (page: number) => void;
  changePerPage: (newPerPage: number) => void;
}

const MarketsPagination: React.FC<MarketsPaginationProps> = ({
  t,
  pagination,
  pages,
  currentPage,
  perPage,
  changePage,
  changePerPage,
}) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="hidden items-center gap-2 rounded-xl border border-muted-200 bg-white py-1 pe-3 ps-1 dark:border-muted-800 dark:bg-muted-950 md:flex">
          <Select
            color="contrast"
            value={perPage.toString()}
            onChange={(e) => changePerPage(+e.target.value)}
            options={["25", "50", "100", "250", "500"]}
          />
          <p className="whitespace-nowrap font-sans text-md text-muted-400">
            {t("Per page")}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end divide-x divide-muted-300 dark:divide-muted-800">
        <div className="flex items-center px-6">
          <button
            type="button"
            onClick={() => changePage(1)}
            className="cursor-pointer text-md text-muted-400 underline-offset-4 hover:text-primary-500 hover:underline"
          >
            <span>{t("First")}</span>
          </button>
          <span className="cursor-pointer px-2 text-md text-muted-400">·</span>
          <button
            type="button"
            onClick={() => changePage(pagination.lastPage)}
            className="cursor-pointer text-md text-muted-400 underline-offset-4 hover:text-primary-500 hover:underline"
          >
            <span>{t("Last")}</span>
          </button>
        </div>
        <div className="flex items-center justify-end ps-6">
          <div className="flex items-center gap-1 rounded-full border border-muted-200 bg-white p-1 dark:border-muted-800 dark:bg-muted-950">
            <button
              type="button"
              onClick={() => changePage(currentPage - 1)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-transparent p-0 text-muted-500 transition-all duration-300 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100"
            >
              <Icon width={16} height={16} icon="lucide:chevron-left" />
            </button>
            {pages.map((page, i) => (
              <button
                type="button"
                key={i}
                className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none p-0 transition-all duration-300 ${
                  currentPage == page
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                    : "bg-transparent text-muted-500 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100"
                }`}
                onClick={() => changePage(page)}
              >
                <span className="text-[.9rem]">{page}</span>
              </button>
            ))}
            <button
              onClick={() => changePage(currentPage + 1)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-transparent p-0 text-muted-500 transition-all duration-300 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100"
            >
              <Icon width={16} height={16} icon="lucide:chevron-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketsPagination;
