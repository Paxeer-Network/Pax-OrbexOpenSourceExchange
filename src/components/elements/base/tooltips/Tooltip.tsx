"use client";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

interface TooltipProps {
  children: React.ReactNode;
  content?: string; // Made optional
  position?: "top" | "bottom" | "start" | "end";
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-20, 20]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-30, 30]),
    springConfig
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    start: "right-full mr-2 top-1/2 -translate-y-1/2",
    end: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  const getLines = (pos: "top" | "bottom" | "start" | "end") => {
    switch (pos) {
      case "top":
        return (
          <>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px w-10 pointer-events-none z-30" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-10 pointer-events-none z-29" />
          </>
        );
      case "bottom":
        return (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px w-10 pointer-events-none z-30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-10 pointer-events-none z-29" />
          </>
        );
      case "start":
        return (
          <>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-emerald-500 to-transparent w-px h-6 pointer-events-none z-30" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-sky-500 to-transparent w-px h-6 pointer-events-none z-29" />
          </>
        );
      case "end":
        return (
          <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-emerald-500 to-transparent w-px h-6 pointer-events-none z-30" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-sky-500 to-transparent w-px h-6 pointer-events-none z-29" />
          </>
        );
    }
  };

  if (!content) {
    return <>{children}</>;
  }

  return (
    <div
      className={`relative inline-block ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 10,
              },
            }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            style={{
              rotate: rotate,
              translateX: translateX,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
            className={`z-50 absolute px-4 py-2 text-xs flex flex-col items-center justify-center rounded-md bg-white dark:bg-black text-black dark:text-white ${positionClasses[position]} transition-colors duration-300`}
          >
            {getLines(position)}
            <div className="relative z-40 text-sm">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
