"use client";

import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  asSpan?: boolean;
}

export default function WordRotate({
  words,
  duration = 2500,
  typingSpeed = 100,
  deletingSpeed = 20,
  pauseDuration = 1000,
  className,
  asSpan = false,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    const currentWord = words[index];
    if (!currentWord) return;

    let timeout: NodeJS.Timeout | undefined;

    if (!isDeleting && displayedText.length < currentWord.length) {
      // Typing mode: add characters one by one
      timeout = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayedText.length === currentWord.length && currentWord.length > 0) {
      // Finished typing: pause before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && displayedText.length > 0) {
      // Deleting mode: remove characters one by one
      timeout = setTimeout(() => {
        setDisplayedText(displayedText.slice(0, -1));
      }, deletingSpeed);
    } else if (isDeleting && displayedText.length === 0) {
      // Finished deleting: move to next word
      setIsDeleting(false);
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [displayedText, isDeleting, index, words, typingSpeed, deletingSpeed, pauseDuration]);

  // Get the current full word for SEO/accessibility
  const currentFullWord = words[index] || "";

  if (asSpan) {
    return (
      <span 
        className={cn(
          "inline-block whitespace-nowrap transition-all duration-300 ease-out text-vs-purple",
          className
        )}
        style={{
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
          lineHeight: "inherit",
          letterSpacing: "inherit",
        }}
        aria-live="polite"
        aria-atomic="true"
        aria-label={currentFullWord}
        title={currentFullWord}
      >
        {displayedText}
      </span>
    );
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <h1 
        className={cn("transition-all duration-300 ease-out", className)}
        style={{
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
          lineHeight: "inherit",
          letterSpacing: "inherit",
          color: "inherit",
        }}
        aria-live="polite"
        aria-atomic="true"
        aria-label={currentFullWord}
      >
        {displayedText}
      </h1>
    </div>
  );
}
