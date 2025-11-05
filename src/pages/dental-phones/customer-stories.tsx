import React from 'react'
import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import Queries from '~/components/revamp/queries'
import ImageCardSection from '~/components/revamp/components/common/ImageCardSection'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import Section from '~/components/structure/Section'
import Button from '~/components/common/Button'
import MasonryCardGridSection from '~/components/revamp/components/common/MasonryCardGridSection'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'

export default function CustomerStories({ pageData }: any) {
  const data =
    pageData &&
    pageData['Powering-Startup'] &&
    pageData['Powering-Startup'].componentData
  const masonryData =
    pageData &&
    pageData['featured-practice-stories'] &&
    pageData['featured-practice-stories'].componentData

  return (
    data && (
      <>
       <div
        className="bg-gradient-to-r from-[#CAC5FF] via-[#F2F1FA] to-[#F0EFFA]"
        style={{
          background:
            'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
        }}
      >
        <HeroSection
          page=""
          data={pageData['dental-phones-hero']?.componentData}
          isCentered={true}
        />
        {pageData['testimonial-video-section']?.componentData && (
          <VerticalTestimonialListing
            data={
              pageData['testimonial-video-section']?.componentData?.refData
                ?.testimonialListing
            }
          />
        )}
      </div>
        {masonryData && <MasonryCardGridSection data={masonryData} />}
        {data && (
          <ImageCardSection
            data={data?.items}
            heading={data?.heading}
            description={data?.description}
          />
        )}
      </>
    )
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('dentalPhones', region)
    const slug =
      region === 'en'
        ? 'customer-stories'
        : `customer-stories-${region.toLowerCase()}`
    const pageData = await queries.getPageData('dentalPhones', slug)

    return {
      props: {
        pageData: pageData || null,
      },
    }
  } catch (error) {
    console.error('Error fetching customer stories:', error)
    return {
      props: {
        pageData: null,
      },
    }
  }
}
