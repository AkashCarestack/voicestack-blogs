import { inferSiteLocaleFromAbsoluteUrl } from '~/resources/utils/sitemap/localeRules'
import {
  buildAlternateLinks,
  resolveLocaleUrlFromMatrix,
} from '~/resources/utils/sitemap/variantMatrix'
import type {
  ResourcesSitemapEntry,
  SiteLocale,
  SitemapUrlCandidate,
} from '~/resources/utils/sitemap/types'

export function flattenCandidatesToEntries(
  candidates: SitemapUrlCandidate[],
  locales: readonly SiteLocale[],
): ResourcesSitemapEntry[] {
  const entries: ResourcesSitemapEntry[] = []
  const seenLocs = new Set<string>()

  candidates.forEach((candidate) => {
    locales.forEach((locale) => {
      const loc = resolveLocaleUrlFromMatrix(candidate, locale)
      if (!loc || seenLocs.has(loc)) return
      seenLocs.add(loc)

      entries.push({
        loc,
        lastmod: candidate.lastmod,
        alternates: buildAlternateLinks(candidate.variants, loc),
        locale: inferSiteLocaleFromAbsoluteUrl(loc),
        group: 'resources',
      })
    })
  })

  return entries
}

export function sortEntriesByLocaleAndLoc(
  entries: ResourcesSitemapEntry[],
): ResourcesSitemapEntry[] {
  return [...entries].sort((a, b) => a.loc.localeCompare(b.loc))
}

export function filterEntriesForSiteLocale(
  entries: ResourcesSitemapEntry[],
  locale: SiteLocale,
): ResourcesSitemapEntry[] {
  return sortEntriesByLocaleAndLoc(
    entries.filter((entry) => entry.locale === locale),
  )
}
