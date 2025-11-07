import React from 'react'
import { GetStaticProps } from 'next'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import FeaturesSectionWithNavigation from '~/components/FeaturesSectionWithNavigation'
import FaqSection from '~/components/revamp/components/common/faqSection'
import Queries from '~/components/revamp/queries'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'

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
    const customData = pageData['custom']?.componentData
    if (!customData?.refData?.integrationListing?.integrationList) {
      return null
    }

    const integrations = customData.refData.integrationListing.integrationList

    // Group integrations by category
    const categoriesMap = new Map()
    const groupedIntegrations = integrations.reduce(
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
      integrations: integrations,
    }
  }, [pageData])

  console.log('pageDataDentalPhonesIntegrations', pageData)
  return (
    <>
      <div
        className="py-12"
        style={{
          background:
            'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
        }}
      >
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        <HeroSection
          page=""
          data={pageData['dental-phones-hero']?.componentData}
        />
      </div>
      {integrationData && (
        <div>
          <FeaturesSectionWithNavigation
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
    const queries = new Queries('integrations', region)
    const slug =
      region === 'en' ? 'integrations' : `integrations-${region.toLowerCase()}`

    // Fetch page data for integrations
    const pageData = await queries.getPageData('dentalPhones', slug)

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
