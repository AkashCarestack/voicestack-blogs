"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from "~/lib/utils";
import Section from '~/components/structure/Section';
import Container from '~/components/structure/Container';
import SectionHeader from '~/components/revamp/components/common/sectionHeader';
import SwitchableTabs from '~/components/revamp/components/common/switchableTabs';
import { IdataProps } from '~/components/revamp/components/common/interface/common';
import { GridPattern } from '~/components/ui/grid-pattern';
import Image from 'next/image';
import ImageLoader from '~/components/common/imageLoader/imageLoader';
import Button from '~/components/common/Button';

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
}

interface CategoryFeatureTabsSectionProps {
  features: Feature[];
  sectionHeading?: any;
  className?: string;
}

export default function CategoryFeatureTabsSection({
  features,
  sectionHeading,
  className,
}: CategoryFeatureTabsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeCategoryRef = useRef<string>('');

  // Process features into categories
  const allCategories = useMemo(() => {
    if (!features || !Array.isArray(features)) {
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

      setIsScrolling(true);
      activeCategoryRef.current = categoryName;
      setActiveCategory(categoryName);

      // Use a small delay to ensure DOM is ready
      setTimeout(() => {
        requestAnimationFrame(() => {
          scrollToSection(categoryName);
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
          }, 1500);
        });
      }, 100);
    },
    [scrollToSection]
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
          <SectionHeader
            heading={
              sectionHeading?.headline
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

  return (
    <Section
      id="features"
      className={cn("py-sm md:py-md lg:py-lg scroll-m-16 bg-gray-50 relative", className)}
    >
      {/* Grid Pattern Background */}
      <div className="md:block hidden absolute top-0 right-0 w-[43rem] h-full z-0 overflow-hidden">
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
        <SectionHeader
          heading={
            sectionHeading?.headline
              ? sectionHeading?.headline
              : 'Feature-Packed to Improve <br/> Every Front Office Workflow'
          }
          description={
            sectionHeading?.subheadline
              ? sectionHeading?.subheadline
              : 'Empower team members with AI-powered calls, messages, and analytics across devices. Measure, analyze, and optimize team performance through every touch point in your practice.'
          }
        />

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
          />
        </div>

        {/* Category Sections with 130px gap */}
        <div className="flex flex-col w-full gap-[130px]">
          {allCategories.map((category, index) => {
            return (
              <article
                key={category.name}
                ref={(el) => {
                  sectionRefs.current[category.name] = el;
                }}
                data-category={category.name}
                id={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-3xl overflow-hidden scroll-mt-[200px]"
                style={{ scrollMarginTop: '200px' }}
              >
                <div className="p-3 space-y-8">
                  {/* Header Section - Title and Description with Image */}
                  <header
                    className="relative flex flex-col justify-end items-start gap-2 flex-1 self-stretch"
                    style={{
                      borderRadius: '12px',
                      background:
                        'linear-gradient(277deg, rgba(202, 197, 255, 0.20) 0%, rgba(202, 197, 255, 0.50) 49.61%, rgba(202, 197, 255, 0.10) 100.18%)',
                    }}
                  >
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="w-full flex flex-col justify-end items-start gap-2 flex-1 self-stretch lg:w-1/2 px-8 p-12">
                        <h3
                          className="text-2xl font-bold text-gray-900 tracking-normal font-manrope leading-8"
                          style={{
                            color: 'var(--Default-gray-900, #111827)',
                          }}
                        >
                          {category.name}
                        </h3>
                        <p
                          className="text-base font-normal text-gray-700 mt-2 md:mt-0 font-geist leading-6 tracking-normal"
                          style={{
                            color: 'var(--color-gray-700, #364153)',
                            textWrap: 'balance',
                          }}
                        >
                          {category.description}
                        </p>
                      </div>

                      <div className="w-full inline-flex lg:w-1/2">
                        {category?.mainImage && (
                          <figure className="relative">
                            <Image
                              src={category?.mainImage?.asset?.url}
                              alt={`${category.name} feature illustration`}
                              title={`${category.name || category?.mainImage?.asset?.title}`}
                              width={800}
                              height={400}
                              className="rounded-lg object-cover w-full h-full"
                            />
                          </figure>
                        )}
                      </div>
                    </div>
                  </header>

                  {/* Features List Section */}
                  {/* <section
                    className="flex flex-col justify-end items-start self-stretch !mt-0 pt-6 px-6 pb-2.5"
                    aria-label={`${category.name} features`}
                  >
                    <h3 className="sr-only">
                      Features included in {category.name}
                    </h3>
                    <ul
                      className="grid grid-cols-1 md:grid-cols-2 gap-x-8 w-full"
                      role="list"
                    >
                      {category.features.map((feature, featureIndex) => {
                        const featuresLength = category.features.length;
                        const isOdd = featuresLength % 2 !== 0;
                        const isLastItem = featureIndex === featuresLength - 1;
                        const isSecondLastItem = featureIndex === featuresLength - 2;
                        const shouldShowBorder = isOdd
                          ? !isLastItem
                          : !isLastItem && !isSecondLastItem;
                        return (
                          <li
                            key={feature._id}
                            className={`flex gap-2 py-[14px] ${shouldShowBorder ? 'border-b border-gray-200' : ''}`}
                            role="listitem"
                          >
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              aria-hidden="true"
                            >
                              <svg
                                width="16"
                                height="25"
                                viewBox="0 0 16 25"
                                fill="black"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M13.3633 7.52243C13.4261 7.57013 13.4789 7.62975 13.5187 7.69789C13.5584 7.76602 13.5844 7.84133 13.595 7.9195C13.6056 7.99767 13.6007 8.07717 13.5806 8.15345C13.5605 8.22973 13.5255 8.30128 13.4777 8.36403L7.07767 16.764C7.02576 16.8321 6.95989 16.8882 6.88449 16.9287C6.80908 16.9692 6.72589 16.9931 6.6405 16.9988C6.5551 17.0044 6.46948 16.9918 6.38937 16.9617C6.30927 16.9315 6.23654 16.8846 6.17607 16.824L2.57607 13.224C2.47009 13.1103 2.41239 12.9598 2.41513 12.8044C2.41788 12.649 2.48084 12.5007 2.59078 12.3907C2.70071 12.2808 2.84901 12.2178 3.00445 12.2151C3.1599 12.2123 3.31033 12.27 3.42407 12.376L6.53927 15.4904L12.5233 7.63683C12.6196 7.51039 12.7621 7.42733 12.9196 7.40588C13.0771 7.38443 13.2367 7.42635 13.3633 7.52243Z"
                                  fill="#030712"
                                />
                              </svg>
                            </div>
                            <span className="text-gray-950 font-geist text-base font-normal leading-6 tracking-normal transition-colors">
                              {feature.basicInfo?.title || feature.title}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </section> */}

                  
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

