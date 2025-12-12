// components/pages/shop/CategoriesCarousel.tsx
import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { MashImage } from "@/components/elements/MashImage";

interface Props {
  categories: any[];
  t: (key: string) => string;
}

const CategoriesCarousel: React.FC<Props> = ({ categories, t }) => {
  return (
    <div className="mt-5 mb-5">
      <div className="relative mb-6">
        <hr className="border-muted-200 dark:border-muted-700" />
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {t("Categories")}
          </span>
        </span>
      </div>
      <Swiper
        modules={[EffectCoverflow]}
        effect={"coverflow"}
        centeredSlides={true}
        grabCursor={true}
        loop={true} // Enables looping
        slidesPerView={4} // Visible slides, including the active one
        spaceBetween={30} // Space between slides
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 120,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
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
        }}
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index} className="slide-item">
            <Link href={`/store/${category.slug}`} passHref>
              <div className="group transition duration-300 ease-in-out transform hover:-translate-y-1 relative w-full h-[150px]">
                <MashImage
                  src={category.image || "/img/placeholder.svg"}
                  alt={category.slug}
                  className="object-cover w-full h-full bg-muted-100 dark:bg-muted-900 rounded-lg"
                  fill
                />
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
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoriesCarousel;
