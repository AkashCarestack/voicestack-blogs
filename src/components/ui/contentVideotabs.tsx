"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from "~/lib/utils";
import VideoPlayers from '~/components/common/VideoPlayer';
import Button from '../common/Button';
import Section from '../structure/Section';
import Container from '../structure/Container';
import SectionHeaderV2 from '../revamp/components/common/sectionHeaderV2';
import SwitchableTabs from '../revamp/components/common/switchableTabs';
import { IdataProps } from '../revamp/components/common/interface/common';


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
  tabs?: TabItem[];
  className?: string;
  containerClassName?: string;
  data: any;
}

// Dummy data for demonstration
const contentVideoTabsDummyData: TabItem[] = [
  {
    key: 'automation',
    title: 'Automation',
    category: 'Smart Workflows',
    heading: 'Automate Your Dental Practice',
    description: 'Streamline your operations with intelligent automation that saves time and reduces manual work.',
    features: ['Auto-scheduling', 'Smart reminders', 'Task automation'],
    ctaText: 'Book Free Demo',
    ctaLink: '/demo',
    video: {
      videoPlatform: 'youtube',
      videoId: 'dQw4w9WgXcQ' // Replace with actual YouTube video ID
    },
    thumbnail: 'https://placehold.co/600x400/EEE/31343C?text=Automation'
  },
  {
    key: 'analytics',
    title: 'Analytics',
    category: 'Data Insights',
    heading: 'Powerful Practice Analytics',
    description: 'Get deep insights into your practice performance with comprehensive analytics and reporting.',
    features: ['Real-time dashboards', 'Custom reports', 'Performance metrics'],
    ctaText: 'Book Free Demo',
    ctaLink: '/demo',
    video: {
      videoPlatform: 'youtube',
      videoId: 'dQw4w9WgXcQ' // Replace with actual YouTube video ID
    },
    thumbnail: 'https://placehold.co/600x400/EEE/31343C?text=Analytics'
  },
  {
    key: 'communication',
    title: 'Communication',
    category: 'Patient Engagement',
    heading: 'Seamless Patient Communication',
    description: 'Connect with patients effortlessly through multiple channels and improve engagement.',
    features: ['SMS & Email', 'Two-way messaging', 'Automated follow-ups'],
    ctaText: 'Book Free Demo',
    ctaLink: '/demo',
    video: {
      videoPlatform: 'youtube',
      videoId: 'dQw4w9WgXcQ' // Replace with actual YouTube video ID
    },
    thumbnail: 'https://placehold.co/600x400/EEE/31343C?text=Communication'
  }
];

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
    if (contentVideoTabsDummyData && contentVideoTabsDummyData.length > 0) {
      return contentVideoTabsDummyData;
    }
    if (manualTabs && manualTabs.length > 0) {
      return manualTabs;
    }
    return [];
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
      const headerHeight = 300; 
      const elementPosition = section.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  // Handle tab click
  const handleTabClick = useCallback(
    (tabKey: string) => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      setIsScrolling(true);
      activeTabRef.current = tabKey;
      setActiveTab(tabKey);

      requestAnimationFrame(() => {
        scrollToSection(tabKey);
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 1500);
      });
    },
    [scrollToSection]
  );

  // Intersection Observer to detect active section
  useEffect(() => {
    if (isScrolling) return;

    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -50% 0px',
      threshold: [0.1, 0.3, 0.5, 0.7],
    };

    const observer = new IntersectionObserver((entries) => {
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

    const timeoutId = setTimeout(() => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [tabs, isScrolling]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  const currentTabData = tabs.find(tab => tab.key === activeTab) || tabs[0];
  
  // Get uploaded MP4 video from data.video
  const getUploadedVideo = () => {
    if (!data?.video || !Array.isArray(data.video) || data.video.length === 0) {
      return null;
    }
    
    const firstVideo = data.video[0];
    if (!firstVideo?.uploadedVideos || !Array.isArray(firstVideo.uploadedVideos)) {
      return null;
    }
    
    // Find MP4 video
    const mp4Video = firstVideo.uploadedVideos.find(
      (uploadedVideo: any) => uploadedVideo.type === 'mp4'
    );
    
    return mp4Video?.url || null;
  };
  
  const uploadedVideoUrl = getUploadedVideo();

  return (
    <Section className={cn("w-full flex flex-col !bg-white", containerClassName)}>
      <Container className='w-full py-sm md:py-md lg:py-lg px-12' type="V2" border="y-0">
      <div className="flex-col relative w-full flex gap-16 mb-[60px]">
          <SectionHeaderV2
            heading={data?.sectionHeadingDynamic}
            description={data?.description}
            className='xl:px-12 md:px-6 px-4'
          />
        </div>
        
        {uploadedVideoUrl && (
          <div className="w-[calc(100%+96px)] -mx-12 mb-8 overflow-hidden bg-gray-100 h-[400px] md:h-[600px]">
            <div className="relative w-full h-full">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src={uploadedVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

      <div className="sticky top-0 md:top-[20px] z-[100] w-fit md:py-16 bg-transparent overflow-hidden justify-center items-center mx-auto">
        <SwitchableTabs
          data={tabs.map(tab => ({
            id: tab.key,
            key: tab.key,
            title: tab.title,
            testimonial: null,
            setActiveTab: handleTabClick,
          })) as IdataProps[]}
          setActiveTab={handleTabClick}
          activeTab={activeTab}
          isSticky={true}
          className="md:py-16 bg-transparent !shadow-none !border-none"
          isShowImage={false}
        />
      </div>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Scrollable Content Sections */}
          <div className="flex-1">
            {tabs?.map((tab) => (
              <section
                key={tab.key}
                className="min-h-screen py-12"
              >
                <div
                  ref={(el) => {
                    sectionRefs.current[tab.key] = el;
                  }}
                  data-tab-key={tab.key}
                >
                  <div className="flex flex-col justify-center">
                    {tab.category && (
                      <div className="text-vs-purple text-base font-geist font-normal leading-6 tracking-normal">
                        {tab.category}
                      </div>
                    )}
                    <h2 className="my-3 text-gray-900 text-4xl font-manrope font-semibold leading-10 tracking-normal">
                      {tab.heading}
                    </h2>
                    <p className="text-gray-500 text-lg font-geist font-normal leading-[155.55%] tracking-normal">
                      {tab.description}
                    </p>
                    
                    {tab.features && tab.features.length > 0 && (
                      <div className="flex flex-wrap gap-4 md:mt-6 mt-3">
                        {tab.features.map((feature, idx) => (
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
                        <Button type="primary" link={tab.ctaLink || '/demo'}>
                          <span className="text-sm font-medium">{tab.ctaText}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Right: Sticky Video Player - Changes based on activeTab */}
          <div className="flex-1 lg:sticky lg:top-[200px] lg:self-start">
            <div className="w-full h-[400px] md:h-[644px] rounded-2xl overflow-hidden bg-gray-100 transition-all duration-500">
              {currentTabData.video ? (
                <div className="w-full h-full">
                  <VideoPlayers
                    video={currentTabData.video}
                    thumbnail={currentTabData.thumbnail}
                  />
                </div>
              ) : currentTabData.thumbnail ? (
                <div className="w-full h-full relative">
                  <img 
                    src={currentTabData.thumbnail} 
                    alt={currentTabData.heading}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5v14l11-7z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium">{currentTabData.title}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400">Video: {currentTabData.title}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}