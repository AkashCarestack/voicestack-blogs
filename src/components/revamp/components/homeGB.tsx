import React from 'react'
import SiteComparisonSection from '~/v2/sections/SiteComparisonSection'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import HeroAU from './common/HeroSection/HeroAu'
import FaqSection from '~/components/revamp/components/common/faqSection'
import ContentVideoTabsSection from '~/v2/sections/ContentVideoTabsSection'
import CardsGridSection from '~/v2/sections/CardsGridSection'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import IntegrationCloudSection from '~/v2/sections/IntegrationCloudSection'
import FooterBottom from './common/FooterBottom'
import AboutCoachingPartners from '~/v2/sections/AboutCoachingPartnersSection'
import VerticalTestimonialListing from '~/v2/sections/verticalTestimonialSection'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import SimpleHead from '~/components/common/SimpleHead'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import VerticalTestimonialListingv2 from '~/v2/sections/verticalTestimonialSection'

export default function
HomeGB({
  data,
  featuresData,
  comparisonLegendData,
  pageData,
}: {
  data: any
  featuresData: any
  comparisonLegendData: any
  pageData: any
}) {
  const heroSectionData = data['hero-section']?.componentData
  const logosListingData = data['logos-listing']?.componentData.blocksListingData

  const comparisonTableComponent = pageData['comparison-table']?.componentData
  const comparisonTableData = comparisonTableComponent?.comparisonTable
  
  // const comparisonTableTitle = pageData['comparison-table']?.componentData
  const comparisonSectionData = {
    strip: comparisonTableComponent?.title,
    header: comparisonTableComponent?.description,
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }
  return (
    <>
      <SimpleHead data={pageData?.seo} />
      <HeroAU
        image={heroSectionData?.heroImage}
        heading={heroSectionData?.heroheading}
        heroStrip={heroSectionData?.heroStrip}
        description={heroSectionData?.heroDescription}
        buttons={heroSectionData?.bookBtnContent}
      />
      {/* {featuresData && <CategoryFeatureTabs features={featuresData || []} />} */}

      {data['logos-listing']?.componentData && (
        <LogoListingV2
          data={data['logos-listing']?.componentData.blocksListingData}
        />
      )}
         {data['how-voicestack-works'] && (
        <GroupedCardsGridSection
          data={data['how-voicestack-works']?.componentData?.blocksListingData}
          sectionBorder="b"
        />
      )}
      {/* {data['voicestack-solution']?.componentData && (
        <ContentVideoTabsSection data={data['voicestack-solution']?.componentData} />
      )} */}

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
      <CategoryFeatureTabsSection
        features={featuresData}
        variant="carousel"
        sectionHeading={
          data['category-feature-tabs']?.componentData?.sectionHeading
        }
      />
      {data['testimonial-video-section']?.componentData?.refData
        ?.testimonialListing && (
        <VerticalTestimonialListingv2
          data={
            data['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
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
    </>
  )
}
