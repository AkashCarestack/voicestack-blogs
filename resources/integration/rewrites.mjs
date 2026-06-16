import { RESOURCE_SECTIONS } from './constants.js'
import { sitemapRewritesBeforeFiles as sitemapRewrites } from './sitemapRewrites.mjs'

const enResourceRewrites = RESOURCE_SECTIONS.flatMap((section) => [
  {
    source: `/resources/${section}`,
    destination: `/resources/en/${section}`,
    locale: false,
  },
  {
    source: `/resources/${section}/:path*`,
    destination: `/resources/en/${section}/:path*`,
    locale: false,
  },
])

export const resourceRewritesBeforeFiles = [
  ...sitemapRewrites,
  {
    source: '/en-GB/resources',
    destination: '/resources/en-GB',
    locale: false,
  },
  {
    source: '/en-GB/resources/:path*',
    destination: '/resources/en-GB/:path*',
    locale: false,
  },
  {
    source: '/en-AU/resources',
    destination: '/resources/en-AU',
    locale: false,
  },
  {
    source: '/en-AU/resources/:path*',
    destination: '/resources/en-AU/:path*',
    locale: false,
  },
  ...enResourceRewrites,
]

/** @deprecated Use sitemapRewrites from ./sitemapRewrites.mjs */
export { sitemapRewritesBeforeFiles } from './sitemapRewrites.mjs'

/** @deprecated Use resourceRewritesBeforeFiles */
export const sitemapRewritesAfterFiles = sitemapRewrites

/** @deprecated Use resourceRewritesBeforeFiles */
export const resourceRewritesAfterFiles = sitemapRewrites
