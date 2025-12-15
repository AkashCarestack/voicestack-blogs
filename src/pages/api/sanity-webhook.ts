import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { _type, _id, slug } = req.body

    console.log('Sanity webhook received:', { _type, _id, slug })

    // Define which pages to revalidate based on document type
    const revalidationMap: { [key: string]: string[] } = {
      'whoWeServe': ['/who-we-serve', '/who-we-serve/index'],
      'whoWeServe_enGB': ['/who-we-serve', '/who-we-serve/index'],
      'whoWeServe_enAU': ['/who-we-serve', '/who-we-serve/index'],
      'globalData': ['/who-we-serve', '/'],
      'homePage': ['/'],
      'systemRequirements': ['/system-requirements'],
      'miscellaneousData': ['/system-requirements']
    }

    const pagesToRevalidate = revalidationMap[_type] || []

    // Add specific page if slug is provided
    if (slug?.current) {
      if (_type?.includes('whoWeServe')) {
        pagesToRevalidate.push(`/who-we-serve/${slug.current}`)
      }
    }

    // Revalidate all relevant pages
    const revalidationPromises = pagesToRevalidate.map(async (path) => {
      try {
        await res.revalidate(path)
        console.log(`✅ Revalidated: ${path}`)
        return { path, success: true }
      } catch (error) {
        console.error(`❌ Failed to revalidate ${path}:`, error)
        return { path, success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    })

    const results = await Promise.all(revalidationPromises)

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    console.log(`Revalidation complete: ${successCount} successful, ${failureCount} failed`)

    return res.json({
      success: true,
      message: `Revalidated ${successCount} pages`,
      results,
      documentType: _type,
      documentId: _id,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
