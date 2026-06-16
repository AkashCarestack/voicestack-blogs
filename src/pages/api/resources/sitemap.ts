import { NextApiRequest, NextApiResponse } from 'next'

import { readToken } from '~/resources/lib/sanity.api'
import { getClient } from '~/resources/lib/sanity.client'
import { getSitemapData } from '~/resources/lib/sanity.queries'
import { generateResourcesSitemapXml } from '~/resources/utils/resourcesSitemap'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const client = getClient(req.preview ? { token: readToken } : undefined)
    const rows = await getSitemapData(client)
    const sitemap = generateResourcesSitemapXml(rows)

    res.writeHead(200, {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    })
    res.end(sitemap)
  } catch (error) {
    console.error('Resources sitemap generation error:', error)
    res.status(500).json({
      error: 'Failed to generate resources sitemap',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
