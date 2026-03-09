import { GetStaticProps } from 'next'
import React from 'react'

import SimpleHead from '~/components/common/SimpleHead'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import Queries from '~/components/revamp/queries'
import FeatureHero from '~/v2/sections/FeatureHero'
import LeadershipList from '~/v2/sections/leadershipList'

// Define proper TypeScript interfaces



export default function LeadershipTeamPage({
  pageData,
  region,
}) {

  return (
    <>
      <SimpleHead data={pageData?.seo} />
      {/* <HeroWrapper>
        {pageData['leadership-team-hero']?.componentData && (
          <HeroSection
            page=""
            isCentered={true}
            showFullDescription={true}
            data={pageData['leadership-team-hero']?.componentData}
            />
        )} 
      </HeroWrapper> */}
      {pageData['leadership-team-hero']?.componentData && (
        <FeatureHero data={pageData['leadership-team-hero']} isCentered={true}/>
      )}
        {pageData['leadership-team-list']?.componentData?.refData?.testimonialListing && (         
        <LeadershipList data={pageData['leadership-team-list']?.componentData?.refData?.testimonialListing} />
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
