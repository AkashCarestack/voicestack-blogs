import groq from 'groq'

import { GetStaticPaths, GetStaticProps } from 'next'

import React from 'react'

import Queries from '~/components/revamp/queries'

import { getClient } from '~/lib/sanity.client'

import SimpleHead from '~/components/common/SimpleHead'

import LpHeader from '~/components/common/LpHeader'

import FeatureHero from '~/v2/sections/FeatureHero'

import LogoListingV2 from '~/v2/sections/LogoListingV2'

import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'

import StatisticsSection from '~/v2/sections/StatisticsSection'

import OfferSection from '~/v2/sections/OfferSection'

import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'

import { getFeaturesList } from '~/lib/sanity.queries'

import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'

import VerticalTestimonialListing from '~/v2/sections/verticalTestimonialSection'

interface PartnerSlugPageProps {
  pageData: any

  region: string

  slug: string

  features: any[]
}

export default function PartnerSlugPage({
  pageData,

  region,

  slug,

  features,
}: PartnerSlugPageProps) {
  const heroData = pageData['partner-hero']?.componentData
  

  return (
    <>
      <SimpleHead data={pageData?.seo} />

      {/* <LpHeader logo={heroData?.heroImageSecondary?.url}/> */}
      {heroData?.heroStrip && heroData?.heroStrip !== '' && (
        <LpHeader logoText={heroData?.heroStrip?.toUpperCase()}/>
      )}
      {/* <LpHeader logoText={heroData?.heroStrip?.toUpperCase() || 'VoiceStack'}/> */}

      {/* <Breadcrumb breadCrumb={pageData?.breadCrumb} /> */}

      {heroData && (
        <>
          <FeatureHero data={heroData} type="partner" />
        </>
      )}

      {pageData['logo-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logo-listing']?.componentData.blocksListingData}
        />
      )}

      {pageData['offer']?.componentData && (
        <OfferSection data={pageData['offer']?.componentData} />
      )}

      {features && features.length > 0 && pageData['category-feature-tabs'] && (
        <CategoryFeatureTabsSection
        {...(slug === 'vetcelerator' && { category: 'Veterinarians' })}
          features={features}
          variant="carousel"
          customType="partner"
          sectionHeading={
            pageData['category-feature-tabs']?.componentData?.sectionHeading
          }
        />
      )}

      {pageData['power-of-ai'] && (
        <GroupedCardsGridSection
          data={pageData['power-of-ai']?.componentData}
          theme="dark"
          aiSection={true}
        />
      )}

      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
          sectionBorder="b"
          demoOnly={true}
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

      <StatisticsSection {...(slug === 'vetcelerator' && { category: 'Veterinarians' })} />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async ({
  locales,

  defaultLocale,
}) => {
  try {
    const client = getClient()

    // Get all unique partner slugs (without drafts)

    const partnersQuery = groq`

      *[_type == "partner" && !(_id in path("drafts.**"))] {

        "slug": basicInfo.slug.current

      }

    `

    const partners = await client.fetch(partnersQuery)

    // Get unique slugs (in case there are duplicates across languages)
    // Exclude static pages that have their own files (e.g., empower-emr.tsx)
    const excludedSlugs = ['empower-emr']

    const uniqueSlugs = [
      ...new Set(partners.map((partner: any) => partner.slug).filter(Boolean)),
    ].filter((slug: string) => !excludedSlugs.includes(slug))

    // Format paths for Next.js

    const paths = uniqueSlugs.map((slug: string) => ({
      params: { slug },
    }))

    return {
      paths,

      fallback: 'blocking', // Only serve pre-generated pages(if false). New pages will 404 until rebuild (webhook handles revalidation)
    }
  } catch (error) {
    console.error('Error fetching partner paths:', error)

    return {
      paths: [],

      fallback: 'blocking', // Only serve pre-generated pages(if false). New pages will 404 until rebuild (webhook handles revalidation)
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
    const queries = new Queries('partner', region)

    const pageData = await queries.getPageData('partner', slug)

    // Check if pageData has any content sections (excluding metadata)

    const metadataKeys = [
      'faqData',
      'faqReferenced',
      'title',
      'description',
      'breadCrumb',
      'seo',
      'icon',
    ]

    // const hasContent = pageData && Object.keys(pageData).some(key =>

    //   !metadataKeys.includes(key) && pageData[key] !== null && pageData[key] !== undefined

    // )

    if (!pageData) {
      console.error(`pageData is empty (all null) for ${slug}`)

      return {
        notFound: true,
      }
    }

    const features = await getFeaturesList(getClient(), region)

    return {
      props: {
        pageData,

        region: region,

        slug: slug,

        features: features || [],
      },
    }
  } catch (error) {
    console.error('Error fetching Partner page:', error)

    return {
      notFound: true,
    }
  }
}
