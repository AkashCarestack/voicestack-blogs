import siteConfig from 'config/siteConfig'

/** Paths with all locale variants and hreflang alternates */
export const PATHS_WITH_ALTERNATES = ['', 'system-requirements'] as const

export const PATHS_NO_EN_URL = [
  'who-we-serve/single-location-dental-practices',
  'who-we-serve/multi-location-dental-practices',
  'who-we-serve/squat-dental-practices',
]

export const PATHS_NO_EN_GB_URL = [
  'dental-phones/comparison',
  'dental-phones/case-studies',
  'phone-system/comparison',
  'phone-system/case-studies',
]

/** US (en) only — no en-AU / en-GB versions; omit hreflang cluster (matches single-locale sitemap entries) */
export const PATHS_EN_ONLY = [
  'who-we-serve/groups-and-enterprises/dental-service-organizations-dso',
  'who-we-serve/groups-and-enterprises/veterinary-service-organizations-vso',
  'who-we-serve/groups-and-enterprises/physical-therapy-groups-mso',
  'who-we-serve/groups-and-enterprises/vision-groups-mso',
]

export const LOCALE_ALTERNATE_MAP: Record<string, Record<string, string>> = {
  'phone-system': {
    en: 'phone-system',
    'en-AU': 'dental-phones',
    'en-GB': 'dental-phones',
  },
  'phone-system/features': {
    en: 'phone-system/features',
    'en-AU': 'dental-phones/features',
    'en-GB': 'dental-phones/features',
  },
  'phone-system/reviews': {
    en: 'phone-system/reviews',
    'en-AU': 'dental-phones/reviews',
    'en-GB': 'dental-phones/reviews',
  },
  'phone-system/integrations': {
    en: 'phone-system/integrations',
    'en-AU': 'dental-phones/integrations',
    'en-GB': 'dental-phones/integrations',
  },
  'phone-system/comparison': {
    en: 'phone-system/comparison',
    'en-AU': 'dental-phones/comparison',
    'en-GB': 'dental-phones/comparison',
  },
  'phone-system/case-studies': {
    en: 'phone-system/case-studies',
    'en-AU': 'dental-phones/case-studies',
    'en-GB': 'dental-phones/case-studies',
  },
  'phone-system/phones': {
    en: 'phone-system/phones',
    'en-AU': 'dental-phones/phones',
    'en-GB': 'dental-phones/phones',
  },
  'ai-receptionist': {
    en: 'phone-system/features/ai-receptionist',
    'en-AU': 'dental-phones/ai-receptionist',
  },
  'phone-system/features/marketing-spend-optimization': {
    en: 'phone-system/features/marketing-spend-optimization',
    'en-AU': 'dental-phones/features/marketing-spend-optimisation',
    'en-GB': 'dental-phones/features/marketing-spend-optimisation',
  },
  'who-we-serve/multi-location-dental-practices': {
    'en-AU': 'who-we-serve/multi-location-dental-practices',
    'en-GB': 'who-we-serve/multi-site-dental-practices',
  },
  'who-we-serve/single-location-dental-practices': {
    'en-AU': 'who-we-serve/single-location-dental-practices',
    'en-GB': 'who-we-serve/single-site-dental-practices',
  },
  'who-we-serve/groups-dsos': {
    en: 'who-we-serve/groups-and-enterprises',
    'en-AU': 'who-we-serve/groups-and-dsos',
    'en-GB': 'who-we-serve/dental-groups-dsos-corporates',
  },
  'who-we-serve/startups': {
    'en-AU': 'who-we-serve/startups',
    'en-GB': 'who-we-serve/squat-dental-practices',
  },
}

/** Alias-only: regional/alternate slugs → canonical group id.
 *  Omit self-rows — getCanonicalKey() falls back to LOCALE_ALTERNATE_MAP keys automatically. */
export const PATH_TO_CANONICAL: Record<string, string> = {
  // dental-phones/* aliases for phone-system/* canonical keys
  'dental-phones': 'phone-system',
  'dental-phones/features': 'phone-system/features',
  'dental-phones/reviews': 'phone-system/reviews',
  'dental-phones/integrations': 'phone-system/integrations',
  'dental-phones/comparison': 'phone-system/comparison',
  'dental-phones/case-studies': 'phone-system/case-studies',
  'dental-phones/phones': 'phone-system/phones',
  // ai-receptionist: shipped/legacy slugs → canonical key
  'phone-system/features/ai-receptionist': 'ai-receptionist',
  'phone-system/ai-receptionist': 'ai-receptionist',
  'dental-phones/ai-receptionist': 'ai-receptionist',
  // marketing-spend: AU/GB spelling alias
  'phone-system/features/marketing-spend-optimisation':
    'phone-system/features/marketing-spend-optimization',
  'dental-phones/features/marketing-spend-optimisation':
    'phone-system/features/marketing-spend-optimization',
  // who-we-serve GB/AU aliases
  'who-we-serve/multi-site-dental-practices': 'who-we-serve/multi-location-dental-practices',
  'who-we-serve/single-site-dental-practices': 'who-we-serve/single-location-dental-practices',
  'who-we-serve/squat-dental-practices': 'who-we-serve/startups',
  'who-we-serve/dental-groups-dsos-corporates': 'who-we-serve/groups-dsos',
  'who-we-serve/groups-and-dsos': 'who-we-serve/groups-dsos',
  'who-we-serve/groups-and-enterprises': 'who-we-serve/groups-dsos',
}

export interface AlternateLink {
  url: string
  hreflang: string
}

export interface AlternateSet {
  alternates: AlternateLink[]
  xDefault: string
}

/** hreflang values for the US (root) locale */
const US_HREFLANG_VALUES = new Set(['en-US', 'en'])

/**
 * x-default for a hreflang cluster: prefer the US version when it appears in alternates,
 * otherwise the first alternate, otherwise fallbackUrl.
 */
export function resolveXDefaultUrl(
  alternates: AlternateLink[],
  fallbackUrl: string,
): string {
  const usAlternate = alternates.find((a) => US_HREFLANG_VALUES.has(a.hreflang))
  if (usAlternate) {
    return usAlternate.url
  }
  if (alternates.length > 0) {
    return alternates[0].url
  }
  return fallbackUrl
}

export function getCanonicalKey(path: string): string | null {
  if (PATH_TO_CANONICAL[path] !== undefined) return PATH_TO_CANONICAL[path]
  // If the path is itself a LOCALE_ALTERNATE_MAP key, it is already canonical
  if (LOCALE_ALTERNATE_MAP[path] !== undefined) return path
  return null
}

export function shouldOmitEnUrl(path: string, locale: string): boolean {
  return locale === 'en' && PATHS_NO_EN_URL.includes(path)
}

export function shouldOmitEnGBUrl(path: string): boolean {
  return PATHS_NO_EN_GB_URL.includes(path)
}

export function isEnOnlyPath(path: string): boolean {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '')
  return PATHS_EN_ONLY.includes(clean)
}

export function formatHreflang(locale: string): string {
  const localeMap: Record<string, string> = {
    en: 'en-US',
    'en-GB': 'en-GB',
    'en-AU': 'en-AU',
    '': 'en',
  }
  return localeMap[locale] || 'en'
}

export function sanitizePathForUrl(path: string): string {
  return path
    .split('/')
    .map((segment) =>
      segment
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, ''),
    )
    .filter(Boolean)
    .join('/')
}

export function normalizePathForLocale(path: string, locale: string): string {
  let result = path
  if (locale === 'en' || !locale) {
    result = result.replace(/(^|\/)dental-phones(\/|$)/g, '$1phone-system$2')
    result = result.replace(/optimisation/g, 'optimization')
  }
  if (locale === 'en-AU' || locale === 'en-GB') {
    result = result.replace(/(^|\/)phone-system(\/|$)/g, '$1dental-phones$2')
    result = result.replace(/optimization/g, 'optimisation')
  }
  return result
}

export function buildAlternateUrl(path: string, locale: string, baseUrl: string): string {
  const cleanedPath = path.replace(/^\/+/, '').replace(/\/+$/, '')
  const normalizedPath = normalizePathForLocale(cleanedPath, locale)
  const urlPath = sanitizePathForUrl(normalizedPath)
  const base = baseUrl.replace(/\/+$/, '')

  if (locale === 'en' || !locale) {
    return urlPath ? `${base}/${urlPath}` : base
  }

  return urlPath ? `${base}/${locale}/${urlPath}` : `${base}/${locale}`
}

/** Strip locale prefix from a route path segment */
export function cleanPathFromRoute(routePath: string, locales: string[] = siteConfig.locales): string {
  if (!routePath || routePath === '/' || routePath === '') {
    return ''
  }

  const parts = routePath.replace(/^\/+/, '').split('/').filter((p) => p !== '')
  if (parts.length === 0) {
    return ''
  }

  const firstPart = parts[0]
  if (firstPart === 'home' || locales.includes(firstPart)) {
    return parts.slice(1).join('/')
  }

  return parts.join('/')
}

function shouldSkipAlternateUrl(url: string, hreflang: string): boolean {
  if (url.includes('/en-AU/phone-system') || url.includes('/en-GB/phone-system')) {
    return true
  }

  if (hreflang === 'en-GB' || url.includes('/en-GB')) {
    const enGBMatch = url.match(/\/en-GB(?:\/(.*))?$/)
    if (enGBMatch) {
      const urlPath = (enGBMatch[1] || '').replace(/\/$/, '')
      if (shouldOmitEnGBUrl(urlPath)) {
        return true
      }
    }
  }

  return false
}

function createAlternateCollector() {
  const seen = new Set<string>()
  const alternates: AlternateLink[] = []

  const add = (url: string, hreflang: string) => {
    if (shouldSkipAlternateUrl(url, hreflang)) return
    const key = `${url}|${hreflang}`
    if (!seen.has(key)) {
      seen.add(key)
      alternates.push({ url, hreflang })
    }
  }

  return { add, alternates }
}

/**
 * Collect hreflang alternates for a content path (same rules as sitemap generation).
 */
export function collectAlternateUrls(
  path: string,
  options: {
    baseUrl: string
    locales?: string[]
    availableLocales?: string[]
    allowLocalePathForAlternate?: (p: string) => boolean
  },
): AlternateLink[] {
  const locales = options.locales ?? siteConfig.locales ?? ['en', 'en-GB', 'en-AU']
  const { baseUrl } = options
  const availableLocales =
    options.availableLocales !== undefined ? options.availableLocales : locales

  const { add, alternates } = createAlternateCollector()
  const canonicalKey = getCanonicalKey(path)
  const localeMap = canonicalKey ? LOCALE_ALTERNATE_MAP[canonicalKey] : null
  const hasLocaleAlternates = Boolean(localeMap)
  const hasMultipleLocales = availableLocales.length > 1
  const allowLocalePathForAlternate = options.allowLocalePathForAlternate ?? (() => true)

  if (hasMultipleLocales) {
    availableLocales.forEach((altLocale) => {
      add(buildAlternateUrl(path, altLocale, baseUrl), formatHreflang(altLocale))
    })
  }

  if (hasLocaleAlternates && localeMap) {
    locales.forEach((locale) => {
      const localePath = localeMap[locale]
      if (
        localePath != null &&
        allowLocalePathForAlternate(localePath) &&
        !shouldOmitEnUrl(localePath, locale) &&
        !(locale === 'en-GB' && shouldOmitEnGBUrl(localePath))
      ) {
        add(buildAlternateUrl(localePath, locale, baseUrl), formatHreflang(locale))
      }
    })
  }

  return alternates
}

/**
 * Alternates + x-default for a specific page URL (matches sitemap entry for that loc).
 */
export function getAlternatesForPage(
  path: string,
  locale: string,
  baseUrl: string,
  options?: {
    locales?: string[]
    availableLocales?: string[]
    allowLocalePathForAlternate?: (p: string) => boolean
  },
): AlternateSet | null {
  const locales = options?.locales ?? siteConfig.locales ?? ['en', 'en-GB', 'en-AU']
  const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '')

  if (PATHS_WITH_ALTERNATES.includes(cleanPath as (typeof PATHS_WITH_ALTERNATES)[number])) {
    const alternates = locales.map((l) => ({
      url: buildAlternateUrl(cleanPath, l, baseUrl),
      hreflang: formatHreflang(l),
    }))
    return {
      alternates,
      xDefault: resolveXDefaultUrl(
        alternates,
        buildAlternateUrl(cleanPath, locale, baseUrl),
      ),
    }
  }

  const canonicalKey = getCanonicalKey(cleanPath)
  const localeMap = canonicalKey ? LOCALE_ALTERNATE_MAP[canonicalKey] : null
  const pathForLocale = localeMap?.[locale] ?? cleanPath

  if (shouldOmitEnUrl(pathForLocale, locale)) {
    return null
  }
  if (locale === 'en-GB' && shouldOmitEnGBUrl(pathForLocale)) {
    return null
  }

  // US-only pages: no hreflang cluster (same as sitemap when pathLocales is ['en'] only).
  if (isEnOnlyPath(cleanPath)) {
    return null
  }

  // Canonical-mapped pages: alternates come from LOCALE_ALTERNATE_MAP only.
  // Unmapped pages (e.g. who-we-serve, why-voicestack): default to all site locales,
  // matching sitemap behavior when pathLocales includes en / en-AU / en-GB from nav.
  const defaultAvailableLocales = canonicalKey ? [] : locales

  const alternates = collectAlternateUrls(cleanPath, {
    baseUrl,
    locales,
    availableLocales: options?.availableLocales ?? defaultAvailableLocales,
    allowLocalePathForAlternate: options?.allowLocalePathForAlternate,
  })

  if (alternates.length === 0) {
    return null
  }

  const xDefault = resolveXDefaultUrl(
    alternates,
    buildAlternateUrl(pathForLocale, locale, baseUrl),
  )

  return { alternates, xDefault }
}

/** Normalize href for head tags (strip trailing /home and slashes) */
export function normalizeAlternateHref(url: string): string {
  return url.replace(/\/home$|\/$/, '').replace(/\/$/, '')
}
