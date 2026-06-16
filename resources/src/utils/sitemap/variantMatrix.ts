import { formatHreflang } from '~/resources/components/utils/alternatePaths'
import { buildResourcesAbsoluteUrl } from '~/resources/utils/common'
import {
  isLocaleNeutralContentType,
  shouldExpandAllLocales,
} from '~/resources/utils/sitemap/contentTypeRegistry'
import type {
  HreflangKey,
  SiteLocale,
  SitemapUrlCandidate,
} from '~/resources/utils/sitemap/types'

export function createEmptyVariantMatrix(): Partial<Record<HreflangKey, string>> {
  return { 'en-US': '', 'en-GB': '', 'en-AU': '' }
}

export function assignLocaleVariant(
  variants: Partial<Record<HreflangKey, string>>,
  locale: SiteLocale,
  url: string,
): void {
  variants[formatHreflang(locale) as HreflangKey] = url
}

export function assignAllLocaleVariants(
  variants: Partial<Record<HreflangKey, string>>,
  path: string,
  locales: readonly SiteLocale[],
): void {
  locales.forEach((locale) => {
    assignLocaleVariant(
      variants,
      locale,
      buildResourcesAbsoluteUrl(locale, path),
    )
  })
}

export function expandVariantsForContentType(
  candidate: SitemapUrlCandidate,
  path: string,
  locales: readonly SiteLocale[],
): void {
  const contentType = candidate.contentType ?? ''

  if (isLocaleNeutralContentType(contentType)) {
    assignLocaleVariant(
      candidate.variants,
      'en',
      buildResourcesAbsoluteUrl('en', path),
    )
    candidate.localeNeutral = true
    return
  }

  if (shouldExpandAllLocales(contentType)) {
    assignAllLocaleVariants(candidate.variants, path, locales)
  }
}

export function resolveLocaleUrlFromMatrix(
  candidate: SitemapUrlCandidate,
  locale: SiteLocale,
): string | null {
  const hreflang = formatHreflang(locale) as HreflangKey
  const variant = candidate.variants[hreflang]
  if (variant) return variant

  if (candidate.localeNeutral && locale === 'en') {
    return candidate.variants['en-US'] || null
  }

  return null
}

export function buildAlternateLinks(
  variants: Partial<Record<HreflangKey, string>>,
  fallbackLoc: string,
): Array<{ hreflang: HreflangKey | 'x-default'; href: string }> {
  const alternates: Array<{ hreflang: HreflangKey | 'x-default'; href: string }> =
    []

  ;(['en-US', 'en-GB', 'en-AU'] as const).forEach((hreflang) => {
    const href = variants[hreflang]
    if (href) alternates.push({ hreflang, href })
  })

  const xDefault =
    variants['en-US'] || variants['en-GB'] || variants['en-AU'] || fallbackLoc
  alternates.push({ hreflang: 'x-default', href: xDefault })

  return alternates
}
