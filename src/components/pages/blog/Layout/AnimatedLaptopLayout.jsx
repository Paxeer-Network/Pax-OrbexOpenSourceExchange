"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Beam_1 = require("@/components/ui/Beam");
const MacBookScroll_1 = require("@/components/ui/MacBookScroll");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const link_1 = __importDefault(require("next/link"));
const CommentSection_1 = require("@/components/pages/blog/CommentSection");
const router_1 = require("next/router");
const RelatedPosts_1 = __importDefault(require("../RelatedPosts"));
const AnimatedLaptopLayout = ({ post, comments, relatedPosts, fetchData, t, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const { title, content, image } = post;
    const router = (0, router_1.useRouter)();
    return (<>
      {/* Back Button */}
      <div className="mb-4">
        <button className="text-sm text-muted-600 dark:text-muted-400 hover:underline" onClick={() => router.back()}>
          ← {t("Back")}
        </button>
      </div>
      <Beam_1.TracingBeam>
        <div className="max-w-prose mx-auto antialiased pt-4 relative">
          <div className="overflow-hidden w-full hidden md:block">
            <MacBookScroll_1.MacbookScroll showGradient={false} title={<div className="flex flex-col gap-2 justify-center items-center">
                  <div>
                    <link_1.default href={`/blog/category/${(_a = post.category) === null || _a === void 0 ? void 0 : _a.slug}`}>
                      <Tag_1.default color="primary" variant="outlined">
                        {(_b = post.category) === null || _b === void 0 ? void 0 : _b.name}
                      </Tag_1.default>
                    </link_1.default>
                  </div>
                  <span className="text-7xl">{title}</span>
                  <div className="text-sm flex gap-2 items-center mt-8">
                    <span>
                      {t("By")} {(_d = (_c = post.author) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.firstName}{" "}
                      {(_f = (_e = post.author) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f.lastName}
                    </span>
                    <Avatar_1.default src={((_h = (_g = post.author) === null || _g === void 0 ? void 0 : _g.user) === null || _h === void 0 ? void 0 : _h.avatar) ||
                "/img/avatars/placeholder.webp"} alt={`${(_k = (_j = post.author) === null || _j === void 0 ? void 0 : _j.user) === null || _k === void 0 ? void 0 : _k.firstName} ${(_m = (_l = post.author) === null || _l === void 0 ? void 0 : _l.user) === null || _m === void 0 ? void 0 : _m.lastName}`} size="sm" className="ml-2"/>
                    <span className="text-muted-600 dark:text-muted-400">
                      {new Date(post.createdAt || new Date()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}{" "}
                    </span>
                  </div>
                </div>} src={image || "/img/placeholder.svg"}/>
          </div>
          <div className="prose mx-auto max-w-prose prose-pre:max-w-[90vw] pe-20 md:pe-0 dark:prose-dark">
            <div dangerouslySetInnerHTML={{ __html: content }}/>
          </div>
          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (<div className="mt-12">
              <h2 className="text-2xl font-semibold text-muted-800 dark:text-muted-200 mb-4">
                {t("Related Posts")}
              </h2>
              <RelatedPosts_1.default posts={relatedPosts} max={2}/>
            </div>)}
          <CommentSection_1.CommentSection comments={comments} postId={post.id} fetchData={fetchData}/>
        </div>
      </Beam_1.TracingBeam>
    </>);
};
exports.default = AnimatedLaptopLayout;
