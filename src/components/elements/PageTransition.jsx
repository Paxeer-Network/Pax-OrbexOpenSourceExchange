"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framer_motion_1 = require("framer-motion");
const router_1 = require("next/router");
const react_1 = require("react");
const Locales_1 = require("../layouts/shared/Locales/Locales");
const pageVariants = {
    initial: {
        opacity: 0,
        scale: 0.98,
    },
    in: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: "easeOut",
        },
    },
    out: {
        opacity: 0,
        scale: 0.98,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};
const PageTransition = ({ children }) => {
    const router = (0, router_1.useRouter)();
    const [isAnimating, setIsAnimating] = (0, react_1.useState)(false);
    const [key, setKey] = (0, react_1.useState)(router.asPath);
    const getPathnameWithoutLocale = (url) => {
        if (typeof url !== "string")
            return ""; // or handle this case as needed
        const urlParts = url.split("/");
        if (urlParts.length > 1 &&
            Locales_1.locales.some((locale) => locale.code === urlParts[1])) {
            urlParts.splice(1, 1);
        }
        return urlParts.join("/");
    };
    (0, react_1.useEffect)(() => {
        const handleRouteChangeStart = (url) => {
            if (getPathnameWithoutLocale(url) !==
                getPathnameWithoutLocale(router.asPath)) {
                setIsAnimating(true);
            }
        };
        const handleRouteChangeComplete = (url) => {
            const newKey = url;
            if (getPathnameWithoutLocale(newKey) !==
                getPathnameWithoutLocale(router.asPath)) {
                setKey(newKey);
            }
            setIsAnimating(false);
        };
        router.events.on("routeChangeStart", handleRouteChangeStart);
        router.events.on("routeChangeComplete", handleRouteChangeComplete);
        router.events.on("routeChangeError", handleRouteChangeComplete);
        return () => {
            router.events.off("routeChangeStart", handleRouteChangeStart);
            router.events.off("routeChangeComplete", handleRouteChangeComplete);
            router.events.off("routeChangeError", handleRouteChangeComplete);
        };
    }, [router]);
    const shouldAnimate = (url1, url2) => {
        const path1 = getPathnameWithoutLocale(url1);
        const path2 = getPathnameWithoutLocale(url2);
        const tradeOrBinaryRegex = /^(\/trade\/[^\/]+|\/binary\/[^\/]+)$/;
        return !(tradeOrBinaryRegex.test(path1) && tradeOrBinaryRegex.test(path2));
    };
    return (<framer_motion_1.AnimatePresence mode="wait">
      {(!isAnimating || shouldAnimate(key, router.asPath)) && (<framer_motion_1.motion.div key={key} initial="initial" animate="in" exit="out" variants={pageVariants} className="hidden-scrollbar">
          {children}
        </framer_motion_1.motion.div>)}
    </framer_motion_1.AnimatePresence>);
};
exports.default = PageTransition;
