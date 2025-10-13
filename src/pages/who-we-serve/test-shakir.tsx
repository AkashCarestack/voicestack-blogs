import React from 'react'
import { GetStaticProps } from 'next'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import CardsGridSection from '~/components/revamp/components/CardsGridSection'
import Queries from '~/components/revamp/queries'

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
  'inner-hero': {
    componentData: HeroComponentData
  }
  'how-voicestack-works'?: {
    componentData: GenericListingData
  }
  [key: string]: any // For other page sections
}

interface TestShakirProps {
  pageData: PageData
  region: string
}

export default function TestShakir({ pageData, region }: TestShakirProps) {
  // Add error boundary and validation
  if (!pageData?.['inner-hero']?.componentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The requested page content is not available.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <HeroSection 
        page="inner" 
        data={pageData['inner-hero'].componentData}
      />
      
      {pageData['how-voicestack-works']?.componentData && (
        <CardsGridSection 
          data={pageData['how-voicestack-works'].componentData}
        />
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const queries = new Queries('test-shakir', region)
    const slug = region === 'en' ? 'test-shakir' : `test-shakir-${region.toLowerCase()}`
    
    const pageData = await queries.getPageData('whoWeServe', slug)

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
