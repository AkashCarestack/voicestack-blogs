import { GetStaticProps } from 'next'
import React from 'react'

import FeaturesSectionWithNavigation from '~/components/FeaturesSectionWithNavigation'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import LeadershipList from '~/components/revamp/components/common/LeadershipList/leadershipList'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import ComparisonCardsSection from '~/components/revamp/components/ComparisonCardsSection'
import Queries from '~/components/revamp/queries'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import { getClient } from '~/lib/sanity.client'

// Define proper TypeScript interfaces



export default function LeadershipTeamPage({
  pageData,
  region,
}) {
  console.log('pageData', pageData)

  return (
    <>
      <div
        className="pt-lg pb-md"
        style={{
          background:
            'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
        }}
      >
        {/* <Breadcrumb breadCrumb={pageData?.breadCrumb} /> */}
        {pageData['leadership-team-hero']?.componentData && (
          <HeroSection
            page=""
            isCentered={true}
            showFullDescription={true}
            data={pageData['leadership-team-hero']?.componentData}
            />
        )} 
            </div>
        {pageData['leadership-team-list']?.componentData && (
          <LeadershipList data={pageData['leadership-team-list']?.componentData} />
        )}

    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const queries = new Queries('leadership-team', region)
    const slug =
      region === 'en' ? 'leadership-team' : `leadership-team-${region.toLowerCase()}`

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
