"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from "~/lib/utils";
import VideoPlayers from '~/components/common/VideoPlayer';
import Button from '../common/Button';
import Section from '../structure/Section';
import Container from '../structure/Container';
import { contentVideoTabsDummyData } from './contentDummy';
import SectionHeaderV2 from '../revamp/components/common/sectionHeaderV2';

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
  data: any;
}

export default function ContentVideoTabs({
  data,
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
    // Priority: 1. Dummy data, 2. Manual tabs, 3. Features data
    if (contentVideoTabsDummyData && contentVideoTabsDummyData.length > 0) {
      return contentVideoTabsDummyData;
    }

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
      const headerHeight = 250; 
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
    <Section className={cn("w-full flex flex-col !bg-white", containerClassName)}>


<Container className='w-full py-sm md:py-md lg:py-lg' type="V2" border="y-0" >
<div className="flex-col relative w-full flex gap-16 mb-[60px]">
        <SectionHeaderV2
              heading={data?.sectionHeadingDynamic}
              description={data?.description}
              className='xl:px-12 md:px-6 px-4'
          />
      </div>
      <div className="sticky top-[80px] z-40 pt-[16px]">
        <div className='mb-[72px] '>
          <div className="flex justify-center">
            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide p-1.5 rounded-full border border-gray-200 bg-white">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-base font-geist transition-all duration-200 ease-in-out whitespace-nowrap",
                      isActive
                        ? "bg-gray-950 text-white border border-transparent"
                        : "text-gray-950 bg-transparent hover:bg-tab-hover-gradient hover:shadow-[0_0_0_2px_#CAC5FF]"
                    )}
                  >
                    {tab.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      {tabs?.map((tab, index) => {
        const isActive = activeTab === tab.key;
        return (
          <section
            key={tab.key}
            className={cn(
              "min-h-screen py-12 bg-white",
              className
            )}
          >
            <div
              ref={(el) => {
                sectionRefs.current[tab.key] = el;
              }}
              data-tab-key={tab.key}
            >
              <Container >
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left Content Section */}
                <div className="flex-1 flex flex-col justify-center">
                  {tab.category && (
                    <div className=" text-vs-purple text-base font-geist font-normal leading-6 tracking-normal">
                      {tab.category}
                    </div>
                  )}
                  <h2 className="my-3 text-gray-900 text-4xl font-manrope font-semibold leading-10 tracking-normal">
                    {tab.heading}
                  </h2>
                  <p className=" text-gray-500 text-lg font-geist font-normal leading-[155.55%] tracking-normal">
                    {tab.description}
                  </p>
                  {tab.features && tab.features.length > 0 && (
                    <div className="flex flex-wrap gap-4 md:mt-6 mt-3">
                      {tab?.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="group flex items-center gap-2 text-gray-950 text-base font-geist font-medium leading-6 tracking-normal cursor-pointer transition-colors duration-200 hover:text-vs-purple"
                        >
                          <span className="transition-colors duration-200">{feature}</span>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 16 16" 
                            fill="none"
                            className="transition-transform duration-200 group-hover:translate-y-[-2px]"
                          >
                            <path 
                              d="M4.66675 4.66675H11.3334V11.3334" 
                              stroke="#6A7282" 
                              strokeWidth="1.66667" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="group-hover:stroke-vs-purple transition-colors duration-200"
                            />
                            <path 
                              d="M4.66675 11.3334L11.3334 4.66675" 
                              stroke="#6A7282" 
                              strokeWidth="1.66667" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="group-hover:stroke-vs-purple transition-colors duration-200"
                            />
                          </svg>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab.ctaText && (
                    <div className="flex justify-start md:mt-12 mt-6">
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
                    <div className="w-full h-full md:h-[644px] rounded-2xl bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-400">Video will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </Container>
            </div>
          </section>
        );
      })}
    </Container>
    </Section>
  );
}
