import siteConfig from '~/resources-config/siteConfig'
import type { NextRouter } from 'next/router'

import { stripTrackingParams } from '~/resources/integration/stripTrackingParams'
import { Post } from '~/resources/interfaces/post'
import post from '~/resources/schemas/post'
import { average, prominent } from '~/resources/utils/color'

const COUNTRY_FLAG_PATHS = {
  en: '/resources/assets/countryFlags/EN-usa.png',
  'en-GB': '/resources/assets/countryFlags/EN-GB.png',
  'en-AU': '/resources/assets/countryFlags/EN-AU.png',
} as const


export const fetchAuthor = (post) => {
  let authorData: any = []
  post &&
    post.authorInfo &&
    post.authorInfo.content.body
      .filter((block: any) => block.component === 'authorBioSection')
      .map((author: any) => (authorData = author.author))
  return authorData
}

export function rgbToHsl(r, g, b) {
  ;(r /= 255), (g /= 255), (b /= 255)

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  var h,
    s,
    l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  // return [ h, 40, 40 ];

  return `hsl(${h * 360},50%,40%)`
  // return `hsl(${h*100},40%,40%)`
}

export function getRelatedFeatures(
  currentPost: Post,
  allPosts: Post[],
): Post[] {
  const currentTags = new Set(currentPost.tags?.map((tag) => tag.tagName) || [])
  const relatedPosts = allPosts
    .filter((post) => post._id !== currentPost._id)
    .map((post) => ({
      post,
      relevance: (
        post.tags?.filter((tag) => currentTags.has(tag.tagName)) || []
      ).length,
    }))
    ?.sort((a, b) => {
      if (b.relevance !== a.relevance) {
        return b.relevance - a.relevance
      }
      return (
        new Date(b.post._createdAt).getTime() -
        new Date(a.post._createdAt).getTime()
      )
    })
    .map((item) => item.post)

  const uniqueRelatedPosts = Array.from(
    new Set(relatedPosts.map((post) => post._id)),
  )
    .map((_id) => relatedPosts.find((post) => post._id === _id))
    .filter((post): post is Post => post !== undefined)
    .slice(0, 2)

  return uniqueRelatedPosts
}

export const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1) + 's'
}

export const getUniqueReorderedCarouselItems = (
  homeSettings,
  ebooks,
  webinars,
) => {
  if (!homeSettings?.featuredCarouselItems || !ebooks || !webinars) return []
  const carouselItems = [
    ...homeSettings?.featuredCarouselItems,
    ...ebooks,
    ...webinars,
  ]

  const uniqueCarouselItems = carouselItems.reduce((acc, item) => {
    if (
      !acc.some(
        (existingItem) => existingItem.slug.current === item.slug.current,
      )
    ) {
      acc.push(item)
    }
    return acc
  }, [])

  return [
    ...(homeSettings?.featuredCarouselItems || []),
    ...uniqueCarouselItems.filter(
      (item) =>
        !homeSettings?.featuredCarouselItems.some(
          (homeItem) => homeItem.slug.current === item.slug.current,
        ),
    ),
  ]
}

export const mergeReviews = (
  homeSettingsReviews = [],
  otherReviews = [],
  uniqueKey = '_id',
) => {
  const seen = new Set()
  const result = []
  if (homeSettingsReviews && homeSettingsReviews.length > 0) {
    result.push(...homeSettingsReviews)
    homeSettingsReviews.forEach((review) => seen.add(review[uniqueKey]))
  }
  otherReviews.forEach((review) => {
    if (!seen.has(review[uniqueKey])) {
      seen.add(review[uniqueKey])
      result.push(review)
    }
  })

  return result
}

export const mergeAndRemoveDuplicates = (
  primaryArray,
  secondaryArray = [],
  uniqueKey = '_id',
) => {
  if (!primaryArray || !secondaryArray) return []

  const seen = new Set()
  const result = []

  if (!Array.isArray(primaryArray)) {
    if (primaryArray[uniqueKey] && !seen.has(primaryArray[uniqueKey])) {
      seen.add(primaryArray[uniqueKey])
      result.push(primaryArray)
    }
  } else {
    primaryArray.forEach((item) => {
      if (item && !seen.has(item[uniqueKey]) && result.length < 5) {
        seen.add(item[uniqueKey])
        result.push(item)
      }
    })
  }

  secondaryArray.forEach((item) => {
    if (item && !seen.has(item[uniqueKey]) && result.length < 5) {
      seen.add(item[uniqueKey])
      result.push(item)
    }
  })

  return result
}

export const removeUnwantedCharacters = (path: string) => {
  if (!path) {
    throw new Error('Provide a valid path')
  }
  const excludeCharacters = ['?', '#']
  const cleanPath = excludeCharacters.reduce((acc, character) => {
    return acc.split(character)[0]
  }, path)
  return cleanPath
}

export const getUniqueData = (data) => {
  if (!data) return []
  return data.reduce((acc, current) => {
    if (!acc.find((item) => item._id === current._id)) {
      acc.push(current)
    }
    return acc
  }, [])
}

export function capitalizeFirst(str) {
  const minorWords = ["and", "or", "but", "of", "to", "in", "on", "for", "at", "by", "with", "a", "an", "the","is","if"];
  
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (
        index === 0 || 
        index === str.split(" ").length - 1 || 
        !minorWords.includes(word)
      ) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word; 
    })
    .join(" ");
}

export function slugToCapitalized(slug) {
  if (!slug) return ''
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const normalizePath = (path) => path && path.replace(/\/+/g, '/').replace(/^\//, '/');

/**
 * Maps Sanity/router locale strings onto siteConfig.locales (handles en-gb vs en-GB, en-us → en).
 * Prevents generateHref from dropping the locale prefix when casing or aliases do not match exactly.
 */
export function normalizeSiteLocale(locale: string | undefined | null): string {
  if (locale == null || String(locale).trim() === '') return 'en'

  const raw = String(locale).trim()
  const allowed = siteConfig.locales as string[]
  if (allowed.includes(raw)) return raw

  const lower = raw.toLowerCase().replace(/_/g, '-')
  if (lower === 'en-us' || lower === 'enus') return 'en'

  const hit = allowed.find((l) => l.toLowerCase().replace(/_/g, '-') === lower)
  if (hit) return hit

  return 'en'
}

const REGIONAL_PUBLIC_PATH = /^\/(en-GB|en-AU)\/resources(?:\/|$)/
const REGIONAL_INTERNAL_PATH = /^\/resources\/(en-GB|en-AU)(?:\/|$)/

export function resolveResourcesCmsLocale(options: {
  pageLocale?: string | null
  asPath?: string
  queryLocale?: string | string[] | undefined
  fallbackLocale?: string | null
}): string {
  if (options.pageLocale) return normalizeSiteLocale(options.pageLocale)

  const asPath = (options.asPath || '').split('?')[0].split('#')[0]

  const publicMatch = asPath.match(REGIONAL_PUBLIC_PATH)
  if (publicMatch) return normalizeSiteLocale(publicMatch[1])

  const internalMatch = asPath.match(REGIONAL_INTERNAL_PATH)
  if (internalMatch) return normalizeSiteLocale(internalMatch[1])

  const qLocale = options.queryLocale
  const raw = Array.isArray(qLocale) ? qLocale[0] : qLocale
  if (raw) return normalizeSiteLocale(raw)

  return normalizeSiteLocale(options.fallbackLocale || 'en')
}

/**
 * CMS locale for resources routes. Next.js i18n sets router.locale to "en" after
 * middleware rewrites; regional locale comes from the URL or [locale] segment.
 */
export function getResourcesCmsLocale(
  router: Pick<NextRouter, 'query' | 'asPath'>,
  pageLocale?: string | null,
): string {
  const asPath =
    typeof window !== 'undefined'
      ? window.location.pathname
      : (router.asPath || '')

  return resolveResourcesCmsLocale({
    pageLocale,
    asPath,
    queryLocale: router.query?.locale,
    fallbackLocale: 'en',
  })
}

/** Prefix /resources/... links with regional locale when the current page is regional. */
export function withRegionalResourcesLocale(
  href: string | undefined,
  cmsLocale: string,
): string | undefined {
  if (!href || cmsLocale === 'en') return href
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href
  if (href.startsWith(`/${cmsLocale}${RESOURCES_SITE_BASE}`)) return href

  const pathOnly = href.split('?')[0]
  if (
    pathOnly.startsWith(`${RESOURCES_SITE_BASE}/`) ||
    pathOnly === RESOURCES_SITE_BASE
  ) {
    const rest = pathOnly.slice(RESOURCES_SITE_BASE.length).replace(/^\//, '')
    const query = href.includes('?') ? href.slice(href.indexOf('?')) : ''
    return `${generateHref(cmsLocale, rest)}${query}`
  }

  return href
}

export const RESOURCES_SITE_BASE = '/resources'

/** Content types that always live under /resources/... (no en-GB/en-AU prefix). */
export const RESOURCES_LOCALE_NEUTRAL_PATHS = ['author']

export function isLocaleNeutralResourcesPath(path: string): boolean {
  const segment = path.replace(/^\/+/, '').split('/')[0]
  return RESOURCES_LOCALE_NEUTRAL_PATHS.includes(segment)
}

const MAIN_SITE_PATH_PREFIXES = [
  '/system-requirements',
  '/pricing',
  '/demo',
  '/phone-system',
  '/company',
  '/studio',
  '/search',
  '/login',
  '/download-app',
  '/support',
  '/who-we-serve',
  '/dental-phones',
  '/legal/2025-01',
  '/legal/2024-10',
  '/legal/uk',
  '/legal/aus',
  '/lp',
  '/events',
  '/en-GB',
  '/en-AU',
]

/** Prefix internal resources links with /resources (skips external + main-site paths). */
export function resolveResourcesHref(href?: string | null): string | undefined {
  if (!href) return href ?? undefined
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href
  if (href.startsWith(RESOURCES_SITE_BASE)) return href

  const normalized = href.startsWith('/') ? href : `/${href}`

  if (
    MAIN_SITE_PATH_PREFIXES.some(
      (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
    )
  ) {
    return normalized
  }

  if (normalized === '/') return RESOURCES_SITE_BASE

  if (normalized.startsWith('/legal')) {
    return `${RESOURCES_SITE_BASE}${normalized}`
  }

  return `${RESOURCES_SITE_BASE}${normalized}`
}

export function getResourcesBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL_RESOURCES ||
    'https://resources.voicestack.com'
  )
}

/**
 * Site origin without /resources — generateHref already adds RESOURCES_SITE_BASE.
 * e.g. http://localhost:3003/resources → http://localhost:3003
 */
export function getResourcesSiteOrigin(): string {
  const raw = (
    process.env.NEXT_PUBLIC_BASE_URL_RESOURCES ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '') ||
    'https://voicestack.com'
  )
    .trim()
    .replace(/\/$/, '')

  if (raw.endsWith(RESOURCES_SITE_BASE)) {
    return raw.slice(0, -RESOURCES_SITE_BASE.length)
  }
  return raw
}

/** Absolute public URL for a resources path (canonical, hreflang, OG). */
export function buildResourcesAbsoluteUrl(
  locale: string,
  linkHref: string,
): string {
  const origin = getResourcesSiteOrigin()
  const cleanPath = linkHref.replace(/^\//, '')
  const href = generateHref(locale, cleanPath)
  return sanitizeUrl(`${origin}${href}`)
}

/** Listing or paginated hub URL, e.g. article or article/page/2. */
export function buildResourcesListingUrl(
  locale: string,
  section: string,
  page?: number,
): string {
  const path =
    page && page > 1 ? `${section}/page/${page}` : section
  return buildResourcesAbsoluteUrl(locale, path)
}

/** Resources site home for a locale. */
export function buildResourcesHomeUrl(locale: string): string {
  return buildResourcesAbsoluteUrl(locale, '')
}

/** Locale-neutral path key for sitemap grouping, e.g. article/slug. */
export function resourcesPathKeyFromAbsoluteUrl(url: string): string {
  try {
    let pathname = new URL(url).pathname
    const localeResourcesMatch = pathname.match(/^\/(en-[A-Z]{2})\/resources(\/.*)?$/)
    if (localeResourcesMatch) {
      pathname = localeResourcesMatch[2] || '/'
    } else {
      const resourcesOnlyMatch = pathname.match(/^\/resources(\/.*)?$/)
      if (resourcesOnlyMatch) {
        pathname = resourcesOnlyMatch[1] || '/'
      } else {
        pathname = pathname.replace(/^\/(en-[A-Z]{2}\/)?/, '') || '/'
      }
    }
    return pathname === '/' ? '' : pathname.replace(/^\//, '')
  } catch {
    return url
  }
}

function withResourcesSiteBase(path: string): string {
  if (!path || path === '/') {
    return RESOURCES_SITE_BASE
  }
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (normalized.startsWith(`${RESOURCES_SITE_BASE}/`) || normalized === RESOURCES_SITE_BASE) {
    return normalized
  }
  return `${RESOURCES_SITE_BASE}${normalized}`
}

export function generateHref(locale: any, linkHref: string): string {
  const resolvedLocale = normalizeSiteLocale(locale)
  const isValidHref =
    resolvedLocale &&
    resolvedLocale !== 'en' &&
    siteConfig.locales.includes(resolvedLocale)

  const cleanPath = normalizePath(linkHref).replace(/^\/+/, '')

  if (cleanPath && isLocaleNeutralResourcesPath(cleanPath)) {
    return `${RESOURCES_SITE_BASE}/${cleanPath}`
  }

  if (!cleanPath || cleanPath === '') {
    if (resolvedLocale === 'en' || !isValidHref) {
      return RESOURCES_SITE_BASE
    }
    return `/${resolvedLocale}${RESOURCES_SITE_BASE}`
  }

  if (resolvedLocale === 'en' || !isValidHref) {
    return `${RESOURCES_SITE_BASE}/${cleanPath}`
  }

  return `/${resolvedLocale}${RESOURCES_SITE_BASE}/${cleanPath}`
}

/** Return 404 for missing slugs instead of redirecting to locale home. */
export function getRedirectToHome(locale?: string | null): { notFound: true } {
  void locale
  return { notFound: true }
}

export const removeNumberPrefix = (id: any) => id.replace(/^\d+\.\s*/, '');

export const generateId = (...args) => {
  if (!args.length) return '';
  // Use a deterministic ID based on the href to avoid hydration mismatches
  const href = args[0] || '';
  const pathPart = href?.split('/').pop() || 'link';
  // Create a simple hash from the href for consistent IDs
  let hash = 0;
  for (let i = 0; i < href.length; i++) {
    const char = href.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${pathPart}-${Math.abs(hash).toString(36)}`;
};

export const cookieSelector = (consentString, field) => {
  const regex = new RegExp(`${field}:(\\w+)`);
  const match = consentString && consentString.match(regex);
  return match && match[1] ? match[1] : "false";
};

export const showCountryFlag = (region: string) => {
  if (!region) return COUNTRY_FLAG_PATHS.en
  return COUNTRY_FLAG_PATHS[region as keyof typeof COUNTRY_FLAG_PATHS] || COUNTRY_FLAG_PATHS.en
}


export function download_file(fileURL, fileName) {
  fetch(fileURL)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || 'ebook.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl); 
    })
    .catch(error => {
      console.error('Download failed:', error);
    });
}

/**
 * Sanitizes URLs by replacing any Vercel URLs with the production URL
 * @param url - The URL to sanitize
 * @returns The sanitized URL with production domain
 */
export function sanitizeUrl(url: string | undefined | null): string {
  const baseUrl = getResourcesBaseUrl()
  if (!url) return baseUrl

  const vercelUrlPattern = /https?:\/\/[^/]*vercel\.app[^/]*/gi
  const sanitized = url.replace(vercelUrlPattern, baseUrl)

  const vercelUrlPatternNoProtocol = /[^/]*vercel\.app[^/]*/gi
  const host = baseUrl.replace(/^https?:\/\//, '')
  const withHost = sanitized.replace(vercelUrlPatternNoProtocol, host)

  return stripTrackingParams(withHost)
}