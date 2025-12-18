import { GetStaticProps, GetStaticPaths } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import FaqSection from '~/components/revamp/components/common/faqSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import groq from 'groq'
import { getComponentBySlug, FEATURE_SLUG_COMPONENTS } from '~/config/featureSlugComponents'
import CallFlowAnalyticsSection from '~/components/revamp/components/callFlowAnalyticsSection'

interface FeaturePageProps {
  pageData: any
  faq: any
  region: string
}


const renderComponentBySlug = (sectionSlug: string, pageData: any) => {
  const Component = getComponentBySlug(sectionSlug)
  
  if (!Component) {
    console.log(`No component configured for slug: ${sectionSlug}`)
    return null
  }

  const sectionData = pageData[sectionSlug]
  
  if (!sectionData) {
    console.log(`No data found for slug: ${sectionSlug}`)
    return null
  }

  // Extract the exact component data based on componentType
  const componentType = sectionData?.componentType
  let componentData = null

  // Map componentType to the actual data field
  if (componentType === 'FeatureBenefit' && sectionData?.featureBenefitComponent) {
    componentData = sectionData.featureBenefitComponent
  } else if (componentType === 'FeatureCategory' && sectionData?.featureCategoryComponent) {
    componentData = sectionData.featureCategoryComponent
  } else if (componentType === 'TabsListing' && sectionData?.tabsListingComponent) {
    componentData = sectionData.tabsListingComponent
    // Handle refData if it exists
    if (componentData?.refData) {
      componentData = componentData.refData.tabsListingComponent || componentData.refData
    }
  } else if (componentType === 'Custom' && sectionData?.customComponent) {
    componentData = sectionData.customComponent
  } else if (componentType === 'GenericListing' && sectionData?.genericListingComponent) {
    componentData = sectionData.genericListingComponent
  } else if (sectionData?.componentData) {
    componentData = sectionData.componentData
  } else {
    componentData = sectionData
  }

  // Pass clean data with componentData field
  const dataToPass = {
    componentData: componentData
  }

  return (
    <Component
      key={sectionSlug}
      data={dataToPass}
    />
  )
}

export default function FeaturePage({ pageData, faq, region }: FeaturePageProps) {

  if (!pageData) {
    return <div>Page not found</div>
  }

  const sectionsOrder = pageData.sectionsOrder || []
  const metadataKeys = ['faqData', 'faqReferenced', 'title', 'description', 'breadCrumb', 'seo', 'icon', 'sectionsOrder']
  
  const sectionSlugs = sectionsOrder.length > 0 
    ? sectionsOrder 
    : Object.keys(pageData).filter((key) => !metadataKeys.includes(key))

  return (
    <>
      <SimpleHead data={pageData?.seo} />
      
      {pageData?.breadCrumb && (
        <HeroWrapper>
          <Breadcrumb breadCrumb={pageData.breadCrumb} />
        </HeroWrapper>
      )}

      {sectionSlugs.map((sectionSlug) => {
        return renderComponentBySlug(sectionSlug, pageData)
      })}
      {faq && <FaqSection faqItems={faq} />}
    </>
  )
}

// Get all feature slugs for static generation
export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient()

  const query = groq`
    *[_type == "features" && defined(basicInfo.slug.current) && !(_id in path("drafts.**"))] {
      "slug": basicInfo.slug.current,
      language
    }
  `

  try {
    const features = await client.fetch(query)
    const paths = features.map((feature: any) => {
      const slug = feature.slug
      return {
        params: { slug },
        locale: 'en', // Always use 'en' for Next.js routing
      }
    })

    return {
      paths,
      fallback: 'blocking', // Enable ISR for new features
    }
  } catch (error) {
    console.error('Error fetching feature slugs:', error)
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

// Get feature data by slug
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const region = locale || 'en'
  const slug = params?.slug as string

  if (!slug) {
    return {
      notFound: true,
    }
  }

  try {
    const client = getClient()
    const featureQuery = groq`
      *[_type == "features" && basicInfo.slug.current == $slug && !(_id in path("drafts.**"))] | order(language asc) [0] {
        language
      }
    `
    const feature = await client.fetch(featureQuery, { slug })
    
    console.log('Feature language query result:', feature)
    
    // Use the feature's actual language, or fall back to region/locale
    // This handles en-GB, en-AU, etc. properly
    const featureLanguage = feature?.language || region || 'en'
    
    console.log('Feature language:', featureLanguage)
    
    // Create queries instance with the feature's actual language
    const queries = new Queries('features', featureLanguage)
    
    // Get page data using Queries.getPageData with the feature's actual language
    // The type should be 'features' to match the schema
    const pageData = await queries.getPageData('features', slug)

    console.log('Page data from getPageData:', JSON.stringify(pageData, null, 2))

    if (!pageData || Object.keys(pageData).length === 0) {
      console.error(`Page data not found for feature slug: ${slug}`)
      return {
        notFound: true,
      }
    }

    // Get the original sections array to preserve order
    // We need to fetch the raw data to get sections in order
    const rawQuery = groq`
      *[_type == "features" && basicInfo.slug.current == $slug && language == $language][0] {
        content {
          sections[] {
            "slug": slug.current
          }
        }
      }
    `
    const rawData = await client.fetch(rawQuery, { slug, language: featureLanguage })
    
    console.log('Raw data for sections order:', JSON.stringify(rawData, null, 2))
    
    // Extract section slugs in order
    const sectionsOrder = rawData?.content?.sections?.map((section: any) => section.slug) || []
    
    console.log('Sections order:', sectionsOrder)
    
    // Add sectionsOrder to pageData so we can map in correct order
    const pageDataWithOrder = {
      ...pageData,
      sectionsOrder,
    }

    // Get FAQ data
    const faqData = pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    console.log('FAQ data:', faqData)
    console.log('Final pageDataWithOrder keys:', Object.keys(pageDataWithOrder))
    console.log('=== getStaticProps - Complete ===')

    return {
      props: {
        pageData: pageDataWithOrder || null,
        region: featureLanguage, // Use the feature's actual language
        faq: faqData,
      },
      revalidate: 60, // Revalidate every 60 seconds for ISR
    }
  } catch (error) {
    console.error('Error fetching feature page:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return {
      notFound: true,
    }
  }
}
