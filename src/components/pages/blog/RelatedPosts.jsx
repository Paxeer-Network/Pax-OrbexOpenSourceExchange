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
exports.RelatedPosts = void 0;
const react_1 = __importStar(require("react"));
const link_1 = __importDefault(require("next/link"));
const MashImage_1 = require("@/components/elements/MashImage");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const RelatedPostsBase = ({ posts, max = 3, // Default maximum number of posts to display
 }) => {
    return (<div className={`grid grid-cols-1 ${max > 1 ? "sm:grid-cols-2" : ""} ${max > 2 ? "md:grid-cols-3" : ""} gap-4 mx-auto`}>
      {posts.slice(0, max).map((post) => {
            var _a;
            const description = post.description || "";
            const contentSnippet = description.slice(0, 150) + "...";
            const header = (<div className="relative w-full max-h-[200px] h-[200px] overflow-hidden z-1">
            <MashImage_1.MashImage src={post.image || "/img/placeholder.svg"} alt={post.title} className="rounded-lg object-cover w-full h-full bg-muted-100 dark:bg-muted-900" fill/>
            <Tag_1.default shape="rounded-sm" color="muted" variant="solid" className="ms-1 absolute top-2 left-2">
              {(_a = post.category) === null || _a === void 0 ? void 0 : _a.name}
            </Tag_1.default>
          </div>);
            const createdAt = post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
                : null;
            return (<link_1.default key={post.id} href={`/blog/post/${post.slug}`}>
            <Card_1.default color={"contrast"} className="relative w-full h-full p-2 hover:shadow-lg cursor-pointer hover:border-primary-500 transition-all duration-300 dark:hover:border-primary-400">
              {header}
              <div className="p-2">
                <h3 className="text-lg font-semibold text-primary-500 dark:text-primary-400">
                  {post.title}
                </h3>
                <div className="flex flex-col gap-1 text-xs">
                  <p className="text-muted-500 dark:text-muted-400">
                    {contentSnippet}
                  </p>
                  {createdAt && (<p className="text-muted-500 dark:text-muted-400 mt-1">
                      {createdAt}
                    </p>)}
                </div>
              </div>
            </Card_1.default>
          </link_1.default>);
        })}
    </div>);
};
exports.RelatedPosts = (0, react_1.memo)(RelatedPostsBase);
exports.default = exports.RelatedPosts;
