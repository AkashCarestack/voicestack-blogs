import {
  REGIONAL_SITEMAP_HREFLANGS,
  regionalSitemapPublicPath,
  type RegionalSitemapHreflang,
  type SitemapProduct,
} from './regionalSitemap'

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://voicestack.com').replace(
  /\/+$/,
  '',
)

const SITEMAP_PRODUCTS: SitemapProduct[] = ['voicestack', 'resources']

export interface SitemapIndexChild {
  id: string
  product: SitemapProduct
  hreflang: RegionalSitemapHreflang
  path: string
}

/**
 * Index lists VoiceStack + Resources regional urlsets (US, GB, AU).
 * Add locales in regionalSitemap.ts and rewrites in sitemapRewrites.mjs.
 */
export const SITEMAP_INDEX_CHILDREN: SitemapIndexChild[] =
  SITEMAP_PRODUCTS.flatMap((product) =>
    REGIONAL_SITEMAP_HREFLANGS.map((hreflang) => ({
      id: `${product}-${hreflang}`,
      product,
      hreflang,
      path: regionalSitemapPublicPath(product, hreflang),
    })),
  )

export function getSitemapIndexChildUrls(): string[] {
  return SITEMAP_INDEX_CHILDREN.map((child) => `${BASE_URL}${child.path}`)
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatLastmod(date = new Date()): string {
  return date.toISOString()
}

export function generateSitemapIndexXml(
  lastmods?: Partial<Record<string, string>>,
): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  for (const child of SITEMAP_INDEX_CHILDREN) {
    const loc = `${BASE_URL}${child.path}`
    xml += '  <sitemap>\n'
    xml += `    <loc>${escapeXml(loc)}</loc>\n`
    const lastmod = lastmods?.[child.id] ?? lastmods?.[loc] ?? formatLastmod()
    xml += `    <lastmod>${lastmod}</lastmod>\n`
    xml += '  </sitemap>\n'
  }

  xml += '</sitemapindex>'
  return xml
}

export const SITEMAP_INDEX_CONTENT_TYPE = 'application/xml; charset=utf-8'
