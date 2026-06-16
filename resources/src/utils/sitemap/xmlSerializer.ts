export function escapeSitemapXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function serializeUrlBlock(
  loc: string,
  alternates: Array<{ hreflang: string; href: string }>,
  lastmod?: string,
): string {
  let block = '  <url>\n'
  block += `    <loc>${escapeSitemapXml(loc)}</loc>\n`
  if (lastmod) {
    block += `    <lastmod>${lastmod}</lastmod>\n`
  }
  alternates.forEach(({ hreflang, href }) => {
    block += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeSitemapXml(href)}"/>\n`
  })
  block += '  </url>'
  return block
}

export function serializeUrlBlocksToXml(
  urlBlocks: string[],
  header: string,
): string {
  if (urlBlocks.length === 0) {
    return `${header}</urlset>`
  }
  return `${header}${urlBlocks.join('\n')}\n</urlset>`
}
