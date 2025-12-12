// components/pages/shop/ProductsGrid.tsx
import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Input from "@/components/elements/form/input/Input";
import Card from "@/components/elements/base/card/Card";
import { MashImage } from "@/components/elements/MashImage";
import Tag from "@/components/elements/base/tag/Tag";
import Button from "@/components/elements/base/button/Button";
import IconButton from "@/components/elements/base/button-icon/IconButton";

interface Props {
  filteredProducts: any[];
  allCategoriesProducts: any[];
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loadMore: () => void;
  wishlist: any[];
  handleWishlistToggle: (product: any) => void;
  profile: any;
  t: (key: string) => string;
  capitalize: (string: string) => string;
}

const ProductsGrid: React.FC<Props> = ({
  filteredProducts,
  allCategoriesProducts,
  searchTerm,
  handleSearchChange,
  loadMore,
  wishlist,
  handleWishlistToggle,
  profile,
  t,
  capitalize,
}) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
        <h2 className="text-2xl">
          <span className="text-primary-500">{capitalize("All")}</span>{" "}
          <span className="text-muted-800 dark:text-muted-200">
            {t("Products")}
          </span>
        </h2>
        <div className="flex gap-2 w-full sm:max-w-xs text-end">
          <Input
            type="text"
            placeholder={t("Search Products...")}
            value={searchTerm}
            onChange={handleSearchChange}
            icon={"mdi:magnify"}
          />
        </div>
      </div>
      <div className="relative my-5">
        <hr className="border-muted-200 dark:border-muted-700" />
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {searchTerm ? `Matching "${searchTerm}"` : `All Products`}
          </span>
        </span>
      </div>

      {/* Products */}
      {filteredProducts.length > 0 && (
        <div className="grid gap-x-3 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative group">
              <Link href={`/store/${product.category.slug}/${product.slug}`}>
                <Card
                  className="group relative w-full h-full p-3 hover:shadow-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400"
                  color="contrast"
                >
                  <div className="relative w-full h-[200px]">
                    <MashImage
                      src={product.image || "/img/placeholder.svg"}
                      alt={product.slug}
                      className="rounded-md object-cover w-full h-full bg-muted-100 dark:bg-muted-900"
                    />
                    <div className="absolute top-1 left-1">
                      <Tag color="primary">
                        {product.category.name || "Uncategorized"}
                      </Tag>
                    </div>
                  </div>

                  <div className="my-2">
                    <h4 className="text-muted-800 dark:text-muted-100 font-medium">
                      {product.name}
                    </h4>
                    <p className="text-muted-500 dark:text-muted-400 text-xs">
                      {product.shortDescription?.length > 100
                        ? product.shortDescription.slice(0, 100) + "..."
                        : product.shortDescription}
                    </p>
                  </div>
                  <div className="divide-muted-200 dark:divide-muted-700 flex items-center justify-between">
                    <div className="pe-4">
                      <span className="text-muted-800 dark:text-muted-100 font-bold text-md">
                        {product.price} {product.currency}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ms-2 text-muted-500 dark:text-muted-400">
                      <Tag shape="full" className="flex items-center">
                        <span>{t("Rating")}</span>
                        <Icon
                          icon="uiw:star-on"
                          className={`h-3 w-3 text-warning-500 ${
                            product.rating === 0 ? "grayscale" : ""
                          }`}
                        />
                        <span className="text-muted-400 text-xs">
                          {product.rating.toFixed(1)} ({product.reviewsCount})
                        </span>
                      </Tag>
                    </div>
                  </div>
                </Card>
              </Link>
              {profile && (
                <div className="absolute top-5 right-5">
                  <IconButton
                    size={"sm"}
                    onClick={() => handleWishlistToggle(product)}
                    color={
                      wishlist.find((item) => item.id === product.id)
                        ? "danger"
                        : "muted"
                    }
                    variant={"pastel"}
                  >
                    <Icon
                      icon="mdi:heart"
                      className={`h-5 w-5 ${
                        wishlist.find((item) => item.id === product.id)
                          ? "text-danger-500"
                          : "text-muted-300"
                      }`}
                    />
                  </IconButton>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length > 0 &&
        filteredProducts.length < allCategoriesProducts.length && (
          <div className="my-16 flex items-center justify-center">
            <Button
              type="button"
              className="rounded-lg bg-default px-4 py-2 flex items-center gap-2"
              onClick={loadMore}
            >
              <Icon icon="ph:dots-nine-bold" className="h-4 w-4" />
              <span>{t("Load more")}</span>
            </Button>
          </div>
        )}

      {filteredProducts.length === 0 && (
        <div className="my-16 w-full text-center text-muted-500 dark:text-muted-400">
          <h2>{t("No Products Available")}</h2>
          <p>{t("Sorry, there are no products available yet.")}</p>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
