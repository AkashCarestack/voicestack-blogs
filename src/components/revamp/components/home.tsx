import React from 'react'

import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import LogoListingSection from '~/components/LogoListingSection'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import LogoSliderSection from '~/components/LogoSliderSection'
import FaqSection from '~/components/revamp/components/common/faqSection'
import Testimonials from '~/components/revamp/components/common/Testimonials/Testimonials'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import SiteComparisonSection from '~/v2/sections/SiteComparisonSection'
import AboutCoachingPartners from '~/v2/sections/AboutCoachingPartnersSection'
import CardsGridSection from '~/v2/sections/CardsGridSection'
import ContentVideoTabsSection from '~/v2/sections/ContentVideoTabsSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import VerticalTestimonialListingv2 from '~/v2/sections/verticalTestimonialSection'
import CardListing from './cardListing'
import HeroAU from './common/HeroSection/HeroAu'
import HeroSection from './common/HeroSection/heroSection'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import SimpleHead from '~/components/common/SimpleHead'
import PromoBannerButtonSection from '~/v2/sections/PromoBannerButtonSection'

export default function Home({
  data,
  featuresData,
  comparisonLegendData,
  comparisonTableData,
  comparisonSectionData,
}: {
  data: any
  featuresData: any
  comparisonLegendData: any
  comparisonTableData: any
  comparisonSectionData: any
}) {
  const heroSectionData = data['hero-section']?.componentData
  const logosListingData =
    data['logos-listing']?.componentData.blocksListingData

  return data?.slug?.includes('v2') ? (
    <div className="">
      <SimpleHead data={data?.seo} />
      <HeroAU
        image={heroSectionData?.heroImage}
        heading={heroSectionData?.heroheading}
        heroStrip={heroSectionData?.heroStrip}
        description={heroSectionData?.heroDescription}
        buttons={heroSectionData?.bookBtnContent}
      />
      <PromoBannerButtonSection />
      {/* {featuresData && <CategoryFeatureTabs features={featuresData || []} />} */}

      {data['logos-listing']?.componentData && (
        <LogoListingV2
          data={data['logos-listing']?.componentData.blocksListingData}
        />
      )}
      {data['testimonial-video-section']?.componentData?.refData
        ?.testimonialListing && (
        <VerticalTestimonialListingv2
          data={
            data['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
        />
      )}
      <CategoryFeatureTabsSection
        features={featuresData}
        variant="carousel"
        layoutDynamic
        sectionHeading={
          data['category-feature-tabs']?.componentData?.sectionHeading
        }
      />
      {data['voicestack-solution']?.componentData && (
        <ContentVideoTabsSection
          data={data['voicestack-solution']?.componentData}
          layoutDynamic
        />
      )}

      {data['power-of-ai'] && (
        <GroupedCardsGridSection
          data={data['power-of-ai']?.componentData}
          theme="dark"
          aiSection={true}
        />
      )}
      {data['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={data['integrations-listing']?.componentData}
          theme="dark"
        />
      )}
      {data['how-voicestack-works'] && (
        <GroupedCardsGridSection
          data={data['how-voicestack-works']?.componentData?.blocksListingData}
        />
      )}
      <StatisticsSection />
      {/* {comparisonLegendData && (
        <SiteComparisonSection
          data={comparisonSectionData}
          legendData={comparisonLegendData}
        />
      )} */}
      {data.faqData && <FaqSection faqItems={data.faqData[0]} />}
    </div>
  ) : (
    <div className="">
      {data && (
        <div className="px-4 xl:px-12 pt-2">
          <div
            className="rounded-[12px] md:rounded-[24px] bg-gradient-to-r from-[#CAC5FF] via-[#F2F1FA] to-[#F0EFFA] py-12"
            style={{
              background:
                ' linear-gradient(270deg, #F0EFFA 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
            }}
          >
            <HeroSection data={data['home-hero']?.componentData} page="home" />
          </div>
        </div>
      )}

      {/* Logo Slider Section */}
      {data['logo-listing']?.componentData && (
        <LogoSliderSection
          data={data['logo-listing']?.componentData?.blocksListingData}
        />
      )}

      {/* Vertical Testimonial Listing */}
      {data['testimonial-video-section']?.componentData?.refData
        ?.testimonialListing && (
        <VerticalTestimonialListing
          data={
            data['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
        />
      )}

      {/* Testimonials Section */}
      {data['testimonial-category-section']?.componentData?.refData
        ?.tabsListingComponent && (
        <Testimonials
          data={
            data['testimonial-category-section']['componentData']['refData']
              ?.tabsListingComponent
          }
        />
      )}

      {/* Card Listing / Business Outcomes */}
      {data['business-outcomes']?.componentData?.refData
        ?.tabsListingComponent && (
        <CardListing
          data={
            data['business-outcomes']?.componentData?.refData
              ?.tabsListingComponent
          }
        />
      )}

      {/* Category Feature Tabs */}
      {featuresData && <CategoryFeatureTabs features={featuresData || []} />}

      {comparisonLegendData && (
        <SiteComparisonSection
          data={comparisonSectionData}
          legendData={comparisonLegendData}
        />
      )}

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Logo Listing Section */}
      {data['logo-listing']?.componentData && (
        <LogoListingSection
          data={data['logo-listing']?.componentData?.blocksListingData}
        />
      )}

      {/* FAQ Section */}
      {data.faqData && <FaqSection faqItems={data.faqData[0]} />}
    </div>
  )
}
