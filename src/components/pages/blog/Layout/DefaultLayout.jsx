"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const CommentSection_1 = require("@/components/pages/blog/CommentSection");
const link_1 = __importDefault(require("next/link"));
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const router_1 = require("next/router");
const RelatedPosts_1 = __importDefault(require("../RelatedPosts"));
const DefaultLayout = ({ post, comments, relatedPosts, fetchData, t }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const { title, content, image } = post;
    const router = (0, router_1.useRouter)();
    return (<div className="mx-auto pb-8 px-4">
      {/* Back Button */}
      <div className="mb-4">
        <button className="text-sm text-muted-600 dark:text-muted-400 hover:underline" onClick={() => router.back()}>
          ← {t("Back")}
        </button>
      </div>

      {image && (<div className="relative w-full mb-6 max-h-[400px] overflow-hidden rounded-lg shadow-md">
          <img src={image} alt={title} className="w-full h-[300px] md:h-[400px] object-cover"/>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
            {/* Category Link */}
            <link_1.default href={`/blog/category/${(_a = post.category) === null || _a === void 0 ? void 0 : _a.slug}`}>
              <Tag_1.default color="contrast">{(_b = post.category) === null || _b === void 0 ? void 0 : _b.name}</Tag_1.default>
            </link_1.default>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>

            {/* Author and Date */}
            <div className="text-sm flex gap-2 items-center text-gray-300">
              <span>
                {t("By")} {(_d = (_c = post.author) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.firstName}{" "}
                {(_f = (_e = post.author) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f.lastName}
              </span>
              <Avatar_1.default src={((_h = (_g = post.author) === null || _g === void 0 ? void 0 : _g.user) === null || _h === void 0 ? void 0 : _h.avatar) || "/img/avatars/placeholder.webp"} alt={`${(_k = (_j = post.author) === null || _j === void 0 ? void 0 : _j.user) === null || _k === void 0 ? void 0 : _k.firstName} ${(_m = (_l = post.author) === null || _l === void 0 ? void 0 : _l.user) === null || _m === void 0 ? void 0 : _m.lastName}`} size="sm" className="ml-2 border border-white"/>
              <span>
                {new Date(post.createdAt || new Date()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
              </span>
            </div>
          </div>
        </div>)}

      {/* Content Section */}
      <div className="prose dark:prose-dark">
        <div dangerouslySetInnerHTML={{ __html: content }}/>
      </div>

      {relatedPosts.length > 0 && (<div className="mt-12">
          <h2 className="text-2xl font-semibold text-muted-800 dark:text-muted-200 mb-4">
            {t("Related Posts")}
          </h2>
          <RelatedPosts_1.default posts={relatedPosts}/>
        </div>)}

      {/* Comments Section */}
      <CommentSection_1.CommentSection comments={comments} postId={post.id} fetchData={fetchData}/>
    </div>);
};
exports.default = DefaultLayout;
