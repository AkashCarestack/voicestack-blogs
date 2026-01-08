"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from "~/lib/utils";
import Section from '~/components/structure/Section';
import Container from '~/components/structure/Container';
import SectionHeader from '~/components/revamp/components/common/sectionHeader';
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2';
import SwitchableTabs from '~/components/revamp/components/common/switchableTabs';
import { IdataProps } from '~/components/revamp/components/common/interface/common';
import { GridPattern } from '~/components/ui/grid-pattern';
import Image from 'next/image';
import ImageLoader from '~/components/common/imageLoader/imageLoader';
import Button from '~/components/common/Button';
import GroupedCardsGrid from '../components/GroupedCardsGrid';
import SectionDivider from '../components/SectionDivider';
import { tr } from 'date-fns/locale';

interface Feature {
  _id: string;
  basicInfo?: {
    title: string;
    slug?: {
      current: string;
    };
    description?: string;
    icon?: any;
    dynamicSvg?: string;
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
}

interface CategoryFeatureTabsSectionProps {
  features: Feature[] | any; 
  sectionHeading?: any;
  className?: string;
  variant?: 'default' | 'carousel' | 'scrollcarousel' | 'singlecard';
}

export default function CategoryFeatureTabsSection({
  features,
  sectionHeading,
  className,
  variant = 'default',
}: CategoryFeatureTabsSectionProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeCategoryRef = useRef<string>('');

  // Get base path dynamically from current route
  const getBasePath = useCallback(() => {
    const pathname = router.pathname || router.asPath;
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length >= 2) {
      return `/${pathSegments[0]}/${pathSegments[1]}`;
    }
    return '/phone-system/features';
  }, [router.pathname, router.asPath]);

  // Helper function to extract plain text from blockContent/portable text
  const extractTextFromBlocks = (blocks: any): string => {
    if (!blocks) return '';
    if (typeof blocks === 'string') return blocks;
    if (!Array.isArray(blocks)) return '';
    
    return blocks
      .map((block: any) => {
        if (block._type === 'block' && block.children) {
          return block.children
            .map((child: any) => child.text || '')
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ')
      .trim();
  };

  // Process features into categories - handle both Feature[] and tabsListingComponent
  const allCategories = useMemo(() => {
    if (!features) {
      return [];
    }

    // Check if it's a tabsListingComponent structure
    // Handle both direct tabs and tabs from refData
    let tabs: any[] = [];
    if (features._type === 'tabsListingComponent' || features.tabs) {
      tabs = features.tabs || [];
    } else if (features.refData?.tabsListingComponent?.tabs) {
      tabs = features.refData.tabsListingComponent.tabs || [];
    } else if (features.refData?.tabsListingComponent) {
      // If refData.tabsListingComponent exists but no tabs, try to get tabs from it
      tabs = (features.refData.tabsListingComponent as any).tabs || [];
    }

    if (tabs.length > 0) {
      
      return tabs.map((tab: any) => {
        // Extract description text (handle both string and rich text)
        const descriptionText = extractTextFromBlocks(tab.description);
        
        // Transform listItems to features format
        const transformedFeatures: Feature[] = (tab.listItems || []).map((item: any) => {
          const itemDescription = typeof item.subfeatureDescription === 'string' 
            ? item.subfeatureDescription 
            : extractTextFromBlocks(item.subfeatureDescription);
          
          return {
            _id: item._key || `feature-${Math.random()}`,
            language: 'en',
            basicInfo: {
              title: item.subfeatureHeading || '',
              description: itemDescription,
              icon: item.svgCode ? { iconSvgCode: item.svgCode } : null,
              dynamicSvg: item.svgCode || '',
            },
            title: item.subfeatureHeading || '',
            shortDescription: itemDescription,
            heroSubtitle: item.subfeatureSubheading || '',
            mainImage: item.subfeatureImage || null,
            featureCategory: {
              name: tab.tabHeading || '',
              subheading: tab.tabSubHeading || '',
              description: descriptionText,
              mainImage: tab.image || null,
              iconSvgCode: tab.icon || '',
            },
          };
        });

        return {
          name: tab.tabHeading || '',
          subheading: tab.tabSubHeading || '',
          description: descriptionText,
          mainImage: tab.image || null,
          icon: tab.icon || null,
          iconSvgCode: tab.icon || '',
          features: transformedFeatures,
        };
      });
    }

    // Original logic for Feature[] array
    if (!Array.isArray(features)) {
      return [];
    }

    const featuresByCategory = (features as Feature[]).reduce(
      (acc, feature) => {
        if (feature.featureCategory && feature.featureCategory.name) {
          const category = feature.featureCategory;
          if (!acc[category.name]) {
            acc[category.name] = {
              category: category,
              features: [],
            };
          }
          acc[category.name].features.push(feature);
        }
        return acc;
      },
      {} as Record<string, { category: any; features: Feature[] }>,
    );

    const categories = Object.keys(featuresByCategory).map((categoryName) => {
      const categoryData = featuresByCategory[categoryName];
      return {
        name: categoryName,
        subheading: categoryData.category.subheading,
        description: categoryData.category.description || categoryName,
        mainImage: categoryData.category.mainImage,
        icon: categoryData.category.icon,
        iconSvgCode: categoryData.category.iconSvgCode,
        features: categoryData.features,
      };
    });

    // Sort categories by featureOrder if available
    return categories.sort((a, b) => {
      const orderA = (a as any).featureOrder ?? 9999;
      const orderB = (b as any).featureOrder ?? 9999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name);
    });
  }, [features]);

  // Set initial active category
  useEffect(() => {
    if (allCategories.length > 0 && !activeCategory) {
      const firstCategory = allCategories[0].name;
      setActiveCategory(firstCategory);
      activeCategoryRef.current = firstCategory;
    }
  }, [allCategories, activeCategory]);

  // Smooth scroll to section
  const scrollToSection = useCallback((categoryName: string) => {
    const section = sectionRefs.current[categoryName];
    if (section) {
      // Calculate offset for header and tabs
      const headerHeight = 100; // Adjust based on your actual header height
      const tabsHeight = 80; // Approximate tabs height
      const extraSpacing = 20; // Extra spacing
      const totalOffset = headerHeight + tabsHeight + extraSpacing;
      
      // Get element position relative to document
      const elementTop = section.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementTop - totalOffset;

      // Scroll to calculated position
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }
  }, []);


  // Handle category click - override SwitchableTabs default behavior
  const handleCategoryClick = useCallback(
    (categoryName: string) => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      activeCategoryRef.current = categoryName;
      setActiveCategory(categoryName);

      // Scroll for default and scrollcarousel variants
      if (variant === 'default' || variant === 'scrollcarousel') {
        setIsScrolling(true);
        // Use a small delay to ensure DOM is ready
        setTimeout(() => {
          requestAnimationFrame(() => {
            scrollToSection(categoryName);
            scrollTimeoutRef.current = setTimeout(() => {
              setIsScrolling(false);
            }, 1500);
          });
        }, 100);
      }
    },
    [scrollToSection, variant]
  );

  // Intersection Observer to detect active section
  useEffect(() => {
    if (isScrolling) return;

    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -50% 0px', // Account for header and tabs
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
        const categoryName = mostVisibleEntry.target.getAttribute('data-category');
        if (categoryName && categoryName !== activeCategoryRef.current) {
          activeCategoryRef.current = categoryName;
          setActiveCategory(categoryName);
        }
      }
    }, observerOptions);

    const timeoutId = setTimeout(() => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [allCategories, isScrolling]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (allCategories.length === 0) {
    return (
      <Section
        id="features"
        className={cn("py-sm md:py-md lg:py-lg scroll-m-16 bg-gray-50 relative overflow-hidden", className)}
      >
        <div className="md:block hidden absolute top-0 right-0 w-[43rem] h-full z-0">
          <GridPattern
            width={50}
            height={50}
            x={-1}
            y={-1}
            className={cn(
              "[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]"
            )}
          />
        </div>
        <Container className="flex flex-col items-center gap-16 relative z-10">
          <SectionHeaderV2
            heading={
              sectionHeading?.sectionHeadingDynamic
                ? sectionHeading?.sectionHeadingDynamic
                : sectionHeading?.headline
                  ? sectionHeading?.headline
                  : 'Feature-Packed to Improve <br/> Every Front Office Workflow'
            }
            description={
              sectionHeading?.subheadline
                ? sectionHeading?.subheadline
                : 'Empower team members with AI-powered calls, messages, and analytics across devices. Measure, analyze, and optimize team performance through every touch point in your practice.'
            }
          />
        </Container>
      </Section>
    );
  }

  // Single Card Layout - Based on Figma design
  // Render if variant is 'singlecard'
  if (variant === 'singlecard' && allCategories.length > 0) {
    const firstCategory = allCategories[0];
    const pillItems = firstCategory.features || [];
    console.log(firstCategory,'firstCategory');
    

    return (
      <Section
        id="features"
        className={cn("w-full flex flex-col bg-white relative", className)}
      >
        <Container className='w-full py-sm md:py-md lg:py-lg' type="V2" border="y-0">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-px bg-gray-200 w-full">
            {/* Left: Content Section */}
            <div className="bg-white flex flex-col gap-6 items-start justify-center p-12 min-h-[202px]">
              <div className="flex flex-col gap-6 items-start w-full">
                {/* Main Heading */}
                {firstCategory.name && (
                  <div className="flex flex-col font-manrope font-semibold justify-center text-gray-900 text-4xl w-full">
                    <p className="leading-[48px] whitespace-pre-wrap">{firstCategory.name}</p>
                  </div>
                )}
                {/* Description */}
                {firstCategory.description && (
                  <p className="font-geist font-normal leading-6 text-gray-700 text-base whitespace-pre-wrap">
                    {firstCategory.description}
                  </p>
                )}
              </div>

              {/* Pill Items - Single Row, No Gap Grid */}
              {pillItems.length > 0 && (
                <div className="flex flex-wrap gap-3 items-start w-full">
                  {pillItems.map((item: any, index: number) => {
                    return (
                      <div
                        key={item._id || index}
                        className="flex items-center border border-gray-200 px-4 py-2 rounded-[500px] bg-white shadow-sm"
                      >
                        <span className="font-geist font-normal text-sm text-gray-950 leading-6 whitespace-nowrap">
                          {item.basicInfo?.title || item.title || 'Untitled Feature'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Category Image */}
            <div className="bg-gray-50 flex flex-col items-center justify-center  overflow-hidden relative">
              {/* Grid Pattern Background */}
              <div className="absolute inset-0 z-0">
                <GridPattern
                  width={50}
                  height={50}
                  x={-1}
                  y={-1}
                  className={cn(
                    "[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]"
                  )}
                />
              </div>
              {firstCategory?.mainImage && (
                <div className="w-full h-full relative z-10 flex items-center justify-center">
                  <ImageLoader
                    image={firstCategory.mainImage}
                    alt={`${firstCategory.name} feature illustration`}
                    title={`${firstCategory.name || firstCategory?.mainImage?.title || firstCategory?.mainImage?.altText || ''}`}
                    width={666}
                    height={500}
                    fixed={false}
                    className="rounded-lg object-contain w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  // Carousel variant with pill items - Based on Figma design
  if (variant === 'carousel') {
    // Convert features to pill items data
    const getPillItems = (category: typeof allCategories[0]) => {
      // Default SVG icon for all pill items
      const defaultPillIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5.83398 5.8335H14.1673V14.1668" stroke="#030712" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.83398 14.1668L14.1673 5.8335" stroke="#030712" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      
      return category.features.map((feature) => {
        const featureSlug = feature.basicInfo?.slug?.current || feature.slug?.current;
        const href = featureSlug ? `/dental-phones/features/${featureSlug}` : '#';
        
        return {
          heading: feature.basicInfo?.title || feature.title || 'Untitled Feature',
          description: feature.basicInfo?.description || feature.shortDescription || feature.heroSubtitle || '',
          dynamicSvg: defaultPillIcon,
          href,
        };
      });
    };

    return (
      <Section
        id="features"
        className={cn("w-full flex flex-col !bg-white relative scroll-m-16", className)}
      >
        <Container className='w-full py-sm md:py-sm lg:py-sm' type="V2" border="y-0">
          {/* Header Section */}
          <div className="flex-col relative w-full flex gap-8 items-center justify-center mb-16 px-4 md:px-12">
            <div className="flex flex-col gap-3 items-center text-center max-w-[712px]">
              <SectionHeaderV2
                heading={
                  sectionHeading?.sectionHeadingDynamic
                    ? sectionHeading?.sectionHeadingDynamic
                    : sectionHeading?.headline
                      ? sectionHeading?.headline
                      : 'Feature-Packed to Improve <br/> Every Front Office Workflow'
                }
                description={
                  sectionHeading?.subheadline
                    ? sectionHeading?.subheadline
                    : 'Empower team members with AI-powered calls, messages, and analytics across devices. Measure, analyze, and optimize team performance through every touch point in your practice.'
                }
                className='px-0'
              />
            </div>
            <Button type="primary" link="/demo">
              <span className="text-base font-medium">Book Free Demo</span>
            </Button>
          </div>

          {/* Switchable Tabs - Sticky */}
          <div className="sticky top-[60px] md:top-[50px] z-[100] w-full bg-transparent overflow-visible justify-center items-center mx-auto px-4 md:px-12 mb-12">
            <SwitchableTabs
              data={allCategories.map(category => ({
                id: category.name,
                key: category.name,
                title: category.name,
                testimonial: null,
                setActiveTab: handleCategoryClick,
              })) as IdataProps[]}
              setActiveTab={handleCategoryClick}
              activeTab={activeCategory}
              isSticky={true}
              className="md:py-8 py-4 bg-transparent !shadow-none !border-none"
              isShowImage={false}
              shadow={false}
            />
          </div>

          {/* Carousel Content - Two Column Layout with Smooth Animation */}
          <div className="relative w-full">
            {/* Single container box that stays */}
            <div className="grid lg:grid-cols-2 grid-cols-1 w-full border border-x-0 border-gray-200 relative">
              {/* Left Column: Content and Pill Items with Smooth Animation */}
              <div className="bg-white flex flex-col gap-6 items-start justify-start p-12 min-h-[400px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {allCategories.map((category) => {
                    const pillItems = getPillItems(category);
                    const isActive = category.name === activeCategory;
                    
                    if (!isActive) return null;
                    
                    return (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-6 items-start w-full"
                      >
                        <div className="flex flex-col gap-6 items-start w-full">
                          {/* Category Label */}
                          {category.name && (
                            <div className="flex flex-col font-geist font-normal justify-center text-vs-purple text-base w-full">
                              <p className="leading-6 whitespace-pre-wrap">{category.name}</p>
                            </div>
                          )}
                          {/* Main Heading */}
                          {category.subheading && (
                            <div className="flex flex-col font-manrope font-semibold justify-center text-gray-900 text-4xl w-full">
                              <p className="leading-[48px] whitespace-pre-wrap">{category.subheading}</p>
                            </div>
                          )}
                          {/* Description */}
                          {category.description && (
                            <p className="font-geist font-normal leading-6 text-gray-700 text-base whitespace-pre-wrap">
                              {category.description}
                            </p>
                          )}
                        </div>

                        {/* Pill Items Grid */}
                        <div className="flex flex-wrap gap-3 items-start w-full">
                          {pillItems.map((item, index) => (
                            <Link
                              key={`${category.name}-${index}`}
                              href={item.href}
                              className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-[500px] bg-white hover:border-[rgba(255,255,255,0.60)] hover:bg-[#E5E7EB] transition-all duration-200 shadow-sm cursor-pointer"
                            >
                              <span className="font-geist font-normal text-sm text-gray-950 leading-6 whitespace-nowrap">
                                {item.heading}
                              </span>
                              {item.dynamicSvg && (
                                <div
                                  className="flex items-center justify-center w-5 h-5 flex-shrink-0 [&_svg]:w-5 [&_svg]:h-5"
                                  dangerouslySetInnerHTML={{ __html: item.dynamicSvg }}
                                />
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Right Column: Category Image with Fixed Grid Pattern */}
              <div className="bg-gray-50 flex flex-col items-center justify-center h-[400px] lg:h-auto overflow-hidden relative">
                {/* Grid Pattern Background - Fixed, doesn't move */}
                <div className="absolute inset-0 z-0">
                  <GridPattern
                    width={50}
                    height={50}
                    x={-1}
                    y={-1}
                    className={cn(
                      "[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]"
                    )}
                  />
                </div>
                {/* Images - Smooth fade animation */}
                <AnimatePresence mode="wait">
                  {allCategories.map((category) => {
                    const isActive = category.name === activeCategory;
                    
                    if (!isActive || !category?.mainImage) return null;
                    
                    return (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full relative z-10 flex items-end justify-center"
                      >
                        <ImageLoader
                          image={category.mainImage}
                          alt={`${category.name} feature illustration`}
                          title={`${category.name || category?.mainImage?.title || category?.mainImage?.altText || ''}`}
                          fixed={true}
                          className="rounded-lg object-contain w-full h-full"
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section
      id="features"
      border='b'
      className={cn("w-full flex flex-col !bg-white relative scroll-m-16", className)}
    >
      <Container className='w-full py-sm md:py-sm lg:py-lg ' type="V2" border="y-0">
        <div className="flex-col relative w-full flex gap-16 mb-[60px]">
          <SectionHeaderV2
            heading={
              sectionHeading?.sectionHeadingDynamic
                ? sectionHeading?.sectionHeadingDynamic
                : sectionHeading?.headline
                  ? sectionHeading?.headline
                  : 'Feature-Packed to Improve <br/> Every Front Office Workflow'
            }
            description={
              sectionHeading?.subheadline
                ? sectionHeading?.subheadline
                : 'Empower team members with AI-powered calls, messages, and analytics across devices. Measure, analyze, and optimize team performance through every touch point in your practice.'
            }
            className='xl:px-12 md:px-6 px-4'
          />
        </div>

        {/* Switchable Tabs - Sticky */}
        <div className="sticky top-[60px] md:top-[50px] z-[100] w-full bg-transparent overflow-visible justify-center items-center mx-auto px-4 md:px-0">
          <SwitchableTabs
            data={allCategories.map(category => ({
              id: category.name,
              key: category.name,
              title: category.name,
              testimonial: null,
              setActiveTab: handleCategoryClick,
            })) as IdataProps[]}
            setActiveTab={handleCategoryClick}
            activeTab={activeCategory}
            isSticky={true}
            className="md:py-8 py-4 bg-transparent !shadow-none !border-none"
            isShowImage={false}
            shadow={false}
            isSkip={true}
          />
        </div>

        {/* Category Sections with line dividers */}
        <div className="flex flex-col w-full">
          {allCategories.map((category, index) => {
            return (
              <React.Fragment key={category.name}>
                {index > 0 && <div className="border-b border-gray-200"><SectionDivider height="130px" /></div>}
                <article
                  ref={(el) => {
                    sectionRefs.current[category.name] = el;
                  }}
                  data-category={category.name}
                  id={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-white overflow-hidden scroll-mt-[200px]"
                  style={{ scrollMarginTop: '200px' }}
                >
                <div className="w-full">
                  {/* Hero Section - Based on Figma Design */}
                  <div className={cn("grid lg:grid-cols-2 grid-cols-1 gap-px bg-gray-200 w-full", index === 0 && "border-t")} style={index === 0 ? { borderTopColor: 'var(--color-gray-200, #E5E7EB)' } : {}}>
                    {/* Left: Content Section */}
                    <div className="bg-white flex flex-col gap-16 items-start justify-center md:p-12 p-4 h-full">
                      <div className="flex flex-col gap-8 items-start w-full">
                        <div className="flex flex-col gap-1.5 items-start tracking-normal w-full">
                          <div className="flex flex-col gap-1.5 items-start leading-0 w-full">
                            {/* Category Label */}
                            {category.name && (
                              <div className="flex flex-col font-geist font-normal justify-center text-vs-purple text-base w-full">
                                <p className="leading-6 whitespace-pre-wrap">{category.name}</p>
                              </div>
                            )}
                            {/* Main Heading */}
                            <div className="flex flex-col font-manrope font-semibold justify-center text-gray-900 text-4xl w-full">
                              <p className="leading-[48px] whitespace-pre-wrap">{category.subheading}</p>
                            </div>
                          </div>
                          {/* Description */}
                          <p className="font-geist font-normal leading-6 relative text-gray-700 text-base w-full whitespace-pre-wrap">
                            {category.description}
                          </p>
                        </div>
                        {/* CTA Button */}
                        <div className="flex items-start">
                          <Button type="primary" link="/demo">
                            <span className="text-base font-medium">Book Free Demo</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Category Image */}
                    <div className="bg-gray-50 flex flex-col items-center justify-end  px-4 md:px-px py-4 md:py-0 overflow-hidden relative">
                      {/* Grid Pattern Background */}
                      <div className="absolute inset-0 z-0">
                        <GridPattern
                          width={50}
                          height={50}
                          x={-1}
                          y={-1}
                          className={cn(
                            "[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]"
                          )}
                        />
                      </div>
                      {category?.mainImage && (
                        <div className="w-full h-full relative z-10 flex items-end justify-center">
                          <figure className="relative w-full flex items-end justify-center h-auto">
                            <ImageLoader
                              image={category.mainImage}
                              alt={`${category.name} feature illustration`}
                              title={`${category.name || category?.mainImage?.title || category?.mainImage?.altText || ''}`}
                              width={400}
                              height={400}
                              fixed={false}
                              className="rounded-lg object-contain w-full h-full"
                            />
                          </figure>
                        </div>
                      )}
                  </div>
                  </div>
                  
                  {/* GroupedCardsGrid Component */}
                  {category.features && category.features.length > 0 && variant !== 'scrollcarousel' && (
                    <div className="w-full">
                      <GroupedCardsGrid
                        customListingItems={category.features.map((feature) => {
                          // Get SVG code from feature - check multiple possible locations
                          const iconSvg = 
                            feature.basicInfo?.dynamicSvg ||
                            (feature.basicInfo?.icon as any)?.iconSvgCode || 
                            (feature.basicInfo?.icon as any)?.icon ||
                            feature.featureCategory?.iconSvgCode || 
                            category.iconSvgCode ||
                            // Default SVG if none provided
                            '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 8V16L21.3333 18.6667" stroke="#6A7282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.3334 16.0002C29.3334 13.4199 28.5847 10.8951 27.1781 8.73199C25.7716 6.56885 23.7676 4.86028 21.4093 3.81351C19.0509 2.76674 16.4395 2.42674 13.8917 2.83475C11.3439 3.24276 8.96929 4.38124 7.05575 6.11212C5.14221 7.84301 3.772 10.0919 3.11129 12.5861C2.45058 15.0803 2.52777 17.7127 3.33348 20.1639C4.1392 22.6151 5.63883 24.7798 7.6505 26.3956C9.66217 28.0114 12.0995 29.0088 14.6667 29.2668" stroke="#6A7282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.3334 21.3335L22.0001 28.6668L18.6667 25.3335" stroke="#030712" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                          
                          // Get slug from basicInfo or direct slug
                          const featureSlug = feature.basicInfo?.slug?.current || feature.slug?.current;
                          const basePath = getBasePath();
                          
                          return {
                            heading: feature.basicInfo?.title || feature.title || 'Untitled Feature',
                            description: feature.basicInfo?.description || feature.shortDescription || feature.heroSubtitle || '',
                            dynamicSvg: iconSvg,
                            image: feature.mainImage || null,
                            link: featureSlug ? {
                              buttonType: "text",
                              text: null,
                              url: `${basePath}/${featureSlug}`
                            } : {
                              buttonType: "text",
                              text: null,
                              url: null
                            }
                          };
                        })}
                        theme="light"
                        simpleListingData={true}
                        columnCount={3}
                        showBorderBottom={true}
                      />
                    </div>
                  )}
                </div>
              </article>
              </React.Fragment>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

