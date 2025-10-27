import React from 'react'
import { GetStaticProps } from 'next'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import CardsGridSection from '~/components/revamp/components/CardsGridSection'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import ComparisonCardsSection from '~/components/revamp/components/ComparisonCardsSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import {
  getComparisonTableData,
  getAllComparisonValues,
} from '~/lib/sanity.queries'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'

// Define proper TypeScript interfaces
interface HeroComponentData {
  title?: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  [key: string]: any // For flexibility with dynamic data
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
  'dental-phones-hero': {
    componentData: HeroComponentData
  }
  'how-voicestack-works'?: {
    componentData: GenericListingData
  }
  [key: string]: any // For other page sections
}

interface DentalPhonesIndexProps {
  pageData: PageData
  region: string
  comparisonTableData: any
  comparisonLegendData: any[] | null
}

export default function DentalPhonesIndex({
  pageData,
  region,
  comparisonTableData,
  comparisonLegendData,
}: DentalPhonesIndexProps) {
  // Create comparison section data (same structure as homepage)

  console.log('pageDataDentalPhonesIndex', pageData)

  return (
    <>
      <HeroSection
        page=""
        data={pageData['dental-phones-hero']?.componentData}
      />
      {pageData['stack-card-tab-testimonial']?.componentData && (
        <StackCardTestimonial
          data={pageData['stack-card-tab-testimonial']?.componentData}
        />
      )}
      {pageData['how-voicestack-works']?.componentData && (
        <CardsGridSection
          data={pageData['how-voicestack-works'].componentData}
        />
      )}
      {pageData['testimonial-video-section']?.componentData && (
        <VerticalTestimonialListing
          data={pageData['testimonial-video-section']?.componentData?.refData?.testimonialListing}
        />
      )}

      {pageData['custom']?.componentData && (
        <div className="mt-12">
          <IntegrationsGrid data={pageData['custom']?.componentData} />
        </div>
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const queries = new Queries('landing', region)
    const slug = region === 'en' ? 'landing' : `landing-${region.toLowerCase()}`

    const pageData = await queries.getPageData('dentalPhones', slug)
    console.log('pageData', pageData)

    // Fetch comparison table data
    const client = getClient()

    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        pageData,
        region,
      },
      // Add revalidation for ISR
      // revalidate: 60, // Revalidate every 60 seconds
    }
  } catch (error) {
    console.error('Error fetching page data:', error)
    return {
      notFound: true,
    }
  }
}
