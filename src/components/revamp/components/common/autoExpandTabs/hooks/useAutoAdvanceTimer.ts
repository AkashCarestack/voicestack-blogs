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
        // Set resuming flag BEFORE updating state to prevent effect interference
        isResumingRef.current = true;
        const pausedProgress = pausedProgressRef.current;
        
        // Set progress state to the paused value first
        setProgress(pausedProgress);
        
        // Calculate remaining time
        const remainingTime = autoPlayDuration * (1 - pausedProgress / 100);
        // Calculate the start time that would give us the current progress when resumed
        startTimeRef.current = Date.now() - (autoPlayDuration * pausedProgress / 100);
        isPausedRef.current = false;
        
        // Restart progress animation
        animateProgress();
        
        // Restart tab advancement timer
        timerRef.current = setTimeout(() => {
          const currentIndex = tabsRef.current.findIndex((tab) => tab.key === activeTab);
          const nextIndex = (currentIndex + 1) % tabsRef.current.length;
          onTabChangeRef.current(tabsRef.current[nextIndex].key);
        }, remainingTime);
        
        // Clear resuming flag after animation starts
        requestAnimationFrame(() => {
          setTimeout(() => {
            isResumingRef.current = false;
          }, 50);
        });
        
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

  // Track if we're resuming (to prevent effect from restarting timer)
  const isResumingRef = useRef(false);
  const activeTabRef = useRef(activeTab);
  const hasStartedRef = useRef(false);

  // Reset pause state and progress when tab changes, then start timer
  useEffect(() => {
    const tabChanged = activeTabRef.current !== activeTab;
    
    // Only reset if tab actually changed
    if (tabChanged) {
      activeTabRef.current = activeTab;
      
      // Reset everything when tab changes
      clearTimers();
      setIsPaused(false);
      isPausedRef.current = false;
      pausedProgressRef.current = 0;
      setProgress(0);
      isResumingRef.current = false; // Reset resuming flag on tab change
      hasStartedRef.current = false; // Reset started flag on tab change
    }
    
    // Start fresh timer for current tab if:
    // 1. Tab changed (fresh start)
    // 2. Visible
    // 3. Not paused
    // 4. Not resuming (togglePause handles resume)
    if (tabs.length > 0 && isVisible && !isPaused && !isResumingRef.current) {
      // Only start if tab changed or hasn't started yet
      if (tabChanged || !hasStartedRef.current) {
        // Clear any existing timers first
        clearTimers();
        
        // Reset progress and start timer
        setProgress(0);
        pausedProgressRef.current = 0;
        startTimeRef.current = Date.now();
        isPausedRef.current = false;
        hasStartedRef.current = true;
        animateProgress();
        
        // Auto advance to next tab
        timerRef.current = setTimeout(() => {
          const currentIndex = tabsRef.current.findIndex((tab) => tab.key === activeTab);
          const nextIndex = (currentIndex + 1) % tabsRef.current.length;
          onTabChangeRef.current(tabsRef.current[nextIndex].key);
        }, autoPlayDuration);
      }
    } else if (!isVisible || (isPaused && !isResumingRef.current)) {
      // Only clear if not resuming
      if (!isResumingRef.current) {
        clearTimers();
      }
    }

    return () => {
      // Don't clear if we're resuming
      if (!isResumingRef.current) {
        clearTimers();
      }
    };
  }, [activeTab, tabs.length, isVisible, isPaused, clearTimers, animateProgress, autoPlayDuration]);

  // Auto advance effect - handle pause state changes
  useEffect(() => {
    isPausedRef.current = isPaused;
    
    // If we're resuming, don't interfere (togglePause handles it)
    if (isResumingRef.current) {
      return;
    }
    
    // If paused or not visible, clear timers
    if (isPaused || !isVisible) {
      clearTimers();
    }
  }, [isPaused, isVisible, clearTimers]);

  return {
    progress,
    isPaused,
    togglePause,
  };
}
