import { useMemo } from 'react'
import { useRouter } from 'next/router'
import siteConfig from 'config/siteConfig'
import {
  getCanonicalKey,
  LOCALE_ALTERNATE_MAP,
} from '~/config/localeAlternateMap'

export interface AlternatePath {
  path: string
  locale: string
}

export function formatHreflang(locale: string): string {
  const localeMap: { [key: string]: string } = {
    en: 'en-US',
    'en-GB': 'en-GB',
    'en-AU': 'en-AU',
    EN: 'en-US',
    'EN-GB': 'en-GB',
    'EN-AU': 'en-AU',
    '': 'en-US',
  }
  return localeMap[locale] || 'en-US'
}

export function removeLocale(slug: string, locales: string[]): string {
  if (!slug || slug === '/' || slug === '') {
    return '/'
  }

  const parts = slug.replace(/^\/+/, '').split('/').filter((p) => p !== '')
  if (parts.length === 0) {
    return '/'
  }

  const firstPart = parts[0]

  if (firstPart === 'home' || locales?.includes(firstPart)) {
    const remaining = parts.slice(1).join('/')
    return remaining ? `/${remaining}` : '/'
  }

  return slug.startsWith('/') ? slug : `/${slug}`
}

export function buildUrl(path: string, locale: string, baseUrl: string): string {
  const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '')

  if (locale === 'en' || !locale) {
    return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl
  }

  return cleanPath ? `${baseUrl}/${locale}/${cleanPath}` : `${baseUrl}/${locale}`
}

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
    const paths: AlternatePath[] = []

    const currentPath = router.asPath.split('?')[0].split('#')[0]
    const pathWithoutLocale = removeLocale(currentPath, locales)
    const cleanPath = pathWithoutLocale.replace(/^\//, '')

    const PATHS_AVAILABLE_FOR_ALL_LOCALES = ['', 'system-requirements']
    const isRootPage = pathWithoutLocale === '' || pathWithoutLocale === '/'
    const isAllowedForAllLocales = PATHS_AVAILABLE_FOR_ALL_LOCALES.includes(cleanPath)

    const canonicalKey = getCanonicalKey(cleanPath)
    const localeMap = canonicalKey ? LOCALE_ALTERNATE_MAP[canonicalKey] : null

    if (localeMap) {
      locales.forEach((locale) => {
        const localePath = localeMap[locale]
        if (localePath != null) {
          paths.push({
            path: buildUrl(localePath, locale, baseUrl),
            locale: formatHreflang(locale),
          })
        }
      })
    } else {
      const isChildPage = !isRootPage && !isAllowedForAllLocales
      const LOCALES_WITHOUT_CHILD_PAGES = ['en-GB', 'en-AU']

      locales.forEach((locale) => {
        if (isChildPage && LOCALES_WITHOUT_CHILD_PAGES.includes(locale)) {
          return
        }

        const url = buildUrl(cleanPath, locale, baseUrl)
        paths.push({
          path: url,
          locale: formatHreflang(locale),
        })
      })
    }

    const defaultUrl = buildUrl(
      localeMap?.en ?? cleanPath,
      'en',
      baseUrl,
    )

    return { alternatePaths: paths, defaultUrl }
  }, [router.asPath, router.locale, locales, baseUrl])
}
