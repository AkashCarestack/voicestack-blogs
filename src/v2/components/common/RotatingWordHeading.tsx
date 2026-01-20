"use client";

import React from 'react';
import WordRotate from '~/components/ui/word-rotate';

/**
 * Function that takes full text and automatically inserts rotating words before "practices"
 * Returns a React element with rotating words inserted inline
 * All controls (words, duration, animations) are handled inside the function
 */
export function createRotatingWordHeading(
  text: string,
  words: string[] = ['Enterprise', 'Dental', 'Optometry', 'Physical Therapy', 'Veterinary']
): React.ReactElement {
  // Default duration - controlled inside
  const duration = 2500;

  // Find the position of "practices" (case insensitive)
  const searchText = text.toLowerCase();
  const practiceIndex = searchText.indexOf('practices');
  
  if (practiceIndex === -1) {
    // If "practices" not found, return original text
    return <>{text}</>;
  }

  // Split text into before and after "practices"
  const beforeText = text.substring(0, practiceIndex);
  const afterText = text.substring(practiceIndex);

  return (
    <>
      {beforeText}
      <WordRotate
        words={words}
        duration={duration}
        asSpan={true}
      />
      {' '}
      {afterText}
    </>
  );
}

