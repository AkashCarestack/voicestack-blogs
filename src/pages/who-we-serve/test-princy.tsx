import React from 'react'
import { GetStaticProps } from 'next'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import CardsGridSection from '~/components/revamp/components/CardsGridSection'
import SiteComparisonSection from '~/components/SiteComparisonSection'
// import VoiceStackComparisonCards from '~/components/revamp/components/VoiceStackComparisonCards'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import { getComparisonTableData, getAllComparisonValues } from '~/lib/sanity.queries'
import ComparisonCardsSection from '~/components/revamp/components/ComparisonCardsSection'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import SectionHeaderV2 from '~/components/revamp/components/common/sectionHeaderV2'
import Section from '~/components/structure/Section'
import Container from '~/components/structure/Container'
import AboutCoachingPartners from '~/components/revamp/components/common/AboutCoachingPartners'
import FooterBottom from '~/components/revamp/components/common/FooterBottom'

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
  comparisonTableData: any
  comparisonLegendData: any[] | null
}

export default function TestShakir({ pageData, region, comparisonTableData, comparisonLegendData }: TestShakirProps) {

  // console.log(pageData)
  // Add error boundary and validation
  // if (!pageData?.['inner-hero']?.componentData) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
  //         <p className="text-gray-600">The requested page content is not available.</p>
  //       </div>
  //     </div>
  //   )
  // }

  // Create comparison section data (same structure as homepage)
  const comparisonSectionData = {
    strip: 'The Best-in-Class Phone System. For the Best-in-Class Dental Practices.',
    header: 'No other phone system can match VoiceStack\'s AI-driven features,outcome-driven workflows and integration capabilities, as shown in the comparison chart below. ',
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }

  return (
    <>
    {pageData['about-coach-partners']?.componentData && (
      <AboutCoachingPartners data={pageData['about-coach-partners']?.componentData} />
    )}
    <FooterBottom/>
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
