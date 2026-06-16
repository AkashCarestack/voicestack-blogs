import siteConfig from '~/resources-config/siteConfig'

import type { ContentTypePolicy, VariantExpansionPolicy } from '~/resources/utils/sitemap/types'

const POST_DETAIL_TYPES = [
  'article',
  'case-study',
  'ebook',
  'podcast',
  'webinar',
  'press-release',
  'testimonial',
] as const

const HUB_SECTION_TYPES = [
  siteConfig.pageURLs.article,
  siteConfig.pageURLs.caseStudy,
  siteConfig.pageURLs.ebook,
  siteConfig.pageURLs.podcast,
  siteConfig.pageURLs.webinar,
  siteConfig.pageURLs.pressRelease,
  siteConfig.paginationBaseUrls.base,
  siteConfig.categoryBaseUrls.base,
] as const

function policy(
  contentType: string,
  expansion: VariantExpansionPolicy,
  options: Partial<Pick<ContentTypePolicy, 'countsForPagination' | 'isHubSection'>> = {},
): ContentTypePolicy {
  return {
    contentType,
    expansion,
    countsForPagination: options.countsForPagination ?? false,
    isHubSection: options.isHubSection ?? false,
  }
}

const REGISTRY: Record<string, ContentTypePolicy> = {
  author: policy('author', 'default-only'),
  browse: policy('browse', 'all-locales', {
    countsForPagination: false,
    isHubSection: true,
  }),
  topic: policy('topic', 'all-locales', {
    countsForPagination: false,
    isHubSection: true,
  }),
}

POST_DETAIL_TYPES.forEach((type) => {
  REGISTRY[type] = policy(type, 'all-locales', { countsForPagination: true })
})

HUB_SECTION_TYPES.forEach((path) => {
  if (!REGISTRY[path]) {
    REGISTRY[path] = policy(path, 'all-locales', { isHubSection: true })
  }
})

export function getContentTypePolicy(contentType: string): ContentTypePolicy {
  return (
    REGISTRY[contentType] ?? {
      contentType,
      expansion: 'none',
      countsForPagination: false,
      isHubSection: false,
    }
  )
}

export function isPostDetailContentType(contentType: string): boolean {
  return getContentTypePolicy(contentType).countsForPagination
}

export function shouldExpandAllLocales(contentType: string): boolean {
  return getContentTypePolicy(contentType).expansion === 'all-locales'
}

export function isLocaleNeutralContentType(contentType: string): boolean {
  return getContentTypePolicy(contentType).expansion === 'default-only'
}
