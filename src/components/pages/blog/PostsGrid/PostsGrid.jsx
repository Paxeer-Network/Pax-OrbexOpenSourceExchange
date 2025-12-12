"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsGrid = void 0;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const MashImage_1 = require("@/components/elements/MashImage");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const PostsGridBase = ({ posts }) => {
    return (<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
      {posts
            .reduce((rows, post, i) => {
            var _a;
            let row = rows[rows.length - 1];
            if (!row) {
                row = [];
                rows.push(row);
            }
            const remaining = 3 - row.reduce((acc, p) => acc + p.width, 0);
            const itemWidth = Math.min(Math.floor(Math.random() * 2) + 1, remaining);
            if (itemWidth <= remaining) {
                const className = `col-span-1 md:col-span-${itemWidth}`;
                const description = post.description || "";
                const contentSnippet = itemWidth === 1
                    ? description.slice(0, 150) + "..."
                    : description.slice(0, 350) + "...";
                const header = (<div className="relative w-full max-h-[200px] h-[200px] overflow-hidden z-1">
                  <MashImage_1.MashImage src={post.image || "/img/placeholder.svg"} alt={post.title} className="rounded-lg object-cover w-full h-full bg-muted-100 dark:bg-muted-900" fill/>
                  <Tag_1.default shape="rounded-sm" color="muted" variant="solid" className="ms-1 absolute top-2 left-2">
                    {(_a = post.category) === null || _a === void 0 ? void 0 : _a.name}
                  </Tag_1.default>
                </div>);
                row.push({
                    width: itemWidth,
                    element: (<link_1.default key={post.id} href={`/blog/post/${post.slug}`}>
                    <Card_1.default color={"contrast"} className={`relative w-full h-full p-2 hover:shadow-lg cursor-pointer ${className} hover:border-primary-500 transition-all duration-300 dark:hover:border-primary-400`}>
                      {header}
                      <div className="p-2">
                        <h3 className="text-lg font-semibold text-primary-500 dark:text-primary-400">
                          {post.title}
                        </h3>
                        <div className="flex flex-col gap-1 text-xs">
                          <p className="text-muted-500 dark:text-muted-400">
                            {contentSnippet}
                          </p>
                        </div>
                      </div>
                    </Card_1.default>
                  </link_1.default>),
                });
                if (remaining - itemWidth === 0) {
                    rows.push([]);
                }
            }
            return rows;
        }, [])
            .flatMap((row) => row.map(({ element }) => element))}
    </div>);
};
exports.PostsGrid = (0, react_1.memo)(PostsGridBase);
