import React, { memo } from "react";
import Link from "next/link";
import { MashImage } from "@/components/elements/MashImage";
import Tag from "@/components/elements/base/tag/Tag";
import Card from "@/components/elements/base/card/Card";

const RelatedPostsBase = ({
  posts,
  max = 3, // Default maximum number of posts to display
}: {
  posts: BlogPost[];
  max?: number;
}) => {
  return (
    <div
      className={`grid grid-cols-1 ${
        max > 1 ? "sm:grid-cols-2" : ""
      } ${max > 2 ? "md:grid-cols-3" : ""} gap-4 mx-auto`}
    >
      {posts.slice(0, max).map((post) => {
        const description = post.description || "";
        const contentSnippet = description.slice(0, 150) + "...";

        const header = (
          <div className="relative w-full max-h-[200px] h-[200px] overflow-hidden z-1">
            <MashImage
              src={post.image || "/img/placeholder.svg"}
              alt={post.title}
              className="rounded-lg object-cover w-full h-full bg-muted-100 dark:bg-muted-900"
              fill
            />
            <Tag
              shape="rounded-sm"
              color="muted"
              variant="solid"
              className="ms-1 absolute top-2 left-2"
            >
              {post.category?.name}
            </Tag>
          </div>
        );

        const createdAt = post.createdAt
          ? new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : null;

        return (
          <Link key={post.id} href={`/blog/post/${post.slug}`}>
            <Card
              color={"contrast"}
              className="relative w-full h-full p-2 hover:shadow-lg cursor-pointer hover:border-primary-500 transition-all duration-300 dark:hover:border-primary-400"
            >
              {header}
              <div className="p-2">
                <h3 className="text-lg font-semibold text-primary-500 dark:text-primary-400">
                  {post.title}
                </h3>
                <div className="flex flex-col gap-1 text-xs">
                  <p className="text-muted-500 dark:text-muted-400">
                    {contentSnippet}
                  </p>
                  {createdAt && (
                    <p className="text-muted-500 dark:text-muted-400 mt-1">
                      {createdAt}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export const RelatedPosts = memo(RelatedPostsBase);
export default RelatedPosts;
