"use client";
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
exports.OptionKey = exports.SpeakerGrid = exports.Row = exports.KBtn = exports.Keypad = exports.Trackpad = exports.Lid = exports.MacbookScroll = void 0;
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const cn_1 = require("@/utils/cn");
const MashImage_1 = require("@/components/elements/MashImage");
const react_2 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const MacbookScroll = ({ src, showGradient, title, badge, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const ref = (0, react_1.useRef)(null);
    const { scrollYProgress } = (0, framer_motion_1.useScroll)({
        target: ref,
        offset: ["start start", "end start"],
    });
    const [isMobile, setIsMobile] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (window && window.innerWidth < 768) {
            setIsMobile(true);
        }
    }, []);
    const scaleX = (0, framer_motion_1.useTransform)(scrollYProgress, [0, 0.3], [1.2, isMobile ? 1 : 1.5]);
    const scaleY = (0, framer_motion_1.useTransform)(scrollYProgress, [0, 0.3], [0.6, isMobile ? 1 : 1.5]);
    const translate = (0, framer_motion_1.useTransform)(scrollYProgress, [0, 1], [0, 1500]);
    const rotate = (0, framer_motion_1.useTransform)(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
    const textTransform = (0, framer_motion_1.useTransform)(scrollYProgress, [0, 0.3], [0, 100]);
    const textOpacity = (0, framer_motion_1.useTransform)(scrollYProgress, [0, 0.2], [1, 0]);
    return (<div ref={ref} className="min-h-[100vh] md:min-h-[175vh] flex flex-col items-center py-0 md:pt-48 md:pb-20 justify-start shrink-0 [perspective:640px] transform md:scale-100 scale-[0.55] sm:scale-50">
      <framer_motion_1.motion.h2 style={{
            translateY: textTransform,
            opacity: textOpacity,
        }} className="dark:text-white text-neutral-800 text-3xl font-bold mb-20 text-center">
        {title || (<span>
            {t("This Macbook is built with Tailwindcss.")}
            <br />
            {t("No kidding.")}
          </span>)}
      </framer_motion_1.motion.h2>
      {/* Lid */}
      <exports.Lid src={src} scaleX={scaleX} scaleY={scaleY} rotate={rotate} translate={translate}/>
      {/* Base area */}
      <div className="h-[17.6rem] w-[25.6rem] bg-gray-200 dark:bg-[#272729] rounded-2xl overflow-hidden relative -z-10">
        {/* above keyboard bar */}
        <div className="h-10 w-full relative">
          <div className="absolute inset-x-0 mx-auto w-[80%] h-4 bg-[#050505]"/>
        </div>
        <div className="flex relative">
          <div className="mx-auto w-[10%] overflow-hidden  h-full">
            <exports.SpeakerGrid />
          </div>
          <div className="mx-auto w-[80%] h-full">
            <exports.Keypad />
          </div>
          <div className="mx-auto w-[10%] overflow-hidden  h-full">
            <exports.SpeakerGrid />
          </div>
        </div>
        <exports.Trackpad />
        <div className="h-2 w-20 mx-auto inset-x-0 absolute bottom-0 bg-linear-to-t from-[#272729] to-[#050505] rounded-tr-3xl rounded-tl-xl"/>
        {showGradient && (<div className="h-40 w-full absolute bottom-0 inset-x-0 bg-linear-to-t dark:from-black from-white via-white dark:via-black to-transparent z-50"></div>)}
        {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
      </div>
    </div>);
};
exports.MacbookScroll = MacbookScroll;
const Lid = ({ scaleX, scaleY, rotate, translate, src, }) => {
    return (<div className="relative [perspective:640px]">
      <div style={{
            transform: "perspective(640px) rotateX(-25deg) translateZ(0px)",
            transformOrigin: "bottom",
            transformStyle: "preserve-3d",
        }} className="h-[9.6rem] w-[25.6rem] bg-gray-950 dark:bg-muted-900 rounded-2xl p-2 relative"></div>
      <framer_motion_1.motion.div style={{
            scaleX: scaleX,
            scaleY: scaleY,
            rotateX: rotate,
            translateY: translate,
            transformStyle: "preserve-3d",
            transformOrigin: "top",
        }} className="h-[17.6rem] w-[25.6rem] absolute inset-0 bg-gray-950 dark:bg-muted-900 rounded-2xl p-2">
        <div className="absolute inset-0 bg-[#272729] rounded-lg"/>
        <MashImage_1.MashImage src={src} alt="aceternity logo" fill className="object-cover object-left-top absolute rounded-lg inset-0 h-full w-full"/>
      </framer_motion_1.motion.div>
    </div>);
};
exports.Lid = Lid;
const Trackpad = () => {
    return (<div className="w-[32%] mx-auto h-[5.12rem]  rounded-xl my-1" style={{
            boxShadow: "0px 0px 1px 1px #00000020 inset",
        }}></div>);
};
exports.Trackpad = Trackpad;
const Keypad = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="h-full rounded-md bg-[#050505] mx-1 p-1">
      {/* First Row */}
      <exports.Row>
        <exports.KBtn className="w-10 items-end justify-start pl-[3.2px] pb-[1.8px]" childrenClassName="items-start">
          {t("esc")}
        </exports.KBtn>
        <exports.KBtn>
          <react_2.Icon icon="tabler:sun-low" className="h-[4.8px] w-[4.8px]"/>
          <span className="inline-block mt-1">F1</span>
        </exports.KBtn>

        <exports.KBtn>
          <react_2.Icon icon="tabler:sun" className="h-[4.8px] w-[4.8px]"/>
          <span className="inline-block mt-1">F2</span>
        </exports.KBtn>

        <exports.KBtn>
          <react_2.Icon icon="tabler:table" className="h-[4.8px] w-[4.8px]"/>
          <span className="inline-block mt-1">F3</span>
        </exports.KBtn>

        <exports.KBtn>
          <react_2.Icon icon="tabler:search" className="h-[4.8px] w-[4.8px]"/>
          <span className="inline-block mt-1">F4</span>
        </exports.KBtn>

        <exports.KBtn>
          <react_2.Icon icon="tabler:microphone" className="h-[4.8px] w-[4.8px]"/>
          <span className="inline-block mt-1">F5</span>
        </exports.KBtn>

        <exports.KBtn>
          <react_2.Icon icon="tabler:moon" className="h-[4.8px] w-[4.8px]"/>
          <span className="inline-block mt-1">F6</span>
        </exports.KBtn>

        <exports.KBtn>
          <react_2.Icon icon="tabler:player-track-prev" className="h-[4.8px] w-[4.8px]"/>
          <span className="inline-block mt-1">F7</span>
        </exports.KBtn>

        <exports.KBtn>
          <react_2.Icon icon="tabler:player-skip-forward" className="h-[4.8px] w-[4.8px]"/>
          <span className="inline-block mt-1">F8</span>
        </exports.KBtn>

        <exports.KBtn>
          <react_2.Icon icon="tabler:player-track-next" className="h-[4.8px] w-[4.8px]"/>
          <span className="inline-block mt-1">F8</span>
        </exports.KBtn>

        <exports.KBtn>
          <react_2.Icon icon="tabler:volume-3" className="h-[4.8px] w-[4.8px]"/>
          <span className="inline-block mt-1">F10</span>
        </exports.KBtn>

        <exports.KBtn>
          <react_2.Icon icon="tabler:volume-2" className="h-[4.8px] w-[4.8px]"/>
          <span className="inline-block mt-1">F11</span>
        </exports.KBtn>

        <exports.KBtn>
          <react_2.Icon icon="tabler:volume" className="h-[4.8px] w-[4.8px]"/>
          <span className="inline-block mt-1">F12</span>
        </exports.KBtn>
        <exports.KBtn>
          <div className="h-4 w-4 rounded-full  bg-linear-to-b from-20% from-neutral-900 via-black via-50% to-neutral-900 to-95% p-px">
            <div className="bg-black h-full w-full rounded-full"/>
          </div>
        </exports.KBtn>
      </exports.Row>

      {/* Second row */}
      <exports.Row>
        <exports.KBtn>
          <span className="block">~</span>
          <span className="block mt-1">`</span>
        </exports.KBtn>

        <exports.KBtn>
          <span className="block ">!</span>
          <span className="block">1</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">@</span>
          <span className="block">2</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">#</span>
          <span className="block">3</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">$</span>
          <span className="block">4</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">%</span>
          <span className="block">5</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">^</span>
          <span className="block">6</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">&</span>
          <span className="block">7</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">*</span>
          <span className="block">8</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">(</span>
          <span className="block">9</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">)</span>
          <span className="block">0</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">-</span>
          <span className="block">_</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">+</span>
          <span className="block"> = </span>
        </exports.KBtn>
        <exports.KBtn className="w-10 items-end justify-end pr-[3.2px] pb-[1.8px]" childrenClassName="items-end">
          {t("delete")}
        </exports.KBtn>
      </exports.Row>

      {/* Third row */}
      <exports.Row>
        <exports.KBtn className="w-10 items-end justify-start pl-[3.2px] pb-[1.8px]" childrenClassName="items-start">
          {t("tab")}
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">Q</span>
        </exports.KBtn>

        <exports.KBtn>
          <span className="block">W</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">E</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">R</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">T</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">Y</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">U</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">I</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">O</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">P</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">{`{`}</span>
          <span className="block">{`[`}</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">{`}`}</span>
          <span className="block">{`]`}</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">{`|`}</span>
          <span className="block">{`\\`}</span>
        </exports.KBtn>
      </exports.Row>

      {/* Fourth Row */}
      <exports.Row>
        <exports.KBtn className="w-[2.24rem] items-end justify-start pl-[3.2px] pb-[1.8px]" childrenClassName="items-start">
          {t("caps lock")}
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">A</span>
        </exports.KBtn>

        <exports.KBtn>
          <span className="block">S</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">D</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">F</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">G</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">H</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">J</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">K</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">L</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">{`:`}</span>
          <span className="block">{`;`}</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">{`"`}</span>
          <span className="block">{`'`}</span>
        </exports.KBtn>
        <exports.KBtn className="w-[2.28rem] items-end justify-end pr-[3.2px] pb-[1.8px]" childrenClassName="items-end">
          {t("return")}
        </exports.KBtn>
      </exports.Row>

      {/* Fifth Row */}
      <exports.Row>
        <exports.KBtn className="w-[2.92rem] items-end justify-start pl-[3.2px] pb-[1.8px]" childrenClassName="items-start">
          {t("shift")}
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">Z</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">X</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">C</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">V</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">B</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">N</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">M</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">{`<`}</span>
          <span className="block">{`,`}</span>
        </exports.KBtn>
        <exports.KBtn>
          <span className="block">{`>`}</span>
          <span className="block">{`.`}</span>
        </exports.KBtn>{" "}
        <exports.KBtn>
          <span className="block">{`?`}</span>
          <span className="block">{`/`}</span>
        </exports.KBtn>
        <exports.KBtn className="w-[2.92rem] items-end justify-end pr-[3.2px] pb-[1.8px]" childrenClassName="items-end">
          {t("shift")}
        </exports.KBtn>
      </exports.Row>

      {/* sixth Row */}
      <exports.Row>
        <exports.KBtn className="" childrenClassName="h-full justify-between py-[3.2px]">
          <div className="flex justify-end w-full pr-1">
            <span className="block">fn</span>
          </div>
          <div className="flex justify-start w-full pl-1">
            <react_2.Icon icon="tabler:world" className="h-[4.8px] w-[4.8px]"/>
          </div>
        </exports.KBtn>
        <exports.KBtn className="" childrenClassName="h-full justify-between py-[3.2px]">
          <div className="flex justify-end w-full pr-1">
            <react_2.Icon icon="tabler:chevron-up" className="h-[4.8px] w-[4.8px]"/>
          </div>
          <div className="flex justify-start w-full pl-1">
            <span className="block">{t("control")}</span>
          </div>
        </exports.KBtn>
        <exports.KBtn className="" childrenClassName="h-full justify-between py-[3.2px]">
          <div className="flex justify-end w-full pr-1">
            <exports.OptionKey className="h-[4.8px] w-[4.8px]"/>
          </div>
          <div className="flex justify-start w-full pl-1">
            <span className="block">{t("option")}</span>
          </div>
        </exports.KBtn>
        <exports.KBtn className="w-8" childrenClassName="h-full justify-between py-[3.2px]">
          <div className="flex justify-end w-full pr-1">
            <react_2.Icon icon="tabler:command" className="h-[4.8px] w-[4.8px]"/>
          </div>
          <div className="flex justify-start w-full pl-1">
            <span className="block">{t("command")}</span>
          </div>
        </exports.KBtn>
        <exports.KBtn className="w-[6.56rem]"></exports.KBtn>
        <exports.KBtn className="w-8" childrenClassName="h-full justify-between py-[3.2px]">
          <div className="flex justify-start w-full pl-1">
            <react_2.Icon icon="tabler:command" className="h-[4.8px] w-[4.8px]"/>
          </div>
          <div className="flex justify-start w-full pl-1">
            <span className="block">{t("command")}</span>
          </div>
        </exports.KBtn>
        <exports.KBtn className="" childrenClassName="h-full justify-between py-[3.2px]">
          <div className="flex justify-start w-full pl-1">
            <exports.OptionKey className="h-[4.8px] w-[4.8px]"/>
          </div>
          <div className="flex justify-start w-full pl-1">
            <span className="block">{t("option")}</span>
          </div>
        </exports.KBtn>
        <div className="w-[4.9rem] mt-[1.8px] h-6 p-[0.4px] rounded-[3.2px] flex flex-col justify-end items-center">
          <exports.KBtn className="w-6 h-3">
            <react_2.Icon icon="tabler:caret-up" className="h-[4.8px] w-[4.8px]"/>
          </exports.KBtn>
          <div className="flex">
            <exports.KBtn className="w-6 h-3">
              <react_2.Icon icon="tabler:caret-left" className="h-[4.8px] w-[4.8px]"/>
            </exports.KBtn>
            <exports.KBtn className="w-6 h-3">
              <react_2.Icon icon="tabler:caret-down" className="h-[4.8px] w-[4.8px]"/>
            </exports.KBtn>
            <exports.KBtn className="w-6 h-3">
              <react_2.Icon icon="tabler:caret-right" className="h-[4.8px] w-[4.8px]"/>
            </exports.KBtn>
          </div>
        </div>
      </exports.Row>
    </div>);
};
exports.Keypad = Keypad;
const KBtn = ({ className, children, childrenClassName, backlit = true, }) => {
    return (<div className={(0, cn_1.cn)("p-[0.4px] rounded-[3.2px]", backlit && "bg-white/[0.2] shadow-xl shadow-white")}>
      <div className={(0, cn_1.cn)("h-6 w-6 bg-[#0A090D] rounded-[3.5px] flex items-center justify-center", className)} style={{
            boxShadow: "0px -0.4px 2px 0 #0D0D0F inset, -0.4px 0px 2px 0 #0D0D0F inset",
        }}>
        <div className={(0, cn_1.cn)("text-neutral-200 text-[4px] w-full flex justify-center items-center flex-col", childrenClassName, backlit && "text-white")}>
          {children}
        </div>
      </div>
    </div>);
};
exports.KBtn = KBtn;
const Row = ({ children }) => {
    return (<div className="flex gap-[1.8px] mb-[1.8px] w-full shrink-0">
      {children}
    </div>);
};
exports.Row = Row;
const SpeakerGrid = () => {
    return (<div className="flex px-[0.4px] gap-[1.8px] mt-2 h-40" style={{
            backgroundImage: "radial-gradient(circle, #08080A 0.4px, transparent 0.4px)",
            backgroundSize: "2.4px 2.4px",
        }}></div>);
};
exports.SpeakerGrid = SpeakerGrid;
const OptionKey = ({ className }) => {
    return (<svg fill="none" version="1.1" id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.6 25.6" className={className}>
      <rect stroke="currentColor" strokeWidth={2} x="18" y="5" width="10" height="2"/>
      <polygon stroke="currentColor" strokeWidth={2} points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "/>
      <rect id="_Transparent_Rectangle_" className="st0" width="25.6" height="25.6" stroke="none"/>
    </svg>);
};
exports.OptionKey = OptionKey;
