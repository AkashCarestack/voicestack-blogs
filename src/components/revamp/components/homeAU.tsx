import React from 'react'
import SiteComparisonSection from '~/v2/sections/SiteComparisonSection'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import HeroAU from './common/HeroSection/HeroAu'
import FaqSection from '~/components/revamp/components/common/faqSection'
import ContentVideoTabsSection from '~/v2/sections/ContentVideoTabsSection'
import CardsGridSection from '~/v2/sections/CardsGridSection'
// import AboutCoachingPartners from './common/AboutCoachingPartners'
// import IntegrationsShowcaseSection from './common/IntegrationsShowcaseSection'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import IntegrationCloudSection from '~/v2/sections/IntegrationCloudSection'
import FooterBottom from './common/FooterBottom'
import AboutCoachingPartners from '~/v2/sections/AboutCoachingPartnersSection'
import VerticalTestimonialListing from '~/v2/sections/verticalTestimonialSection'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'

export default function 
HomeAU({
  data,
  featuresData,
  comparisonLegendData,
  comparisonTableData,
  comparisonSectionData,
  pageData,
}: {
  data: any
  featuresData: any
  comparisonLegendData: any
  comparisonTableData: any
  comparisonSectionData: any
  pageData: any
}) {
  const heroSectionData = data['hero-section']?.componentData
  const logosListingData = data['logos-listing']?.componentData.blocksListingData

  
  return (
    <>
      <HeroAU
        image={heroSectionData?.heroImage}
        heading={heroSectionData?.heroheading}
        heroStrip={heroSectionData?.heroStrip}
        description={heroSectionData?.heroDescription}
        buttons={heroSectionData?.bookBtnContent}
      />
      {pageData['logos-listing']?.componentData && (
        <LogoListingV2 data={pageData['logos-listing']?.componentData.blocksListingData} />
      )}
      {data['voicestack-solution']?.componentData && (
        <ContentVideoTabsSection data={data['voicestack-solution']?.componentData} />
      )}

      {data['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={data['integrations-listing']?.componentData}
          theme="dark"
        />
      )}

      {pageData['test-listing-2']?.componentData && (
        <CardsGridSection variant="V2" colCount={3}
          data={pageData['test-listing-2'].componentData}
        />
      )}

      {pageData['testimonial-video-section']?.componentData?.refData
        ?.testimonialListing && (
        <VerticalTestimonialListing
          data={
            pageData['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
        
        />
      )}

      {pageData['test-listing-3']?.componentData && (
        <CardsGridSection variant="V2" colCount={2} bottomSpace={true}
          data={pageData['test-listing-3'].componentData}
        />
      )}

      <StatisticsSection />
      {comparisonLegendData && (
        <SiteComparisonSection
          data={comparisonSectionData}
          legendData={comparisonLegendData}
        />
      )}
      
    {pageData['about-coach-partners']?.componentData && (
      <AboutCoachingPartners data={pageData['about-coach-partners']?.componentData} />
    )}
      {data.faqData && <FaqSection faqItems={data.faqData[0]} />}
    </>
  )
}
