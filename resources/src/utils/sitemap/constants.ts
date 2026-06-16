import siteConfig from '~/resources-config/siteConfig'

import type { HreflangKey, SiteLocale } from '~/resources/utils/sitemap/types'

export const HREFLANG_KEYS: readonly HreflangKey[] = [
  'en-US',
  'en-GB',
  'en-AU',
] as const

export const SITE_LOCALES: readonly SiteLocale[] = siteConfig.locales as SiteLocale[]

export const SITEMAP_LOCALE_ORDER: readonly SiteLocale[] = [
  'en',
  'en-GB',
  'en-AU',
] as const

export const SITEMAP_LOCALE_LABELS: Record<SiteLocale, string> = {
  en: 'en-US (Default)',
  'en-GB': 'en-GB (United Kingdom)',
  'en-AU': 'en-AU (Australia)',
}

export const HUB_PATHS: readonly string[] = [
  siteConfig.pageURLs.article,
  siteConfig.pageURLs.caseStudy,
  siteConfig.pageURLs.ebook,
  siteConfig.pageURLs.podcast,
  siteConfig.pageURLs.webinar,
  siteConfig.pageURLs.pressRelease,
  siteConfig.paginationBaseUrls.base,
  siteConfig.categoryBaseUrls.base,
]

export const PAGINATED_SECTIONS: readonly string[] = [
  siteConfig.pageURLs.article,
  siteConfig.pageURLs.caseStudy,
  siteConfig.pageURLs.ebook,
  siteConfig.pageURLs.podcast,
  siteConfig.pageURLs.webinar,
  siteConfig.pageURLs.pressRelease,
  siteConfig.paginationBaseUrls.base,
  siteConfig.categoryBaseUrls.base,
] as const

export const SITEMAP_URLSET_HEADER =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
