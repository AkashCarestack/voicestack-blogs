import React from 'react'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import StatisticsSection from './StatisticsSection'
import HeroAU from './common/HeroSection/HeroAu'

export default function HomeAU({
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
  return (
    <>
    <HeroAU  image={data.heroImage} heading={data.heroheading} heroStrip={data.heroStrip} description={data.heroDescription} buttons={data.bookBtnContent} />
    {featuresData && <CategoryFeatureTabs features={featuresData || []} />}

    {comparisonLegendData && (
      <SiteComparisonSection
        data={comparisonSectionData}
        legendData={comparisonLegendData}
      />
    )}

    {/* Statistics Section */}
    <StatisticsSection />
    </>
  )
}
