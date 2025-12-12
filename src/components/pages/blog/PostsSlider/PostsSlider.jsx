"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsSlider = void 0;
const MashImage_1 = require("@/components/elements/MashImage");
const modules_1 = require("swiper/modules");
const react_1 = require("swiper/react");
require("swiper/css");
require("swiper/css/pagination");
require("swiper/css/effect-fade");
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const SwiperNavigation_1 = __importDefault(require("@/components/elements/addons/swiper/SwiperNavigation"));
const date_fns_1 = require("date-fns");
const link_1 = __importDefault(require("next/link"));
const PostsSliderBase = ({ content }) => {
    return (<>
      <h1 className="mb-[2rem] text-center text-[3rem] font-bold"></h1>
      <react_1.Swiper modules={[modules_1.Pagination, modules_1.EffectFade]} effect={"fade"} loop={true} spaceBetween={30} className="fade relative h-[400px]">
        {content.map((post, index) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return (<react_1.SwiperSlide className="relative pointer-events-none" key={index}>
              <div className="relative w-full h-full">
                <MashImage_1.MashImage src={post.image || "/img/placeholder.svg"} className="object-cover rounded-lg w-full h-full" fill alt=""/>
                <div className="absolute right-4 top-4">
                  <Tag_1.default shape="full">
                    {(0, date_fns_1.formatDate)(new Date(post.createdAt || new Date()), "MMM dd, yyyy")}
                  </Tag_1.default>
                </div>
              </div>
              <div className="hidden md:block absolute inset-x-0 bottom-0 mb-6 px-6 pointer-events-auto">
                <Card_1.default color="contrast" shadow-sm="flat" className="p-6 font-sans">
                  <div className="space-y-2">
                    <link_1.default href={`/blog/post/${post.slug}`}>
                      <h5 className="text-lg font-medium text-muted-800 dark:text-muted-100">
                        {post.title}
                      </h5>
                    </link_1.default>
                    <p className="text-sm text-muted-500 dark:text-muted-100">
                      {(_a = post.description) === null || _a === void 0 ? void 0 : _a.slice(0, 250)}...
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Avatar_1.default src={((_c = (_b = post.author) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.avatar) ||
                    "/img/avatars/placeholder.webp"} alt="" size="xxs"/>
                    <div>
                      <p className="text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
                        {(_e = (_d = post.author) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? void 0 : _e.firstName}{" "}
                        {(_g = (_f = post.author) === null || _f === void 0 ? void 0 : _f.user) === null || _g === void 0 ? void 0 : _g.lastName}
                      </p>
                      <span className="block text-xs text-muted-400">
                        {(_k = (_j = (_h = post.author) === null || _h === void 0 ? void 0 : _h.user) === null || _j === void 0 ? void 0 : _j.role) === null || _k === void 0 ? void 0 : _k.name}
                      </span>
                    </div>
                  </div>
                </Card_1.default>
              </div>
            </react_1.SwiperSlide>);
        })}
        <SwiperNavigation_1.default />
      </react_1.Swiper>
    </>);
};
exports.PostsSlider = PostsSliderBase;
