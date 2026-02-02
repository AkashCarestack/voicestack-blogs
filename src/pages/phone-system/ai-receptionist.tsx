import { GetStaticProps } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'

import FaqSection from '~/components/revamp/components/common/faqSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { getAllComparisonValues, getFeaturesList } from '~/lib/sanity.queries'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import FeatureTestimonialsSection from '~/v2/sections/FeatureTestimonialsSection'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import OfferSection from '~/v2/sections/OfferSection'
import SiteComparisonSection from '~/v2/sections/SiteComparisonSection'
import StackCardTestimonial from '~/v2/sections/stackCardTestimonialSection'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import VerticalTestimonialListing from '~/v2/sections/verticalTestimonialSection'
import ReceptionistTeamSection from '~/v2/sections/ReceptionistTeamSection'

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

interface AiReceptionistProps {
  pageData: any,
  region: string
  comparisonTableData: any
  comparisonLegendData: any[] | null
  faq: any
  features: any[]
}

export default function AiReceptionist({
  pageData,
  region,
  comparisonLegendData,
  faq,
  features,
}: AiReceptionistProps) {
  console.log("ppp",pageData)

  const comparisonTableComponent = pageData['comparison-table']?.componentData
  const comparisonTableData = comparisonTableComponent?.comparisonTable

  // const comparisonTableTitle = pageData['comparison-table']?.componentData
  const comparisonSectionData = {
    strip: comparisonTableComponent?.title,
    header: comparisonTableComponent?.description,
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }

  return (
    <>
      <SimpleHead data={pageData?.seo} />

      {pageData['dental-phones-hero']?.componentData && (
        <FeatureHero data={pageData['dental-phones-hero']} type="feature" hideBg={region === 'en-AU' ? true : false} isVertical={region === 'en-AU' ? true : false} isCentered={region === 'en-AU' ? true : false} />
      )}

      {pageData['list-items'] && (
        <GroupedCardsGridSection sectionSpacing='py-0' sectionBorder='none'
          data={pageData['list-items']?.componentData}
        />
      )}

      {pageData['feature-testimonials-section-single']?.componentData && (() => {
        const componentData = pageData['feature-testimonials-section-single']?.componentData
        const transformedData = {
          ...componentData,
          items: componentData?.testimonial 
            ? [{
                _key: componentData.testimonial._id || 'single-testimonial',
                testimonial: componentData.testimonial
              }]
            : componentData?.items || []
        }
        return (
          <FeatureTestimonialsSection
            data={transformedData}
          />
        )
      })()}

      {pageData['receptionist-team']?.componentData && (
        <ReceptionistTeamSection
          data={pageData['receptionist-team']?.componentData}
        />
      )}

      <CategoryFeatureTabsSection
        features={
          pageData['groups-and-dso']?.componentData?.refData
            ?.tabsListingComponent
        }
        sectionHeading={
          pageData['groups-and-dso']?.componentData?.refData
            ?.tabsListingComponent
        }
        isGridListing={true}
      />


      {pageData['offer']?.componentData && (
        <OfferSection data={pageData['offer']?.componentData} variant='compact' />
      )}

      {comparisonTableData && (
        <SiteComparisonSection
          data={comparisonSectionData}
          legendData={comparisonLegendData || []}
        />
      )}

      {/* {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
        />
      )} */}



      {faq && <FaqSection faqItems={faq} />}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const queries = new Queries('ai-receptionist', region)
    const slug =
      region === 'en' ? 'ai-receptionist' : `ai-receptionist-${region.toLowerCase()}`
    const pageData = await queries.getPageData('dentalPhones', slug)
    const client = getClient()

    if (!pageData) {
      return {
        notFound: true,
      }
    }

    const comparisonLegendData = (await getAllComparisonValues()) || []
    // Ensure FAQ data is serializable
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null
    // Fetch features data for CategoryFeatureTabs
    const features = await getFeaturesList(client, region)

    return {
      props: {
        pageData,
        region,
        comparisonLegendData,
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
