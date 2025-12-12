export const buttonMotionVariants = {
  hover: {
    scale: 1.01, // Reduced scale transformation for a subtler effect
    textShadow: "0px 0px 8px rgb(255, 255, 255)",
    transition: { type: "spring", stiffness: 200, damping: 20 }, // Adjusted stiffness and added damping for a smoother transition
  },
  tap: {
    scale: 0.98, // Reduced scale transformation to make it less noticeable
    textShadow: "0px 0px 8px rgb(34, 34, 34)",
    transition: { duration: 0.1 }, // Added a transition duration to control speed
  },
  initial: {
    scale: 1,
    textShadow: "0px 0px 0px transparent",
  },
};

export const messageVariants = {
  initial: { y: 100, scale: 0.5, opacity: 0 },
  animate: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "backOut" },
  },
  exit: {
    y: -100,
    scale: 0.5,
    opacity: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const panelTransition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
};

export const panelVariants = (side) => ({
  panel: {
    hidden: {
      x: side === "right" ? 500 : side === "left" ? -500 : 0,
      y: side === "top" ? -500 : side === "bottom" ? 500 : 0,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: panelTransition,
    },
  },
  backdrop: {
    hidden: { opacity: 0, transition: { duration: 0.3 } },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  },
});

export const lottiesConfig = [
  {
    name: "mobileVerificationLottie",
    label: "Mobile Verification Lottie",
    category: "otp",
    path: "mobile-verfication",
    max: 2,
    maxWidth: 160,
    maxHeight: 160,
  },
  {
    name: "appVerificationLottie",
    label: "App Verification Lottie",
    category: "otp",
    path: "app-verfication",
    maxWidth: 160,
    maxHeight: 160,
  },
  {
    name: "emailVerificationLottie",
    label: "Email Verification Lottie",
    category: "otp",
    path: "email-verfication",
    maxWidth: 160,
    maxHeight: 160,
  },
  {
    name: "loginLottie",
    label: "Login Page Lottie",
    category: "cryptocurrency-3",
    path: "mining",
    maxWidth: 1024,
    maxHeight: 1024,
  },
  {
    name: "investmentLottie",
    label: "Active Investment Lottie",
    category: "stock-market",
    path: "stock-market-monitoring",
    max: 2,
    maxWidth: 512,
    maxHeight: 512,
  },
  {
    name: "icoLottie",
    label: "ICO Lottie",
    category: "cryptocurrency-2",
    path: "payout",
    maxWidth: 512,
    maxHeight: 512,
  },
  {
    name: "ecommerceLottie",
    label: "E-commerce Lottie",
    category: "ecommerce",
    path: "delivery",
    max: 2,
    maxWidth: 512,
    maxHeight: 512,
  },
  {
    name: "affiliateLottie",
    label: "Affiliate Lottie",
    category: "communications",
    path: "referral-marketing",
    max: 2,
    maxWidth: 512,
    maxHeight: 512,
  },
  {
    name: "binaryLottie",
    label: "Binary Lottie",
    category: "cryptocurrency-2",
    path: "trading",
    maxWidth: 512,
    maxHeight: 512,
  },
  {
    name: "forexLottie",
    label: "Forex Lottie",
    category: "stock-market-2",
    path: "capital-funding",
    max: 2,
    maxWidth: 512,
    maxHeight: 512,
  },
  {
    name: "investmentPlansLottie",
    label: "Investment Plans Page Lottie",
    dynamic: true,
    maxWidth: 512,
    maxHeight: 512,
  },
  {
    name: "stakingLottie",
    label: "Staking Lottie",
    category: "cryptocurrency-2",
    path: "payout",
    maxWidth: 512,
    maxHeight: 512,
  },
];
