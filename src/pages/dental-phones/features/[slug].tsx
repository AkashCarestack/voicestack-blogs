import groq from 'groq'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'

import LogoListingV2 from '~/v2/sections/LogoListingV2'
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
import SimpleHead from '~/components/common/SimpleHead'

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
  return (
    <>
      <SimpleHead
        data={pageData?.seo}
      />
      {/* <div className='!max-w-[1240px] w-full m-auto !px-0'> */}
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      {/* </div> */}

      {pageData['feature-hero']?.componentData && (
        <FeatureHero data={pageData['feature-hero']?.componentData} type="feature" />
      )}

      {/* {console.log(pageData['logos-listing']?.componentData, 'LogoListing component Dtaat')} */}
      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
      )}

      {pageData['the-missing-visibility']?.componentData && (
        <GroupedCardsGridSection
        data={pageData['the-missing-visibility']?.componentData}
        sectionBorder="b"
        />
      )}
      {pageData['card-with-image'] && (
        <GroupedCardsGridSection data={pageData['card-with-image']?.genericListingComponent} sectionBorder="b" />
      )}
     
      {pageData['feature-testimonials-section-single']?.componentData && (
        <FeatureTestimonialsSection
          data={pageData['feature-testimonials-section-single']?.componentData}
        />
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
      {pageData['better-decisions']?.genericListingComponent && (
        <CardWIthGraph
          data={pageData['better-decisions']?.genericListingComponent}
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
      fallback: 'blocking', // Only serve pre-generated pages (if false). New pages will 404 until rebuild (webhook handles revalidation)
    }
  } catch (error) {
    console.error('Error fetching feature paths:', error)
    return {
      paths: [],
      fallback: 'blocking', // Only serve pre-generated pages(if false). New pages will 404 until rebuild (webhook handles revalidation)
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const region = locale || 'en'
  const slug = params?.slug as string

  // dental-phones pages support 'en-AU' and 'en-GB' locales
  if (region !== 'en-AU' && region !== 'en-GB') {
    return {
      notFound: true,
    }
  }

  // console.log(slug, 'slug', params, 'params', locale, 'locale')

  if (!slug) {
    return {
      notFound: true,
    }
  }

  try {
    const queries = new Queries('features', region)
    const pageData = await queries.getPageData('features', slug)
    // console.log(pageData, 'pageData')

    if (!pageData) {
      console.error(`pageData is empty (all null) for ${slug}`)
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
