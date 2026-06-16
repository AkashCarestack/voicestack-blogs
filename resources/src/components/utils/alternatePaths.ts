import siteConfig from '~/resources-config/siteConfig'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import {
  generateHref,
  getResourcesSiteOrigin,
  sanitizeUrl,
} from '~/resources/utils/common'

/**
 * Paths that are available for all locales
 * Add paths here that should have alternate language versions across all locales
 */
export const PATHS_AVAILABLE_FOR_ALL_LOCALES = [
  'article',
  'case-study',
  'ebook',
  'podcast',
  'webinar',
  'press-release',
  'testimonial',
  'browse',
  'topic',
  'about',
]

/**
 * Locales that are restricted to root pages only
 * These locales will not have child pages (like /article/slug, /case-study/slug, etc.)
 */
export const LOCALES_WITHOUT_CHILD_PAGES: string[] = []

/**
 * Interface for alternate path data
 */
export interface AlternatePath {
  href: string
  hrefLang: string
}

/**
 * Formats locale code for hreflang attribute
 * Matches the sitemap formatHreflang function
 */
export function formatHreflang(locale: string): string {
  const localeMap: { [key: string]: string } = {
    'en-US': 'en-US',
    'en-GB': 'en-GB',
    'en-AU': 'en-AU',
    'EN-US': 'en-US',
    'EN-GB': 'en-GB',
    'EN-AU': 'en-AU',
    'en': 'en-US',
    '': 'en-US'
  };
  return localeMap[locale] || 'en-US';
}

/**
 * Removes locale and /resources prefix from pathname for hreflang generation.
 * Examples:
 * - '/en-GB/resources/article/slug' -> '/article/slug'
 * - '/resources/article/slug' -> '/article/slug'
 * - '/resources/en-GB/article/slug' -> '/article/slug' (legacy)
 * - '/en-GB/resources' -> '/'
 * - '/resources' -> '/'
 */
export function removeLocale(pathname: string, locales: string[]): string {
  if (!pathname || pathname === '/') {
    return '/'
  }

  const localeResourcesMatch = pathname.match(/^\/(en-[A-Z]{2})\/resources(\/.*)?$/)
  if (localeResourcesMatch) {
    const rest = localeResourcesMatch[2] || ''
    return rest || '/'
  }

  const resourcesLocaleMatch = pathname.match(/^\/resources\/(en(?:-[A-Z]{2})?)(\/.*)?$/)
  if (resourcesLocaleMatch) {
    const rest = resourcesLocaleMatch[2] || ''
    return rest || '/'
  }

  const resourcesOnlyMatch = pathname.match(/^\/resources(\/.*)?$/)
  if (resourcesOnlyMatch) {
    const rest = resourcesOnlyMatch[1] || ''
    return rest || '/'
  }

  const basePath = pathname.replace(/^\/(en-[A-Z]{2}\/)?/, '')
  return basePath ? `/${basePath}` : '/'
}

/**
 * Builds URL for a given locale and path using generateHref (same as sitemap)
 * Examples:
 * - buildUrl('en', '/article/slug', baseUrl) -> 'https://example.com/resources/article/slug'
 * - buildUrl('en-GB', '/article/slug', baseUrl) -> 'https://example.com/en-GB/resources/article/slug'
 * - buildUrl('en-AU', '/', baseUrl) -> 'https://example.com/en-AU/resources'
 */
export function buildUrl(
  locale: string,
  path: string,
  baseUrl: string
): string {
  // Remove leading slash from path for generateHref
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const href = generateHref(locale, cleanPath)
  return `${baseUrl}${href}`
}

/**
 * Gets the base URL for the application
 * Uses window.location.origin in browser, falls back to env var or production URL
 */
export function getBaseUrl(): string {
  return getResourcesSiteOrigin()
}

/**
 * Checks if a path should be available for a specific locale
 */
function isPathAvailableForLocale(
  path: string,
  locale: string,
  locales: string[]
): boolean {
  // Root path is always available
  if (path === '/') {
    return true
  }

  // Check if locale is restricted to root pages only
  if (LOCALES_WITHOUT_CHILD_PAGES.includes(locale)) {
    return false
  }

  // Extract the first segment of the path (content type)
  const pathSegments = path.split('/').filter(Boolean)
  if (pathSegments.length === 0) {
    return true
  }

  const contentType = pathSegments[0]

  // Check if this content type is available for all locales
  return PATHS_AVAILABLE_FOR_ALL_LOCALES.includes(contentType)
}

/**
 * Builds the resources region-switch target URL — always the locale landing page.
 */
export function getResourcesRegionHref(
  targetLocale: string,
  _router?: Pick<NextRouter, 'asPath' | 'pathname' | 'query'>,
): string {
  return generateHref(targetLocale, '')
}

/**
 * Hook to generate alternate language paths for SEO hreflang tags
 * 
 * @returns Object containing alternatePaths array and defaultUrl for x-default
 */
/** Stable path for hreflang (works during SSR / before router.isReady when asPath is set). */
export function pathnameForAlternateTags(
  router: Pick<NextRouter, 'asPath' | 'pathname' | 'query'>,
): string {
  const fromAsPath = router.asPath?.split('?')[0]?.split('#')[0]
  if (fromAsPath && fromAsPath.length > 0) return fromAsPath

  let path = router.pathname || '/'
  const q = router.query || {}
  for (const key of Object.keys(q)) {
    const val = q[key]
    const v = Array.isArray(val) ? val[0] : val
    if (typeof v === 'string' && path.includes(`[${key}]`)) {
      path = path.replace(`[${key}]`, v)
    }
  }
  return path || '/'
}

/**
 * Build hreflang alternates + x-default target URL (same logic as sitemap / SEOHead).
 * Call from SSR or client with the real pathname (e.g. /en-AU/article/my-slug).
 */
export function buildAlternatePathData(
  pathname: string,
  baseUrl: string,
): { alternatePaths: AlternatePath[]; defaultUrl: string } {
  const locales = siteConfig.locales || []
  const normalizedPath = pathname.split('?')[0].split('#')[0] || '/'
  const basePath = removeLocale(normalizedPath, locales)
  const origin = baseUrl.replace(/\/$/, '')
  const alternates: AlternatePath[] = []

  for (const locale of locales) {
    if (!isPathAvailableForLocale(basePath, locale, locales)) {
      continue
    }

    const pathWithoutSlash = basePath.startsWith('/') ? basePath.slice(1) : basePath
    const href = generateHref(locale, pathWithoutSlash)
    const url = sanitizeUrl(`${origin}${href}`)
    const hrefLang = formatHreflang(locale)

    alternates.push({
      href: url,
      hrefLang,
    })
  }

  const defaultPathWithoutSlash = basePath.startsWith('/') ? basePath.slice(1) : basePath
  const defaultHref = generateHref('en', defaultPathWithoutSlash)
  const defaultUrl = sanitizeUrl(`${origin}${defaultHref}`)

  return { alternatePaths: alternates, defaultUrl }
}

export function useAlternatePaths(): {
  alternatePaths: AlternatePath[]
  defaultUrl: string
} {
  const router = useRouter()
  const baseUrl = getBaseUrl()

  const pathname = useMemo(() => pathnameForAlternateTags(router), [router])

  return useMemo(
    () => buildAlternatePathData(pathname, baseUrl),
    [pathname, baseUrl],
  )
}

