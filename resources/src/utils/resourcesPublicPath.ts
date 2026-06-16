import siteConfig from '~/resources-config/siteConfig'
import Router from 'next/router'
import type { NextRouter } from 'next/router'

import { removeLocale } from '~/resources/components/utils/alternatePaths'
import { generateHref, normalizeSiteLocale, getResourcesCmsLocale } from '~/resources/utils/common'

/** Runs synchronously in document head before Next.js hydrates (see _document.tsx). */
export const REGIONAL_RESOURCES_URL_GUARD_SCRIPT = `
(function () {
  var match = window.location.pathname.match(/^\\/(en-GB|en-AU)\\/resources(?:\\/.*)?$/);
  if (!match) return;
  var expected = window.location.pathname + window.location.search + window.location.hash;
  var restore = function () {
    var current = window.location.pathname + window.location.search + window.location.hash;
    if (current !== expected) {
      window.history.replaceState(window.history.state, '', expected);
    }
  };
  restore();
  window.__resourcesRegionalUrl = expected;
  window.__resourcesRestoreRegionalUrl = restore;
})();
`

/** Stop the regional URL guard from forcing users back onto en-GB/en-AU paths. */
export function clearResourcesRegionalUrlGuard(): void {
  if (typeof window === 'undefined') return

  const w = window as Window & {
    __resourcesRegionalUrlTimer?: number | null
    __resourcesRegionalUrl?: string
    __resourcesRestoreRegionalUrl?: () => void
  }

  if (w.__resourcesRegionalUrlTimer) {
    window.clearInterval(w.__resourcesRegionalUrlTimer)
    w.__resourcesRegionalUrlTimer = null
  }
  delete w.__resourcesRegionalUrl
  delete w.__resourcesRestoreRegionalUrl
}

/** Client-side navigation for region switcher (clears stale guard before route change). */
export function navigateToResourcesRegion(href: string): void {
  clearResourcesRegionalUrlGuard()
  void Router.push(href, href, { locale: false, scroll: true })
}

function resolveInternalResourcesPath(
  pathname: string,
  query: NextRouter['query'],
): string | null {
  if (!pathname.startsWith('/resources/')) return null

  let resolved = pathname
  for (const [key, val] of Object.entries(query)) {
    const v = Array.isArray(val) ? val[0] : val
    if (typeof v === 'string' && resolved.includes(`[${key}]`)) {
      resolved = resolved.replace(`[${key}]`, v)
    }
  }
  return resolved
}

/** Expected public URL for regional resources routes (e.g. /en-GB/resources/article/slug). */
export function getResourcesPublicPath(
  router: Pick<NextRouter, 'pathname' | 'query' | 'isReady' | 'asPath'>,
  cmsLocaleOverride?: string | null,
): string | null {
  if (!router.isReady || !router.pathname.startsWith('/resources/')) {
    return null
  }

  const cmsLocale = normalizeSiteLocale(
    cmsLocaleOverride ||
      getResourcesCmsLocale(router) ||
      'en',
  )
  if (cmsLocale === 'en') return null

  const internalPath = resolveInternalResourcesPath(
    router.pathname,
    router.query,
  )
  if (!internalPath) return null

  const contentPath = removeLocale(internalPath, siteConfig.locales)
  const contentPathWithoutLeading =
    contentPath === '/' ? '' : contentPath.replace(/^\//, '')

  return generateHref(cmsLocale, contentPathWithoutLeading)
}

/** Restore regional public URL if Next.js i18n stripped the locale prefix after hydration. */
export function preserveResourcesPublicUrl(
  router: Pick<NextRouter, 'pathname' | 'query' | 'isReady' | 'asPath'>,
  cmsLocaleOverride?: string | null,
): void {
  if (typeof window === 'undefined') return

  const actual = window.location.pathname
  // US default public URL — never rewrite back to a regional prefix
  if (actual === '/resources' || actual.startsWith('/resources/')) {
    clearResourcesRegionalUrlGuard()
    return
  }

  const expected = getResourcesPublicPath(router, cmsLocaleOverride)
  if (!expected) return

  if (actual === expected) return

  window.history.replaceState(
    window.history.state,
    '',
    `${expected}${window.location.search}${window.location.hash}`,
  )
}

/** Run preserve after Next.js i18n may have rewritten the address bar. */
export function schedulePreserveResourcesPublicUrl(
  router: Pick<NextRouter, 'pathname' | 'query' | 'isReady' | 'asPath'>,
  cmsLocaleOverride?: string | null,
): () => void {
  const run = () => preserveResourcesPublicUrl(router, cmsLocaleOverride)
  run()
  const frame = window.requestAnimationFrame(run)

  return () => {
    window.cancelAnimationFrame(frame)
  }
}
