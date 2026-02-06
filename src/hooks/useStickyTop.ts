import { useHeaderContext } from '~/providers/HeaderContextProvider';

interface StickyTopOptions {
  /**
   * Base value for mobile (applies to all screen sizes, can be overridden by md)
   * This matches the pattern: top-[base] md:top-[md]
   */
  base?: number;
  /**
   * Value for md breakpoint and above (768px+)
   * This matches the pattern: top-[base] md:top-[md]
   */
  md?: number;
}

/**
 * Hook to calculate correct sticky top values based on header state.
 * When the main header is hidden (scroll > 200px down), returns 'top-0'.
 * Otherwise, returns the exact values provided for different breakpoints.
 * 
 * @param options - Base top values for different breakpoints
 * @returns Tailwind className string with correct top values
 * 
 * @example
 * const stickyTop = useStickyTop(); // Uses defaults: top-[48px] md:top-[63px]
 * const stickyTop = useStickyTop({ base: 60, md: 50 }); // Custom values
 * // Returns: "top-0" when main header is hidden
 * // Returns: "top-[48px] md:top-[63px]" (or custom values) when main header is visible
 */
export function useStickyTop(options: StickyTopOptions = {}): string {
  const { showMainHeader } = useHeaderContext();
  
  // If main header is hidden, sticky elements should be at top-0
  if (!showMainHeader) {
    return 'top-0';
  }
  
  // Default values: 48 for base (mobile), 63 for md (desktop)
  const base = options.base ?? 48;
  const md = options.md ?? 63;
  
  const classes: string[] = [];
  
  classes.push(`top-[${base}px]`);
  classes.push(`md:top-[${md}px]`);
  
  return classes.join(' ');
}

