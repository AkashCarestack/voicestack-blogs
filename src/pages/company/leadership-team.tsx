import { GetStaticProps } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'

import FeaturesSectionWithNavigation from '~/components/FeaturesSectionWithNavigation'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import LeadershipList from '~/components/revamp/components/common/LeadershipList/leadershipList'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import ComparisonCardsSection from '~/components/revamp/components/ComparisonCardsSection'
import Queries from '~/components/revamp/queries'
import SiteComparisonSection from '~/v2/sections/SiteComparisonSection'
import { getClient } from '~/lib/sanity.client'

// Define proper TypeScript interfaces



export default function LeadershipTeamPage({
  pageData,
  region,
}) {

  return (
    <>
      <SimpleHead data={pageData?.seo} />
      <HeroWrapper>
        {pageData['leadership-team-hero']?.componentData && (
          <HeroSection
            page=""
            isCentered={true}
            showFullDescription={true}
            data={pageData['leadership-team-hero']?.componentData}
            />
        )} 
      </HeroWrapper>
      {pageData['leadership-team-list']?.componentData && (
        <LeadershipList data={pageData['leadership-team-list']?.componentData} />
      )}

    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const queries = new Queries('leadership', region)
    const slug =
      region === 'en' ? 'leadership' : `leadership-${region.toLowerCase()}`

    // Fetch page data for integrations
    const pageData = await queries.getPageData('company', slug)

    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

   
    return {
      props: {
        pageData,
        region,
      },
    }
  } catch (error) {
    console.error('Error fetching integrations page data:', error)
    return {
      notFound: true,
    }
  }
}
