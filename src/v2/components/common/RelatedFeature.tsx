import React, { useMemo } from 'react'
import GroupedCardsGrid from '../GroupedCardsGrid'
import Container from '~/components/structure/Container'
import SectionHeaderV2 from './sectionHeaderV2'
import { getFeatureBasePath } from '~/lib/featurePage'

const DEFAULT_ICON_SVG =
  '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 8V16L21.3333 18.6667" stroke="#6A7282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.3334 16.0002C29.3334 13.4199 28.5847 10.8951 27.1781 8.73199C25.7716 6.56885 23.7676 4.86028 21.4093 3.81351C19.0509 2.76674 16.4395 2.42674 13.8917 2.83475C11.3439 3.24276 8.96929 4.38124 7.05575 6.11212C5.14221 7.84301 3.772 10.0919 3.11129 12.5861C2.45058 15.0803 2.52777 17.7127 3.33348 20.1639C4.1392 22.6151 5.63883 24.7798 7.6505 26.3956C9.66217 28.0114 12.0995 29.0088 14.6667 29.2668" stroke="#6A7282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.3334 21.3335L22.0001 28.6668L18.6667 25.3335" stroke="#030712" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

function getDescriptionText(description: unknown): string {
  if (!description) return ''
  if (typeof description === 'string') return description
  if (Array.isArray(description)) {
    return description
      .map((block: any) => {
        if (block._type === 'block' && block.children) {
          return block.children.map((child: any) => child.text || '').join('')
        }
        return ''
      })
      .filter(Boolean)
      .join(' ')
      .trim()
  }
  return ''
}

function mapFeatureToCard(item: any, basePath: string) {
  const featureSlug = item.basicInfo?.slug?.current || item.slug?.current
  const iconSvg =
    item.basicInfo?.dynamicSvg ||
    item.dynamicSvg ||
    (item.basicInfo?.icon as any)?.iconSvgCode ||
    (item.icon as any)?.iconSvgCode ||
    DEFAULT_ICON_SVG

  return {
    heading: item.basicInfo?.title || item.title || 'Untitled Feature',
    description:
      getDescriptionText(item.basicInfo?.description) ||
      getDescriptionText(item.description) ||
      item.subheading ||
      '',
    dynamicSvg: iconSvg,
    image: item.mainImage || null,
    link: featureSlug
      ? {
          buttonType: 'text',
          text: null,
          url: `${basePath}/${featureSlug}`.replace(/\/+/g, '/'),
        }
      : undefined,
  }
}

interface RelatedFeatureProps {
  data: any[]
  currentSlug?: string
  basePath?: string
}

export default function RelatedFeature({
  data,
  currentSlug,
  basePath,
}: RelatedFeatureProps) {
  const resolvedBasePath = basePath || getFeatureBasePath()

  const listingItems = useMemo(() => {
    if (!data?.length) return []

    return data
      .filter((item) => {
        const itemSlug = item.basicInfo?.slug?.current || item.slug?.current
        return !currentSlug || itemSlug !== currentSlug
      })
      .map((item) => mapFeatureToCard(item, resolvedBasePath))
  }, [data, currentSlug, resolvedBasePath])
  const colCount = useMemo(() => {
    if (listingItems?.length % 3 === 0) return 3
    if (listingItems?.length % 4 === 0) return 4
    return 3
  }, [listingItems?.length])

  if (!listingItems.length) return null

  return (
    <Container className="lg:py-md md:py-xs flex-col gap-16" type="V2" border="b-0">
      <SectionHeaderV2 className="text-center md:pb-16 pt-8 md:pt-0" heading="Related Features" />
      <GroupedCardsGrid
        customListingItems={listingItems}
        simpleListingData={true}
        columnCount={colCount}
        showBorderBottom={true}
      />
    </Container>
  )
}
