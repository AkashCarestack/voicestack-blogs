import React from 'react'
import { useRouter } from 'next/router'

import Anchor from '~/components/common/anchor'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

export interface RelatedFeature {
  _id?: string
  basicInfo?: {
    title?: string
    slug?: { current?: string } | string
    description?: string
  }
}

function getFeatureSlug(feature: RelatedFeature): string {
  const slug = feature?.basicInfo?.slug
  if (!slug) return ''
  if (typeof slug === 'string') return slug
  return slug.current || ''
}

function getFeatureHref(slug: string, locale?: string | null): string {
  if (!slug) return '#'
  const base =
    locale === 'en-AU' || locale === 'en-GB' ? '/dental-phones' : '/phone-system'
  return `${base}/features/${slug}`
}

interface RelatedFeaturesSectionProps {
  features?: RelatedFeature[]
  heading?: string
}

export default function RelatedFeaturesSection({
  features = [],
  heading = 'Related Features',
}: RelatedFeaturesSectionProps) {
  const router = useRouter()

  if (!features.length) return null

  return (
    <Section className="bg-gray-50" border="t">
      <Container className="py-12 md:py-16">
        <h2 className="font-geist text-2xl md:text-3xl font-medium text-gray-950 mb-8">
          {heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => {
            const slug = getFeatureSlug(feature)
            const title = feature?.basicInfo?.title || ''
            const description = feature?.basicInfo?.description || ''

            return (
              <Anchor
                key={feature._id || slug}
                href={getFeatureHref(slug, router.locale)}
                className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-5 hover:border-vs-blue/40 hover:shadow-sm transition-all duration-200 h-full"
              >
                <span className="font-geist text-base font-medium text-gray-950">
                  {title}
                </span>
                {description && (
                  <span className="font-geist text-sm text-gray-600 line-clamp-3">
                    {description}
                  </span>
                )}
              </Anchor>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
