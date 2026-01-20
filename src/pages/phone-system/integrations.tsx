import { GetStaticProps } from 'next'
import React from 'react'

import SimpleHead from '~/components/common/SimpleHead'
import IntegrationsSectionWithNavigation from '~/v2/sections/IntegrationsSectionWithNavigation'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import Queries from '~/components/revamp/queries'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import LogoListingV2 from '~/v2/sections/LogoListingV2'

// Define proper TypeScript interfaces
interface HeroComponentData {
  title?: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  [key: string]: any // For flexibility with dynamic data
}

interface IntegrationCategory {
  _id: string
  name: string
  subheading?: string
  description?: string
  mainImage?: any
  icon?: any
  iconSvgCode?: string
  language: string
}

interface IntegrationList {
  _id: string
  title: string
  headline: string
  description?: any
  shortDescription?: string
  image?: any
  link?: string
  integrationCategory?: IntegrationCategory
  language: string
  order?: number
}

interface IntegrationData {
  categories: IntegrationCategory[]
  integrations: IntegrationList[]
}

interface PageData {
  'integrations-hero': {
    componentData: HeroComponentData
  }
  'integrations-grid'?: {
    componentData: any
  }
  [key: string]: any // For other page sections
}

interface DentalPhonesIntegrationsProps {
  pageData: PageData
  region: string
  faq: any
}

export default function DentalPhonesIntegrations({
  pageData,
  region,
  faq,
}: DentalPhonesIntegrationsProps) {
  // Extract integration data from pageData instead of separate query
  const integrationData = React.useMemo(() => {
    // Check both paths: v2 pages use 'integrations-listing', non-v2 use 'custom'
    const v2Data = pageData['integrations-listing']?.componentData
    const customData = pageData['custom']?.componentData
    
    // Try v2 path first, then fallback to custom path
    const integrationListing = v2Data?.refData?.integrationListing || customData?.refData?.integrationListing
    
    if (!integrationListing?.integrationList) {
      return null
    }

    const integrations = integrationListing.integrationList

    // Sort integrations by order field (ascending), with items without order at the end
    const sortedIntegrations = [...integrations].sort((a: any, b: any) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })

    // Group integrations by category
    const categoriesMap = new Map()
    const groupedIntegrations = sortedIntegrations.reduce(
      (acc: any, integration: any) => {
        if (integration.integrationCategory) {
          const categoryId = integration.integrationCategory._id
          const categoryName = integration.integrationCategory.name

          // Add category to map if not already present
          if (!categoriesMap.has(categoryId)) {
            categoriesMap.set(categoryId, {
              _id: categoryId,
              name: categoryName,
              subheading: integration.integrationCategory.subheading,
              description: integration.integrationCategory.description,
              mainImage: integration.integrationCategory.mainImage,
              icon: integration.integrationCategory.icon,
              iconSvgCode: integration.integrationCategory.iconSvgCode,
              language: integration.integrationCategory.language,
            })
          }

          if (!acc[categoryId]) {
            acc[categoryId] = []
          }
          acc[categoryId].push(integration)
        }
        return acc
      },
      {},
    )

    return {
      categories: Array.from(categoriesMap.values()),
      integrations: sortedIntegrations,
    }
  }, [pageData])

  return pageData?.slug?.includes('v2') ? (
    <>
    <SimpleHead data={pageData?.seo} />
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      {pageData['integrations-hero']?.componentData && (
        <FeatureHero data={pageData['integrations-hero']} type="feature" />
      )}
      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
      )}
      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
        />
      )}
      {integrationData && (
        <div>
          <IntegrationsSectionWithNavigation
            categories={integrationData.categories}
            integrations={integrationData.integrations}
          />
        </div>
      )}
         {faq && <FaqSection faqItems={faq} />}
    </>
  ) : (
    <>
      <SimpleHead data={pageData?.seo} />

      <HeroWrapper>
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        <HeroSection
          page=""
          data={pageData['dental-phones-hero']?.componentData}
        />
      </HeroWrapper>

      {pageData['custom']?.componentData && (
        <div className="">
          <IntegrationsGrid
            showIntegrationBtn={false}
            data={pageData['custom']?.componentData}
          />
        </div>
      )}
      {integrationData && (
        <div>
          <IntegrationsSectionWithNavigation
            categories={integrationData.categories}
            integrations={integrationData.integrations}
          />
        </div>
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
  try {
    const region = locale || 'en'
    const queries = new Queries('integrations-v2', region)
    const slug =
      region === 'en'
        ? 'integrations-v2'
        : `integrations-v2-${region.toLowerCase()}`

    // Fetch page data for integrations
    const pageData = await queries.getPageData('dentalPhones', slug)
    pageData.slug = slug

    const noPageData = Object.values(pageData).every(
      (value) => value === null || value === undefined,
    )

    if (noPageData) {
      return {
        notFound: true,
      }
    }

    // Ensure FAQ data is serializable
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    return {
      props: {
        pageData,
        region,
        faq: faqData,
      },
    }
  } catch (error) {
    console.error('Error fetching integrations page data:', error)
    return {
      notFound: true,
    }
  }
}
