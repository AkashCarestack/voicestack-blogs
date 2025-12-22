import groq from 'groq'
import { GetStaticPaths,GetStaticProps } from 'next'
import React from 'react'
import LogoListingV2 from '~/components/LogoListingV2'
import CallFlowAnalyticsSection from '~/components/revamp/components/callFlowAnalyticsSection'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import CardWIthGraph from '~/components/revamp/components/common/cardWIthGraph'
import FaqSection from '~/components/revamp/components/common/faqSection'

import FeatureTestimonialsSection from '~/components/revamp/components/common/FeatureTestimonialsSection'
import FeatureHero from '~/components/revamp/components/common/HeroSection/FeatureHero'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import IntegrationsShowcaseSection from '~/components/revamp/components/common/IntegrationsShowcaseSection'
import GroupedCardsGridSection from '~/components/revamp/components/GroupedCardsGridSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'

interface FeaturePageProps {
  pageData: any
  faq: any
  region: string
  slug: string
}

export default function FeaturePage({
  pageData,
  faq,
  region,
  slug,
}: FeaturePageProps) {
  console.log(pageData,'pageData')
  console.log('multi listing data', pageData['the-missing-visibility']);
  
  return (
    <>
       <Breadcrumb  className=' !max-w-[1372px] md:block hidden' />
      <FeatureHero data={pageData[slug]} />

      {pageData['logos-listing']?.componentData && (
        <LogoListingV2 data={pageData['logos-listing']?.componentData.blocksListingData} />
      )}

      {pageData['the-missing-visibility']?.componentData && (
        <GroupedCardsGridSection data={pageData['the-missing-visibility']?.componentData} />
      )}

      {pageData['integrations-listing']?.componentData && (
        <div className="mt-12">
          <IntegrationsShowcaseSection
            data={pageData['integrations-listing']?.componentData}
          />
        </div>
      )}
      {pageData['feature-testimonials-section']?.componentData && (
        <FeatureTestimonialsSection data={pageData['feature-testimonials-section']?.componentData} />
      )}
      <CallFlowAnalyticsSection data={pageData['call-flow-analytics']?.componentData} />
      <CardWIthGraph data={pageData['better-decisions']?.genericListingComponent} />
      {faq && <FaqSection faqItems={faq} />}
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales, defaultLocale }) => {
  try {
    const client = getClient()
    
    // Get all unique feature slugs (without drafts)
    const featuresQuery = groq`
      *[_type == "features" && !(_id in path("drafts.**"))] {
        "slug": basicInfo.slug.current
      }
    `
    const features = await client.fetch(featuresQuery)
    
    // Get unique slugs (in case there are duplicates across languages)
    const uniqueSlugs = [...new Set(features.map((feature: any) => feature.slug).filter(Boolean))]
    
    // Format paths for Next.js
    const paths = uniqueSlugs.map((slug: string) => ({
      params: { slug },
    }))

    return {
      paths,
      fallback: 'blocking',
    }
  } catch (error) {
    console.error('Error fetching feature paths:', error)
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const region = locale || 'en'
  const slug = params?.slug as string

  if (!slug) {
    return {
      notFound: true,
    }
  }

  try {
    const queries = new Queries('features', region)
    const pageData = await queries.getPageData('features', slug)
    if (!pageData) {
      console.error(`pageData not found for ${slug}`)
      return {
        notFound: true,
      }
    }

    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    return {
      props: {
        pageData: pageData || null,
        region: region,
        faq: faqData,
        slug: slug,
      }
    }
  } catch (error) {
    console.error('Error fetching Feature page:', error)
    return {
      notFound: true,
    }
  }
}
