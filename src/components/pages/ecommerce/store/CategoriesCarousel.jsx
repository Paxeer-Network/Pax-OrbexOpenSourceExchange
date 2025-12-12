"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// components/pages/shop/CategoriesCarousel.tsx
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const react_2 = require("swiper/react");
const modules_1 = require("swiper/modules");
require("swiper/css");
require("swiper/css/pagination");
require("swiper/css/effect-coverflow");
const MashImage_1 = require("@/components/elements/MashImage");
const CategoriesCarousel = ({ categories, t }) => {
    return (<div className="mt-5 mb-5">
      <div className="relative mb-6">
        <hr className="border-muted-200 dark:border-muted-700"/>
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {t("Categories")}
          </span>
        </span>
      </div>
      <react_2.Swiper modules={[modules_1.EffectCoverflow]} effect={"coverflow"} centeredSlides={true} grabCursor={true} loop={true} // Enables looping
     slidesPerView={4} // Visible slides, including the active one
     spaceBetween={30} // Space between slides
     coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: false,
        }} pagination={{ clickable: true }} breakpoints={{
            0: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            640: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
        }}>
        {categories.map((category, index) => (<react_2.SwiperSlide key={index} className="slide-item">
            <link_1.default href={`/store/${category.slug}`} passHref>
              <div className="group transition duration-300 ease-in-out transform hover:-translate-y-1 relative w-full h-[150px]">
                <MashImage_1.MashImage src={category.image || "/img/placeholder.svg"} alt={category.slug} className="object-cover w-full h-full bg-muted-100 dark:bg-muted-900 rounded-lg" fill/>
                <div className="bg-muted-900 absolute inset-0 z-10 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-50 rounded-lg"></div>
                <div className="absolute inset-0 z-20 flex h-full w-full flex-col justify-between p-6">
                  <h3 className="font-sans text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                    {category.name}
                  </h3>
                  <h3 className="font-sans text-sm text-white underline opacity-0 transition-all duration-300 group-hover:opacity-100">
                    {t("View products")}
                  </h3>
                </div>
              </div>
            </link_1.default>
          </react_2.SwiperSlide>))}
      </react_2.Swiper>
    </div>);
};
exports.default = CategoriesCarousel;
