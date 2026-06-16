import siteConfig from '~/resources-config/siteConfig'

import type { SiteLocale } from '~/resources/utils/sitemap/types'

const LOCALE_SEGMENT_PATTERNS: ReadonlyArray<{
  locale: SiteLocale
  pattern: RegExp
}> = [
  { locale: 'en-GB', pattern: /\/en-GB(?:\/|$)/ },
  { locale: 'en-AU', pattern: /\/en-AU(?:\/|$)/ },
]

export function inferSiteLocaleFromAbsoluteUrl(url: string): SiteLocale {
  for (const { locale, pattern } of LOCALE_SEGMENT_PATTERNS) {
    if (pattern.test(url)) return locale
  }
  return 'en'
}

export function buildResourcesContentPath(
  contentType: string,
  slug: string,
): string {
  if (contentType === 'browse') {
    return `${siteConfig.paginationBaseUrls.base}/${slug}`
  }
  if (contentType === 'topic') {
    return `${siteConfig.categoryBaseUrls.base}/${slug}`
  }
  return `${contentType}/${slug}`
}

export function formatSitemapLastmod(
  date: string | undefined,
): string | undefined {
  if (!date) return undefined
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return undefined
  return dateObj.toISOString()
}

export function mergeLastmod(
  existing: string | undefined,
  incoming: string | undefined,
): string | undefined {
  if (!incoming) return existing
  if (!existing || incoming > existing) return incoming
  return existing
}
