// components/pages/shop/ShopHeading.tsx
import { HeroParallax } from "@/components/ui/HeroParallax";
import { HeaderCardImage } from "@/components/widgets/HeaderCardImage";
import React from "react";

interface Props {
  allCategoriesProducts: any[];
  profile: any | null;
  t: (key: string) => string;
}

const ShopHeading: React.FC<Props> = ({
  allCategoriesProducts,
  profile,
  t,
}) => {
  return allCategoriesProducts.length > 7 ? (
    <HeroParallax
      items={allCategoriesProducts.map((product) => ({
        title: product.name,
        link: `/store/${product?.category.slug}/${product.slug}`,
        thumbnail: product.image,
      }))}
      title={
        <>
          <span className="text-primary-500">
            {t("Welcome to our Online Store")}
          </span>
          <br />
        </>
      }
      description={
        <>
          <span className="text-muted-500 dark:text-muted-400">
            {t("Explore our wide range of products")}
          </span>
          <br />
          <span className="text-muted-500 dark:text-muted-400">
            {t("and find the perfect one for you")}
          </span>
        </>
      }
    />
  ) : (
    <div className="mb-5">
      <HeaderCardImage
        title={t("Welcome to our Online Store")}
        description={t(
          "Explore our wide range of products and find the perfect one for you"
        )}
        lottie={{
          category: "ecommerce",
          path: "delivery",
          max: 2,
          height: 220,
        }}
        size="lg"
        link={profile ? `/user/store` : undefined}
        linkLabel={t("View Your Orders")}
      />
    </div>
  );
};

export default ShopHeading;
