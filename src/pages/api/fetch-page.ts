import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' })
  }

  try {
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SEO-Checker/1.0',
      },
    })

    const html = await response.text()

    // Return HTML with CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.status(200).send(html)
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch page', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
