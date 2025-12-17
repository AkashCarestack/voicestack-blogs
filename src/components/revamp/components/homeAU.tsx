import React from 'react'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import StatisticsSection from './StatisticsSection'
import HeroAU from './common/HeroSection/HeroAu'
import FaqSection from '~/components/revamp/components/common/faqSection'

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
      {featuresData && <CategoryFeatureTabs features={featuresData || []} />}

      {comparisonLegendData && (
        <SiteComparisonSection
          data={comparisonSectionData}
          legendData={comparisonLegendData}
        />
      )}

      {/* Statistics Section */}
      <StatisticsSection />
      {data.faqData && <FaqSection faqItems={data.faqData[0]} />}
    </>
  )
}
