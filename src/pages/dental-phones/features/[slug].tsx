import groq from 'groq'
import { GetStaticPaths,GetStaticProps } from 'next'
import React from 'react'
import CallFlowAnalyticsSection from '~/components/revamp/components/callFlowAnalyticsSection'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'

import FeatureTestimonialsSection from '~/components/revamp/components/common/FeatureTestimonialsSection'
import FeatureHero from '~/components/revamp/components/common/HeroSection/featureHero'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import IntegrationsShowcaseSection from '~/components/revamp/components/common/IntegrationsShowcaseSection'
import Queries from '~/components/revamp/queries'
import Section from '~/components/structure/Section'
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
  return (
    <>
       <Breadcrumb  className=' !max-w-[1372px] md:block hidden' />
      <FeatureHero data={pageData[slug]} />
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
    </>
  )
}

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
      }
    })

    return {
      paths,
      fallback: 'blocking',
    }
  } catch (error) {
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
    const client = getClient()
    const featureQuery = groq`
      *[_type == "features" && basicInfo.slug.current == $slug && !(_id in path("drafts.**"))] | order(language asc) [0] {
        language
      }
    `
    const feature = await client.fetch(featureQuery, { slug })
    const featureLanguage = feature?.language || region || 'en'
    const queries = new Queries('features', featureLanguage)
    const pageData = await queries.getPageData('features', slug)
    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

    const rawQuery = groq`
      *[_type == "features" && basicInfo.slug.current == $slug && language == $language][0] {
        content {
          sections[] {
            "slug": slug.current
          }
        }
      }
    `
    const rawData = await client.fetch(rawQuery, {
      slug,
      language: featureLanguage,
    })

    const sectionsOrder =
      rawData?.content?.sections?.map((section: any) => section.slug) || []

    const pageDataWithOrder = {
      ...pageData,
      sectionsOrder,
    }

    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    return {
      props: {
        pageData: pageDataWithOrder || null,
        region: featureLanguage,
        faq: faqData,
        slug: slug,
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
