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

interface StartupPracticesProps {
  pageData: any
  faq: any
}

export default function StartupPractices({ pageData, faq }: StartupPracticesProps) {
  const tabsListingComponentData = pageData?.['smarter-system']?.componentData?.refData?.tabsListingComponent;
  return (
    <>
       <div
         className="bg-gradient-to-r from-[#CAC5FF] via-[#F2F1FA] to-[#F0EFFA]"
         style={{
           background: 'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)'
         }}
       >
      <HeroSection
        page=""
        data={pageData['dental-phones-hero']?.componentData}
      />
        
       </div>
      {tabsListingComponentData &&
        <SingleTabCardListing data={tabsListingComponentData}/>
      }
      {pageData['testimonial-video-section']?.componentData && (
        <VerticalTestimonialListing
          data={pageData['testimonial-video-section']?.componentData?.refData?.testimonialListing}
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
          <IntegrationsGrid data={pageData['integrations-listing']?.componentData} />
        </div>
      )}
      {pageData?.['startup-practices']?.componentData &&
        <TabCardsListing data={pageData?.['startup-practices']?.componentData} />
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
        ? 'startup-practices'
        : `startup-practices-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)
    if(!pageData){
      console.error(`pageData not found for ${slug}`)
    }
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
    console.error('Error fetching Startup Practices page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null
      },
    }
  }
}