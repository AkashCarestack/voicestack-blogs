"use client";
import React, { useMemo } from 'react';
import Section from '~/components/structure/Section';
import Container from '~/components/structure/Container';
import SectionH2 from '~/components/typography/revamp/SectionH2';
import Button from '~/components/common/Button';
import AutoExpandTabs from './common/autoExpandTabs';
import { AutoExpandTab } from './common/autoExpandTabs/types';

interface CallFlowAnalyticsSectionProps {
  data?: {
    sectionHeadingDynamic?: any;
    heading?: string;
    description?: string;
    items?: Array<{
      _key?: string;
      heading?: string;
      subheading?: string;
      description?: string;
      image?: {
        url?: string;
      };
      genericVideo?: {
        videoId?: string;
        videoUrl?: string;
        videoPlatform?: string;
      };
    }>;
    ctaListItems?: Array<{
      ctaText?: string;
      ctaLink?: string;
      ctaType?: string;
    }>;
  };
  className?: string;
}

export default function CallFlowAnalyticsSection({
  data,
  className,
}: CallFlowAnalyticsSectionProps) {
  // Transform CMS items into tabs format
  const tabsData: AutoExpandTab[] = useMemo(() => {
    if (!data?.items || data.items.length === 0) {
      return [];
    }

    return data.items.map((item, index) => {
      const stepNumber = String(index + 1).padStart(2, '0');
      const tab: AutoExpandTab = {
        key: item._key || `step-${index + 1}`,
        step: `STEP ${stepNumber}`,
        title: item.heading || '',
        subheading: item.subheading || '',
        description: item.description || '',
      };

      // Add video if genericVideo exists
      if (item.genericVideo?.videoUrl) {
        tab.video = {
          videoPlatform: item.genericVideo.videoPlatform || 'youtube',
          videoUrl: item.genericVideo.videoUrl,
          videoId: item.genericVideo.videoId,
        };
      }

      // Add thumbnail if image exists
      if (item.image?.url) {
        tab.thumbnail = item.image.url;
      }

      return tab;
    });
  }, [data?.items]);

  // Get first CTA button or default
  const primaryCTA = data?.ctaListItems?.[0] || {
    ctaText: 'Book Free Demo',
    ctaLink: '/demo',
    ctaType: 'primary',
  };

  if (!data) {
    return null;
  }

  return (
    <Section className="w-full flex flex-col !bg-white pb-12">
      <Container className="w-full " type="V2" border="t-0">
        {/* Header Section */}
        <div className="flex items-center justify-center md:py-32 py-16 md:px-12 px-4">
          <div className="flex flex-col md:gap-8 gap-6 items-start w-full lg:w-[712px]">
            <div className="flex flex-col md:gap-3 gap-2 items-start w-full text-center">
              <div className="flex flex-col font-manrope font-semibold justify-center w-full md:text-[48px] text-[32px] text-gray-950 md:tracking-[-0.8px] tracking-[-0.5px] md:leading-[56px] leading-[40px]">
                <SectionH2 
                  content={data.sectionHeadingDynamic? data.sectionHeadingDynamic : data.heading}
                />
              </div>
              <p className="font-geist font-normal md:leading-7 leading-6 w-full text-gray-700 md:text-lg text-base tracking-normal whitespace-pre-wrap">
                {data.description || 'Every call captured, analyzed, and turned into actionable insight'}
              </p>
            </div>
            {primaryCTA && (
              <div className="flex items-start justify-center w-full">
                <Button type={primaryCTA.ctaType as any || 'primary'} link={primaryCTA.ctaLink || '/demo'}>
                  <span className="md:text-base text-sm font-medium">{primaryCTA.ctaText}</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Auto Expand Tabs */}
        {tabsData.length > 0 && (
          <AutoExpandTabs tabs={tabsData} autoPlayDuration={5000} />
        )}
      </Container>
    </Section>
  );
}

