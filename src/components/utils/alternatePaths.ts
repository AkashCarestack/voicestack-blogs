import { useMemo } from 'react'
import { useRouter } from 'next/router'
import siteConfig from 'config/siteConfig'
import {
  buildAlternateUrl,
  cleanPathFromRoute,
  formatHreflang,
  getAlternatesForPage,
  normalizeAlternateHref,
} from '~/lib/seo/alternateResolver'

export interface AlternatePath {
  path: string
  locale: string
}

export { formatHreflang, cleanPathFromRoute as removeLocale }

export function buildUrl(path: string, locale: string, baseUrl: string): string {
  return buildAlternateUrl(path, locale, baseUrl)
}

/** Same origin resolution as useAlternatePaths (SSR-safe when window is undefined). */
export function getSiteBaseUrl(origin?: string): string {
  let url: string

  if (origin) {
    url = origin
  } else if (process.env.NEXT_PUBLIC_BASE_URL) {
    url = process.env.NEXT_PUBLIC_BASE_URL
  } else if (typeof window !== 'undefined') {
    url = window.location.origin
  } else {
    const isProduction = process.env.NODE_ENV === 'production'
    url = isProduction ? 'https://www.voicestack.com' : 'http://localhost:3000'
  }

  return url.replace(/\/+$/, '')
}

export function useAlternatePaths(origin?: string) {
  const router = useRouter()
  const locales = siteConfig.locales || ['en', 'en-GB', 'en-AU']
  const baseUrl = getSiteBaseUrl(origin)

  return useMemo(() => {
    const currentPath = router.asPath.split('?')[0].split('#')[0]
    const currentLocale = router.locale || 'en'
    const cleanPath = cleanPathFromRoute(currentPath, locales)

    const result = getAlternatesForPage(cleanPath, currentLocale, baseUrl, { locales })

    if (!result) {
      return { alternatePaths: [] as AlternatePath[], defaultUrl: null as string | null }
    }

    const alternatePaths: AlternatePath[] = result.alternates.map(({ url, hreflang }) => ({
      path: normalizeAlternateHref(url),
      locale: hreflang,
    }))

    return {
      alternatePaths,
      defaultUrl: normalizeAlternateHref(result.xDefault),
    }
  }, [router.asPath, router.locale, locales, baseUrl])
}
