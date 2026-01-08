"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from "~/lib/utils";
import { urlForImage } from '~/lib/sanity.image';
import Section from '~/components/structure/Section';
import Container from '~/components/structure/Container';
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2';
import SwitchableTabs from '~/components/revamp/components/common/switchableTabs';
import { IdataProps } from '~/components/revamp/components/common/interface/common';
import GroupedCardsGrid from '~/v2/components/GroupedCardsGrid';
import SectionDivider from '~/v2/components/SectionDivider';

interface IntegrationCategory {
  _id: string;
  name: string;
  subheading?: string;
  description?: string;
  mainImage?: any;
  icon?: any;
  iconSvgCode?: string;
  language: string;
}

interface IntegrationList {
  _id: string;
  title: string;
  headline: string;
  description?: any;
  shortDescription?: string;
  image?: any;
  colorImage?: any;
  link?: string;
  integrationCategory?: {
    _id: string;
    name: string;
    subheading?: string;
    description?: string;
    mainImage?: any;
    icon?: any;
    iconSvgCode?: string;
  };
  language: string;
  order?: number;
}

interface IntegrationsSectionWithNavigationProps {
  categories: IntegrationCategory[];
  integrations: IntegrationList[];
  sectionHeading?: {
    headline?: string;
    subheadline?: string;
    sectionHeadingDynamic?: string;
  };
  className?: string;
}

interface CategorySectionProps {
  title: string;
  description: string;
  integrations: any[];
  integrationCount: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  description,
  integrations,
  integrationCount,
}) => {
  return (
    <div className=" flex flex-col gap-px items-start px-0 py-px relative shrink-0 w-full">
      {/* Header */}
      <div className="bg-white flex items-end justify-between px-12 py-16 relative shrink-0 tracking-normal w-full first:border-t border-gray-200 border-solid">
        <div className="flex flex-col gap-3 items-start relative shrink-0 w-full max-w-[921px]">
          <div className="flex flex-col font-manrope font-semibold justify-center leading-0 relative shrink-0 text-gray-950 text-4xl w-full">
            <p className="leading-[40px] whitespace-pre-wrap">{title}</p>
          </div>
          <p className="font-geist font-normal leading-6 relative shrink-0 text-[#6a7282] text-base w-full whitespace-pre-wrap">
            {description}
          </p>
        </div>
        <p className="font-geist font-normal leading-6 relative shrink-0 text-[#99a1af] text-base text-right">
          {integrationCount}
        </p>
      </div>
      
      {/* Integration Cards Grid using GroupedCardsGrid */}
      {integrations && integrations.length > 0 && (
        <div className="w-full integration-icon-wrapper">
          <style jsx>{`
            .integration-icon-wrapper :global(.overflow-clip) {
              width: 50px !important;
              height: 50px !important;
              border-radius: 8px !important;
              background-color: #F3F4F6 !important;
              border: 1px solid #F3F4F6 !important;
            }
            .integration-icon-wrapper :global(.overflow-clip svg) {
              width: 100% !important;
              height: 100% !important;
            }
          `}</style>
          <GroupedCardsGrid
            customListingItems={integrations}
            theme="light"
            simpleListingData={true}
            columnCount={3}
            showBorderBottom={false}
          />
        </div>
      )}
    </div>
  );
};

export default function IntegrationsSectionWithNavigation({
  categories,
  integrations,
  sectionHeading,
  className,
}: IntegrationsSectionWithNavigationProps) {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeCategoryRef = useRef<string>('');

  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      const firstCategoryId = categories[0]._id;
      setActiveCategory(firstCategoryId);
      activeCategoryRef.current = firstCategoryId;
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const groupedIntegrations = useMemo(() => {
    const grouped = integrations.reduce((acc, integration) => {
      if (integration.integrationCategory) {
        const categoryId = integration.integrationCategory._id;
        if (!acc[categoryId]) {
          acc[categoryId] = [];
        }
        acc[categoryId].push(integration);
      }
      return acc;
    }, {} as Record<string, IntegrationList[]>);

    Object.keys(grouped).forEach((categoryId) => {
      grouped[categoryId].sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });
    });

    return grouped;
  }, [integrations]);

  const categorySections = useMemo(() => {
    return (categories || []).map((category) => {
      const categoryIntegrations = groupedIntegrations[category._id] || [];
      
      return {
        id: category._id,
        title: category.name,
        description: category.description || category.subheading || '',
        integrationCount: `${categoryIntegrations.length} Integration${categoryIntegrations.length !== 1 ? 's' : ''}`,
        integrations: categoryIntegrations.map((integration) => {
          let iconUrl = null;
          try {
            if (integration.colorImage) {
              iconUrl = integration.colorImage.url || integration.colorImage.asset?.url || urlForImage(integration.colorImage, { width: 50, height: 50 });
            } else if (integration.image) {
              iconUrl = integration.image.url || integration.image.asset?.url || urlForImage(integration.image, { width: 50, height: 50 });
            }
          } catch (error) {
            // Keep iconUrl as null
          }
          
          const iconSvg = iconUrl ? `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="50" height="50" rx="8" fill="#F3F4F6"/><image href="${iconUrl}" x="0" y="0" width="50" height="50" preserveAspectRatio="xMidYMid meet"/></svg>` : null;
          
          return {
            heading: integration.title,
            description: integration.shortDescription || integration.headline || '',
            image: null,
            dynamicSvg: iconSvg,
            link: integration.link ? {
              buttonType: "text",
              text: null,
              url: integration.link
            } : null
          };
        })
      };
    });
  }, [categories, groupedIntegrations]);

  const scrollToSection = useCallback((categoryId: string) => {
    const section = sectionRefs.current[categoryId];
    if (section) {
      const headerHeight = 100;
      const tabsHeight = 80;
      const extraSpacing = 20;
      const totalOffset = headerHeight + tabsHeight + extraSpacing;
      
      const elementTop = section.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementTop - totalOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }
  }, []);

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      activeCategoryRef.current = categoryId;
      setActiveCategory(categoryId);

      setIsScrolling(true);
      setTimeout(() => {
        requestAnimationFrame(() => {
          scrollToSection(categoryId);
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
          }, 1500);
        });
      }, 100);
    },
    [scrollToSection]
  );

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
        const categoryId = mostVisibleEntry.target.getAttribute('data-category');
        if (categoryId && categoryId !== activeCategoryRef.current) {
          activeCategoryRef.current = categoryId;
          setActiveCategory(categoryId);
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
  }, [categorySections, isScrolling]);

  const switchableTabsData = useMemo(() => {
    return (categories || []).map((category) => ({
      id: category._id,
      key: category._id,
      title: category.name,
      testimonial: null,
      setActiveTab: handleCategoryClick,
    })) as IdataProps[];
  }, [categories, handleCategoryClick]);

  if (!categories || categories.length === 0) {
    return (
      <Section className={cn("py-sm md:py-md lg:py-lg bg-white", className)}>
        <Container className="flex flex-col items-center gap-16">
          <div className="text-center">
            <p className="text-gray-600 font-geist">No integration categories found.</p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section
      id="integrations"
      border="b"
      className={cn("w-full flex flex-col bg-white relative scroll-m-16", className)}
    >
      <Container className="w-full py-sm md:py-sm lg:py-sm" type="V2" border="y-0">
        {/* Header Section */}
        <div className="flex-col relative w-full flex gap-16 mb-[-64px] px-12 py-16 shrink-0 z-[3]">
          <div className="flex flex-col gap-3 items-start text-center relative shrink-0 max-w-[712px] mx-auto">
            <SectionHeaderV2
              heading={
                sectionHeading?.sectionHeadingDynamic
                  ? sectionHeading?.sectionHeadingDynamic
                  : sectionHeading?.headline
                    ? sectionHeading?.headline
                    : 'VoiceStack Works with All Leading PMS, CRM And Analytics Systems'
              }
              description={
                sectionHeading?.subheadline
                  ? sectionHeading?.subheadline
                  : 'VoiceStack is a modern AI powered phone system that supports integrations with all major software systems that growing dental practices require. Our integration landscape is always growing as we add new partners almost on a monthly basis.'
              }
              className="px-0"
            />
          </div>
        </div>

        {/* Switchable Tabs - Sticky */}
        <div className="sticky top-[60px] md:top-[50px] z-[10] w-full bg-transparent overflow-visible justify-center items-center mx-auto px-12 mb-[-64px] pb-[130px] pt-[72px] shrink-0">
          <SwitchableTabs
            data={switchableTabsData}
            setActiveTab={handleCategoryClick}
            activeTab={activeCategory}
            isSticky={true}
            className="bg-transparent !shadow-none !border-none"
            isShowImage={false}
            shadow={false}
            fullWidth={true}
          />
        </div>

        {/* Category Sections with SectionDivider */}
        <div className="flex flex-col w-full mb-[-64px] relative shrink-0 z-[1]">
          {categorySections.map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 && (
                <div className=" ">
                  <SectionDivider className='border-gray-200 border-t' height="130px" />
                </div>
              )}
              <article
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                data-category={section.id}
                id={`category-${section.id.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white overflow-hidden scroll-mt-[200px]"
                style={{ scrollMarginTop: '200px' }}
              >
                <CategorySection {...section} />
              </article>
            </React.Fragment>
          ))}
        </div>
      </Container>
    </Section>
  );
}

