"use client";
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "~/lib/utils";
import { AutoExpandTabsProps } from './types';
import { useAutoAdvanceTimer } from './hooks/useAutoAdvanceTimer';
import TabsList from './components/TabsList';
import MediaDisplay from './components/MediaDisplay';

export default function AutoExpandTabs({
  tabs,
  autoPlayDuration = 15000,
  className,
}: AutoExpandTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.key || '');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const wasVisibleRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer to detect when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Section becomes visible - keep the current tab, just update visibility state
            setIsVisible(true);
            wasVisibleRef.current = true;
          } else {
            // Section goes out of view - keep the tab state, just update visibility
            setIsVisible(false);
            wasVisibleRef.current = false;
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: '0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const { progress, isPaused, togglePause } = useAutoAdvanceTimer({
    tabs,
    activeTab,
    autoPlayDuration,
    onTabChange: setActiveTab,
    isVisible: isVisible && !isMobile, // Disable timer on mobile
  });

  // Handle tab click
  const handleTabClick = (tabKey: string) => {
    if (activeTab !== tabKey) {
      setActiveTab(tabKey);
    }
  };

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div 
      ref={sectionRef}
      className={cn("w-full  flex flex-col lg:flex-row gap-0", className)}
    >
      {/* Left: Accordion Steps */}
      <div className="flex w-full ">
        <TabsList
          tabs={tabs}
          activeTab={activeTab}
          progress={progress}
          isPaused={isPaused}
          onTabClick={handleTabClick}
          onPauseToggle={togglePause}
        />
      </div>

      {/* Right: Media Display - Desktop Only */}
      <div className="hidden lg:flex w-full flex-col items-end lg:sticky lg:top-0">
        <MediaDisplay tabs={tabs} activeTab={activeTab} />
      </div>
    </div>
  );
}

