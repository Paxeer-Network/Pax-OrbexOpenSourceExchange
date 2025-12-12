"use client";

import React from "react";
import Avatar from "@/components/elements/base/avatar/Avatar";
import { CommentSection } from "@/components/pages/blog/CommentSection";
import Link from "next/link";
import Tag from "@/components/elements/base/tag/Tag";
import { useRouter } from "next/router";
import RelatedPosts from "../RelatedPosts";

const DefaultLayout = ({ post, comments, relatedPosts, fetchData, t }: any) => {
  const { title, content, image } = post;
  const router = useRouter();

  return (
    <div className="mx-auto pb-8 px-4">
      {/* Back Button */}
      <div className="mb-4">
        <button
          className="text-sm text-muted-600 dark:text-muted-400 hover:underline"
          onClick={() => router.back()}
        >
          ← {t("Back")}
        </button>
      </div>

      {image && (
        <div className="relative w-full mb-6 max-h-[400px] overflow-hidden rounded-lg shadow-md">
          <img
            src={image}
            alt={title}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
            {/* Category Link */}
            <Link href={`/blog/category/${post.category?.slug}`}>
              <Tag color="contrast">{post.category?.name}</Tag>
            </Link>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>

            {/* Author and Date */}
            <div className="text-sm flex gap-2 items-center text-gray-300">
              <span>
                {t("By")} {post.author?.user?.firstName}{" "}
                {post.author?.user?.lastName}
              </span>
              <Avatar
                src={
                  post.author?.user?.avatar || "/img/avatars/placeholder.webp"
                }
                alt={`${post.author?.user?.firstName} ${post.author?.user?.lastName}`}
                size="sm"
                className="ml-2 border border-white"
              />
              <span>
                {new Date(post.createdAt || new Date()).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="prose dark:prose-dark">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-muted-800 dark:text-muted-200 mb-4">
            {t("Related Posts")}
          </h2>
          <RelatedPosts posts={relatedPosts} />
        </div>
      )}

      {/* Comments Section */}
      <CommentSection
        comments={comments}
        postId={post.id}
        fetchData={fetchData}
      />
    </div>
  );
};

export default DefaultLayout;
