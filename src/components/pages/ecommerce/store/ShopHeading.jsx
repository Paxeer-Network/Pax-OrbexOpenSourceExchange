"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// components/pages/shop/ShopHeading.tsx
const HeroParallax_1 = require("@/components/ui/HeroParallax");
const HeaderCardImage_1 = require("@/components/widgets/HeaderCardImage");
const react_1 = __importDefault(require("react"));
const ShopHeading = ({ allCategoriesProducts, profile, t, }) => {
    return allCategoriesProducts.length > 7 ? (<HeroParallax_1.HeroParallax items={allCategoriesProducts.map((product) => ({
            title: product.name,
            link: `/store/${product === null || product === void 0 ? void 0 : product.category.slug}/${product.slug}`,
            thumbnail: product.image,
        }))} title={<>
          <span className="text-primary-500">
            {t("Welcome to our Online Store")}
          </span>
          <br />
        </>} description={<>
          <span className="text-muted-500 dark:text-muted-400">
            {t("Explore our wide range of products")}
          </span>
          <br />
          <span className="text-muted-500 dark:text-muted-400">
            {t("and find the perfect one for you")}
          </span>
        </>}/>) : (<div className="mb-5">
      <HeaderCardImage_1.HeaderCardImage title={t("Welcome to our Online Store")} description={t("Explore our wide range of products and find the perfect one for you")} lottie={{
            category: "ecommerce",
            path: "delivery",
            max: 2,
            height: 220,
        }} size="lg" link={profile ? `/user/store` : undefined} linkLabel={t("View Your Orders")}/>
    </div>);
};
exports.default = ShopHeading;
