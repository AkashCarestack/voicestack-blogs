import { GetStaticProps } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'

import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import ReviewTestimonial from '~/components/revamp/components/common/ReviewTestimonial/ReviewTestimonial'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import Queries from '~/components/revamp/queries'

interface ReviewsProps {
  pageData: any
  faq: any
}

export default function Reviews({ pageData, faq }: ReviewsProps) {
  return (
    <>
      <SimpleHead data={pageData?.seo} />
      <HeroWrapper>
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        <HeroSection
          page=""
          showFullDescription={true}
          data={pageData['dental-phones-hero']?.componentData}
          isCentered={true}
        />
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
      </HeroWrapper>
     
        {pageData['review-testimonial']?.componentData && (
          <ReviewTestimonial data={pageData['review-testimonial']?.componentData} />
        )}
        <div className='w-full lg:mb-24 mb-12'>
        <StatisticsSection />
        </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('dentalPhones', region)

    const slug = region === 'en' ? 'reviews' : `reviews-${region.toLowerCase()}`
    const pageData = await queries.getPageData('dentalPhones', slug)

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
