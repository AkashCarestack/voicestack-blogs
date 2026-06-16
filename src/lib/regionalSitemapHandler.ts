import type { NextApiRequest, NextApiResponse } from 'next'

import { buildResourcesRegionalSitemapXmlFromRows } from '~/resources/integration/resourcesRegionalSitemap'
import {
  filterVoiceStackUrlBlocksForRegion,
  mergeRegionalSitemapXml,
  type RegionalSitemapHreflang,
} from '~/resources/integration/regionalSitemap'
import { SITEMAP_INDEX_CONTENT_TYPE } from '~/resources/integration/sitemapIndex'
import { readToken as resourcesReadToken } from '~/resources/lib/sanity.api'
import { getClient as getResourcesClient } from '~/resources/lib/sanity.client'
import { getSitemapData } from '~/resources/lib/sanity.queries'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { buildVoiceStackSitemapXml } from '~/pages/api/sitemap'

export async function buildVoiceStackRegionalSitemapXml(
  hreflang: RegionalSitemapHreflang,
): Promise<string> {
  const voiceStackFullXml = await buildVoiceStackSitemapXml(getClient())
  const voiceStackBlocks = filterVoiceStackUrlBlocksForRegion(
    voiceStackFullXml,
    hreflang,
  )
  return mergeRegionalSitemapXml(voiceStackBlocks)
}

export async function buildResourcesRegionalSitemapXml(
  hreflang: RegionalSitemapHreflang,
): Promise<string> {
  const resourceRows = await getSitemapData(getResourcesClient())
  return buildResourcesRegionalSitemapXmlFromRows(resourceRows, hreflang)
}

async function serveRegionalSitemapResponse(
  req: NextApiRequest,
  res: NextApiResponse,
  hreflang: RegionalSitemapHreflang,
  buildXml: (hreflang: RegionalSitemapHreflang) => Promise<string>,
  label: string,
) {
  try {
    if (req.preview) {
      getClient({ token: readToken })
      getResourcesClient({ token: resourcesReadToken })
    }

    const sitemap = await buildXml(hreflang)

    res.writeHead(200, {
      'Content-Type': SITEMAP_INDEX_CONTENT_TYPE,
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    })
    res.end(sitemap)
  } catch (error) {
    console.error(`${label} sitemap generation error (${hreflang}):`, error)
    res.status(500).json({
      error: `Failed to generate ${label} regional sitemap`,
      region: hreflang,
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export function serveVoiceStackRegionalSitemap(
  req: NextApiRequest,
  res: NextApiResponse,
  hreflang: RegionalSitemapHreflang,
) {
  return serveRegionalSitemapResponse(
    req,
    res,
    hreflang,
    buildVoiceStackRegionalSitemapXml,
    'VoiceStack',
  )
}

export function serveResourcesRegionalSitemap(
  req: NextApiRequest,
  res: NextApiResponse,
  hreflang: RegionalSitemapHreflang,
) {
  return serveRegionalSitemapResponse(
    req,
    res,
    hreflang,
    buildResourcesRegionalSitemapXml,
    'Resources',
  )
}
