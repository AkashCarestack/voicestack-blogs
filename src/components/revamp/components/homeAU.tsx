import React from 'react'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import StatisticsSection from './StatisticsSection'
import HeroAU from './common/HeroSection/HeroAu'
import FaqSection from '~/components/revamp/components/common/faqSection'
import ContentVideoTabs from '~/components/ui/contentVideotabs'
import CardsGridSection from './CardsGridSection'

export default function HomeAU({
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

      {comparisonLegendData && (
        <SiteComparisonSection
          variant="V2"
          data={comparisonSectionData}
          legendData={comparisonLegendData}
        />
      )}
      {pageData['voicestack-solution']?.componentData && <ContentVideoTabs data={pageData['voicestack-solution']?.componentData} />}

      {pageData['test-listing-2']?.componentData && (
        <CardsGridSection variant="V2" type="col-3"
          data={pageData['test-listing-2'].componentData}
        />
      )}

      {pageData['test-listing-3']?.componentData && (
        <CardsGridSection variant="V2" type="col-2" bottomSpace={true}
          data={pageData['test-listing-3'].componentData}
        />
      )}
      <StatisticsSection variant="V2" />
      {data.faqData && <FaqSection faqItems={data.faqData[0]} />}
    </>
  )
}
