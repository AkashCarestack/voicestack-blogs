import {
  HREFLANG_TO_SITE_LOCALE,
  type RegionalSitemapHreflang,
} from '~/resources/integration/regionalSitemap'
import type { SitemapRow } from '~/resources/lib/sanity.queries'
import { buildResourcesSitemapEntriesForLocale } from '~/resources/utils/sitemap/engine'
import {
  SITEMAP_URLSET_HEADER,
} from '~/resources/utils/sitemap/constants'
import type { ResourcesSitemapEntry } from '~/resources/utils/sitemap/types'
import {
  serializeUrlBlock,
  serializeUrlBlocksToXml,
} from '~/resources/utils/sitemap/xmlSerializer'

export interface ResourcesRegionalSlice {
  hreflang: RegionalSitemapHreflang
  siteLocale: (typeof HREFLANG_TO_SITE_LOCALE)[RegionalSitemapHreflang]
  entries: ResourcesSitemapEntry[]
}

export function sliceResourcesEntriesForRegion(
  rows: SitemapRow[],
  hreflang: RegionalSitemapHreflang,
): ResourcesRegionalSlice {
  const siteLocale = HREFLANG_TO_SITE_LOCALE[hreflang]
  const entries = buildResourcesSitemapEntriesForLocale(rows, siteLocale)

  return { hreflang, siteLocale, entries }
}

export function buildResourcesRegionalSitemapXmlFromRows(
  rows: SitemapRow[],
  hreflang: RegionalSitemapHreflang,
): string {
  const slice = sliceResourcesEntriesForRegion(rows, hreflang)
  const urlBlocks = slice.entries.map((entry) =>
    serializeUrlBlock(entry.loc, entry.alternates, entry.lastmod),
  )
  return serializeUrlBlocksToXml(urlBlocks, SITEMAP_URLSET_HEADER)
}
