import { GetStaticProps } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'

import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import SingleTabCardListing from '~/components/revamp/components/common/TabListing/singleTabCardListing'
import TabCardsListing from '~/components/revamp/components/common/TabListing/tabCardsListing'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import Queries from '~/components/revamp/queries'

interface GroupsAndDSOProps {
  pageData: any
  faq: any
}

export default function GroupsAndDSO({ pageData, faq }: GroupsAndDSOProps) {
  const tabsListingData = pageData?.["mobile-practices"]?.componentData?.refData?.tabsListingComponent
  const tabsListingComponentData =
    pageData['smarter-systems']?.componentData?.refData?.tabsListingComponent
  return (
    <>
      <SimpleHead data={pageData?.seo} />
      
      <HeroWrapper>
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        <HeroSection
          page=""
          data={pageData['dental-phones-hero']?.componentData}
        />
      </HeroWrapper>

      {/* {tabsListingComponentData && (
        <SingleTabCardListing data={tabsListingComponentData} />
      )} */}
      {pageData['testimonial-video-section']?.componentData && (
        <VerticalTestimonialListing
          data={
            pageData['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
        />
      )}
      <StatisticsSection />
      {pageData['stack-card-tab-testimonial']?.componentData?.refData ? (
        <StackCardTestimonial
          data={
            pageData['stack-card-tab-testimonial']?.componentData?.refData
              ?.tabsListingComponent
          }
        />
      ) : (
        <StackCardTestimonial
          data={pageData['stack-card-tab-testimonial']?.componentData}
        />
      )}
      {pageData['integrations-listing']?.componentData && (
        <div className="mt-12">
          <IntegrationsGrid
            data={pageData['integrations-listing']?.componentData}
          />
        </div>
      )}

      {
        tabsListingData && (<TabCardsListing data={tabsListingData} />)
      }

      {/* FAQ Section */}
      {faq && (
        <div>
          <FaqSection faqItems={faq} />
        </div>
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('whoWeServe', region)
    const slug =
      region === 'en'
        ? 'groups-and-dsos'
        : `groups-and-dsos-${region.toLowerCase()}`
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
    console.error('Error fetching groups and DSO page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null,
      },
    }
  }
}
