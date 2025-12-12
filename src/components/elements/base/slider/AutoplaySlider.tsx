import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Icon } from "@iconify/react";

interface AutoplaySliderProps {
  children: React.ReactNode[]; // Array of child elements (slides)
  autoplayDuration?: number; // Duration for each slide in milliseconds
  containerStyles?: string; // Custom styles for the container
}

const AutoplaySlider: React.FC<AutoplaySliderProps> = ({
  children,
  autoplayDuration = 5000, // Default duration is 5 seconds
  containerStyles = "",
}) => {
  const swiperRef = useRef<any>(null); // Reference to Swiper instance
  const [isAutoplay, setIsAutoplay] = useState(true); // State to track autoplay status
  const [progress, setProgress] = useState(0); // Progress bar state
  const [activeIndex, setActiveIndex] = useState(0); // Track active slide index

  // Handler to start/stop autoplay
  const toggleAutoplay = () => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      if (isAutoplay) {
        swiperInstance.autoplay.stop();
      } else {
        swiperInstance.autoplay.start();
      }
      setIsAutoplay(!isAutoplay);
    }
  };

  // Dynamic progress update with smoother transition and timing control
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const updateInterval = 50; // Interval duration for updating progress (in ms)

    if (isAutoplay) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const nextValue = prev + (updateInterval / autoplayDuration) * 100;
          return nextValue >= 100 ? 100 : nextValue;
        });
      }, updateInterval); // Increment progress every `updateInterval` milliseconds
    }

    return () => clearInterval(interval);
  }, [isAutoplay, autoplayDuration]);

  // Trigger slide change when progress reaches 100%
  useEffect(() => {
    if (progress >= 100 && swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      swiperInstance.slideNext(); // Move to the next slide
      setProgress(0); // Reset progress
    }
  }, [progress]);

  // Function to jump to a specific slide
  const jumpToSlide = (index: number) => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      swiperInstance.slideTo(index);
      setProgress(0); // Reset progress when manually jumping to a slide
    }
  };

  return (
    <div className={`relative ${containerStyles}`}>
      <Swiper
        ref={swiperRef}
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: autoplayDuration, disableOnInteraction: false }}
        pagination={{ clickable: false }} // Disable default pagination
        navigation={false} // Disable navigation buttons
        className="w-full h-full rounded-xl"
        onSlideChange={(swiper) => {
          setProgress(0); // Reset progress on slide change
          setActiveIndex(swiper.activeIndex); // Update active index
        }}
      >
        {children.map((child, index) => (
          <SwiperSlide
            key={index}
            className="w-full h-full flex items-center justify-center"
          >
            {child}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Autoplay Control and Progress Bars outside Swiper */}
      {children.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-2">
          {/* Start/Stop Button */}
          <button
            onClick={toggleAutoplay}
            className={
              "px-1 py-1 bg-white dark:bg-black text-black dark:text-white rounded-xs cursor-pointer text-xs"
            }
          >
            <Icon icon={isAutoplay ? "akar-icons:pause" : "akar-icons:play"} />
          </button>

          {/* Custom Progress Bars */}
          <div className="flex items-center space-x-1">
            {children.map((_, barIndex) => (
              <div
                key={barIndex}
                onClick={() => jumpToSlide(barIndex)} // Make the bar clickable to jump to the corresponding slide
                className={`w-[40px] h-[2px] bg-gray-400 rounded-full overflow-hidden cursor-pointer`}
              >
                <div
                  className="bg-white h-full transition-all"
                  style={{
                    width: `${barIndex === activeIndex ? progress : 0}%`,
                    transition: "width 0.05s linear", // Smooth progress bar update
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoplaySlider;
