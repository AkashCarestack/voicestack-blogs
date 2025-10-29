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
import FaqSection from '~/components/revamp/components/common/faqSection'
import LogoListingSection from '~/components/LogoListingSection'
import CardListing from '~/components/revamp/components/cardListing'

interface WhoWeServeIndexProps {
  pageData: any
  region: string
  comparisonTableData: any
  comparisonLegendData: any[] | null
  faq: any
}

export default function WhoWeServeIndex({
  pageData,
  region,
  comparisonTableData,
  comparisonLegendData,
  faq,
}: WhoWeServeIndexProps) {
  return (
    <>
     { pageData['dental-phones-hero']?.componentData &&  <HeroSection
        page=""
        data={pageData['dental-phones-hero']?.componentData}
      />
     }

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
      {pageData['logo-listing']?.componentData && (
        <LogoListingSection data={pageData['logo-listing']?.componentData?.blocksListingData} header={true}/>
      )}

      {/* FAQ Section */}
      {faq && (
         <div>
           <FaqSection faqItems={faq} />
         </div>
       )}
     
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
    // Ensure FAQ data is serializable
    const faqData = pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        pageData: pageData,
        region: region,
        faq: faqData
      },
    }
  } catch (error) {
    console.error('Error fetching Who We Serve pages:', error)
    return {
      props: {
        pageData: [],
        faq: null
      },
    }
  }
}
