// pages/shop/index.tsx
import React, { useEffect, useState } from "react";
import Layout from "@/layouts/Default";
import { useEcommerceStore } from "@/stores/user/ecommerce";
import { useDashboardStore } from "@/stores/dashboard";
import { $serverFetch } from "@/utils/api";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { capitalize } from "lodash";

import { Faq } from "@/components/pages/knowledgeBase/Faq";
import ShopHeading from "@/components/pages/ecommerce/store/ShopHeading";
import CategoriesCarousel from "@/components/pages/ecommerce/store/CategoriesCarousel";
import ProductsGrid from "@/components/pages/ecommerce/store/ProductsGrid";

interface Props {
  categories: any[];
  error?: string;
}

const Shop: React.FC<Props> = ({ categories, error }) => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const router = useRouter();

  const {
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    wishlistFetched,
  } = useEcommerceStore();

  const [displayLimit, setDisplayLimit] = useState<number>(9);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (router.isReady && !wishlistFetched) {
      fetchWishlist();
    }
  }, [router.isReady, wishlistFetched]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const loadMore = () => {
    setDisplayLimit(displayLimit + 9);
  };

  const handleWishlistToggle = (product: any) => {
    if (wishlist.find((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Flatten all categories and their products
  const allCategoriesProducts = categories?.length
    ? categories.flatMap((category) =>
        category.products.map((product: any) => ({
          ...product,
          category: {
            id: category.id,
            name: category.name,
            slug: category.slug,
          },
        }))
      )
    : [];

  // Filter products based on search term
  const filteredProducts = allCategoriesProducts
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase())
    )
    .slice(0, displayLimit);

  return (
    <Layout title={t("Shop")}>
      <ShopHeading
        allCategoriesProducts={allCategoriesProducts}
        profile={profile}
        t={t}
      />

      {categories.length > 0 && (
        <CategoriesCarousel categories={categories} t={t} />
      )}

      <ProductsGrid
        filteredProducts={filteredProducts}
        allCategoriesProducts={allCategoriesProducts}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        loadMore={loadMore}
        wishlist={wishlist}
        handleWishlistToggle={handleWishlistToggle}
        profile={profile}
        t={t}
        capitalize={capitalize}
      />

      <Faq category="ECOMMERCE" />
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  try {
    const response = await $serverFetch(context, {
      url: `/api/ext/ecommerce/category`,
    });

    if (!response.data) {
      return {
        props: {
          error: "Categories not found",
        },
      };
    }

    return {
      props: {
        categories: response.data,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error: `Error fetching categories: ${error.message}`,
      },
    };
  }
}

export default Shop;
