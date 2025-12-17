import React from 'react'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import StatisticsSection from './StatisticsSection'
import ContentVideoTabs from '~/components/ui/contentVideotabs'

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
  return (
    <>
    {featuresData && <CategoryFeatureTabs features={featuresData || []} />}

    {comparisonLegendData && (
      <SiteComparisonSection
        data={comparisonSectionData}
        legendData={comparisonLegendData}
      />
    )}
    {pageData['voicestack-solution']?.componentData && <ContentVideoTabs data={pageData['voicestack-solution']?.componentData} />}

    {/* Statistics Section */}
    <StatisticsSection />
    </>
  )
}
