import { RESOURCE_SECTIONS } from './constants.js'

const legacySectionRedirects = RESOURCE_SECTIONS.filter(
  (section) => !['about', 'testimonial'].includes(section),
).map((section) => ({
  source: `/${section}/:slug*`,
  destination: `/resources/${section}/:slug*`,
  permanent: false,
  locale: false,
}))

export const resourceRedirects = [
  ...legacySectionRedirects,
  {
    source: '/en-GB/resources/author/:slug*',
    destination: '/resources/author/:slug*',
    permanent: true,
    locale: false,
  },
  {
    source: '/en-AU/resources/author/:slug*',
    destination: '/resources/author/:slug*',
    permanent: true,
    locale: false,
  },
  {
    source: '/resources/en-GB/author/:slug*',
    destination: '/resources/author/:slug*',
    permanent: true,
    locale: false,
  },
  {
    source: '/resources/en-AU/author/:slug*',
    destination: '/resources/author/:slug*',
    permanent: true,
    locale: false,
  },
  {
    source: '/resources/en/:path*',
    destination: '/resources/:path*',
    permanent: true,
    locale: false,
  },
  {
    source: '/resources/en-GB/:path*',
    destination: '/en-GB/resources/:path*',
    permanent: true,
    locale: false,
  },
  {
    source: '/resources/en-AU/:path*',
    destination: '/en-AU/resources/:path*',
    permanent: true,
    locale: false,
  },
  {
    source: '/sitemap-voicestack-en-US.xml',
    destination: '/sitemap-en-US.xml',
    permanent: true,
    locale: false,
  },
  {
    source: '/sitemap-voicestack-en-GB.xml',
    destination: '/sitemap-en-GB.xml',
    permanent: true,
    locale: false,
  },
  {
    source: '/sitemap-voicestack-en-AU.xml',
    destination: '/sitemap-en-AU.xml',
    permanent: true,
    locale: false,
  },
  {
    source: '/resources/sitemap.xml',
    destination: '/sitemap.xml',
    permanent: true,
    locale: false,
  },
]
