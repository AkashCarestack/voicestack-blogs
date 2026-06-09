import groq from 'groq'
import type { GetStaticPaths, GetStaticProps } from 'next'

import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { getFeaturesList } from '~/lib/sanity.queries'

export const PHONE_SYSTEM_LOCALES = ['en'] as const
export const DENTAL_PHONES_LOCALES = ['en-AU', 'en-GB'] as const

export function getFeatureBasePath(locale?: string | null): string {
  if (locale === 'en-AU' || locale === 'en-GB') return '/dental-phones/features'
  return '/phone-system/features'
}

export const featureStaticPaths: GetStaticPaths = async () => {
  try {
    const client = getClient()

    const featuresQuery = groq`
      *[_type == "features" && !(_id in path("drafts.**"))] {
        "slug": basicInfo.slug.current
      }
    `
    const features = await client.fetch(featuresQuery)

    const uniqueSlugs = [
      ...new Set(features.map((feature: any) => feature.slug).filter(Boolean)),
    ]

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

export function createFeatureStaticProps(
  allowedLocales: string[],
): GetStaticProps {
  return async ({ params, locale }) => {
    const region = locale || 'en'
    const slug = params?.slug as string

    if (!allowedLocales.includes(region)) {
      return { notFound: true }
    }

    if (!slug) {
      return { notFound: true }
    }

    try {
      const queries = new Queries('features', region)
      const pageData = await queries.getPageData('features', slug)
      const features = await getFeaturesList(getClient(), region)

      if (!pageData) {
        console.error(`pageData is empty (all null) for ${slug}`)
        return { notFound: true }
      }

      const faqData =
        pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

      return {
        props: {
          features: features || [],
          pageData: pageData || null,
          region,
          faq: faqData,
          slug,
        },
      }
    } catch (error) {
      console.error('Error fetching Feature page:', error)
      return { notFound: true }
    }
  }
}
