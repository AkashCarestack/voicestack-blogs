"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from "~/lib/utils";
import VideoPlayers from '~/components/common/VideoPlayer';
import Button from '../common/Button';

interface Feature {
  _id: string;
  basicInfo?: {
    title: string;
    slug?: {
      current: string;
    };
    description?: string;
    icon?: any;
  };
  title?: string;
  slug?: {
    current: string;
  };
  language: string;
  order?: number;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: any;
  mainImage?: any;
  shortDescription?: any;
  featureCategory?: {
    name: string;
    subheading?: string;
    description?: string;
    mainImage?: any;
    icon?: any;
    iconSvgCode?: string;
  };
  video?: any;
  thumbnail?: any;
}

interface TabItem {
  key: string;
  title: string;
  category?: string;
  heading: string;
  description: string;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
  video?: any;
  thumbnail?: any;
}

interface ContentVideoTabsProps {
  features?: Feature[];
  tabs?: TabItem[]; // Fallback for manual tabs
  className?: string;
  containerClassName?: string;
}

export default function ContentVideoTabs({
  features,
  tabs: manualTabs,
  className,
  containerClassName,
}: ContentVideoTabsProps) {
  const activeTabRef = useRef<string>('');
  const [activeTab, setActiveTab] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Transform featuresData into tabs structure
  const tabs = useMemo(() => {
    if (manualTabs && manualTabs.length > 0) {
      return manualTabs;
    }

    if (!features || !Array.isArray(features)) {
      return [];
    }

    // Group features by category
    const featuresByCategory = features.reduce(
      (acc, feature) => {
        if (feature.featureCategory && feature.featureCategory.name) {
          const categoryName = feature.featureCategory.name;
          if (!acc[categoryName]) {
            acc[categoryName] = {
              category: feature.featureCategory,
              features: [],
            };
          }
          acc[categoryName].features.push(feature);
        }
        return acc;
      },
      {} as Record<string, { category: any; features: Feature[] }>,
    );

    // Convert to tabs
    return Object.keys(featuresByCategory).map((categoryName) => {
      const categoryData = featuresByCategory[categoryName];
      const category = categoryData.category;
      const categoryFeatures = categoryData.features;

      // Get first feature's video if available
      const firstFeature = categoryFeatures[0];
      const video = firstFeature?.video;
      const thumbnail = firstFeature?.thumbnail || firstFeature?.mainImage || firstFeature?.heroImage;

      // Extract feature titles for the features list
      const featureTitles = categoryFeatures
        .map((f) => f.basicInfo?.title || f.title || f.heroTitle)
        .filter(Boolean);

      return {
        key: categoryName.toLowerCase().replace(/\s+/g, '-'),
        title: categoryName,
        category: category.subheading || categoryName,
        heading: category.subheading || categoryName,
        description: category.description || categoryFeatures[0]?.basicInfo?.description || categoryFeatures[0]?.shortDescription || '',
        features: featureTitles,
        ctaText: 'Book Free Demo',
        ctaLink: categoryFeatures[0]?.basicInfo?.slug?.current 
          ? `/dental-phones/features/${categoryFeatures[0].basicInfo.slug.current}`
          : '#',
        video,
        thumbnail,
      };
    });
  }, [features, manualTabs]);

  // Set initial active tab
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      const firstTab = tabs[0].key;
      setActiveTab(firstTab);
      activeTabRef.current = firstTab;
    }
  }, [tabs, activeTab]);

  // Smooth scroll to section
  const scrollToSection = useCallback((tabKey: string) => {
    const section = sectionRefs.current[tabKey];
    if (section) {
      const headerHeight = 100; // Adjust based on your header height
      const elementPosition = section.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  // Handle tab click - scroll to section (similar to CategoryFeatureTabs)
  const handleTabClick = useCallback(
    (tabKey: string) => {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Disable intersection observer FIRST
      setIsScrolling(true);

      // Update active tab immediately in ref AND state
      activeTabRef.current = tabKey;
      setActiveTab(tabKey);

      // Use requestAnimationFrame to ensure state is updated before scroll
      requestAnimationFrame(() => {
        // Scroll to section
        scrollToSection(tabKey);

        // Re-enable intersection observer after scroll completes
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 1500);
      });
    },
    [scrollToSection]
  );

  // Intersection Observer to detect active section (similar to CategoryFeatureTabs)
  useEffect(() => {
    // Don't set up observer if user is manually scrolling
    if (isScrolling) return;

    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -50% 0px',
      threshold: [0.1, 0.3, 0.5, 0.7],
    };

    const observer = new IntersectionObserver((entries) => {
      // Skip if user is manually scrolling
      if (isScrolling) return;

      let mostVisibleEntry = null;
      let highestRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
          highestRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      });

      if (mostVisibleEntry && highestRatio > 0.2) {
        const tabKey = mostVisibleEntry.target.getAttribute('data-tab-key');
        if (tabKey && tabKey !== activeTabRef.current) {
          activeTabRef.current = tabKey;
          setActiveTab(tabKey);
        }
      }
    }, observerOptions);

    // Small delay to ensure refs are set
    const timeoutId = setTimeout(() => {
      // Observe all sections
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [tabs, isScrolling]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Early return if no tabs
  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full", containerClassName)}>
      {/* Tabs Navigation */}
      <div className="sticky top-[80px] z-40 bg-white py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 xl:px-12">
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className={cn(
                    "px-5 py-2.5 rounded-3xl text-base font-geist transition-all duration-200 ease-in-out whitespace-nowrap",
                    isActive
                      ? "bg-gray-950 text-white"
                      : "text-gray-950 bg-transparent hover:bg-gray-100"
                  )}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 xl:px-12">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.key;
          return (
            <div
              key={tab.key}
              ref={(el) => {
                sectionRefs.current[tab.key] = el;
              }}
              data-tab-key={tab.key}
              className={cn(
                "min-h-screen py-12 flex flex-col lg:flex-row gap-8 lg:gap-12",
                className
              )}
            >
              {/* Left Content Section */}
              <div className="flex-1 flex flex-col justify-center">
                {tab.category && (
                  <div className="text-sm font-medium text-purple-600 mb-2">
                    {tab.category}
                  </div>
                )}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {tab.heading}
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {tab.description}
                </p>
                {tab.features && tab.features.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-8">
                    {tab.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-gray-700 text-sm"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <span>{feature}</span>
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    ))}
                  </div>
                )}

                {tab.ctaText && (
                  <div className="flex justify-start">
               <Button type="primary" link="/demo">
                 <span className="text-sm font-medium">{`Book Free Demo`}</span>
               </Button>
               </div>
                )}
              </div>

              {/* Right Video Player Section */}
              <div className="flex-1 flex items-center justify-center">
                {isActive && tab.video ? (
                  <div className="w-full h-full md:h-[644px] rounded-2xl overflow-hidden bg-gray-100">
                    <VideoPlayers
                      video={tab?.video}
                      thumbnail={tab?.thumbnail}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full  md:h-[644px] rounded-2xl bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">Video will appear here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
