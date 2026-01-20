import { GetStaticProps } from 'next'
import React from 'react'

import SimpleHead from '~/components/common/SimpleHead'
// import PracticeCards from '~/components/revamp/components/common/PracticeCards/practiceCards'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import LogoListingSection from '~/components/LogoListingSection'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import Queries from '~/components/revamp/queries'
import FeatureHero from '~/v2/sections/FeatureHero'
import StatisticsSection from '~/v2/sections/StatisticsSection'

export default function CustomerStories({ pageData }: any) {
  const data =
    pageData &&
    pageData['Powering-Startup'] &&
    pageData['Powering-Startup'].componentData
  const masonryData =
    pageData &&
    pageData['featured-practice-stories'] &&
    pageData['featured-practice-stories'].componentData

  return (
    data && (
      <>
        <SimpleHead data={pageData?.seo} />
        
        {pageData['dental-phones-hero']?.componentData && (
          <FeatureHero  data={pageData['dental-phones-hero']?.componentData} type="feature" isCentered={true} />
        )}


        {pageData['testimonial-tabs']?.componentData && (
          <CategoryFeatureTabs page="case-studies" sectionHeading={pageData['testimonial-tabs']?.componentData} features={pageData['testimonial-tabs']?.componentData?.tabs} />
        )}

         {pageData['custom']?.componentData && (
        <div className="">
          <IntegrationsGrid data={pageData['custom']?.componentData} />
        </div>
      )}
        
        <StatisticsSection bgColor="#f4f3fa" />
        {pageData['logo-listing']?.componentData && (
          <LogoListingSection
            data={pageData['logo-listing']?.componentData?.blocksListingData}
            header={false}
          />
        )}
      </>
    )
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('dentalPhones', region)
    const slug =
      region === 'en'
        ? 'case-studies'
        : `case-studies-${region.toLowerCase()}`
    const pageData = await queries.getPageData('dentalPhones', slug)

    return {
      props: {
        pageData: pageData || null,
      },
    }
  } catch (error) {
    console.error('Error fetching customer stories:', error)
    return {
      props: {
        pageData: null,
      },
    }
  }
}