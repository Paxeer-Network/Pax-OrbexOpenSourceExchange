import React from "react";
import Select from "@/components/elements/form/select/Select";
import Pagination from "@/components/elements/base/pagination/Pagination";

interface PaginationControlsProps {
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
  };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      currentPage: number;
      perPage: number;
      totalItems: number;
    }>
  >;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  setPagination,
}) => {
  // Handle page change
  const changePage = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  return (
    <div
      className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 bg-muted-50 dark:bg-muted-900 border border-muted-200 dark:border-muted-800 rounded-lg mt-4`}
    >
      <div className="w-full md:w-auto md:max-w-[164px]">
        <Select
          color="contrast"
          name="pageSize"
          value={pagination.perPage.toString()}
          options={[
            { value: "5", label: "5 per page" },
            { value: "10", label: "10 per page" },
            { value: "15", label: "15 per page" },
            { value: "20", label: "20 per page" },
          ]}
          onChange={(e) =>
            setPagination({
              ...pagination,
              perPage: parseInt(e.target.value, 10),
              currentPage: 1, // Reset to first page when items per page changes
            })
          }
        />
      </div>
      <Pagination
        buttonSize={"md"}
        currentPage={pagination.currentPage}
        totalCount={pagination.totalItems}
        pageSize={pagination.perPage}
        onPageChange={changePage}
      />
    </div>
  );
};

export default PaginationControls;
