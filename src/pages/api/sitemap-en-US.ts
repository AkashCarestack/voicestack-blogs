import type { NextApiRequest, NextApiResponse } from 'next'

import { serveVoiceStackRegionalSitemap } from '~/lib/regionalSitemapHandler'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return serveVoiceStackRegionalSitemap(req, res, 'en-US')
}
