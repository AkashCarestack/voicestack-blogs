"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PortableText } from '@portabletext/react';
import { cn } from "~/lib/utils";
import VideoPlayers from '~/components/common/VideoPlayer';
import Button from '~/components/common/Button';
import Section from '~/components/structure/Section';
import Container from '~/components/structure/Container';
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2';
import SwitchableTabs from '~/components/revamp/components/common/switchableTabs';
import { IdataProps } from '~/components/revamp/components/common/interface/common';
import { urlForImage } from '~/lib/sanity.image';
import ImageLoader from '~/components/common/imageLoader/imageLoader';


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
  description: any; // Block content array
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
  ctaListItems?: Array<{
    ctaText?: string;
    ctaLink?: string;
    ctaType?: string;
  }>;
  video?: any;
  thumbnail?: any;
  image?: any;
}

interface ContentVideoTabsProps {
  features?: Feature[];
  tabs?: TabItem[];
  className?: string;
  containerClassName?: string;
  data: any;
}

export default function ContentVideoTabsSection({
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
  const stickyTabsRef = useRef<HTMLDivElement | null>(null);

  // Helper function to check if video has valid data
  const hasValidVideo = (video: any): boolean => {
    if (!video) return false;
    // Check if video has videoUrl (direct video URL)
    if (video.videoUrl) return true;
    // Check if video has videoId and videoPlatform (embedded video)
    if (video.videoId && video.videoPlatform) return true;
    return false;
  };

  // Transform CMS tabs data into tabs structure
  const tabs = useMemo(() => {
    if (manualTabs && manualTabs.length > 0) {
      return manualTabs;
    }
    
    if (data?.tabs && Array.isArray(data.tabs) && data.tabs.length > 0) {
      return data.tabs.map((tab: any, index: number) => {
        const tabKey = tab._key || `tab-${index}`;
        
        // Get image URL - handle multiple cases (similar to imageLoader logic)
        let imageUrl = null;
        if (tab.image) {
          // Check if image has direct URL (resolved image)
          if (tab.image.url) {
            imageUrl = tab.image.url;
          } 
          // Check if image has asset._ref (standard Sanity structure)
          else if (tab.image.asset?._ref) {
            imageUrl = urlForImage(tab.image);
          }
          // Extract image ID (similar to imageLoader)
          else {
            const imageID = tab.image._id
              ? tab.image._id
              : tab.image.asset
                ? tab.image.asset._id
                : tab.image._id || tab.image.asset?._id || tab.image;
            
            imageUrl = urlForImage(imageID);
          }
        }
        
        const video = tab.genericVideo && hasValidVideo(tab.genericVideo) ? tab.genericVideo : null;
        
        return {
          key: tabKey,
          title: tab.tabSubHeading || tab.tabHeading || `Tab ${index + 1}`,
          category: tab.tabHeading || undefined,
          heading: tab.tabSubHeading || tab.tabHeading || '',
          description: tab.description || [],
          features: tab.listItems?.map((item: any) => item.subfeatureHeading).filter(Boolean) || [],
          ctaText: tab.LinkText || undefined,
          ctaLink: tab.Link?.url || tab.Link || undefined,
          ctaListItems: tab.ctaListItems || undefined,
          video: video,
          thumbnail: imageUrl,
          image: tab.image,
        };
      });
    }
    
    return [];
  }, [data, manualTabs]);

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
      // Calculate sticky header height dynamically
      const stickyTabsHeight = stickyTabsRef.current?.offsetHeight || 0;
      
      // Mobile: top-[80px] + tabs height, Desktop: top-[30px] + tabs height
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      const stickyTopOffset = isMobile ? 80 : 30;
      const headerHeight = stickyTopOffset + stickyTabsHeight + 20; // 20px extra spacing
      
      const elementPosition = section.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
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

      // Small delay to ensure layout has settled, especially on mobile
      setTimeout(() => {
        requestAnimationFrame(() => {
          scrollToSection(tabKey);
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
          }, 1500);
        });
      }, 50);
    },
    [scrollToSection]
  );

  // Intersection Observer to detect active section
  useEffect(() => {
    if (isScrolling) return;

    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -50% 0px',
      threshold: [0.1, 0.3, 0.6, 0.7],
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

  const currentTabData = (tabs.find(tab => tab.key === activeTab) || tabs[0]) as TabItem;
  
  // Get uploaded MP4 video from data.overviewVideo
  const getUploadedVideo = () => {
    if (!data?.overviewVideo || !Array.isArray(data.overviewVideo) || data.overviewVideo.length === 0) {
      return null;
    }
    
    const firstVideo = data.overviewVideo[0];
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
  
  // Portable text components for description
  const portableTextComponents = {
    block: {
      normal: ({ children }: any) => <p className="text-gray-500 md:text-lg text-base font-geist font-normal leading-[155.55%] tracking-normal">{children}</p>,
    },
    marks: {
      strong: ({ children }: any) => <strong>{children}</strong>,
      em: ({ children }: any) => <em>{children}</em>,
      link: ({ value, children }: any) => {
        const target = value?.blank ? '_blank' : undefined;
        const rel = value?.blank ? 'noopener noreferrer' : undefined;
        return (
          <a href={value?.href} target={target} rel={rel} className="text-vs-purple underline hover:opacity-80">
            {children}
          </a>
        );
      },
    },
  };

  console.log(data);
  return (
    <Section className={cn("w-full flex flex-col !bg-white", containerClassName)}>
      <Container className='w-full py-sm md:py-md lg:py-lg' type="V2" border="y-0">
      <div className="flex-col relative w-full flex gap-16">
          <SectionHeaderV2
            heading={data?.sectionHeadingDynamic}
            description={data?.description || data?.subDescription}
            className='xl:px-12 md:px-6 px-4'
          />
        </div>
        
        {uploadedVideoUrl && (
          <div className="w-full   mb-8 overflow-hidden bg-gray-100 h-[300px] md:h-[600px]">
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

      <div 
        ref={stickyTabsRef}
        data-sticky-tabs
        className="sticky top-[60px] md:top-[30px] z-[10] w-full bg-transparent overflow-visible justify-center items-center mx-auto px-4 md:px-0"
      >
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
          shadow={false}
          isSkip={true}
        />
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:px-12 px-4 ">
          {/* Left: Scrollable Content Sections */}
          <div className="w-full">
            {tabs?.map((tab,i) => (
              <section
                key={tab.key}
                className={`md:min-h-screen min-h-auto md:pt-[160px] py-8`}
              >
                <div
                  ref={(el) => {
                    sectionRefs.current[tab.key] = el;
                  }}
                  data-tab-key={tab.key}
                  className='md:h-[50vh] h-full flex flex-col lg:flex-row'
                >
                  <div className="flex flex-col justify-center">
                    {tab.category && (
                      <div className="text-vs-purple text-base font-geist font-normal leading-6 tracking-normal">
                        {tab.category}
                      </div>
                    )}
                    <h2 className="my-3 text-gray-900 md:text-4xl  text-2xl font-manrope font-semibold leading-10 tracking-normal">
                      {tab.heading}
                    </h2>
                    {tab.description && Array.isArray(tab.description) && tab.description.length > 0 ? (
                      <div className="text-gray-500 md:text-lg text-base font-geist font-normal leading-[155.55%] tracking-normal">
                        <PortableText value={tab.description} components={portableTextComponents} />
                      </div>
                    ) : null}
                    
                    {tab.features && tab.features.length > 0 && (
                      <div className="flex flex-col gap-0 md:mt-6 mt-3">
                        {tab.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex gap-2 items-start px-0 py-1.5"
                          >
                            <div className="flex items-center px-0 py-1 shrink-0">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 16 16" 
                                fill="none"
                                className="shrink-0"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  clipRule="evenodd" 
                                  d="M13.363 3.32248C13.4259 3.37018 13.4787 3.4298 13.5184 3.49794C13.5582 3.56607 13.5841 3.64138 13.5948 3.71955C13.6054 3.79772 13.6005 3.87722 13.5804 3.9535C13.5602 4.02977 13.5252 4.10133 13.4774 4.16408L7.07743 12.5641C7.02552 12.6321 6.95965 12.6883 6.88424 12.7288C6.80884 12.7692 6.72565 12.7931 6.64025 12.7988C6.55486 12.8045 6.46923 12.7918 6.38913 12.7617C6.30903 12.7316 6.2363 12.6846 6.17583 12.6241L2.57583 9.02408C2.46984 8.91034 2.41215 8.7599 2.41489 8.60446C2.41763 8.44902 2.4806 8.30071 2.59053 8.19078C2.70046 8.08085 2.84877 8.01788 3.00421 8.01513C3.15965 8.01239 3.31009 8.07009 3.42383 8.17608L6.53903 11.2905L12.523 3.43688C12.6193 3.31044 12.7619 3.22738 12.9194 3.20593C13.0769 3.18448 13.2364 3.2264 13.363 3.32248Z" 
                                  fill="#030712"
                                />
                              </svg>
                            </div>
                            <div className="flex flex-1 flex-col font-geist font-normal justify-center leading-6 text-gray-700 text-base tracking-normal">
                              <p className="leading-6 whitespace-pre-wrap">{feature}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {tab.ctaListItems && tab.ctaListItems.length > 0 ? (
                      <div className="flex flex-col md:flex-row justify-start gap-4 md:mt-12 mt-6">
                        {tab.ctaListItems.map((btn: any, key: number) => (
                          <Button 
                            key={`${btn.ctaText}-${key}`} 
                            type={btn?.ctaType || 'primary'} 
                            link={btn.ctaLink || '/demo'}
                          >
                            <span className="text-sm font-medium">{btn.ctaText}</span>
                          </Button>
                        ))}
                      </div>
                    ) : tab.ctaText ? (
                      <div className="flex justify-start md:mt-12 mt-6">
                        <Button type="primary" link={tab.ctaLink || '/demo'}>
                          <span className="text-sm font-medium">{tab.ctaText}</span>
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  
                  {/* Mobile: Image/Video below each content section */}
                  <div className="lg:hidden w-full mt-8">
                    <div className="w-full h-full md:h-[400px] rounded-2xl overflow-hidden bg-gray-100">
                      {tab.video ? (
                        <div className="w-full h-full">
                          <VideoPlayers
                            video={tab.video}
                            thumbnail={tab.thumbnail}
                          />
                        </div>
                      ) : tab.thumbnail ? (
                        <div className="w-full h-full relative">
                          <img 
                            src={tab.thumbnail as string} 
                            alt={tab.heading}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-gray-400">No media available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Right: Sticky Video Player - Changes based on activeTab - Desktop Only */}
          <div 
            className="hidden lg:flex w-full lg:sticky lg:top-[200px] lg:self-start"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          >
            <div className="w-full h-[644px] md:rounded-2xl rounded-none overflow-hidden bg-gray-100">
              {currentTabData.video ? (
                <div className="w-full h-full">
                  <VideoPlayers
                    video={currentTabData.video}
                    thumbnail={currentTabData.thumbnail}
                  />
                </div>
              ) : currentTabData.thumbnail ? (
                <div className="w-full h-full relative">
                  <ImageLoader
                    image={currentTabData.thumbnail as string} 
                    alt={currentTabData.heading}
                    className="w-full h-full object-cover md:rounded-2xl rounded-none"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400">No media available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

