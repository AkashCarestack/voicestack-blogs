import React from 'react'
import { GetStaticProps } from 'next'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import CardsGridSection from '~/components/revamp/components/CardsGridSection'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import ComparisonCardsSection from '~/components/revamp/components/ComparisonCardsSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import { getComparisonTableData, getAllComparisonValues } from '~/lib/sanity.queries'

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

export default function DentalPhonesIndex({ pageData, region, comparisonTableData, comparisonLegendData }: DentalPhonesIndexProps) {
  // Create comparison section data (same structure as homepage)
  const comparisonSectionData = {
    strip: 'The Best-in-Class Phone System. For the Best-in-Class Dental Practices.',
    header: 'No other phone system can match VoiceStack\'s AI-driven features,outcome-driven workflows and integration capabilities, as shown in the comparison chart below. ',
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }

  return (
    <>
      <HeroSection 
        page="inner" 
        data={pageData['dental-phones-hero']?.componentData}
      />
      
      {pageData['how-voicestack-works']?.componentData && (
        <CardsGridSection 
          data={pageData['how-voicestack-works'].componentData}
        />
      )}
      
      {/* VoiceStack Comparison Cards Section */}
      <ComparisonCardsSection data={pageData['comparison-cards']?.componentData} />
      
      {pageData['comparison-table']?.componentData && (
        <SiteComparisonSection 
          data={comparisonSectionData} 
          legendData={comparisonLegendData || []}
        />
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
    console.log('pageData', pageData);
    
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
