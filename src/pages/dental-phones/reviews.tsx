import { GetStaticProps } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'

import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import Queries from '~/components/revamp/queries'
import FeatureHero from '~/v2/sections/FeatureHero'
import ReviewTestimonialV2 from '~/v2/sections/ReviewTestimonialV2'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import VerticalTestimonialListing from '~/v2/sections/verticalTestimonialSection'

interface ReviewsProps {
  pageData: any
  faq: any
}

export default function Reviews({ pageData, faq }: ReviewsProps) {
  return (
    <>
      <SimpleHead data={pageData?.seo} />
    
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        {/* <HeroSection
          page=""
          showFullDescription={true}
          data={pageData['dental-phones-hero']?.componentData}
          isCentered={true}
        /> */}
        <FeatureHero data={pageData['dental-phones-hero']} type="feature"   isCentered={true} />
        {pageData['testimonial-video-section']?.componentData && (
          <VerticalTestimonialListing
            showBookFeeBtn={false}
            data={
              pageData['testimonial-video-section']?.componentData?.refData
                ?.testimonialListing
            }
            hideTitle={true}
          />
        )}
      
     
        {pageData['review-testimonial']?.componentData && (
          <ReviewTestimonialV2 data={pageData['review-testimonial']?.componentData} />
        )}
        <div className='w-full lg:mb-24 mb-12'>
        <StatisticsSection />
        </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  // dental-phones pages support 'en-AU' and 'en-GB' locales
  if (region !== 'en-AU' && region !== 'en-GB') {
    return {
      notFound: true,
    }
  }

  try {
    const queries = new Queries('dentalPhones', region)
    // Convert region to slug format (en-AU -> en-au, en-GB -> en-gb)
    const regionSlug = region.toLowerCase()
    const slug = `reviews-${regionSlug}`
    const pageData = await queries.getPageData('dentalPhones', slug)

    if(!pageData){
      return {
        notFound: true
      }
    }

    // Ensure FAQ data is serializable
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
    console.error('Error fetching Reviews page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null,
      },
    }
  }
}
