import { GetStaticProps } from 'next'

import SimpleHead from '~/components/common/SimpleHead'
import LogoListingSection from '~/components/LogoListingSection'
import CardListing from '~/components/revamp/components/cardListing'
import CardsGridSection from '~/components/revamp/components/CardsGridSection'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import HoverTestimonial from '~/components/revamp/components/common/HoverTestimonial/HoverTestimonial'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import Queries from '~/components/revamp/queries'

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
      <SimpleHead data={pageData?.seo} />
      
      <HeroWrapper>
        <HeroSection
          page=""
          data={pageData['dental-phones-hero']?.componentData}
        />
      </HeroWrapper>

      {pageData['how-voicestack-works']?.componentData && (
        <CardsGridSection
          customText="Curious if VoiceStack fits your practice"
          data={pageData['how-voicestack-works'].componentData}
        />
      )}
      {pageData['real-business-outcomes']?.componentData && (
        <CardListing
          data={
            pageData['real-business-outcomes']?.componentData.refData
              .tabsListingComponent
          }
        />
      )}
      {pageData['hover-card-change-testimonial']?.componentData && (
        <HoverTestimonial
          data={pageData['hover-card-change-testimonial']?.componentData}
        />
      )}
      {pageData['integrations-listing']?.componentData && (
        <div className="mt-12">
          <IntegrationsGrid
            data={pageData['integrations-listing']?.componentData}
          />
        </div>
      )}

      <StatisticsSection />
      {pageData['logo-listing']?.componentData && (
        <LogoListingSection
          data={pageData['logo-listing']?.componentData?.blocksListingData}
          header={true}
        />
      )}

      {/* FAQ Section */}
      {/* {faq && (
        <div>
          <FaqSection faqItems={faq} />
        </div>
      )} */}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    // Get all pages
    const queries = new Queries('landing-v2', region)
    const slug = region === 'en' ? 'landing-v2' : `landing-v2-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)
    console.log(JSON.stringify(pageData),'pageData Who We Serve');
    // Ensure FAQ data is serializable
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        pageData: pageData,
        region: region,
        faq: faqData,
      },
    }
  } catch (error) {
    console.error('Error fetching Who We Serve pages:', error)
    return {
      props: {
        pageData: [],
        faq: null,
      },
    }
  }
}
