import React from 'react';
import { PauseButtonProps } from '../types';

export default function PauseButton({ isPaused, onToggle }: PauseButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="bg-gray-200 flex items-center p-2 rounded-full shrink-0 transition-all duration-200 hover:bg-gray-300 active:scale-95"
      aria-label={isPaused ? "Play" : "Pause"}
    >
      {isPaused ? (
        // Play icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3.33325 2.66675L12.6666 8.00008L3.33325 13.3334V2.66675Z"
            fill="#1F2937"
          />
        </svg>
      ) : (
        // Pause icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <rect x="4" y="3" width="2.5" height="10" rx="0.5" fill="#1F2937" />
          <rect x="9.5" y="3" width="2.5" height="10" rx="0.5" fill="#1F2937" />
        </svg>
      )}
    </button>
  );
}
