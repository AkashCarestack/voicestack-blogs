import type { NextApiRequest, NextApiResponse } from 'next'

import {
  generateSitemapIndexXml,
  SITEMAP_INDEX_CONTENT_TYPE,
} from '~/resources/integration/sitemapIndex'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const sitemapIndex = generateSitemapIndexXml()

    res.writeHead(200, {
      'Content-Type': SITEMAP_INDEX_CONTENT_TYPE,
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    })
    res.end(sitemapIndex)
  } catch (error) {
    console.error('Sitemap index generation error:', error)
    res.status(500).json({
      error: 'Failed to generate sitemap index',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
