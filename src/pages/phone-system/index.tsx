import { GetStaticProps } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'

import FaqSection from '~/components/revamp/components/common/faqSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { getFeaturesList } from '~/lib/sanity.queries'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import StackCardTestimonial from '~/v2/sections/stackCardTestimonialSection'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import VerticalTestimonialListing from '~/v2/sections/verticalTestimonialSection'

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
  faq: any
  features: any[]
}

export default function DentalPhonesIndex({
  pageData,
  region,
  comparisonTableData,
  comparisonLegendData,
  faq,
  features,
}: DentalPhonesIndexProps) {
  // console.log("ppp",pageData)
  return (
    <>
      <SimpleHead data={pageData?.seo} />
      {pageData['dental-phones-hero']?.componentData && (
        <FeatureHero data={pageData['dental-phones-hero']} type="feature" />
      )}

      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
      )}
      {pageData['stack-card-tab-testimonial']?.componentData?.refData ? (
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
        <CategoryFeatureTabsSection
        features={features}
        variant="carousel"
        sectionHeading={
          pageData['category-feature-tabs']?.componentData?.sectionHeading
        }
      />
      {pageData['card-with-image'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image']?.componentData}
        />
      )}

      {pageData['how-voicestack-works'] && (
        <GroupedCardsGridSection
          data={pageData['how-voicestack-works']?.componentData}
        />
      )}
      {pageData['testimonial-video-section']?.componentData?.refData
        ?.testimonialListing && (
        <VerticalTestimonialListing
          data={
            pageData['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
        />
      )}
      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
        />
      )}
      <StatisticsSection  />

      {faq && <FaqSection faqItems={faq} />}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const queries = new Queries('landing-v2', region)
    const slug =
      region === 'en' ? 'landing-v2' : `landing-v2-${region.toLowerCase()}`

    const pageData = await queries.getPageData('dentalPhones', slug)
    const client = getClient()

    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

    // Ensure FAQ data is serializable
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null
    // Fetch features data for CategoryFeatureTabs
    const features = await getFeaturesList(client, region)

    return {
      props: {
        pageData,
        region,
        faq: faqData,
        features: features || [],
      },
    }
  } catch (error) {
    console.error('Error fetching page data:', error)
    return {
      notFound: true,
    }
  }
}
