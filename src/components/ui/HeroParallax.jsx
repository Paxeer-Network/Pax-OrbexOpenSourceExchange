"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemCard = exports.Header = exports.HeroParallax = void 0;
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
const MashImage_1 = require("@/components/elements/MashImage");
const link_1 = __importDefault(require("next/link"));
const HeroParallax = ({ title, description, items, }) => {
    const rows = Math.ceil(items.length / 5);
    const firstRow = items.slice(0, 5);
    const secondRow = items.slice(5, 10);
    const thirdRow = items.slice(10, 15);
    const ref = react_1.default.useRef(null);
    const { scrollYProgress } = (0, framer_motion_1.useScroll)({
        target: ref,
        offset: ["start start", "end start"],
    });
    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
    const translateX = (0, framer_motion_1.useSpring)((0, framer_motion_1.useTransform)(scrollYProgress, [0, 1], [0, 1000]), springConfig);
    const translateXReverse = (0, framer_motion_1.useSpring)((0, framer_motion_1.useTransform)(scrollYProgress, [0, 1], [0, -1000]), springConfig);
    const rotateX = (0, framer_motion_1.useSpring)((0, framer_motion_1.useTransform)(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
    const opacity = (0, framer_motion_1.useSpring)((0, framer_motion_1.useTransform)(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
    const rotateZ = (0, framer_motion_1.useSpring)((0, framer_motion_1.useTransform)(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
    const translateY = (0, framer_motion_1.useSpring)((0, framer_motion_1.useTransform)(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);
    return (<div ref={ref} className={`h-[${rows * 100}vh] py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]`}>
      <exports.Header title={title} description={description}/>
      <framer_motion_1.motion.div style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
        }} className="">
        <framer_motion_1.motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((item) => (<exports.ItemCard item={item} translate={translateX} key={item.title}/>))}
        </framer_motion_1.motion.div>
        <framer_motion_1.motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((item) => (<exports.ItemCard item={item} translate={translateXReverse} key={item.title}/>))}
        </framer_motion_1.motion.div>
        <framer_motion_1.motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((item) => (<exports.ItemCard item={item} translate={translateX} key={item.title}/>))}
        </framer_motion_1.motion.div>
      </framer_motion_1.motion.div>
    </div>);
};
exports.HeroParallax = HeroParallax;
const Header = ({ title, description, }) => {
    return (<div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
        {title}
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        {description}
      </p>
    </div>);
};
exports.Header = Header;
const ItemCard = ({ item, translate, }) => {
    return (<framer_motion_1.motion.div style={{
            x: translate,
        }} whileHover={{
            y: -20,
        }} key={item.title} className="group/item h-96 w-[30rem] relative shrink-0">
      <link_1.default href={item.link} className="block group-hover/item:shadow-2xl ">
        <MashImage_1.MashImage src={item.thumbnail} height={600} width={600} className="object-cover object-left-top absolute h-full w-full inset-0" alt={item.title}/>
      </link_1.default>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/item:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/item:opacity-100 text-white">
        {item.title}
      </h2>
    </framer_motion_1.motion.div>);
};
exports.ItemCard = ItemCard;
