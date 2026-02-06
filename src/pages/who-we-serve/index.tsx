import { GetStaticProps } from 'next'

import SimpleHead from '~/components/common/SimpleHead'
import LogoListingSection from '~/components/LogoListingSection'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import CardListing from '~/components/revamp/components/cardListing'
import CardsGridSection from '~/v2/sections/CardsGridSection'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import HoverTestimonial from '~/components/revamp/components/common/HoverTestimonial/HoverTestimonial'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import Queries from '~/components/revamp/queries'
import FeatureHero from '~/v2/sections/FeatureHero'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import StackCardTestimonial from '~/v2/sections/stackCardTestimonialSection'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import features from '../phone-system/features'
import { getFeaturesList } from '~/lib/sanity.queries'
import { getClient } from '~/lib/sanity.client'

interface WhoWeServeIndexProps {
  pageData: any
  region: string
  comparisonTableData: any
  comparisonLegendData: any[] | null
  faq: any
  features: any[]
}

export default function WhoWeServeIndex({
  pageData,
  region,
  comparisonTableData,
  comparisonLegendData,
  faq,
  features,
}: WhoWeServeIndexProps) {
  console.log(pageData, 'fffffffff')

  return pageData?.slug?.includes('v2') ? (
    <>
    {pageData?.seo && <SimpleHead data={pageData?.seo} />}
      {pageData['dental-phones-hero']?.componentData && (
        <FeatureHero
          data={pageData['dental-phones-hero']?.componentData}
          type="feature"
        />
      )}

      {pageData['logo-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logo-listing']?.componentData.blocksListingData}
        />
      )}

      {pageData['why-dentists-to-voicestack']?.componentData && (
        <GroupedCardsGridSection
          data={pageData['why-dentists-to-voicestack']?.componentData}
        />
      )}

      {pageData['how-voicestack-works']?.componentData && (
        <GroupedCardsGridSection
          data={pageData['how-voicestack-works']?.componentData}
        />
      )}

      {pageData['power-of-ai'] && (
        <GroupedCardsGridSection
          data={pageData['power-of-ai']?.componentData}
          theme="dark"
          aiSection={true}
          sectionBorder="b"
        />
      )}

      {pageData['stack-card-tab-testimonial'] && pageData['stack-card-tab-testimonial']?.componentData?.refData ? (
        <StackCardTestimonial
          data={
            pageData['stack-card-tab-testimonial']?.componentData?.refData
              ?.tabsListingComponent
          }
        />
      ) : (
        <StackCardTestimonial
          data={pageData['stack-card-tab-testimonial']?.componentData}
        />
      )}

      {pageData['category-feature-tabs']?.componentData && (
        <CategoryFeatureTabsSection
          features={features}
          variant="carousel"
          sectionHeading={pageData['category-feature-tabs']?.componentData?.sectionHeading}
        />
      )}

      <StatisticsSection />
      
      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
        />
      )}

    {faq && (
        <div>
          <FaqSection faqItems={faq} />
        </div>
      )}
    </>
  ) : (
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
       {pageData['test-listing-3']?.componentData && (
        <CardsGridSection variant="V2" colCount={3}
          data={pageData['test-listing-3'].componentData}
        />
      )}
      
      {pageData['test-listing-3']?.componentData && (
        <GroupedCardsGridSection
          data={pageData['test-listing-3']?.componentData}
          theme="dark"
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
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'
  const client = getClient()
  try {
    // Get all pages
    const queries = new Queries('landing-v2', region)
    const slug =
      region === 'en' ? 'landing-v2' : `landing-v2-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)
    pageData.slug = slug
    // Ensure FAQ data is serializable
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    if (!pageData) {
      return {
        notFound: true,
      }
    }

    const features = await getFeaturesList(client, region)

    return {
      props: {
        pageData: pageData,
        region: region,
        faq: faqData,
        features: features || [],
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
