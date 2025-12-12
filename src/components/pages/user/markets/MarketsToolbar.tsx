import React from "react";
import Input from "@/components/elements/form/input/Input";

interface MarketsToolbarProps {
  t: (key: string) => string;
  onSearch: (query: string) => void;
}

const MarketsToolbar: React.FC<MarketsToolbarProps> = ({ t, onSearch }) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onSearch(value);
  };

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="font-sans text-2xl font-light text-muted-700 dark:text-muted-200">
          {t("Markets Overview")}
        </h2>
      </div>
      <div className="flex items-center justify-end gap-3">
        <div className="hidden w-full md:block md:w-auto">
          <Input
            icon="lucide:search"
            color="contrast"
            placeholder={t("Search...")}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketsToolbar;
