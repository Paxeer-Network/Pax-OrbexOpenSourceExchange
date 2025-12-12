"use client";

import React, { useEffect, useState } from "react";
import Avatar from "@/components/elements/base/avatar/Avatar";
import { CommentSection } from "@/components/pages/blog/CommentSection";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import { Icon } from "@iconify/react";
import Tag from "@/components/elements/base/tag/Tag";
import Link from "next/link";
import { useRouter } from "next/router";
import RelatedPosts from "../RelatedPosts";
import SocialShareButtons from "../SocialShare/SocialShareButtons";

const TableOfContentsLayout = ({
  post,
  comments,
  relatedPosts,
  fetchData,
  t,
}: any) => {
  const { title, content, image } = post;
  const router = useRouter();

  // State for table of contents
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [updatedContent, setUpdatedContent] = useState<string>("");

  useEffect(() => {
    // Parse content and assign unique IDs to headings
    const container = document.createElement("div");
    container.innerHTML = content;

    let headingCounter = 0;

    // Update headings with unique IDs
    const newHeadings: { id: string; text: string }[] = [];
    Array.from(container.querySelectorAll("h1, h2, h3")).forEach((heading) => {
      const text = heading.textContent?.trim() || "";
      const uniqueId = `${text.toLowerCase().replace(/\s+/g, "-")}-${headingCounter}`;
      heading.id = uniqueId;
      newHeadings.push({ id: uniqueId, text });
      headingCounter++;
    });

    setHeadings(newHeadings);
    setUpdatedContent(container.innerHTML); // Save updated content with unique IDs
  }, [content]);

  return (
    <div className="mx-auto pb-8 px-4 lg:px-8 max-w-7xl">
      {/* Back Button */}
      <div className="mb-4">
        <button
          className="text-sm text-muted-600 dark:text-muted-400 hover:underline"
          onClick={() => router.back()}
        >
          ← {t("Back")}
        </button>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8">
        <Link href={`/blog/category/${post.category?.slug}`}>
          <Tag color="primary" variant="outlined">
            {post.category?.name}
          </Tag>
        </Link>
        <h1 className="text-4xl font-bold text-muted-800 dark:text-muted-200 mb-2">
          {title}
        </h1>
        <div className="text-sm text-muted-600 dark:text-muted-400 flex justify-center items-center gap-2">
          <span>
            {t("By")} {post.author?.user?.firstName}{" "}
            {post.author?.user?.lastName}
          </span>
          <Avatar
            src={post.author?.user?.avatar || "/img/avatars/placeholder.webp"}
            alt={`${post.author?.user?.firstName} ${post.author?.user?.lastName}`}
            size="sm"
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

      {/* Main Image */}
      {image && (
        <div className="relative w-full mb-6 overflow-hidden rounded-lg shadow-md">
          <img
            src={image}
            alt={title}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Table of Contents */}
        <aside className="md:w-1/4 space-y-4">
          <div className="sticky top-4">
            <h3 className="text-lg font-semibold text-muted-800 dark:text-muted-200 pb-2">
              {t("Table of Contents")}
            </h3>
            <ul className="list-disc pl-4 text-sm text-muted-600 dark:text-muted-400">
              {headings.map(({ id, text }) => (
                <li key={id} className="mb-2">
                  <a
                    href={`#${id}`}
                    className="hover:underline hover:text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById(id);
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
            {/* Social Share Buttons */}
            <div className="mt-8 flex flex-col gap-4">
              <span className="text-muted-600 dark:text-muted-400 text-sm">
                {t("Share Article")}:{" "}
              </span>
              <div className="flex gap-2">
                <SocialShareButtons url={window.location.href} />
              </div>
            </div>
          </div>
        </aside>

        {/* Content Section */}
        <div className="flex-1 prose dark:prose-dark max-w-none">
          <div dangerouslySetInnerHTML={{ __html: updatedContent }} />
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-muted-800 dark:text-muted-200 mb-4">
            {t("Related Posts")}
          </h2>
          <RelatedPosts posts={relatedPosts} />
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-12">
        <CommentSection
          comments={comments}
          postId={post.id}
          fetchData={fetchData}
        />
      </div>
    </div>
  );
};

export default TableOfContentsLayout;
