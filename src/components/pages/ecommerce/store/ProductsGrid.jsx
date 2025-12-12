"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// components/pages/shop/ProductsGrid.tsx
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@iconify/react");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const MashImage_1 = require("@/components/elements/MashImage");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const ProductsGrid = ({ filteredProducts, allCategoriesProducts, searchTerm, handleSearchChange, loadMore, wishlist, handleWishlistToggle, profile, t, capitalize, }) => {
    return (<div>
      <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
        <h2 className="text-2xl">
          <span className="text-primary-500">{capitalize("All")}</span>{" "}
          <span className="text-muted-800 dark:text-muted-200">
            {t("Products")}
          </span>
        </h2>
        <div className="flex gap-2 w-full sm:max-w-xs text-end">
          <Input_1.default type="text" placeholder={t("Search Products...")} value={searchTerm} onChange={handleSearchChange} icon={"mdi:magnify"}/>
        </div>
      </div>
      <div className="relative my-5">
        <hr className="border-muted-200 dark:border-muted-700"/>
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {searchTerm ? `Matching "${searchTerm}"` : `All Products`}
          </span>
        </span>
      </div>

      {/* Products */}
      {filteredProducts.length > 0 && (<div className="grid gap-x-3 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => {
                var _a;
                return (<div key={product.id} className="relative group">
              <link_1.default href={`/store/${product.category.slug}/${product.slug}`}>
                <Card_1.default className="group relative w-full h-full p-3 hover:shadow-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400" color="contrast">
                  <div className="relative w-full h-[200px]">
                    <MashImage_1.MashImage src={product.image || "/img/placeholder.svg"} alt={product.slug} className="rounded-md object-cover w-full h-full bg-muted-100 dark:bg-muted-900"/>
                    <div className="absolute top-1 left-1">
                      <Tag_1.default color="primary">
                        {product.category.name || "Uncategorized"}
                      </Tag_1.default>
                    </div>
                  </div>

                  <div className="my-2">
                    <h4 className="text-muted-800 dark:text-muted-100 font-medium">
                      {product.name}
                    </h4>
                    <p className="text-muted-500 dark:text-muted-400 text-xs">
                      {((_a = product.shortDescription) === null || _a === void 0 ? void 0 : _a.length) > 100
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
                      <Tag_1.default shape="full" className="flex items-center">
                        <span>{t("Rating")}</span>
                        <react_2.Icon icon="uiw:star-on" className={`h-3 w-3 text-warning-500 ${product.rating === 0 ? "grayscale" : ""}`}/>
                        <span className="text-muted-400 text-xs">
                          {product.rating.toFixed(1)} ({product.reviewsCount})
                        </span>
                      </Tag_1.default>
                    </div>
                  </div>
                </Card_1.default>
              </link_1.default>
              {profile && (<div className="absolute top-5 right-5">
                  <IconButton_1.default size={"sm"} onClick={() => handleWishlistToggle(product)} color={wishlist.find((item) => item.id === product.id)
                            ? "danger"
                            : "muted"} variant={"pastel"}>
                    <react_2.Icon icon="mdi:heart" className={`h-5 w-5 ${wishlist.find((item) => item.id === product.id)
                            ? "text-danger-500"
                            : "text-muted-300"}`}/>
                  </IconButton_1.default>
                </div>)}
            </div>);
            })}
        </div>)}

      {filteredProducts.length > 0 &&
            filteredProducts.length < allCategoriesProducts.length && (<div className="my-16 flex items-center justify-center">
            <Button_1.default type="button" className="rounded-lg bg-default px-4 py-2 flex items-center gap-2" onClick={loadMore}>
              <react_2.Icon icon="ph:dots-nine-bold" className="h-4 w-4"/>
              <span>{t("Load more")}</span>
            </Button_1.default>
          </div>)}

      {filteredProducts.length === 0 && (<div className="my-16 w-full text-center text-muted-500 dark:text-muted-400">
          <h2>{t("No Products Available")}</h2>
          <p>{t("Sorry, there are no products available yet.")}</p>
        </div>)}
    </div>);
};
exports.default = ProductsGrid;
