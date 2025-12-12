"use client";

import React from "react";
import { TracingBeam } from "@/components/ui/Beam";
import { MacbookScroll } from "@/components/ui/MacBookScroll";
import Tag from "@/components/elements/base/tag/Tag";
import Avatar from "@/components/elements/base/avatar/Avatar";
import Link from "next/link";
import { CommentSection } from "@/components/pages/blog/CommentSection";
import { useRouter } from "next/router";
import RelatedPosts from "../RelatedPosts";

const AnimatedLaptopLayout = ({
  post,
  comments,
  relatedPosts,
  fetchData,
  t,
}: any) => {
  const { title, content, image } = post;
  const router = useRouter();

  return (
    <>
      {/* Back Button */}
      <div className="mb-4">
        <button
          className="text-sm text-muted-600 dark:text-muted-400 hover:underline"
          onClick={() => router.back()}
        >
          ← {t("Back")}
        </button>
      </div>
      <TracingBeam>
        <div className="max-w-prose mx-auto antialiased pt-4 relative">
          <div className="overflow-hidden w-full hidden md:block">
            <MacbookScroll
              showGradient={false}
              title={
                <div className="flex flex-col gap-2 justify-center items-center">
                  <div>
                    <Link href={`/blog/category/${post.category?.slug}`}>
                      <Tag color="primary" variant="outlined">
                        {post.category?.name}
                      </Tag>
                    </Link>
                  </div>
                  <span className="text-7xl">{title}</span>
                  <div className="text-sm flex gap-2 items-center mt-8">
                    <span>
                      {t("By")} {post.author?.user?.firstName}{" "}
                      {post.author?.user?.lastName}
                    </span>
                    <Avatar
                      src={
                        post.author?.user?.avatar ||
                        "/img/avatars/placeholder.webp"
                      }
                      alt={`${post.author?.user?.firstName} ${post.author?.user?.lastName}`}
                      size="sm"
                      className="ml-2"
                    />
                    <span className="text-muted-600 dark:text-muted-400">
                      {new Date(
                        post.createdAt || new Date()
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                    </span>
                  </div>
                </div>
              }
              src={image || "/img/placeholder.svg"}
            />
          </div>
          <div className="prose mx-auto max-w-prose prose-pre:max-w-[90vw] pe-20 md:pe-0 dark:prose-dark">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-muted-800 dark:text-muted-200 mb-4">
                {t("Related Posts")}
              </h2>
              <RelatedPosts posts={relatedPosts} max={2} />
            </div>
          )}
          <CommentSection
            comments={comments}
            postId={post.id}
            fetchData={fetchData}
          />
        </div>
      </TracingBeam>
    </>
  );
};

export default AnimatedLaptopLayout;
