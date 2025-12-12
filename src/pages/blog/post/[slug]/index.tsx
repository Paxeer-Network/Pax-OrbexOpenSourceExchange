import React from "react";
import dynamic from "next/dynamic";
import Layout from "@/layouts/Default";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
import { $serverFetch } from "@/utils/api";
import { ErrorPage, NotFound } from "@/components/ui/Errors";

// Dynamic imports
const AnimatedLaptopLayout = dynamic(
  () => import("@/components/pages/blog/Layout/AnimatedLaptopLayout")
);
const DefaultLayout = dynamic(
  () => import("@/components/pages/blog/Layout/DefaultLayout")
);
const TableOfContentsLayout = dynamic(
  () => import("@/components/pages/blog/Layout/TableOfContentsLayout")
);

interface Props {
  post?: BlogPost;
  comments?: Comment[];
  relatedPosts?: BlogPost[];
  error?: string;
}

const Post: React.FC<Props> = ({
  post,
  comments = [],
  relatedPosts = [],
  error,
}) => {
  const { t } = useTranslation();
  const { settings } = useDashboardStore();

  if (error) {
    // Render error UI if an error occurs
    return (
      <ErrorPage
        title={t("Error")}
        description={t(error)}
        link="/blog"
        linkTitle={t("Back to Blog")}
      />
    );
  }

  if (!post) {
    // Render not found message if no post is available
    return (
      <NotFound
        title={t("Blog Post")}
        description={t("The blog post you are looking for does not exist.")}
        link="/blog"
        linkTitle={t("Back to Blog")}
      />
    );
  }

  const blogPostLayout = settings?.blogPostLayout || "DEFAULT";

  return (
    <Layout title={post.title || "Blog"} color="muted">
      {(() => {
        switch (blogPostLayout) {
          case "TABLE_OF_CONTENTS":
            return (
              <TableOfContentsLayout
                post={post}
                comments={comments}
                relatedPosts={relatedPosts}
                t={t}
              />
            );
          case "ANIMATED_LAPTOP":
            return (
              <AnimatedLaptopLayout
                post={post}
                comments={comments}
                relatedPosts={relatedPosts}
                t={t}
              />
            );
          default:
            return (
              <DefaultLayout
                post={post}
                comments={comments}
                relatedPosts={relatedPosts}
                t={t}
              />
            );
        }
      })()}
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { slug } = context.params;
  try {
    const { data, error } = await $serverFetch(context, {
      url: `/api/content/post/${slug}`,
    });

    if (error || !data) {
      return {
        props: {
          error: error || "Unable to fetch the blog post.",
        },
      };
    }

    return {
      props: {
        post: data,
        comments: data.comments || [],
        relatedPosts: data.relatedArticles || [],
      },
    };
  } catch (error) {
    console.error("Error fetching post data:", error);
    return {
      props: {
        error: `An unexpected error occurred: ${error.message}`,
      },
    };
  }
}

export default Post;
