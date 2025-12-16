import React from 'react'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import StatisticsSection from './StatisticsSection'
import ContentVideoTabs from '~/components/ui/content-video-tabs'

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
    {featuresData && <ContentVideoTabs pageData={pageData} features={featuresData || []} />}

    {/* Statistics Section */}
    <StatisticsSection />
    </>
  )
}
