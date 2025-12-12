"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCardPin = void 0;
const link_1 = __importDefault(require("next/link"));
const PostPin_1 = require("@/components/ui/PostPin");
const MashImage_1 = require("@/components/elements/MashImage");
const PostCardPinBase = ({ post }) => {
    var _a;
    return (<link_1.default href={`/blog/${post.slug}`} passHref>
      <PostPin_1.PinContainer title={post.title} href={`/blog/${post.slug}`}>
        <div className="flex basis-full flex-col tracking-tight text-slate-100/50 sm:basis-1/2 w-[16rem] h-[20rem] ">
          <div className="relative w-full h-[200px] mb-5">
            <MashImage_1.MashImage src={post.image || "/img/placeholder.svg"} alt={post.title} className="rounded-lg object-cover w-full h-full bg-muted-100 dark:bg-muted-900" fill/>
          </div>
          <h3 className="line-clamp-2 text-gray-800 dark:text-gray-100">
            {post.title}
          </h3>
          <div className="text-base m-0! p-0! font-normal">
            <span className="text-slate-500 ">
              {(_a = post.content) === null || _a === void 0 ? void 0 : _a.slice(0, 120)}...
            </span>
          </div>
        </div>
      </PostPin_1.PinContainer>
    </link_1.default>);
};
exports.PostCardPin = PostCardPinBase;
