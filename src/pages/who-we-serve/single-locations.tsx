import { GetStaticProps } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'

import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import SingleTabCardListing from '~/components/revamp/components/common/TabListing/singleTabCardListing'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import Queries from '~/components/revamp/queries'

interface IndependentPracticesProps {
  pageData: any
  faq: any
}

export default function IndependentPractices({ pageData, faq }: IndependentPracticesProps) {
  const tabsListingComponentData = pageData["smarter-systems"]?.componentData?.refData?.tabsListingComponent

  return (
    <>
      <SimpleHead data={pageData?.seo} />
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
       {pageData['testimonial-video-section']?.componentData && (
        <VerticalTestimonialListing
          data={pageData['testimonial-video-section']?.componentData?.refData?.testimonialListing}
        />
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
        ? 'single-locations'
        : `single-locations-${region.toLowerCase()}`
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
    console.error('Error fetching Single Locations page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null
      },
    }
  }
}