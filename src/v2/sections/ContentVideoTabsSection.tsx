"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PortableText } from '@portabletext/react';
import { cn } from "~/lib/utils";
import VideoPlayers from '~/components/common/VideoPlayer';
import Button from '~/components/common/Button';
import Link from 'next/link';
import Section from '~/components/structure/Section';
import Container from '~/components/structure/Container';
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2';
import SwitchableTabs from '~/components/revamp/components/common/switchableTabs';
import { IdataProps } from '~/components/revamp/components/common/interface/common';
import { urlForImage } from '~/lib/sanity.image';
import ImageLoader from '~/components/common/imageLoader/imageLoader';
import ListingBlock from '~/components/blockEditor/ListingBlock';
import { useStickyTop } from '~/hooks/useStickyTop';
import Image from 'next/image';


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
  subHeading?: string;
  description: any; // Block content array
  content?: any; // Block content array
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
  const previousActiveTabRef = useRef<string>('');
  const [activeTab, setActiveTab] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);
  const [tabActivationCount, setTabActivationCount] = useState<{ [key: string]: number }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stickyTabsRef = useRef<HTMLDivElement | null>(null);
  const stickyTop = useStickyTop({ desktop: 60, tablet: 30 });

  // Helper function to check if video has valid data
  const hasValidVideo = (video: any): boolean => {
    if (!video) return false;
    // Check if video has uploadedVideo with a valid url (uploaded file - Priority 1)
    if (video.uploadedVideo) {
      // Check if uploadedVideo has a url property or is a valid asset reference
      if (video.uploadedVideo.url || video.uploadedVideo.asset?._ref || video.uploadedVideo._id) {
        return true;
      }
    }
    // Check if video has videoUrl (direct video URL - Priority 2)
    if (video.videoUrl) return true;
    // Check if video has videoId and videoPlatform (embedded video - Priority 3)
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

        // Process video data - normalize videoPlatform if it exists
        let video = null;
        if (tab.genericVideo) {
          // Debug: Log the raw genericVideo data
          console.log(`Tab ${index + 1} raw genericVideo:`, tab.genericVideo);

          if (hasValidVideo(tab.genericVideo)) {
            video = { ...tab.genericVideo };
            // Normalize videoPlatform to lowercase and trim whitespace
            if (video.videoPlatform) {
              const normalizedPlatform = video.videoPlatform.toLowerCase().trim();
              // Handle comma-separated values (e.g., "vimeo, vidyard and youtube")
              // Extract the first valid platform
              const validPlatforms = ['youtube', 'vimeo', 'vidyard'];
              const platformParts = normalizedPlatform.split(/[,\s]+and\s+|[,\s]+/);
              const foundPlatform = platformParts.find((p: string) =>
                validPlatforms.includes(p.trim())
              );

              if (foundPlatform) {
                video.videoPlatform = foundPlatform.trim();
              } else if (validPlatforms.includes(normalizedPlatform)) {
                video.videoPlatform = normalizedPlatform;
              } else {
                // If platform doesn't match, set to null to avoid invalid iframe
                console.warn(`Tab ${index + 1} invalid videoPlatform: "${video.videoPlatform}", setting to null`);
                video.videoPlatform = null;
              }
            }
            // Debug: Log processed video data
            console.log(`Tab ${index + 1} processed video data:`, video);
          } else {
            // Debug: Log why video was rejected
            console.warn(`Tab ${index + 1} video rejected - invalid data:`, {
              hasUploadedVideo: !!tab.genericVideo.uploadedVideo,
              uploadedVideoUrl: tab.genericVideo.uploadedVideo?.url,
              uploadedVideoId: tab.genericVideo.uploadedVideo?._id,
              uploadedVideoAssetRef: tab.genericVideo.uploadedVideo?.asset?._ref,
              hasVideoUrl: !!tab.genericVideo.videoUrl,
              hasVideoId: !!tab.genericVideo.videoId,
              hasVideoPlatform: !!tab.genericVideo.videoPlatform,
              videoPlatform: tab.genericVideo.videoPlatform,
              fullGenericVideo: tab.genericVideo,
            });
          }
        }

        const tabData = {
          key: tabKey,
          title: tab.tabSubHeading || tab.tabHeading || `Tab ${index + 1}`,
          category: tab.tabHeading || undefined,
          heading: tab.tabHeading || '',
          subHeading: tab.tabSubHeading || undefined,
          description: tab.description || [],
          content: tab.content || [],
          features: tab.listItems?.map((item: any) => item.subfeatureHeading).filter(Boolean) || [],
          ctaText: tab.LinkText || undefined,
          ctaLink: tab.Link?.url || tab.Link || undefined,
          ctaListItems: tab.ctaListItems || undefined,
          video: video,
          thumbnail: imageUrl,
          image: tab.image,
        };

        return tabData;
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
      previousActiveTabRef.current = firstTab;
      // Initialize activation count for first tab
      setTabActivationCount({ [firstTab]: 1 });
    }
  }, [tabs, activeTab]);

  // Increment activation count when tab becomes active (to restart video)
  useEffect(() => {
    if (activeTab && previousActiveTabRef.current !== activeTab) {
      setTabActivationCount(prev => ({
        ...prev,
        [activeTab]: (prev[activeTab] || 0) + 1
      }));
      previousActiveTabRef.current = activeTab;
    }
  }, [activeTab]);

  // Smooth scroll to section
  const scrollToSection = useCallback((tabKey: string) => {
    const section = sectionRefs.current[tabKey];
    if (section) {
      // Calculate sticky header height dynamically
      const stickyTabsHeight = stickyTabsRef.current?.offsetHeight || 0;

      // Mobile: top-[80px] + tabs height, Desktop: top-[70px] + tabs height
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      const stickyTopOffset = isMobile ? 80 : 70;
      const headerHeight = stickyTopOffset + stickyTabsHeight;

      // Get element's position relative to document
      const rect = section.getBoundingClientRect();
      const elementPosition = rect.top + window.scrollY;

      // Calculate viewport dimensions
      const viewportHeight = window.innerHeight;
      const sectionHeight = section.offsetHeight;

      // Calculate available viewport space below sticky header
      const availableSpace = viewportHeight - headerHeight;

      // Mobile: align to top, Desktop: center the section
      const targetTopPosition = isMobile
        ? headerHeight  // Mobile: align to top just below sticky header
        : headerHeight + (availableSpace - sectionHeight) / 2;  // Desktop: center in viewport

      // Calculate scroll position to achieve this
      const scrollPosition = elementPosition - targetTopPosition;

      window.scrollTo({
        top: Math.max(0, scrollPosition),
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
      // rootMargin: '-80px 0px -50% 0px',
      // threshold: [0.1, 0.3, 0.6, 0.7],
      rootMargin: '-80px 0px -30% 0px',
      threshold: [0.3],
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

  // Get overview video from data.overviewVideo - handles all video types
  const getOverviewVideo = () => {
    if (!data?.overviewVideo || !Array.isArray(data.overviewVideo) || data.overviewVideo.length === 0) {
      return null;
    }

    const firstVideo = data.overviewVideo[0];
    if (!firstVideo) return null;

    // Check for uploaded videos array (plural)
    if (firstVideo.uploadedVideos && Array.isArray(firstVideo.uploadedVideos) && firstVideo.uploadedVideos.length > 0) {
      // Find MP4 video
      const mp4Video = firstVideo.uploadedVideos.find(
        (uploadedVideo: any) => uploadedVideo.type === 'mp4' || uploadedVideo.type === 'mov' || uploadedVideo.type === 'webm'
      );
      if (mp4Video?.url) {
        return {
          videoUrl: mp4Video.url,
        };
      }
    }

    // Check for single uploaded video (from Sanity asset)
    if (firstVideo.uploadedVideo) {
      return {
        uploadedVideo: firstVideo.uploadedVideo,
      };
    }

    // Check for direct video URL
    if (firstVideo.videoUrl) {
      return {
        videoUrl: firstVideo.videoUrl,
      };
    }

    // Check for platform-based video (YouTube, Vimeo, Vidyard)
    if (firstVideo.videoId && firstVideo.videoPlatform) {
      let normalizedPlatform = firstVideo.videoPlatform.toLowerCase().trim();
      // Handle comma-separated values
      const validPlatforms = ['youtube', 'vimeo', 'vidyard'];
      const platformParts = normalizedPlatform.split(/[,\s]+and\s+|[,\s]+/);
      const foundPlatform = platformParts.find((p: string) =>
        validPlatforms.includes(p.trim())
      );

      if (foundPlatform && validPlatforms.includes(foundPlatform.trim())) {
        return {
          videoId: firstVideo.videoId,
          videoPlatform: foundPlatform.trim(),
        };
      } else if (validPlatforms.includes(normalizedPlatform)) {
        return {
          videoId: firstVideo.videoId,
          videoPlatform: normalizedPlatform,
        };
      }
    }

    return null;
  };

  const overviewVideo = getOverviewVideo();

  // Debug: Log overview video data
  if (data?.overviewVideo) {
    console.log('Overview Video Data:', {
      raw: data.overviewVideo,
      processed: overviewVideo,
    });
  }

  // Portable text components for description
  const portableTextComponents = {
    block: {
      normal: ({ children }: any) => <p className="text-[#364153] text-base font-geist font-normal leading-6 tracking-normal">{children}</p>,
      h2: ({ children }: any) => <h2 className="text-gray-900 md:text-3xl text-2xl font-manrope font-semibold leading-tight tracking-normal mt-6 mb-4">{children}</h2>,
      h3: ({ children }: any) => <h3 className="text-gray-900 md:text-2xl text-xl font-manrope font-semibold leading-tight tracking-normal mt-5 mb-3">{children}</h3>,
      h4: ({ children }: any) => <h4 className="text-gray-900 md:text-xl text-lg font-manrope font-semibold leading-tight tracking-normal mt-4 mb-2">{children}</h4>,
      h5: ({ children }: any) => <h5 className="text-gray-900 md:text-lg text-base font-manrope font-semibold leading-tight tracking-normal mt-3 mb-2">{children}</h5>,
      h6: ({ children }: any) => <h6 className="text-gray-900 md:text-base text-sm font-manrope font-semibold leading-tight tracking-normal mt-2 mb-2">{children}</h6>,
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-vs-purple pl-4 my-4 italic text-gray-600">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="flex flex-col gap-0 my-4">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="flex flex-col gap-0 my-4">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => (
        <div className="flex gap-2 items-start px-0 py-1.5">
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
                fill="#99A1AF"
              />
            </svg>
          </div>
          <div className="flex flex-1 flex-col font-geist font-normal justify-center text-[#364153] text-base leading-6 tracking-normal">
            <p className="leading-6 whitespace-pre-wrap">{children}</p>
          </div>
        </div>
      ),
      number: ({ children }: any) => (
        <div className="flex gap-2 items-start px-0 py-1.5">
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
                fill="#99A1AF"
              />
            </svg>
          </div>
          <div className="flex flex-1 flex-col font-geist font-normal justify-center text-[#364153] text-base leading-6 tracking-normal">
            <p className="leading-6 whitespace-pre-wrap">{children}</p>
          </div>
        </div>
      ),
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }: any) => <em className="italic">{children}</em>,
      underline: ({ children }: any) => <span className="underline">{children}</span>,
      highlight: ({ children }: any) => (
        <span className="bg-yellow-200 font-semibold">{children}</span>
      ),
      link: ({ value, children }: any) => {
        const target = value?.blank ? '_blank' : undefined;
        const rel = value?.blank ? 'noopener noreferrer' : undefined;
        return (
          <Link href={value?.href || '#'} target={target} rel={rel} className="text-vs-purple underline hover:opacity-80">
            {children}
          </Link>
        );
      },
    },
    types: {
      listingBlock: ({ value }: any) => {
        if (!value) return null;
        return (
          <ListingBlock
            itemHeading={value.itemHeading}
            listingItem={value.listingItem}
          />
        );
      },
    },
  };

  // Portable text components for content - uses h4 styling for normal text
  const contentTextComponents = {
    ...portableTextComponents,
    block: {
      ...portableTextComponents.block,
      normal: ({ children }: any) => <p className="text-gray-900 md:text-xl text-lg font-manrope font-semibold leading-tight tracking-normal">{children}</p>,
    },
  };

  return (
    <Section className={cn("w-full flex flex-col !bg-white", containerClassName)}>
      <Container className='w-full py-sm md:py-md lg:py-lg' type="V2" border="y-0">
        <div className="flex-col relative w-full flex gap-8">
          <SectionHeaderV2
            heading={data?.sectionHeadingDynamic}
            description={data?.description || data?.subDescription}
            className='xl:px-12 md:px-6 px-4'
          />
          {overviewVideo && (
            <div className="w-full mb-8 overflow-hidden h-[300px] md:h-[600px]">
              <div className="relative w-full h-full">
                <VideoPlayers
                  video={overviewVideo}
                  thumbnail={data?.overviewVideo?.[0]?.videoThumbnail}
                />
              </div>
            </div>
          )}

          <div
            ref={stickyTabsRef}
            data-sticky-tabs
            // className={`sticky ${stickyTop} z-[10] w-full bg-transparent overflow-visible justify-center items-center mx-auto pl-3 md:px-0`}
            className="sticky top-[48px] md:top-[63px] py-4 md:my-8 z-[10] w-full bg-transparent overflow-visible justify-center items-center mx-auto pl-3 md:px-0"
            style={{
              background: 'linear-gradient(180deg, #FFF 50%, rgba(255, 255, 255, 0.00) 100%)',
            }}

        >
          <SwitchableTabs
            data={tabs.map(tab => ({
              id: tab.key,
              key: tab.key,
              title: tab?.category,
              testimonial: null,
              setActiveTab: handleTabClick,
            })) as IdataProps[]}
            setActiveTab={handleTabClick}
            activeTab={activeTab}
            isSticky={false}
            className="md:py-2 bg-transparent !shadow-none !border-none"
            isShowImage={false}
            shadow={false}
            isSkip={true}
          />
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 lg:px-12 px-4 ">
            {/* Left: Scrollable Content Sections */}
            <div className="w-full lg:max-w-[503px]">
              {tabs?.map((tab, i) => (
                <section
                  key={tab.key}
                  className={`lg:min-h-[80vh] min-h-auto md:pt-[120px] py-4`}
                >
                  <div
                    ref={(el) => {
                      sectionRefs.current[tab.key] = el;
                    }}
                    data-tab-key={tab.key}
                    className='lg:h-[50vh] h-full flex flex-col lg:flex-row'
                  >
                    <div className="flex flex-col justify-center">
                      {tab.subHeading ? (
                        <span className="text-vs-purple text-base font-geist font-normal leading-6 tracking-normal">
                         {tab.heading} 
                        </span>
                      ) : (
                        <span className="text-vs-purple text-base font-geist font-normal leading-6 tracking-normal">
                          {tab.category}
                        </span>
                      )}
                      <h3 className="my-3 text-gray-900 md:text-4xl  text-2xl font-manrope font-semibold leading-[133.33%] tracking-normal">
                      {tab.subHeading}
                      </h3>
                      {tab.description && Array.isArray(tab.description) && tab.description.length > 0 ? (
                        <div className="text-gray-500 md:text-lg text-base font-geist font-normal leading-[155.55%] tracking-normal">
                          <PortableText value={tab.description} components={portableTextComponents} />
                        </div>
                      ) : null}

                      {tab.content && Array.isArray(tab.content) && tab.content.length > 0 ? (
                        (() => {
                          const hasLinks = tab.content.some((block: any) => block.markDefs?.some((def: any) => def._type === 'link'));

                          if (hasLinks) {
                            return (
                              <div className="mt-6 flex flex-wrap gap-4 items-start w-full">
                                {tab.content.map((block: any, idx: number) => {
                                  if (!block.children) return null;
                                  const text = block.children.map((c: any) => c.text).join('').trim();
                                  if (!text) return null;

                                  const linkDef = block.markDefs?.find((def: any) => def._type === 'link');
                                  const href = linkDef?.href;
                                  const isBlank = linkDef?.blank;

                                  const content = (
                                    <div className={`flex items-center gap-2 w-full rounded-[500px] bg-white ${href ? 'cursor-pointer' : ''}`}>
                                      <span className="font-geist font-medium text-base text-gray-950 group-hover:text-vs-purple transition-colors leading-6 whitespace-nowrap">
                                        {text}
                                      </span>
                                      {href && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#6A7282] group-hover:text-vs-purple">
                                          <path d="M4.66675 4.66675H11.3334V11.3334" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                          <path d="M4.66675 11.3334L11.3334 4.66675" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      )}
                                    </div>
                                  );

                                  if (href) {
                                    return (
                                      <Link
                                        key={block._key || idx}
                                        href={href}
                                        target={isBlank ? "_blank" : undefined}
                                        rel={isBlank ? "noopener noreferrer" : undefined}
                                        className="block group"
                                      >
                                        {content}
                                      </Link>
                                    );
                                  }
                                  return <div key={block._key || idx}>{content}</div>;
                                })}
                              </div>
                            )
                          }

                          return (
                            <div className="mt-4">
                              <PortableText value={tab.content} components={contentTextComponents} />
                            </div>
                          )
                        })()
                      ) : tab.features && tab.features.length > 0 ? (
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
                      ) : null}

                      {tab.ctaListItems && tab.ctaListItems.length > 0 ? (
                        <div className="flex flex-col md:flex-row align-start justify-start gap-4 md:mt-12 mt-6">
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
                      ) : (
                        <div className="flex justify-start md:mt-12 mt-6">
                          <Button type="primary" link="/demo">
                            <span className="text-sm font-medium">Book Free Demo</span>
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Mobile: Image/Video below each content section */}
                    <div className="lg:hidden w-full mt-8">
                      <div className="w-full h-full lg:h-[400px] rounded-2xl overflow-hidden relative">
                        {tab.video ? (
                          <div className="w-full h-full">
                            <VideoPlayers
                              key={`mobile-video-${tab.key}`}
                              video={tab.video}
                              thumbnail={tab.thumbnail}
                            />
                          </div>
                        ) : tab.thumbnail ? (
                          <div className="w-full h-full relative">
                            <Image
                              src={tab.thumbnail as string}
                              alt={tab.heading}
                              fill
                              className="object-cover rounded-2xl"
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
              <div className="w-full h-[644px] md:rounded-2xl rounded-none overflow-hidden relative">
                {tabs.map((tab) => (
                  <div
                    key={tab.key}
                    className={cn(
                      "absolute inset-0 w-full h-full",
                      activeTab === tab.key ? "block" : "hidden"
                    )}
                  >
                    {tab.video ? (
                      <div className="w-full h-full">
                        <VideoPlayers
                          key={`video-${tab.key}-${tabActivationCount[tab.key] || 0}`}
                          video={tab.video}
                          thumbnail={tab.thumbnail}
                        />
                      </div>
                    ) : tab.thumbnail ? (
                      <div className="w-full h-full relative">
                        <ImageLoader
                          image={tab.thumbnail as string}
                          alt={tab.heading}
                          className="w-full h-full object-cover md:rounded-2xl rounded-none"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-400">No media available</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </Container>
    </Section>
  );
}

