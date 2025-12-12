import Layout from "@/layouts/Default";
import Link from "next/link";
import { PageHeader } from "@/components/elements/base/page-header";
import Tag from "@/components/elements/base/tag/Tag";
import { useTranslation } from "next-i18next";
import { ErrorPage, NotFound } from "@/components/ui/Errors";
import { $serverFetch } from "@/utils/api";

interface Props {
  tags?: Tag[];
  error?: string;
}

const BlogTags: React.FC<Props> = ({ tags = [], error }) => {
  const { t } = useTranslation();

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

  return (
    <Layout title={t("Blog")} color="muted">
      <div className="space-y-5 max-w-5xl lg:mx-auto">
        <PageHeader title={t("Blog Tags")} />

        <div className="flex flex-wrap gap-2 justify-center">
          {tags.map((tag, index) => (
            <Link href={`/blog/tag/${tag.slug}`} passHref key={index}>
              <Tag
                shape="rounded-sm"
                className="group p-3 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                {tag.name}
              </Tag>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  try {
    const { data, error } = await $serverFetch(context, {
      url: `/api/content/tag`,
    });

    if (error || !data) {
      return {
        props: {
          error: error || "Unable to fetch tags.",
        },
      };
    }

    return {
      props: {
        tags: data,
      },
    };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return {
      props: {
        error: `An unexpected error occurred: ${error.message}`,
      },
    };
  }
}

export default BlogTags;
