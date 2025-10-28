import React from 'react'
import { GetStaticProps } from 'next'
import Queries from '~/components/revamp/queries'
import TabCardsListing from '~/components/revamp/components/common/TabListing/tabCardsListing'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import SingleTabCardListing from '~/components/revamp/components/common/TabListing/singleTabCardListing'
import FaqSection from '~/components/revamp/components/common/faqSection'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'

interface MobilePracticesProps {
  pageData: any
  faq: any
}

export default function MobilePractices({ pageData, faq }: MobilePracticesProps) {
  return (
    <>
      <HeroSection
        page=""
        data={pageData['dental-phones-hero']?.componentData}
      />
      {pageData?.['trusted-business-communications']?.tabsListingComponent &&
        <SingleTabCardListing data={pageData?.['trusted-business-communications']?.tabsListingComponent}/>
      }
      {pageData['testimonial-video-section']?.componentData && (
        <VerticalTestimonialListing
          data={pageData['testimonial-video-section']?.componentData?.refData?.testimonialListing}
        />
      )}
          <StatisticsSection />
        {pageData['stack-card-tab-testimonial']?.componentData && (
        <StackCardTestimonial
          data={pageData['stack-card-tab-testimonial']?.componentData}
        />
      )}
       {pageData['integrations-listing']?.componentData && (
        <div className="mt-12">
          <IntegrationsGrid data={pageData['integrations-listing']?.componentData} />
        </div>
      )}
      {pageData?.['mobile-practices']?.componentData &&
        <TabCardsListing data={pageData?.['mobile-practices']?.componentData} />
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
        ? 'mobile-practices'
        : `mobile-practices-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)

    // Ensure FAQ data is serializable
    const faqData = pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    return {
      props: {
        pageData: pageData || null,
        region: region,
        faq: faqData
      },
    }
  } catch (error) {
    console.error('Error fetching Mobile Practices page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null
      },
    }
  }
}
