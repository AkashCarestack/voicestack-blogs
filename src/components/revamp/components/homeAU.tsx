import React from 'react'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import StatisticsSection from './StatisticsSection'

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
  console.log(data, 'data')
  return (
    <>
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
