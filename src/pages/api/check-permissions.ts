import { NextApiRequest, NextApiResponse } from 'next'
import { getClient, getWriteClient } from '~/lib/sanity.client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const client = getClient()
    const writeClient = getWriteClient()
    
    // Test read permissions
    const readTest = await client.fetch('*[_type == "whoWeServe"][0]')
    
    // Test write permissions by trying to fetch a document
    let writeTest = null
    try {
      writeTest = await writeClient.fetch('*[_type == "whoWeServe"][0]')
    } catch (error) {
      writeTest = { error: error.message }
    }

    // Get token info
    const tokenInfo = {
      hasReadToken: !!process.env.SANITY_API_READ_TOKEN,
      hasWriteToken: !!process.env.SANITY_API_WRITE_TOKEN,
      readTokenLength: process.env.SANITY_API_READ_TOKEN?.length || 0,
      writeTokenLength: process.env.SANITY_API_WRITE_TOKEN?.length || 0,
    }

    return res.json({
      success: true,
      readPermissions: {
        working: !!readTest,
        test: readTest
      },
      writePermissions: {
        working: !writeTest?.error,
        test: writeTest
      },
      tokenInfo,
      recommendations: [
        "1. Go to your Sanity Studio at https://your-project.sanity.studio",
        "2. Navigate to Settings > API > Tokens",
        "3. Create a new token with 'Editor' or 'Admin' permissions",
        "4. Update your .env file with the new token",
        "5. Restart your development server"
      ]
    })

  } catch (error) {
    console.error('Error checking permissions:', error)
    return res.status(500).json({ 
      message: 'Error checking permissions',
      error: error.message 
    })
  }
}
