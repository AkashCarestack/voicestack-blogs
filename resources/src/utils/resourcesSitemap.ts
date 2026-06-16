import type { SitemapRow } from '~/resources/lib/sanity.queries'
import {
  SITEMAP_LOCALE_LABELS,
  SITEMAP_LOCALE_ORDER,
  SITEMAP_URLSET_HEADER,
} from '~/resources/utils/sitemap/constants'
import {
  buildResourcesSitemapEntries,
  buildResourcesSitemapEntriesForLocale,
} from '~/resources/utils/sitemap/engine'
import type {
  ResourcesSitemapEntry,
  SiteLocale,
} from '~/resources/utils/sitemap/types'
import {
  serializeUrlBlock,
  serializeUrlBlocksToXml,
} from '~/resources/utils/sitemap/xmlSerializer'

export type { ResourcesSitemapEntry } from '~/resources/utils/sitemap/types'

export {
  buildResourcesSitemapEntries,
  buildResourcesSitemapEntriesForLocale,
} from '~/resources/utils/sitemap/engine'

function entriesToUrlBlocks(entries: ResourcesSitemapEntry[]): string[] {
  return entries.map((entry) =>
    serializeUrlBlock(entry.loc, entry.alternates, entry.lastmod),
  )
}

export function generateResourcesSitemapXmlForLocale(
  rows: SitemapRow[],
  locale: SiteLocale,
): string {
  const entries = buildResourcesSitemapEntriesForLocale(rows, locale)
  let xml = SITEMAP_URLSET_HEADER

  if (entries.length > 0) {
    xml += `\n  <!-- ${SITEMAP_LOCALE_LABELS[locale]} -->\n`
    xml += entriesToUrlBlocks(entries).join('\n')
    xml += '\n'
  }

  xml += '</urlset>'
  return xml
}

export function generateResourcesSitemapXml(rows: SitemapRow[]): string {
  const allEntries = buildResourcesSitemapEntries(rows)
  const urlBlocks: string[] = []

  SITEMAP_LOCALE_ORDER.forEach((locale) => {
    const localeEntries = allEntries
      .filter((entry) => entry.locale === locale)
      .sort((a, b) => a.loc.localeCompare(b.loc))

    if (localeEntries.length === 0) return

    urlBlocks.push(`\n  <!-- ${SITEMAP_LOCALE_LABELS[locale]} -->`)
    urlBlocks.push(...entriesToUrlBlocks(localeEntries))
  })

  return serializeUrlBlocksToXml(urlBlocks, SITEMAP_URLSET_HEADER)
}

export { defaultResourcesSitemapEngine as resourcesSitemapEngine } from '~/resources/utils/sitemap/engine'
