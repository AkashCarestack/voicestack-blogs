import { useEffect, useState, useCallback } from 'react'

/**
 * useScrollListen
 * React hook for listening to scroll events and tracking header fixed state and top strip visibility.
 * 
 * @returns {{
 *   scrollUp: boolean,
 *   scrollDown: boolean
 * }}
 */
export default function useScrollListen() {
  const [scrollUp, setScrollUp] = useState(false);
  const [scrollDown, setScrollDown] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScrollMob = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollUp(currentScrollY > 44);

    // Show top strip when at top or scrolling up, hide when scrolling down
    if (currentScrollY <= 0) {
      setScrollDown(true);
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up
      setScrollDown(true);
      setScrollUp(false);
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down
      setScrollDown(false);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollMob);
    return () => {
      window.removeEventListener("scroll", handleScrollMob);
    };
  }, [handleScrollMob]);

  return { scrollUp, scrollDown };
}
