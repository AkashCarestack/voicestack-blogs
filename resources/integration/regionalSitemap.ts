export const REGIONAL_SITEMAP_HREFLANGS = ['en-US', 'en-GB', 'en-AU'] as const

export type RegionalSitemapHreflang = (typeof REGIONAL_SITEMAP_HREFLANGS)[number]

export type SitemapProduct = 'voicestack' | 'resources'

export const HREFLANG_TO_SITE_LOCALE: Record<
  RegionalSitemapHreflang,
  'en' | 'en-GB' | 'en-AU'
> = {
  'en-US': 'en',
  'en-GB': 'en-GB',
  'en-AU': 'en-AU',
}

export const SITEMAP_URLSET_HEADER =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'

export function isRegionalSitemapHreflang(
  value: string,
): value is RegionalSitemapHreflang {
  return (REGIONAL_SITEMAP_HREFLANGS as readonly string[]).includes(value)
}

export function regionalSitemapPublicPath(
  product: SitemapProduct,
  hreflang: RegionalSitemapHreflang,
): string {
  if (product === 'voicestack') {
    return `/sitemap-${hreflang}.xml`
  }
  return `/sitemap-${product}-${hreflang}.xml`
}

export function extractUrlBlocksFromSitemapXml(xml: string): string[] {
  return xml.match(/  <url>[\s\S]*?  <\/url>/g) ?? []
}

function getLocFromUrlBlock(block: string): string | null {
  const match = block.match(/<loc>([^<]+)<\/loc>/)
  return match?.[1] ?? null
}

export function filterVoiceStackUrlBlocksForRegion(
  fullXml: string,
  hreflang: RegionalSitemapHreflang,
): string[] {
  return extractUrlBlocksFromSitemapXml(fullXml).filter((block) => {
    const loc = getLocFromUrlBlock(block)
    if (!loc || loc.includes('/resources')) return false

    if (hreflang === 'en-US') {
      return !/\/en-GB(\/|$)/.test(loc) && !/\/en-AU(\/|$)/.test(loc)
    }
    if (hreflang === 'en-GB') {
      return /\/en-GB(\/|$)/.test(loc)
    }
    return /\/en-AU(\/|$)/.test(loc)
  })
}

export function mergeRegionalSitemapXml(urlBlocks: string[]): string {
  if (urlBlocks.length === 0) {
    return `${SITEMAP_URLSET_HEADER}</urlset>`
  }

  return `${SITEMAP_URLSET_HEADER}${urlBlocks.join('\n')}\n</urlset>`
}
