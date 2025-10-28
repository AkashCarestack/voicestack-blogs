import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { whoWeServeQueries } from '~/lib/sanity.queries'
import { urlForImage } from '~/lib/sanity.image'
import SimpleHead from '~/components/common/SimpleHead'
import Layout from '~/components/Layout'
import DynamicComponentRenderer from '~/components/dynamic/DynamicComponentRenderer'
import Queries from '~/components/revamp/queries'
import TabCardsListing from '~/components/revamp/components/common/TabListing/tabCardsListing'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import CardsGridSection from '~/components/revamp/components/CardsGridSection'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import CardListing from '~/components/revamp/components/cardListing'

interface WhoWeServeIndexProps {
  pageData: any
  region: string
  comparisonTableData: any
  comparisonLegendData: any[] | null
}

export default function WhoWeServeIndex({
  pageData,
}: WhoWeServeIndexProps) {
  return (
    <>
      <HeroSection
        page=""
        data={pageData['dental-phones-hero']?.componentData}
      />

      {pageData['how-voicestack-works']?.componentData && (
        <CardsGridSection 
          data={pageData['how-voicestack-works'].componentData}
        />
      )}
      {
        pageData['real-business-outcomes']?.componentData && (
           <CardListing data={ pageData['real-business-outcomes']?.componentData.refData.tabsListingComponent}/>
        )
      }
     
      {pageData['integrations-listing']?.componentData && (
        <div className="mt-12">
          <IntegrationsGrid data={pageData['integrations-listing']?.componentData} />
        </div>
      )}

      <StatisticsSection />
     
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    // Get all pages
    const queries = new Queries('landing', region)
    const slug = region === 'en' ? 'landing' : `landing-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug) 

    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        pageData: pageData,
        region: region,
      },
    }
  } catch (error) {
    console.error('Error fetching Who We Serve pages:', error)
    return {
      props: {
        pageData: [],
      },
    }
  }
}
