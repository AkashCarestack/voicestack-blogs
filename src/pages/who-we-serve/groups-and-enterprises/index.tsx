import { GetStaticProps } from 'next'
import React from 'react'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import Queries from '~/components/revamp/queries'   
import FeatureHero from '~/v2/sections/FeatureHero'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import LogoListingV2 from '~/v2/sections/LogoListingV2'

interface DentalServiceOrganizationsDSOProps {
  pageData: any
  faq: any
  region: string
}

export default function GroupsAndEnterprises({
  pageData,
  faq,
  region,
}: DentalServiceOrganizationsDSOProps) {
    console.log({pageData}, 'pageData')
  return (
    <>
    <FeatureHero
      data={pageData['dso-hero']?.componentData}
      type="feature"
    />
    <div>
      {pageData['logo-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logo-listing']?.componentData.blocksListingData}
        />
      )}
          {pageData['card-with-image'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image']?.genericListingComponent}
        />
      )}
      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
        />
      )}
       <StatisticsSection variant="V2" />
    </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('whoWeServe', region)
    const slug =
      region === 'en'
        ? 'groups-and-enterprise'
        : `groups-and-enterprise-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)

    if (!pageData) {
      console.error(`pageData not found for ${slug}`)
    }
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    return {
      props: {
        pageData: pageData || null,
        region: region,
        faq: faqData,
      },
    }
  } catch (error) {
    console.error(
      'Error fetching Dental Service Organizations DSO page:',
      error,
    )
    return {
      props: {
        pageData: null,
        region: region,
        faq: null,
      },
    }
  }
}
