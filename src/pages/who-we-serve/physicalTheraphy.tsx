import { GetStaticProps } from 'next'
import React from 'react'

import LogoListingV2 from '~/components/LogoListingV2'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FaqSection from '~/components/revamp/components/common/faqSection'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import Queries from '~/components/revamp/queries'
import FeatureHero from '~/v2/sections/FeatureHero'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import VerticalTestimonialListing from '~/v2/sections/verticalTestimonialSection'

interface PhysicalTherapyProps {
  pageData: any
  faq: any
}

export default function PhysicalTherapy({ pageData, faq }: PhysicalTherapyProps) {
  if (!pageData) {
    return null
  }

  return (
    <>
      {/* <div className='!max-w-[1240px] w-full m-auto !px-0'> */}
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      {/* </div> */}
      <FeatureHero data={pageData['physical-therapy-hero']} type="feature" />

      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
      )}

      {pageData['card-with-image'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image']?.genericListingComponent}
        />
      )}
      {pageData['testimonial-video-section']?.componentData?.refData
        ?.testimonialListing && (
        <VerticalTestimonialListing
          data={
            pageData['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
         
        />
      )}
      {pageData['card-with-image2'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image2']?.genericListingComponent}
        />
      )}
      <StatisticsSection variant="V2" />
      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
        />
      )}

      {faq && <FaqSection faqItems={faq} />}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('whoWeServe', region)
    const slug = region === 'en' ? 'physical-therapy' : `physical-therapy-${region.toLowerCase()}`
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
    console.error('Error fetching physical therapy page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null,
      },
    }
  }
}
