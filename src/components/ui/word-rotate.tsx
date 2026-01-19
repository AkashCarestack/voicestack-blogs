"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";

import { cn } from "~/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  framerProps?: HTMLMotionProps<"span">;
  className?: string;
  asSpan?: boolean;
}

export default function WordRotate({
  words,
  duration = 2500,
  framerProps,
  className,
  asSpan = false,
}: WordRotateProps) {
  // Magic UI default animation variants
  const defaultVariants = {
    enter: { y: '20%', opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: '-20%', opacity: 0 },
  };

  const defaultTransition = { duration: 0.35, ease: [0.4, 0, 0.2, 1] };
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number | "auto">("auto");
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [words, duration]);

  // Measure the widest word to prevent layout shift
  useEffect(() => {
    if (asSpan) {
      // Use a timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        if (measureRef.current) {
          const measureElement = measureRef.current;
          let maxWidth = 0;
          
          // Create a temporary element to measure each word
          const tempSpan = document.createElement("span");
          tempSpan.style.visibility = "hidden";
          tempSpan.style.position = "absolute";
          tempSpan.style.whiteSpace = "nowrap";
          tempSpan.style.top = "-9999px";
          tempSpan.style.left = "-9999px";
          
          // Copy font styles from parent or use defaults
          const parentStyles = window.getComputedStyle(measureElement);
          tempSpan.style.fontSize = parentStyles.fontSize || "inherit";
          tempSpan.style.fontFamily = parentStyles.fontFamily || "inherit";
          tempSpan.style.fontWeight = parentStyles.fontWeight || "inherit";
          tempSpan.style.letterSpacing = parentStyles.letterSpacing || "normal";
          
          document.body.appendChild(tempSpan);

          words.forEach((word) => {
            tempSpan.textContent = word;
            maxWidth = Math.max(maxWidth, tempSpan.offsetWidth);
          });

          document.body.removeChild(tempSpan);
          if (maxWidth > 0) {
            setWidth(maxWidth);
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [words, asSpan]);

  if (asSpan) {
    return (
      <span 
        ref={measureRef}
        className={cn("inline-block", className)}
        // style={{
        //   ...(width !== "auto" ? { minWidth: `${width}px` } : {}),
        // }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            className="inline-block whitespace-nowrap"
            variants={framerProps?.variants || defaultVariants}
            initial={framerProps?.initial || "enter"}
            animate={framerProps?.animate || "center"}
            exit={framerProps?.exit || "exit"}
            transition={framerProps?.transition || defaultTransition}
            style={{ 
              lineHeight: 'inherit',
              fontSize: 'inherit',
            }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    );
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.h1
          key={words[index]}
          className={cn(className)}
          variants={framerProps?.variants || defaultVariants}
          initial={framerProps?.initial || "enter"}
          animate={framerProps?.animate || "center"}
          exit={framerProps?.exit || "exit"}
          transition={framerProps?.transition || defaultTransition}
        >
          {words[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
