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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("swiper/react");
const modules_1 = require("swiper/modules");
require("swiper/css");
require("swiper/css/navigation");
require("swiper/css/autoplay");
const react_3 = require("@iconify/react");
const AutoplaySlider = ({ children, autoplayDuration = 5000, // Default duration is 5 seconds
containerStyles = "", }) => {
    const swiperRef = (0, react_1.useRef)(null); // Reference to Swiper instance
    const [isAutoplay, setIsAutoplay] = (0, react_1.useState)(true); // State to track autoplay status
    const [progress, setProgress] = (0, react_1.useState)(0); // Progress bar state
    const [activeIndex, setActiveIndex] = (0, react_1.useState)(0); // Track active slide index
    // Handler to start/stop autoplay
    const toggleAutoplay = () => {
        if (swiperRef.current) {
            const swiperInstance = swiperRef.current.swiper;
            if (isAutoplay) {
                swiperInstance.autoplay.stop();
            }
            else {
                swiperInstance.autoplay.start();
            }
            setIsAutoplay(!isAutoplay);
        }
    };
    // Dynamic progress update with smoother transition and timing control
    (0, react_1.useEffect)(() => {
        let interval;
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
    (0, react_1.useEffect)(() => {
        if (progress >= 100 && swiperRef.current) {
            const swiperInstance = swiperRef.current.swiper;
            swiperInstance.slideNext(); // Move to the next slide
            setProgress(0); // Reset progress
        }
    }, [progress]);
    // Function to jump to a specific slide
    const jumpToSlide = (index) => {
        if (swiperRef.current) {
            const swiperInstance = swiperRef.current.swiper;
            swiperInstance.slideTo(index);
            setProgress(0); // Reset progress when manually jumping to a slide
        }
    };
    return (<div className={`relative ${containerStyles}`}>
      <react_2.Swiper ref={swiperRef} modules={[modules_1.Pagination, modules_1.Navigation, modules_1.Autoplay]} spaceBetween={0} slidesPerView={1} autoplay={{ delay: autoplayDuration, disableOnInteraction: false }} pagination={{ clickable: false }} // Disable default pagination
     navigation={false} // Disable navigation buttons
     className="w-full h-full rounded-xl" onSlideChange={(swiper) => {
            setProgress(0); // Reset progress on slide change
            setActiveIndex(swiper.activeIndex); // Update active index
        }}>
        {children.map((child, index) => (<react_2.SwiperSlide key={index} className="w-full h-full flex items-center justify-center">
            {child}
          </react_2.SwiperSlide>))}
      </react_2.Swiper>

      {/* Autoplay Control and Progress Bars outside Swiper */}
      {children.length > 1 && (<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-2">
          {/* Start/Stop Button */}
          <button onClick={toggleAutoplay} className={"px-1 py-1 bg-white dark:bg-black text-black dark:text-white rounded-xs cursor-pointer text-xs"}>
            <react_3.Icon icon={isAutoplay ? "akar-icons:pause" : "akar-icons:play"}/>
          </button>

          {/* Custom Progress Bars */}
          <div className="flex items-center space-x-1">
            {children.map((_, barIndex) => (<div key={barIndex} onClick={() => jumpToSlide(barIndex)} // Make the bar clickable to jump to the corresponding slide
             className={`w-[40px] h-[2px] bg-gray-400 rounded-full overflow-hidden cursor-pointer`}>
                <div className="bg-white h-full transition-all" style={{
                    width: `${barIndex === activeIndex ? progress : 0}%`,
                    transition: "width 0.05s linear", // Smooth progress bar update
                }}></div>
              </div>))}
          </div>
        </div>)}
    </div>);
};
exports.default = AutoplaySlider;
