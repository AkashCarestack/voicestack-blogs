import type { NextApiRequest, NextApiResponse } from 'next'

import { serveResourcesRegionalSitemap } from '~/lib/regionalSitemapHandler'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return serveResourcesRegionalSitemap(req, res, 'en-US')
}
