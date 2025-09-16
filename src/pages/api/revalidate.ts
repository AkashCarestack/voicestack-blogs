import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    // Get the path to revalidate from the request body
    const { path, type } = req.body

    if (!path) {
      return res.status(400).json({ message: 'Path is required' })
    }

    // Revalidate the specific path
    await res.revalidate(path)
    
    console.log(`Revalidated ${type || 'page'}: ${path}`)
    
    return res.json({ 
      revalidated: true, 
      path,
      type: type || 'page',
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error revalidating:', err)
    return res.status(500).json({ 
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}
