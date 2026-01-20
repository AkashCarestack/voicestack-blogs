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
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayedText.length < currentWord.length) {
      // Typing mode: add characters one by one
      timeout = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayedText.length === currentWord.length) {
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

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, index, words, typingSpeed, deletingSpeed, pauseDuration]);

  if (asSpan) {
    return (
      <span className={cn("inline-block whitespace-nowrap", className)}>
        {displayedText}
      </span>
    );
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <h1 className={cn(className)}>
        {displayedText}
      </h1>
    </div>
  );
}
