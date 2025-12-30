import groq from 'groq'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'

import LogoListingV2 from '~/components/LogoListingV2'
import CallFlowAnalyticsSection from '~/v2/components/CallFlowAnalyticsSection'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import CardWIthGraph from '~/components/revamp/components/common/cardWIthGraph'
import FaqSection from '~/components/revamp/components/common/faqSection'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import FeatureHero from '~/v2/sections/FeatureHero'
import FeatureTestimonialsSection from '~/v2/sections/FeatureTestimonialsSection'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'

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
  console.log(pageData['card-with-image'],'pageData FeaturePage')
  return (
    <>
      {/* <div className='!max-w-[1240px] w-full m-auto !px-0'> */}
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      {/* </div> */}
      <FeatureHero data={pageData['feature-hero']} type="feature" />

      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
      )}

      {pageData['the-missing-visibility']?.componentData && (
        <GroupedCardsGridSection
          data={pageData['the-missing-visibility']?.componentData}
        />
      )}
      {pageData['feature-testimonials-section1']?.componentData && (
        <FeatureTestimonialsSection
          data={pageData['feature-testimonials-section1']?.componentData}
        />
      )}
      {pageData['card-with-image'] && (
                <GroupedCardsGridSection data={pageData['card-with-image']?.genericListingComponent} />
              )}

      <CallFlowAnalyticsSection
        data={pageData['call-flow-analytics']?.componentData}
      />
      {pageData['benefits-of-healthcare']?.componentData && (
        <GroupedCardsGridSection
          data={pageData['benefits-of-healthcare']?.componentData}
          theme="dark"
        />
      )}

      {pageData['integrations-listing']?.componentData && (
          <IntegrationsShowcaseSection
            data={pageData['integrations-listing']?.componentData}
              theme="dark"
          />
      )}
      {pageData['feature-testimonials-section']?.componentData && (
        <FeatureTestimonialsSection
          data={pageData['feature-testimonials-section']?.componentData}
        />
      )}
      <CardWIthGraph
        data={pageData['better-decisions']?.genericListingComponent}
      />
      {faq && <FaqSection faqItems={faq} />}
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async ({
  locales,
  defaultLocale,
}) => {
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
    const uniqueSlugs = [
      ...new Set(features.map((feature: any) => feature.slug).filter(Boolean)),
    ]

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
      },
    }
  } catch (error) {
    console.error('Error fetching Feature page:', error)
    return {
      notFound: true,
    }
  }
}
