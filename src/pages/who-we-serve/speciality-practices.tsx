import { GetStaticProps } from 'next'
import React from 'react'

import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import SingleCardWithList from '~/components/revamp/components/common/TabListing/singleCardWithList'
import SingleTabCardListing from '~/components/revamp/components/common/TabListing/singleTabCardListing'
import TabCardsListing from '~/components/revamp/components/common/TabListing/tabCardsListing'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import Queries from '~/components/revamp/queries'

interface SpecialityPracticesProps {
  pageData: any
  faq: any
}

export default function SpecialityPractices({ pageData, faq }: SpecialityPracticesProps) {
  return (
    <>
      {pageData['dental-phones-hero']?.componentData && <HeroSection
        page=""
        data={pageData['dental-phones-hero']?.componentData}
      />}
      {
        pageData?.['effortlessly-handle-calls']?.componentData &&
        <SingleCardWithList data={pageData?.['effortlessly-handle-calls']?.componentData}/>
      }
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
        {pageData?.['speciality-practices']?.componentData &&
        <TabCardsListing data={pageData?.['speciality-practices']?.componentData} />
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
        ? 'speciality-practices'
        : `speciality-practices-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)
    if(!pageData){
      console.error(`pageData not found for ${slug}`)
    }

    const faqData = pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    return {
      props: {
        pageData: pageData || null,
        region: region,
        faq: faqData
      },
    }
  } catch (error) {
    console.error('Error fetching Speciality Practices page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null
      },
    }
  }
}
