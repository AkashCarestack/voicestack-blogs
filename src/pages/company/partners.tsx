import { GetStaticProps } from 'next'
import React from 'react'
import LogoListingSection from '~/components/LogoListingSection'
import CardsWithTestimonial from '~/components/revamp/components/common/cardsWithTestimonial'

import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import LeadershipList from '~/components/revamp/components/common/LeadershipList/leadershipList'
import PartnerLogoListing from '~/components/revamp/components/common/partnerLogoListing'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { logoSection } from '~/lib/sanity.queries'

// Define proper TypeScript interfaces

export default function PartnersPage({ pageData, region }) {
  console.log('pageData', pageData['partner-logos'])
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
        {pageData['partners-hero']?.componentData && (
          <HeroSection
            page=""
            isCentered={true}
            showFullDescription={true}
            data={pageData['partners-hero']?.componentData}
          />
        )}
      </div>
      {pageData['partner-logos']?.componentData && (
         <PartnerLogoListing data={pageData['partner-logos']?.componentData} />
       )}
      {pageData['partner-feature']?.componentData && (
        <CardsWithTestimonial
          data={pageData['partner-feature']?.componentData}
        />
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const client = getClient()
    const queries = new Queries('partners', region)
    const slug =
      region === 'en' ? 'partners' : `partners-${region.toLowerCase()}`

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
