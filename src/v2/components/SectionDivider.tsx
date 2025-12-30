import React from 'react';
import { cn } from '~/lib/utils';

interface SectionDividerProps {
  className?: string;
  height?: string;
  color?: string;
  width?: string;
}

export default function SectionDivider({ 
  className, 
  height = '',
  color,
  width = '',
}: SectionDividerProps) {
  const borderColor = color || '#E5E7EB';
  
  return (
    <div 
      className={cn("w-full relative bg-white", className)}
      style={{ 
        height: height,
        // borderTop: '1px solid var(--color-gray-200, #E5E7EB)',
        // borderBottom: '1px solid var(--color-gray-200, #E5E7EB)',
        width: width,
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          ${borderColor},
          ${borderColor} 1px,
          transparent 1px,
          transparent 10px
        )`,
        backgroundSize: '14.14px 14.14px',
      }}
    />
  );
}

