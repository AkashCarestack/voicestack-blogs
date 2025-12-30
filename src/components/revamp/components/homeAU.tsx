import React from 'react'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import StatisticsSection from './StatisticsSection'
import HeroAU from './common/HeroSection/HeroAu'
import FaqSection from '~/components/revamp/components/common/faqSection'
import ContentVideoTabsSection from '~/v2/sections/ContentVideoTabsSection'
import CardsGridSection from '~/v2/sections/CardsGridSection'
import VerticalTestimonialListing from './common/VerticalTestimonialListing/VerticalTestimonialListing'
// import AboutCoachingPartners from './common/AboutCoachingPartners'
// import IntegrationsShowcaseSection from './common/IntegrationsShowcaseSection'
import LogoListingV2 from '~/components/LogoListingV2'
import IntegrationCloudSection from '~/v2/sections/IntegrationCloudSection'
import FooterBottom from './common/FooterBottom'
import AboutCoachingPartners from '~/v2/sections/AboutCoachingPartnersSection'

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
  console.log(logosListingData)
  console.log(pageData['test-listing-3']?.componentData);
  
  return (
    <>
      <HeroAU
        image={heroSectionData?.heroImage}
        heading={heroSectionData?.heroheading}
        heroStrip={heroSectionData?.heroStrip}
        description={heroSectionData?.heroDescription}
        buttons={heroSectionData?.bookBtnContent}
      />
      {/* {featuresData && <CategoryFeatureTabs features={featuresData || []} />} */}

      {pageData['logos-listing']?.componentData && (
        <LogoListingV2 data={pageData['logos-listing']?.componentData.blocksListingData} />
      )}

      {comparisonLegendData && (
        <SiteComparisonSection
          variant="V2"
          data={comparisonSectionData}
          legendData={comparisonLegendData}
        />
      )}
      {pageData['voicestack-solution']?.componentData && <ContentVideoTabsSection data={pageData['voicestack-solution']?.componentData} />}
      {pageData['integrations-showcase']?.customComponent && (
        <IntegrationCloudSection data={pageData['integrations-showcase']?.customComponent} />
      )}
      {pageData['test-listing-2']?.componentData && (
        <CardsGridSection variant="V2" colCount={3}
          data={pageData['test-listing-2'].componentData}
        />
      )}

      {pageData['test-listing-3']?.componentData && (
        <CardsGridSection variant="V2" colCount={2} bottomSpace={true}
          data={pageData['test-listing-3'].componentData}
        />
      )}

      <StatisticsSection variant="V2" />
      {pageData['testimonial-video-section']?.componentData?.refData
        ?.testimonialListing && (
        <VerticalTestimonialListing
          data={
            pageData['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
          refer="en-AU"
        />
      )}
    {pageData['about-coach-partners']?.componentData && (
      <AboutCoachingPartners data={pageData['about-coach-partners']?.componentData} />
    )}
      {data.faqData && <FaqSection faqItems={data.faqData[0]} />}
      <FooterBottom/>
    </>
  )
}
