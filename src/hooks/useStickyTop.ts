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
  /**
   * @deprecated Use 'base' instead
   */
  desktop?: number;
  /**
   * @deprecated Use 'md' instead
   */
  tablet?: number;
  /**
   * @deprecated Use 'base' instead
   */
  mobile?: number;
}

/**
 * Hook to calculate correct sticky top values based on header state.
 * When the top strip is visible (scroll up), adds 42px to all values.
 * 
 * @param options - Base top values for different breakpoints
 * @returns Tailwind className string with correct top values
 * 
 * @example
 * const stickyTop = useStickyTop({ base: 60, md: 50 });
 * // Returns: "top-[60px] md:top-[50px]" when top strip is hidden
 * // Returns: "top-[102px] md:top-[92px]" when top strip is visible
 */
export function useStickyTop(options: StickyTopOptions = {}): string {
  const { showTopStrip } = useHeaderContext();
  
  const TOP_STRIP_HEIGHT = 42;
  const adjustment = showTopStrip ? TOP_STRIP_HEIGHT : 0;
  
  // Support both new (base, md) and deprecated (desktop, tablet, mobile) naming
  const baseValue = options.base ?? options.desktop ?? options.mobile;
  const mdValue = options.md ?? options.tablet;
  
  const base = baseValue !== undefined ? baseValue + adjustment : undefined;
  const md = mdValue !== undefined ? mdValue + adjustment : undefined;
  
  const classes: string[] = [];
  
  if (base !== undefined) {
    classes.push(`top-[${base}px]`);
  }
  
  if (md !== undefined) {
    classes.push(`md:top-[${md}px]`);
  }
  
  return classes.join(' ');
}

