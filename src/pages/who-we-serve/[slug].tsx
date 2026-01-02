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
import { getFeaturesList } from '~/lib/sanity.queries'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import FeatureTestimonialsSection from '~/v2/sections/FeatureTestimonialsSection'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'

interface Feature {
  _id: string
  title: string
  slug: {
    current: string
  }
  language: string
  order?: number
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: any
  mainImage?: any
  shortDescription?: any
  featureCategory?: {
    name: string
    description?: string
    icon?: any
  }
}

interface WhoWeServePageProps {
  pageData: any
  faq: any
  region: string
  slug: string
  features: Feature[]
}

export default function WhoWeServePage({
  pageData,
  faq,
  region,
  slug,
  features,
}: WhoWeServePageProps) {
  if (!pageData) {
    return null
  }

  return (
    <>
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      <FeatureHero data={pageData['veterinary-hero'] || pageData['feature-hero']} type="feature" />

      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
      )}

      {pageData['card-with-image'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image']?.genericListingComponent}
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
      {/* //pass the prop scrollcarousel for sscrollcarousel layout */}
      {(
        <CategoryFeatureTabsSection
          features={pageData['message-solution']?.componentData}
          variant="scrollcarousel"
          sectionHeading={pageData['category-feature-tabs']?.componentData?.sectionHeading}
          singleCard={true}
        />
      )}
      {/* //pass the prop singleCard for single card layout */}
      {(
        <CategoryFeatureTabsSection
          features={pageData['message-solution']?.componentData}
          variant="singlecard"
          sectionHeading={pageData['category-feature-tabs']?.componentData?.sectionHeading}
          singleCard={true}
        />
      )}
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

    // Get all unique whoWeServe slugs (without drafts)
    const whoWeServeQuery = groq`
      *[_type == "whoWeServe" && !(_id in path("drafts.**")) && defined(basicInfo.slug.current)] {
        "slug": basicInfo.slug.current
      }
    `
    const whoWeServePages = await client.fetch(whoWeServeQuery)

    // Get unique slugs (in case there are duplicates across languages)
    const uniqueSlugs = [
      ...new Set(whoWeServePages.map((page: any) => page.slug).filter(Boolean)),
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
    console.error('Error fetching whoWeServe paths:', error)
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
    const queries = new Queries('whoWeServe', region)
    const pageData = await queries.getPageData('whoWeServe', slug)
    const features = await getFeaturesList(getClient(), region)

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
        features: features || [],
      },
    }
  } catch (error) {
    console.error('Error fetching Who We Serve page:', error)
    return {
      notFound: true,
    }
  }
}
