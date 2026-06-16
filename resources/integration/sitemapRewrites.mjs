/** Sitemap rewrites — index + separate VoiceStack / Resources per locale (US, GB, AU). */
export const sitemapRewritesBeforeFiles = [
  {
    source: '/sitemap.xml',
    destination: '/api/sitemap-index',
    locale: false,
  },
  {
    source: '/sitemap-en-US.xml',
    destination: '/api/sitemap-en-US',
    locale: false,
  },
  {
    source: '/sitemap-en-GB.xml',
    destination: '/api/sitemap-en-GB',
    locale: false,
  },
  {
    source: '/sitemap-en-AU.xml',
    destination: '/api/sitemap-en-AU',
    locale: false,
  },
  {
    source: '/sitemap-resources-en-US.xml',
    destination: '/api/sitemap-resources-en-US',
    locale: false,
  },
  {
    source: '/sitemap-resources-en-GB.xml',
    destination: '/api/sitemap-resources-en-GB',
    locale: false,
  },
  {
    source: '/sitemap-resources-en-AU.xml',
    destination: '/api/sitemap-resources-en-AU',
    locale: false,
  },
  {
    source: '/sitemap-voicestack.xml',
    destination: '/api/sitemap',
    locale: false,
  },
  {
    source: '/sitemap-resources.xml',
    destination: '/api/resources/sitemap',
    locale: false,
  },
]
