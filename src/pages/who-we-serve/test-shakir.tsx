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
import SwitchableTabsV2 from '~/v2/sections/SwitchableTabsV2'

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
  if (!pageData) {
    return null
  }

  // Create comparison section data (same structure as homepage)
  const comparisonSectionData = {
    strip: 'The Best-in-Class Phone System. For the Best-in-Class Dental Practices.',
    header: 'No other phone system can match VoiceStack\'s AI-driven features,outcome-driven workflows and integration capabilities, as shown in the comparison chart below. ',
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }
  const tabListingData = pageData['mobile-practice-v2-generic']?.componentData
  return (
    <>
      {pageData['inner-hero']?.componentData && (
        <HeroSection 
          page="inner" 
          data={pageData['inner-hero'].componentData}
        />
      )}

      {pageData['test-listing-2']?.componentData && (
        <CardsGridSection variant="V2" type="col-3"
          data={pageData['test-listing-2'].componentData}
        />
      )}
      { <SwitchableTabsV2 data={tabListingData} showTabs={false} />}
      {/* {
       
        tabListingData && (<TabCardsListing data={tabListingData} />)
      } */}

      {pageData['test-listing-3']?.componentData && (
        <CardsGridSection variant="V2" type="col-2" bottomSpace={true}
          data={pageData['test-listing-3'].componentData}
        />
      )}
      <StatisticsSection variant="V2" />
      
      {pageData['how-voicestack-works']?.componentData && (
        <CardsGridSection 
          data={pageData['how-voicestack-works'].componentData}
        />
      )}


      

      {pageData['how-voicestack-works2']?.componentData && (
        <CardsGridSection 
          data={pageData['how-voicestack-works2'].componentData}
        />
      )}

      <Section className='bg-[#ffffff]' border="b">
        <Container className='w-full py-sm md:py-md lg:py-lg' type="V2" border="y-0" innerPadding>
          <div className="flex-col relative w-full flex gap-16">
            <SectionHeaderV2 className='xl:px-12 md:px-6 px-4'
              heading={pageData['how-voicestack-works2']?.componentData?.sectionHeadingDynamic || ''}
              // heading={pageData['how-voicestack-works2']?.componentData?.heading}
              description={"lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."}
            />

            <div>
              test content
            </div>
          </div>
        </Container>
      </Section>

      {pageData['integrations-listing']?.componentData && (
        <div className="mt-12">
          <IntegrationsGrid data={pageData['integrations-listing']?.componentData} />
        </div>
      )}
      
      {/* VoiceStack Comparison Cards Section */}
      {pageData['comparison-cards']?.componentData && (
        <ComparisonCardsSection data={pageData['comparison-cards'].componentData}/>
      )}
      
      {pageData['comparison-table']?.componentData && (
        <SiteComparisonSection 
          data={comparisonSectionData} 
          legendData={comparisonLegendData || []}
        />
      )}

      <StatisticsSection />
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const queries = new Queries('test-shakir', region)
    const slug = region === 'en' ? 'test-shakir' : `test-shakir-${region.toLowerCase()}`
    
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
