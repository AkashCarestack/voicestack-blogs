import { GetStaticProps } from 'next'
import React from 'react'

import FooterBottom from '~/components/revamp/components/common/FooterBottom'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
// import VoiceStackComparisonCards from '~/components/revamp/components/VoiceStackComparisonCards'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { getAllComparisonValues,getComparisonTableData } from '~/lib/sanity.queries'
import AboutCoachingPartnersSection from '~/v2/sections/AboutCoachingPartnersSection'
import FeatureTestimonialsSection from '~/v2/sections/FeatureTestimonialsSection'
interface HeroComponentData {
  title?: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  [key: string]: any 
}

interface GenericListingData {
  heading?: string
  description?: string
  items?: Array<{
    _key?: string
    heading?: string
    subheading?: string
    description?: string
    link?: {
      url?: string
      text?: string
      buttonType?: string
    }
    dynamicSvg?: string
    image?: any
  }>
}

interface PageData {
  'inner-hero': {
    componentData: HeroComponentData
  }
  'how-voicestack-works'?: {
    componentData: GenericListingData
  }
  [key: string]: any // For other page sections
}

interface TestPrincyProps {
  pageData: PageData
  region: string
  comparisonTableData: any
  comparisonLegendData: any[] | null
}

export default function TestPrincy({ pageData, region, comparisonTableData, comparisonLegendData }: TestPrincyProps) {
  // Debug: Check what sections are available in pageData
  console.log('Available pageData keys:', pageData)

  return (
    <>
    {pageData['testimonial-video-section']?.componentData?.refData
        ?.testimonialListing && (
        <VerticalTestimonialListing
          data={
            pageData['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
          refer={region}
        />
      )}
    {pageData['about-coach-partners']?.componentData && (
      <AboutCoachingPartnersSection data={pageData['about-coach-partners']?.componentData} />
    )}
    {pageData['feature-testimonials-section']?.componentData && (
      <FeatureTestimonialsSection data={pageData['feature-testimonials-section']?.componentData} />
    )}
    {/* <FooterBottom/> */}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const queries = new Queries('test-princy', region)
    const slug = region === 'en' ? 'test-princy' : `test-princy-${region.toLowerCase()}`
    
    const pageData = await queries.getPageData('whoWeServe', slug)
    
    // Fetch comparison table data
    const client = getClient()
    const comparisonTableData = await getComparisonTableData(client, region)
    const comparisonLegendData = await getAllComparisonValues() || []

    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        pageData,
        region,
        comparisonTableData,
        comparisonLegendData,
      },
    }
  } catch (error) {
    console.error('Error fetching page data:', error)
    return {
      notFound: true,
    }
  }
}
