"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const CommentSection_1 = require("@/components/pages/blog/CommentSection");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const link_1 = __importDefault(require("next/link"));
const router_1 = require("next/router");
const RelatedPosts_1 = __importDefault(require("../RelatedPosts"));
const SocialShareButtons_1 = __importDefault(require("../SocialShare/SocialShareButtons"));
const TableOfContentsLayout = ({ post, comments, relatedPosts, fetchData, t, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const { title, content, image } = post;
    const router = (0, router_1.useRouter)();
    // State for table of contents
    const [headings, setHeadings] = (0, react_1.useState)([]);
    const [updatedContent, setUpdatedContent] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        // Parse content and assign unique IDs to headings
        const container = document.createElement("div");
        container.innerHTML = content;
        let headingCounter = 0;
        // Update headings with unique IDs
        const newHeadings = [];
        Array.from(container.querySelectorAll("h1, h2, h3")).forEach((heading) => {
            var _a;
            const text = ((_a = heading.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "";
            const uniqueId = `${text.toLowerCase().replace(/\s+/g, "-")}-${headingCounter}`;
            heading.id = uniqueId;
            newHeadings.push({ id: uniqueId, text });
            headingCounter++;
        });
        setHeadings(newHeadings);
        setUpdatedContent(container.innerHTML); // Save updated content with unique IDs
    }, [content]);
    return (<div className="mx-auto pb-8 px-4 lg:px-8 max-w-7xl">
      {/* Back Button */}
      <div className="mb-4">
        <button className="text-sm text-muted-600 dark:text-muted-400 hover:underline" onClick={() => router.back()}>
          ← {t("Back")}
        </button>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8">
        <link_1.default href={`/blog/category/${(_a = post.category) === null || _a === void 0 ? void 0 : _a.slug}`}>
          <Tag_1.default color="primary" variant="outlined">
            {(_b = post.category) === null || _b === void 0 ? void 0 : _b.name}
          </Tag_1.default>
        </link_1.default>
        <h1 className="text-4xl font-bold text-muted-800 dark:text-muted-200 mb-2">
          {title}
        </h1>
        <div className="text-sm text-muted-600 dark:text-muted-400 flex justify-center items-center gap-2">
          <span>
            {t("By")} {(_d = (_c = post.author) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.firstName}{" "}
            {(_f = (_e = post.author) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f.lastName}
          </span>
          <Avatar_1.default src={((_h = (_g = post.author) === null || _g === void 0 ? void 0 : _g.user) === null || _h === void 0 ? void 0 : _h.avatar) || "/img/avatars/placeholder.webp"} alt={`${(_k = (_j = post.author) === null || _j === void 0 ? void 0 : _j.user) === null || _k === void 0 ? void 0 : _k.firstName} ${(_m = (_l = post.author) === null || _l === void 0 ? void 0 : _l.user) === null || _m === void 0 ? void 0 : _m.lastName}`} size="sm"/>
          <span>
            {new Date(post.createdAt || new Date()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })}
          </span>
        </div>
      </div>

      {/* Main Image */}
      {image && (<div className="relative w-full mb-6 overflow-hidden rounded-lg shadow-md">
          <img src={image} alt={title} className="w-full h-[300px] md:h-[400px] object-cover"/>
        </div>)}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Table of Contents */}
        <aside className="md:w-1/4 space-y-4">
          <div className="sticky top-4">
            <h3 className="text-lg font-semibold text-muted-800 dark:text-muted-200 pb-2">
              {t("Table of Contents")}
            </h3>
            <ul className="list-disc pl-4 text-sm text-muted-600 dark:text-muted-400">
              {headings.map(({ id, text }) => (<li key={id} className="mb-2">
                  <a href={`#${id}`} className="hover:underline hover:text-primary" onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(id);
                if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                }
            }}>
                    {text}
                  </a>
                </li>))}
            </ul>
            {/* Social Share Buttons */}
            <div className="mt-8 flex flex-col gap-4">
              <span className="text-muted-600 dark:text-muted-400 text-sm">
                {t("Share Article")}:{" "}
              </span>
              <div className="flex gap-2">
                <SocialShareButtons_1.default url={window.location.href}/>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Section */}
        <div className="flex-1 prose dark:prose-dark max-w-none">
          <div dangerouslySetInnerHTML={{ __html: updatedContent }}/>
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (<div className="mt-12">
          <h2 className="text-2xl font-semibold text-muted-800 dark:text-muted-200 mb-4">
            {t("Related Posts")}
          </h2>
          <RelatedPosts_1.default posts={relatedPosts}/>
        </div>)}

      {/* Comments Section */}
      <div className="mt-12">
        <CommentSection_1.CommentSection comments={comments} postId={post.id} fetchData={fetchData}/>
      </div>
    </div>);
};
exports.default = TableOfContentsLayout;
