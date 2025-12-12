"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCard = void 0;
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const MashImage_1 = require("@/components/elements/MashImage");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const date_fns_1 = require("date-fns");
const PostCardBase = ({ post }) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return (<link_1.default href={`/blog/${post.slug}`} passHref>
      <Card_1.default shape="curved" className="group relative w-full h-full p-3 hover:shadow-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400">
        <div className="relative w-full h-[200px]">
          <MashImage_1.MashImage src={post.image || "/img/placeholder.svg"} alt={post.title} className="rounded-md object-cover w-full h-full bg-muted-100 dark:bg-muted-900" fill/>
          <Tag_1.default shape="full" color="primary" variant="pastel" className="absolute left-3 top-3 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {(_a = post.category) === null || _a === void 0 ? void 0 : _a.name}
          </Tag_1.default>
        </div>
        <div>
          <div className="mb-6 mt-3">
            <h3 className="line-clamp-2 text-gray-800 dark:text-gray-100">
              {post.title}
            </h3>
          </div>
          <div className="mt-auto flex items-center gap-2">
            <Avatar_1.default src={((_c = (_b = post.author) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.avatar) || "/img/avatars/1.svg"} text={(_e = (_d = post.author) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? void 0 : _e.firstName} size="xs" className="bg-muted-500/20 text-muted-500"/>
            <div className="leading-none">
              <h4 className="text-muted-800 dark:text-muted-100 font-sans text-sm font-medium leading-tight">
                {(_g = (_f = post.author) === null || _f === void 0 ? void 0 : _f.user) === null || _g === void 0 ? void 0 : _g.firstName}
              </h4>
              <p className="text-muted-400 font-sans text-xs">
                {(0, date_fns_1.formatDate)(new Date(post.createdAt || new Date()), "MMM dd, yyyy")}
              </p>
            </div>
            {/* {post.author?.user?.id === user?.id && (
          <Link
            href={`/blog/author/post?type=edit&slug=${post.slug}`}
            passHref
          >
            <button className="ms-auto">
              <Icon name="lucide:edit-3" />
              <span>Edit</span>
            </button>
          </Link>
        )} */}
          </div>
        </div>
      </Card_1.default>
    </link_1.default>);
};
exports.PostCard = PostCardBase;
