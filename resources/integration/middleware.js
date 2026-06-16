import { NextResponse } from 'next/server'

import { RESOURCE_SECTIONS, RESOURCE_SECTIONS_PATTERN } from './constants.js'

const SITEMAP_REWRITE_MAP = {
  '/sitemap.xml': '/api/sitemap-index',
  '/sitemap-en-US.xml': '/api/sitemap-en-US',
  '/sitemap-en-GB.xml': '/api/sitemap-en-GB',
  '/sitemap-en-AU.xml': '/api/sitemap-en-AU',
  '/sitemap-resources-en-US.xml': '/api/sitemap-resources-en-US',
  '/sitemap-resources-en-GB.xml': '/api/sitemap-resources-en-GB',
  '/sitemap-resources-en-AU.xml': '/api/sitemap-resources-en-AU',
  '/sitemap-voicestack.xml': '/api/sitemap',
  '/sitemap-resources.xml': '/api/resources/sitemap',
}

export const resourcesMatcher = [
  '/resources/:path*',
  '/en-GB/resources/:path*',
  '/en-AU/resources/:path*',
  ...Object.keys(SITEMAP_REWRITE_MAP),
  ...RESOURCE_SECTIONS.map((section) => `/${section}/:path*`),
]

/** Redirects and sitemap rewrites that run before geo lookup. */
export function handleResourcesRedirects(request) {
  const fullPathname = new URL(request.url).pathname

  if (fullPathname === '/resources/sitemap.xml') {
    const url = request.nextUrl.clone()
    url.pathname = '/sitemap.xml'
    return NextResponse.redirect(url, 308)
  }

  const sitemapDestination = SITEMAP_REWRITE_MAP[fullPathname]
  if (sitemapDestination) {
    const url = request.nextUrl.clone()
    url.pathname = sitemapDestination
    return NextResponse.rewrite(url)
  }

  const legacyMatch = fullPathname.match(
    new RegExp(`^\\/(${RESOURCE_SECTIONS_PATTERN})(?:\\/(.*))?$`),
  )
  if (legacyMatch) {
    const url = request.nextUrl.clone()
    const section = legacyMatch[1]
    const rest = legacyMatch[2]
    url.pathname = `/resources/${section}${rest ? `/${rest}` : ''}`
    return NextResponse.redirect(url)
  }

  const oldRegionalMatch = fullPathname.match(/^\/resources\/(en-GB|en-AU)(\/.*)?$/)
  if (oldRegionalMatch) {
    const url = request.nextUrl.clone()
    url.pathname = `/${oldRegionalMatch[1]}/resources${oldRegionalMatch[2] || ''}`
    return NextResponse.redirect(url, 308)
  }

  const oldEnMatch = fullPathname.match(/^\/resources\/en(\/.*)?$/)
  if (oldEnMatch) {
    const url = request.nextUrl.clone()
    url.pathname = `/resources${oldEnMatch[1] || ''}`
    return NextResponse.redirect(url, 308)
  }

  return null
}

/** Rewrites that run after geo lookup; caller applies VoiceStack geo cookies. */
export function handleResourcesRewrites(request) {
  const fullPathname = new URL(request.url).pathname

  const regionalResourcesMatch = fullPathname.match(/^\/(en-GB|en-AU)\/resources(\/.*)?$/)
  if (regionalResourcesMatch) {
    const url = request.nextUrl.clone()
    url.pathname = `/resources/${regionalResourcesMatch[1]}${regionalResourcesMatch[2] || ''}`
    url.locale = 'en'
    return NextResponse.rewrite(url)
  }

  const resourceSectionMatch = fullPathname.match(
    new RegExp(`^\\/resources\\/(${RESOURCE_SECTIONS_PATTERN})(\\/.*)?$`),
  )
  if (resourceSectionMatch) {
    const url = request.nextUrl.clone()
    const section = resourceSectionMatch[1]
    const rest = resourceSectionMatch[2] || ''
    url.pathname = `/resources/en/${section}${rest}`
    url.locale = 'en'
    return NextResponse.rewrite(url)
  }

  return null
}
