import Layout from "@/layouts/Default";
import { PostsGrid } from "@/components/pages/blog/PostsGrid";
import Input from "@/components/elements/form/input/Input";
import { PageHeader } from "@/components/elements/base/page-header";
import Pagination from "@/components/elements/base/pagination/Pagination";
import Select from "@/components/elements/form/select/Select";
import { motion, AnimatePresence } from "framer-motion";
import { capitalize } from "lodash";
import { useTranslation } from "next-i18next";
import $fetch, { $serverFetch } from "@/utils/api";
import { useState } from "react";
import { ErrorPage, NotFound } from "@/components/ui/Errors";

interface Props {
  initialData?: {
    items: BlogPost[];
    pagination: {
      totalItems: number;
      currentPage: number;
      perPage: number;
      totalPages: number;
    };
  };
  slug?: string;
  error?: string;
}

const Blog: React.FC<Props> = ({ initialData, slug, error }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<any>({});
  const [sort] = useState({ field: "createdAt", rule: "desc" });
  const [items, setItems] = useState(initialData?.items || []);
  const [pagination, setPagination] = useState<{
    totalItems: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
  }>(
    initialData?.pagination || {
      totalItems: 0,
      currentPage: 1,
      perPage: 10,
      totalPages: 0,
    }
  );

  if (error) {
    return (
      <ErrorPage
        title={t("Error")}
        description={t(error)}
        link="/blog"
        linkTitle={t("Back to Blog")}
      />
    );
  }

  const handleFilterChange = async (value: string) => {
    const activeFilter: Record<string, any> = {
      "category.slug": {
        value: slug,
        operator: "like",
      },
    };

    if (value.trim()) {
      activeFilter.title = {
        value: value.trim().toLowerCase(),
        operator: "startsWith",
      };
    }

    const params = new URLSearchParams({
      page: String(pagination.currentPage),
      perPage: String(pagination.perPage),
      sortField: sort.field,
      sortOrder: sort.rule,
      filter: JSON.stringify(activeFilter),
    });

    const response = await $fetch({
      url: `/api/content/post?${params.toString()}`,
    });

    if (response.data) {
      setItems(response.data.items);
      setPagination(response.data.pagination);
    }
  };

  return (
    <Layout title={t("Blog")} color="muted">
      <div className="space-y-5 max-w-5xl lg:mx-auto">
        <PageHeader title={`${capitalize(slug as string)} Posts`}>
          <Input
            type="text"
            placeholder={t("Search posts")}
            icon="ic:twotone-search"
            className="w-full px-3 py-1.5 text-sm text-muted-700 dark:text-muted-300 bg-muted-200 dark:bg-muted-800 rounded-md focus:ring-1 focus:ring-primary-500 focus:outline-hidden"
            onChange={(e) => {
              setFilter({ value: e.target.value });
              handleFilterChange(e.target.value);
            }}
          />
        </PageHeader>

        <div className="relative">
          <hr className="border-muted-200 dark:border-muted-800" />
          <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
            <span className="bg-muted-50 dark:bg-muted-900 px-2">
              {filter.value
                ? `Matching "${filter.value}"`
                : `Latest Posts in ${capitalize(slug as string)}`}
            </span>
          </span>
        </div>

        {items.length > 0 ? (
          <PostsGrid posts={items} />
        ) : (
          <div className="flex items-center justify-center h-96">
            <h2 className="text-muted-500 dark:text-muted-400">
              {t("No posts found")}
            </h2>
          </div>
        )}

        <AnimatePresence>
          {pagination.totalPages > 1 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] fixed bottom-10 left-[5%] sm:left-[10%] md:left-[15%] lg:left-[20%] flex gap-4 items-start"
            >
              <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 rounded-lg bg-muted-50 dark:bg-muted-950 border border-muted-200 dark:border-muted-800">
                <div className="w-full md:w-auto md:max-w-[164px]">
                  <Select
                    color="contrast"
                    name="pageSize"
                    value={pagination.perPage}
                    options={[
                      { value: "5", label: "5 per page" },
                      { value: "10", label: "10 per page" },
                      { value: "15", label: "15 per page" },
                      { value: "20", label: "20 per page" },
                    ]}
                    onChange={(e) =>
                      setPagination({
                        ...pagination,
                        perPage: parseInt(e.target.value),
                        currentPage: 1,
                      })
                    }
                  />
                </div>
                <Pagination
                  buttonSize={"md"}
                  currentPage={pagination.currentPage}
                  totalCount={pagination.totalItems}
                  pageSize={pagination.perPage}
                  onPageChange={(page) =>
                    setPagination({
                      ...pagination,
                      currentPage: page,
                    })
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { slug } = context.params;
  try {
    const params = new URLSearchParams({
      page: "1",
      perPage: "10",
      sortField: "createdAt",
      sortOrder: "desc",
      filter: JSON.stringify({
        "category.slug": { value: slug, operator: "like" },
      }),
    });

    const { data, error } = await $serverFetch(context, {
      url: `/api/content/post?${params.toString()}`,
    });

    if (error || !data) {
      return {
        props: {
          error: error || "Unable to fetch posts.",
        },
      };
    }

    return {
      props: {
        initialData: data,
        slug,
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      props: {
        error: `An unexpected error occurred: ${error.message}`,
      },
    };
  }
}

export default Blog;
