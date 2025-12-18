import { useState, useEffect, useRef, useCallback } from 'react';
import { AutoExpandTab } from '../types';

interface UseAutoAdvanceTimerProps {
  tabs: AutoExpandTab[];
  activeTab: string;
  autoPlayDuration: number;
  onTabChange: (tabKey: string) => void;
  isVisible?: boolean;
}

interface UseAutoAdvanceTimerReturn {
  progress: number;
  isPaused: boolean;
  togglePause: () => void;
}

export function useAutoAdvanceTimer({
  tabs,
  activeTab,
  autoPlayDuration,
  onTabChange,
  isVisible = true,
}: UseAutoAdvanceTimerProps): UseAutoAdvanceTimerReturn {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnimationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedProgressRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const onTabChangeRef = useRef(onTabChange);
  const tabsRef = useRef(tabs);

  // Keep refs updated
  useEffect(() => {
    onTabChangeRef.current = onTabChange;
    tabsRef.current = tabs;
  }, [onTabChange, tabs]);

  // Clear all timers and animations
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressAnimationRef.current !== null) {
      cancelAnimationFrame(progressAnimationRef.current);
      progressAnimationRef.current = null;
    }
  }, []);

  // Smooth progress animation using requestAnimationFrame
  const animateProgress = useCallback(() => {
    const updateProgress = () => {
      if (isPausedRef.current) {
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / autoPlayDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100 && !isPausedRef.current) {
        progressAnimationRef.current = requestAnimationFrame(updateProgress);
      }
    };

    progressAnimationRef.current = requestAnimationFrame(updateProgress);
  }, [autoPlayDuration]);

  // Start auto advance timer
  const startTimer = useCallback(() => {
    clearTimers();
    setProgress(0);
    pausedProgressRef.current = 0;
    startTimeRef.current = Date.now();
    isPausedRef.current = false;
    animateProgress();

    // Auto advance to next tab
    timerRef.current = setTimeout(() => {
      const currentIndex = tabsRef.current.findIndex((tab) => tab.key === activeTab);
      const nextIndex = (currentIndex + 1) % tabsRef.current.length;
      onTabChangeRef.current(tabsRef.current[nextIndex].key);
    }, autoPlayDuration);
  }, [activeTab, autoPlayDuration, clearTimers, animateProgress]);

  // Handle pause/play
  const togglePause = useCallback(() => {
    setIsPaused((prevIsPaused) => {
      if (prevIsPaused) {
        // Resume: continue from where we left off
        const remainingTime = autoPlayDuration * (1 - pausedProgressRef.current / 100);
        startTimeRef.current = Date.now() - (autoPlayDuration - remainingTime);
        isPausedRef.current = false;
        
        // Restart progress animation
        animateProgress();
        
        // Restart tab advancement timer
        timerRef.current = setTimeout(() => {
          const currentIndex = tabsRef.current.findIndex((tab) => tab.key === activeTab);
          const nextIndex = (currentIndex + 1) % tabsRef.current.length;
          onTabChangeRef.current(tabsRef.current[nextIndex].key);
        }, remainingTime);
        
        return false;
      } else {
        // Pause: stop animation and save current progress
        pausedProgressRef.current = progress;
        isPausedRef.current = true;
        clearTimers();
        return true;
      }
    });
  }, [activeTab, autoPlayDuration, progress, clearTimers, animateProgress]);

  // Reset pause state when tab changes
  useEffect(() => {
    setIsPaused(false);
    isPausedRef.current = false;
    pausedProgressRef.current = 0;
  }, [activeTab]);

  // Auto advance effect - only start when visible
  useEffect(() => {
    isPausedRef.current = isPaused;
    
    if (!isPaused && tabs.length > 0 && isVisible) {
      startTimer();
    } else {
      clearTimers();
    }

    return () => {
      clearTimers();
    };
  }, [activeTab, isPaused, tabs.length, isVisible, startTimer, clearTimers]);

  return {
    progress,
    isPaused,
    togglePause,
  };
}
